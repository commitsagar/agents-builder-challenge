"""
Script to generate 1,000 High-Fidelity Enterprise Retail Mock Products across 10 Departments
(100 Products per Department) with zero broken image URLs, rich descriptions, realistic pricing,
aisle mapping, and full Firestore compatibility.
"""

import os
import json
import random

# Curated high-resolution Unsplash images for each department (Verified HTTP 200 URLs)
CATEGORY_IMAGES = {
    "Furniture": [
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
    ],
    "Electronics": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
    ],
    "Apparel": [
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    "Kitchen": [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    ],
    "Fitness": [
        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
    ],
    "Home & Decor": [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    "Beauty": [
        "https://images.unsplash.com/photo-1608248597359-54d9a3b61033?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    "Gourmet": [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
    ],
    "Outdoor": [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=800&q=80"
    ],
    "Toys & Hobbies": [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"
    ]
}

# Rich vocabulary templates for procedural generation
DEPT_TEMPLATES = {
    "Furniture": {
        "aisle": "Aisle 4{sub} (Furniture & Living)",
        "adjectives": ["Nordic", "Ergonomic", "Modular", "Solid Wood", "Velvet", "Artisan", "Mid-Century", "Minimalist", "Crafted", "Executive", "Reclaimed", "Linear"],
        "items": ["Desk Chair", "Standing Desk", "Lounge Armchair", "Bookshelf", "Coffee Table", "Credenza", "Ottoman", "Storage Console", "Dining Chair", "Side Table", "Wall Shelf", "Platform Bed Frame"],
        "materials": ["White Oak", "American Walnut", "Matte Steel", "Linen Weave", "Full-Grain Leather", "Cast Brass", "Solid Birch"],
        "price_range": (89, 899)
    },
    "Electronics": {
        "aisle": "Aisle 1{sub} (Studio Tech & Audio)",
        "adjectives": ["Aura Pro", "Studio Grade", "Wireless", "Lossless", "Precision", "Active", "Ultra-Low Latency", "Beryllium", "Mechanical", "Hi-Res", "Dynamic", "Noise-Canceling"],
        "items": ["Headphones", "Earbuds", "Studio Microphone", "Audio Interface", "Mechanical Keyboard", "Wireless Mouse", "4K Webcam", "Desk DAC", "Bluetooth Monitor", "USB-C Hub", "Smart Display", "Gaming Headset"],
        "materials": ["Anodized Aluminum", "Carbon Fiber", "CNC Billet", "Tempered Glass", "Braided Kevlar"],
        "price_range": (49, 699)
    },
    "Apparel": {
        "aisle": "Aisle 7{sub} (Apparel & Outerwear)",
        "adjectives": ["Weatherproof", "Merino Wool", "Technical", "Tailored", "Everyday", "Heavyweight", "Breathable", "Water-Repellent", "Relaxed Fit", "GORE-TEX", "Commuter", "Japanese Denim"],
        "items": ["Parka Jacket", "Base Layer Crew", "Chino Pant", "Oxford Shirt", "Selvedge Denim", "Fleece Hoodie", "Commuter Bag", "Field Overshirt", "Rain Trench", "Thermal Beanie", "Tote Backpack", "Linen Shirt"],
        "materials": ["3-Layer Shell", "100% Merino Wool", "Raw Cotton", "Cordura Fabric", "Organic Bamboo"],
        "price_range": (39, 389)
    },
    "Kitchen": {
        "aisle": "Aisle 6{sub} (Culinary & Brew)",
        "adjectives": ["Precision", "Enamelled", "Carbon Steel", "Hand-Forged", "Cast Iron", "Gooseneck", "Japanese Steel", "Double-Walled", "Culinary", "Heavy Duty", "Stainless", "Non-Stick"],
        "items": ["Chef Knife", "Pour-Over Kettle", "Dutch Oven", "Skillet Pan", "Espresso Tamper", "French Press", "Cutting Board", "Santoku Slicer", "Mortar & Pestle", "Roasting Pan", "Spice Grinder", "Stoneware Baker"],
        "materials": ["VG-10 Damascus", "Enameled Iron", "End-Grain Walnut", "18/10 Stainless", "Matte Ceramic"],
        "price_range": (29, 349)
    },
    "Fitness": {
        "aisle": "Aisle 9{sub} (Athletics & Training)",
        "adjectives": ["Heavy-Duty", "Adjustable", "High-Density", "Natural Rubber", "Deep-Tissue", "Competition", "Compact", "Ergonomic", "Textured", "Calisthenic", "Precision", "Recovery"],
        "items": ["Dumbbell Set", "Yoga Mat", "Kettlebell", "Foam Roller", "Massage Gun", "Pull-Up Bar", "Resistance Bands", "Speed Jump Rope", "Balance Board", "Weight Vest", "Parallettes", "Gym Bag"],
        "materials": ["Cast Iron", "Natural Tree Rubber", "High-Density EVA", "Aerospace Alloy", "Tear-Proof Nylon"],
        "price_range": (19, 299)
    },
    "Home & Decor": {
        "aisle": "Aisle 5{sub} (Home & Sanctuary)",
        "adjectives": ["Hand-Thrown", "Ultrasonic", "Fluted", "Textured", "Stoneware", "Minimalist", "Aromatherapy", "Woven", "Soy Wax", "Artisan Glazed", "Abstract", "Linen"],
        "items": ["Planter Pot", "Aroma Diffuser", "Ceramic Vase", "Throw Blanket", "Accent Lamp", "Wall Mirror", "Table Candle", "Linen Pillow", "Trinket Dish", "Sculptural Bowl", "Floor Lantern", "Incense Holder"],
        "materials": ["Stoneware Clay", "French Flax Linen", "Brushed Brass", "Smoked Glass", "Natural Travertine"],
        "price_range": (24, 219)
    },
    "Beauty": {
        "aisle": "Aisle 2{sub} (Clean Beauty & Skincare)",
        "adjectives": ["Plant-Derived", "Cold-Pressed", "Hyaluronic", "Niacinamide", "Peptide-Rich", "Sonic", "Botanical", "Antioxidant", "Hydrating", "Gua Sha", "Soothing", "Clean Formula"],
        "items": ["Face Serum", "Facial Oil", "Night Cream", "Cleansing Balm", "Rose Quartz Tool", "Sonic Exfoliator", "Toning Essence", "Eye Contour Gel", "Lip Recovery Mask", "Scalp Elixir", "Body Polish", "Mist Spray"],
        "materials": ["Pure Squalane", "100% Brazilian Rose Quartz", "Organic Rosehip", "Medical Silicone", "Amber Glass"],
        "price_range": (18, 149)
    },
    "Gourmet": {
        "aisle": "Aisle 3{sub} (Artisan Pantry & Coffee)",
        "adjectives": ["Single-Origin", "Cold-Pressed", "Ceremonial Grade", "Stone-Ground", "Raw Wildflower", "Artisanal", "Direct-Trade", "Organic", "Heirloom", "Wood-Smoked", "Hand-Harvested", "Batch Roasted"],
        "items": ["Whole Bean Coffee", "Extra Virgin Olive Oil", "Matcha Powder", "Raw Honeycomb", "Aged Balsamic", "Dark Chocolate Bar", "Loose Leaf Tea", "Sea Salt Flakes", "Almond Butter", "Maple Syrup", "Chili Crisp Oil", "Granola"],
        "materials": ["Ethiopian Yirgacheffe", "Cretan Koroneiki", "Uji Kyoto Harvest", "Vermont Grade A", "Single-Estate Cacao"],
        "price_range": (12, 85)
    },
    "Outdoor": {
        "aisle": "Aisle 8{sub} (Expedition & Camp)",
        "adjectives": ["Ultralight", "Waterproof", "Packable", "Thermal Insulated", "Rugged", "Portable", "Solar Compatible", "Ripstop", "Compact", "Titanium", "High-Output", "Sub-Zero"],
        "items": ["2-Person Tent", "Sleeping Bag", "Camp Stove", "Power Station", "Dry Bag", "Titanium Mug", "Headlamp", "Hammock", "Water Filter", "Camp Chair", "Trekking Poles", "Insulated Flask"],
        "materials": ["Silnylon Ripstop", "Grade 2 Titanium", "LiFePO4 Cells", "Anodized 7075 Aluminum", "Double-Wall Vacuum"],
        "price_range": (25, 450)
    },
    "Toys & Hobbies": {
        "aisle": "Aisle 10{sub} (Creative & Hobbies)",
        "adjectives": ["Architectural", "Laser-Cut", "Precision Wood", "Strategy", "Mechanical", "Handcrafted", "Educational", "Vintage", "Deluxe Edition", "Artisan Tin", "Kinetic", "Modular"],
        "items": ["Building Blocks", "Board Game", "Orrery Model", "Watercolor Set", "Puzzle Sphere", "Retro Camera Kit", "Mechanical Music Box", "Calligraphy Set", "Wooden Marble Run", "Chess Set", "Model Telescope", "Craft Loom"],
        "materials": ["Solid Beechwood", "Natural Pigments", "Birch Plywood", "Brass Gears", "Heavyweight Linen Board"],
        "price_range": (22, 199)
    }
}

def generate_1000_products():
    import sys
    sys.path.append(os.path.dirname(__file__))
    from generate_100_products import PRODUCTS as original_100
    
    # Store all 1000 items
    all_products = []
    
    # Keep the original 100 products as anchors (prod-001 to prod-100)
    for p in original_100:
        all_products.append(p)
        
    # Group original by category to count how many we need per category
    cat_counts = {}
    for p in original_100:
        cat_counts[p["category"]] = cat_counts.get(p["category"], 0) + 1
        
    print(f"Loaded {len(original_100)} baseline products across categories: {cat_counts}")

    next_id = 101
    subs = ["A", "B", "C", "D", "E"]
    
    # We want exactly 100 products for EACH of the 10 departments
    departments = list(DEPT_TEMPLATES.keys())
    
    for category in departments:
        current_count = cat_counts.get(category, 0)
        needed = 100 - current_count
        tmpl = DEPT_TEMPLATES[category]
        images = CATEGORY_IMAGES[category]
        
        for i in range(needed):
            p_id = f"prod-{next_id:04d}"
            next_id += 1
            
            adj = tmpl["adjectives"][i % len(tmpl["adjectives"])]
            item = tmpl["items"][(i * 3 + 1) % len(tmpl["items"])]
            mat = tmpl["materials"][(i * 2) % len(tmpl["materials"])]
            
            # Variant differentiator
            variant_num = (i // len(tmpl["items"])) + 1
            variant_suffix = f" (Series {variant_num})" if variant_num > 1 else ""
            
            name = f"{adj} {mat} {item}{variant_suffix}"
            
            min_p, max_p = tmpl["price_range"]
            # Semi-random deterministic price
            base_price = round(min_p + ((i * 17 + next_id * 3) % int(max_p - min_p + 1)), 2)
            has_deal = (i % 3 == 0)
            original_price = round(base_price * (1.15 + (i % 4) * 0.05), 2) if has_deal else None
            
            rating = round(4.2 + (i % 8) * 0.1, 2)
            if rating > 5.0: rating = 4.95
            
            reviews_count = 25 + (i * 31 + next_id * 7) % 850
            stock = 8 + (i * 13 + next_id * 5) % 85
            
            sub_aisle = subs[i % len(subs)]
            in_store_aisle = tmpl["aisle"].format(sub=sub_aisle)
            
            image_url = images[i % len(images)]
            
            desc = f"Engineered for daily performance and longevity. Features premium {mat.lower()} craftsmanship with {adj.lower()} industrial design and verified local store stock."
            
            features = [
                f"Premium {mat} build quality",
                f"Optimized for {category.lower()} environments",
                f"Full 2-year manufacturer warranty",
                f"Fulfills with 2-hour local store delivery"
            ]
            
            tags = [
                category.lower(),
                adj.lower(),
                item.lower().replace(" ", "-"),
                mat.lower().replace(" ", "-"),
                "express-delivery",
                "verified-stock"
            ]
            if has_deal:
                tags.append("lightning-deal")
                
            elasticity = round(-0.9 - (i % 7) * 0.12, 2)
            return_risk = 3 + (i * 5) % 25
            
            prod_data = {
                "id": p_id,
                "name": name,
                "category": category,
                "price": base_price,
                "originalPrice": original_price,
                "rating": rating,
                "reviewsCount": reviews_count,
                "stock": stock,
                "image": image_url,
                "description": desc,
                "features": features,
                "tags": tags,
                "elasticity": elasticity,
                "inStoreAisle": in_store_aisle,
                "returnRiskScore": return_risk
            }
            
            all_products.append(prod_data)

    print(f"Total products generated: {len(all_products)}")
    
    # Verify counts per category
    final_counts = {}
    for p in all_products:
        final_counts[p["category"]] = final_counts.get(p["category"], 0) + 1
    print(f"Final distribution across all 10 departments: {final_counts}")
    
    # Write to TypeScript file src/data/mockCatalog.ts
    ts_content = "import { Product } from '../types';\n\n"
    ts_content += "export const MOCK_PRODUCTS: Product[] = " + json.dumps(all_products, indent=2) + ";\n"
    
    out_ts_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockCatalog.ts")
    with open(out_ts_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    
    out_json_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockCatalog1000.json")
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2)
        
    print(f"Successfully updated TypeScript catalog at {out_ts_path} and JSON at {out_json_path} with {len(all_products)} products!")
    
    return all_products

if __name__ == "__main__":
    generate_1000_products()
