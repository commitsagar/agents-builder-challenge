"""
Seed all 100 products to Google Cloud Firestore (collection: inventory_items)
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from scripts.generate_100_products import PRODUCTS
from gcp.auth_helper import get_firestore_client

def seed_firestore_100_items():
    print(f"Connecting to Firestore for project aistudio-499215...")
    db = get_firestore_client()
    inv_ref = db.collection("inventory_items")
    
    batch = db.batch()
    count = 0
    total_seeded = 0

    for p in PRODUCTS:
        doc_data = {
            "sku": p["id"],
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "original_price": p.get("originalPrice", p["price"]),
            "cost": round(p["price"] * 0.45, 2),
            "quantity_on_hand": p["stock"],
            "reserved_quantity": 2 if p["stock"] > 10 else 0,
            "reorder_point": max(5, int(p["stock"] * 0.25)),
            "store_id": "STORE-104",
            "aisle_location": p.get("inStoreAisle", "Aisle 1A"),
            "elasticity": p.get("elasticity", -1.4),
            "rating": p.get("rating", 4.8),
            "reviews_count": p.get("reviewsCount", 100),
            "image_url": p["image"],
            "description": p["description"],
            "features": p.get("features", []),
            "tags": p.get("tags", []),
            "return_risk_score": p.get("returnRiskScore", 5)
        }
        doc_ref = inv_ref.document(p["id"])
        batch.set(doc_ref, doc_data)
        count += 1
        
        # Firestore batch commit limit is 500
        if count >= 250:
            batch.commit()
            total_seeded += count
            batch = db.batch()
            count = 0

    if count > 0:
        batch.commit()
        total_seeded += count

    print(f"Successfully seeded {total_seeded} products to Firestore collection 'inventory_items'!")

if __name__ == "__main__":
    seed_firestore_100_items()
