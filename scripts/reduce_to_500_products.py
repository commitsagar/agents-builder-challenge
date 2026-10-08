"""
Reduce mock catalog inventory from 1,000 to 500 products (50 items per department).
Preserves all primary flagship models and RAG test data while removing 500 excess products.
"""

import json
import os
from collections import defaultdict

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(root, "src", "data", "mockCatalog1000.json")
    ts_path = os.path.join(root, "src", "data", "mockCatalog.ts")
    json_500_path = os.path.join(root, "src", "data", "mockCatalog500.json")

    with open(json_path, "r", encoding="utf-8") as f:
        products = json.load(f)

    print(f"Original total products: {len(products)}")

    by_cat = defaultdict(list)
    for p in products:
        by_cat[p["category"]].append(p)

    reduced = []
    # Keep 50 items per department
    for cat in sorted(by_cat.keys()):
        items = by_cat[cat][:50]
        reduced.extend(items)
        print(f"  {cat}: {len(items)} items retained")

    print(f"Final reduced inventory: {len(reduced)} products")

    # Save to mockCatalog1000.json and mockCatalog500.json
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(reduced, f, indent=2)

    with open(json_500_path, "w", encoding="utf-8") as f:
        json.dump(reduced, f, indent=2)

    # Save to src/data/mockCatalog.ts
    ts_content = "import { Product } from '../types';\n\nexport const MOCK_PRODUCTS: Product[] = " + json.dumps(reduced, indent=2) + ";\n"
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("Successfully updated src/data/mockCatalog.ts and catalog JSON files with 500 products.")

if __name__ == "__main__":
    main()
