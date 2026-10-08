"""
OmniCommerce Google Cloud Data Layer Initializer
Seeds Google Cloud Firestore (Firebase) collections and validates BigQuery dataset tables.
100% Serverless Cloud Data - Zero local database files.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from gcp.firestore_db import firestore_db
from gcp.bigquery_analytics import bigquery_client

def init_cloud_databases():
    print("Connecting to Google Cloud Firestore (Firebase Native Mode)...")
    firestore_db.seed_initial_data_if_needed()
    items = firestore_db.get_all_inventory()
    orders = firestore_db.get_all_orders()
    print(f"✓ Firestore initialized: {len(items)} catalog items, {len(orders)} active orders.")

    print("Checking Google Cloud BigQuery dataset `omnicommerce_retail_analytics`...")
    forecast = bigquery_client.query_demand_forecast("prod-001")
    cohorts = bigquery_client.query_customer_cohorts()
    print(f"✓ BigQuery analytics validated: {len(forecast)} forecast records, {cohorts['total_active_shoppers']} shoppers indexed.")

if __name__ == "__main__":
    init_cloud_databases()
    print("✓ All Google Cloud data services verified successfully.")
