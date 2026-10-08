"""
Google Cloud Authentication & Client Factory Helper
Provides unified, resilient access to Google Cloud Services:
- Firestore (Firebase Data Layer)
- BigQuery & BigQuery AI
- Cloud Storage (GCS)
- Vertex AI
"""

import os
import subprocess
from typing import Optional
from google.auth.credentials import Credentials
from google.oauth2.credentials import Credentials as OAuthCredentials
import google.auth

PROJECT_ID = os.environ.get("GCP_PROJECT", "aistudio-499215")

def get_gcp_credentials():
    """
    Returns valid credentials. In Cloud Run, uses metadata server.
    In local dev, seamlessly falls back to active gcloud token if ADC is expired.
    """
    try:
        creds, _ = google.auth.default()
        # Verify credentials work by refreshing or checking
        if hasattr(creds, "refresh"):
            from google.auth.transport.requests import Request
            try:
                creds.refresh(Request())
                return creds
            except Exception:
                pass
        else:
            return creds
    except Exception:
        pass

    # Fallback to gcloud active access token
    try:
        token = subprocess.check_output(
            ["gcloud", "auth", "print-access-token"],
            stderr=subprocess.DEVNULL
        ).decode().strip()
        if token:
            return OAuthCredentials(token)
    except Exception as e:
        print(f"Warning: Failed to fetch gcloud token: {e}")

    return None

def get_firestore_client():
    from google.cloud import firestore
    creds = get_gcp_credentials()
    if creds:
        return firestore.Client(project=PROJECT_ID, credentials=creds)
    return firestore.Client(project=PROJECT_ID)

def get_bigquery_client():
    from google.cloud import bigquery
    creds = get_gcp_credentials()
    if creds:
        return bigquery.Client(project=PROJECT_ID, credentials=creds)
    return bigquery.Client(project=PROJECT_ID)

def get_storage_client():
    from google.cloud import storage
    creds = get_gcp_credentials()
    if creds:
        return storage.Client(project=PROJECT_ID, credentials=creds)
    return storage.Client(project=PROJECT_ID)
