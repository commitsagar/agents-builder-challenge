# Terraform Infrastructure as Code for OmniCommerce on Google Cloud Platform
# Provisions: Cloud Run, Cloud SQL / AlloyDB, Cloud Storage, BigQuery ML, Vertex AI Search

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
  }
}

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "omnicommerce-retail-prod"
}

variable "region" {
  description = "Primary GCP Region"
  type        = string
  default     = "us-central1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Cloud Storage Buckets (Product Assets & Return Photos)
resource "google_storage_bucket" "product_assets" {
  name                     = "${var.project_id}-product-assets"
  location                 = var.region
  uniform_bucket_level_access = true
  force_destroy            = false
}

resource "google_storage_bucket" "returns_quarantine" {
  name                     = "${var.project_id}-returns-quarantine"
  location                 = var.region
  uniform_bucket_level_access = true
  force_destroy            = false
}

# 2. Cloud SQL / AlloyDB Operational Databases (PostgreSQL 15)
resource "google_sql_database_instance" "operational_postgres" {
  name             = "omnicommerce-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-custom-2-7680"
    availability_type = "REGIONAL"
    backup_configuration {
      enabled = true
    }
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_database" "inventory_db" {
  name     = "inventory_db"
  instance = google_sql_database_instance.operational_postgres.name
}

resource "google_sql_database" "orders_db" {
  name     = "orders_db"
  instance = google_sql_database_instance.operational_postgres.name
}

# 3. Google Cloud Run Service (FastAPI Commerce & Microservices API)
resource "google_cloud_run_v2_service" "commerce_api" {
  name     = "omnicommerce-commerce-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 50
    }
    containers {
      image = "gcr.io/${var.project_id}/omnicommerce-backend:latest"
      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }
      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GEMINI_MODEL"
        value = "gemini-3.7-flash"
      }
    }
  }
}

# 4. BigQuery Petabyte-Scale Retail Analytics Dataset
resource "google_bigquery_dataset" "retail_analytics" {
  dataset_id                  = "retail_analytics"
  friendly_name               = "OmniCommerce Retail Analytics & AI"
  description                 = "Stores POS streams, customer segments, and BigQuery ML TFT forecasts."
  location                    = "US"
  default_table_expiration_ms = null
}

# 5. Cloud Pub/Sub & Eventarc (Event-Driven Telemetry)
resource "google_pubsub_topic" "inventory_discrepancies" {
  name = "inventory-phantom-alerts"
}

resource "google_pubsub_topic" "return_intake" {
  name = "retail-return-intake"
}

output "cloud_run_endpoint" {
  value = google_cloud_run_v2_service.commerce_api.uri
}

output "storage_bucket_assets" {
  value = google_storage_bucket.product_assets.url
}
