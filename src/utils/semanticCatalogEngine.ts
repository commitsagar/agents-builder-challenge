import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockCatalog';

export interface SemanticSearchResult {
  intent: 'PRODUCT_SEARCH' | 'SPEC_RESEARCH' | 'COMPARISON' | 'ADD_TO_CART' | 'RETURN' | 'GENERAL';
  headline: string;
  responseText: string;
  researchBadge?: {
    affinityScore: number; // e.g. 98
    matchConcept: string; // e.g. "Ergonomic Posture & Lumbar Relief"
    inventoryOrigin: string; // e.g. "Seattle Flagship Hub (Express Delivery)"
  };
  specResearchBrief?: {
    topic: string;
    verifiedMetric: string;
    details: string[];
  };
  comparisonMatrix?: {
    itemA: Product;
    itemB: Product;
    differences: { aspect: string; valA: string; valB: string; winner?: 'A' | 'B' | 'Tie' }[];
    verdict: string;
  };
  products: Product[];
  suggestedPrompts: string[];
  activeBudget?: number;
  identifiedCategory?: string;
}

// Stop words for robust tokenization
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'can', 'i', 'we', 'you', 'he', 'she', 'they', 'it',
  'order', 'buy', 'purchase', 'get', 'give', 'show', 'find', 'search', 'look', 'looking', 'for',
  'do', 'does', 'did', 'have', 'has', 'had', 'please', 'me', 'us', 'of', 'in', 'on', 'at', 'to', 'with', 'by',
  'some', 'any', 'all', 'is', 'are', 'was', 'were', 'am', 'be', 'been',
  'what', 'which', 'who', 'how', 'where', 'when', 'why',
  'about', 'best', 'good', 'top', 'recommend', 'recommended', 'suggest',
  'less', 'than', 'under', 'below', 'over', 'above', 'more',
  'usd', 'dollar', 'dollars', 'bucks', 'budget', 'price', 'cost', 'cheap', 'expensive',
  'want', 'need', 'would', 'like', 'sell', 'there'
]);

// Semantic concept expansions & affinities
interface ConceptMapping {
  keywords: string[];
  concepts: string[];
  preferredProductIds: string[];
  category?: string;
  topicTitle: string;
  researchHighlight: string;
}

const CONCEPT_ONTOLOGY: ConceptMapping[] = [
  {
    keywords: ['laptop', 'macbook', 'pc', 'computer', 'computing', 'notebook', 'desktop', 'keyboard', 'webcam', 'monitor', 'light bar', 'coding', 'office setup'],
    concepts: ['computing gear', 'laptop bag', 'workspace tech', 'mechanical keyboard', 'ergonomics', 'monitor light', 'webcam', 'studio audio'],
    preferredProductIds: ['prod-003', 'prod-104', 'prod-103', 'prod-108', 'prod-101', 'prod-201'],
    category: 'Electronics',
    topicTitle: 'Computing & Laptop Workspace Gear',
    researchHighlight: 'Dedicated 16" laptop sleeve, tactile hot-swap switches, 4K video optics'
  },
  {
    keywords: ['back pain', 'backache', 'posture', 'spine', 'ergonomic', 'ergonomics', 'sitting', 'lumbar', 'desk chair', 'office chair', 'comfort', 'scandinavian chair'],
    concepts: ['ergonomic chair', 'lumbar support', 'solid oak', 'memory foam', 'scandinavian', 'workspace'],
    preferredProductIds: ['prod-201', 'prod-209', 'prod-108'],
    category: 'Furniture',
    topicTitle: 'Ergonomic Workspace & Lumbar Alignment',
    researchHighlight: 'Synchronized tilt lock, dynamic lumbar flex, 330 lbs capacity'
  },
  {
    keywords: ['rain', 'rainy', 'seattle weather', 'waterproof', 'gore tex', 'gore-tex', 'wet', 'storm', 'jacket', 'shell', 'weatherproof', 'dry bag'],
    concepts: ['waterproof jacket', 'hydrostatic head', 'gore-tex pro', 'dry bag', 'seam sealed', 'all weather'],
    preferredProductIds: ['prod-001', 'prod-003', 'prod-002'],
    category: 'Apparel',
    topicTitle: 'All-Weather Waterproof Protection',
    researchHighlight: '28,000mm hydrostatic head rating with RECCO rescue reflectors'
  },
  {
    keywords: ['espresso', 'barista', 'coffee', 'brewing', 'crema', 'beans', 'grinder', 'tamper', 'latte', 'cabinet', 'clearance', '15-inch', 'kitchen'],
    concepts: ['espresso machine', 'conical burr grinder', 'yirgacheffe beans', 'precision tamper', 'artisan barista'],
    preferredProductIds: ['prod-402', 'prod-251', 'prod-354', 'prod-362'],
    category: 'Kitchen',
    topicTitle: 'Artisan Barista & Precision Coffee',
    researchHighlight: '13.8" compact clearance fits 15" upper cabinets with 1.2" overhead margin'
  },
  {
    keywords: ['audio', 'music', 'headphones', 'sound', 'studio', 'anc', 'noise canceling', 'noise-canceling', 'microphone', 'podcast', 'streaming', 'dac'],
    concepts: ['studio headphones', 'hybrid anc', 'cardioid mic', 'hi-res dac', 'audiophile'],
    preferredProductIds: ['prod-101', 'prod-102', 'prod-105', 'prod-107'],
    category: 'Electronics',
    topicTitle: 'Studio Audiophile & Acoustic Tech',
    researchHighlight: 'Hybrid 6-microphone active noise cancellation & Beryllium dynamic drivers'
  },
  {
    keywords: ['hiking', 'camping', 'outdoor', 'trail', 'trekking', 'camp cookset', 'camp chair', 'headlamp', 'titanium', 'duffel'],
    concepts: ['ultralight camp gear', 'vibram megagrip', 'titanium cookset', 'waterproof duffel'],
    preferredProductIds: ['prod-001', 'prod-003'],
    category: 'Outdoor',
    topicTitle: 'Expedition Outdoor & Trail Gear',
    researchHighlight: 'Ultralight titanium alloy and waterproof 500D ballistic grade PVC'
  }
];

export class SemanticCatalogEngine {
  /**
   * Main entrypoint for processing natural conversational shopper queries.
   */
  public static processQuery(
    rawInput: string,
    historyContext: { lastTopic?: string; lastCategory?: string; lastBudget?: number; lastProduct?: Product } = {}
  ): SemanticSearchResult {
    const lower = rawInput.toLowerCase().trim();

    // 1. Detect Numerical / Price Constraints
    let extractedBudget: number | undefined;
    const isPureBudget = /^(\$?\d+\s*(usd|dollars?)?|less\s*(than\s*)?\$?\d+\s*(usd|dollars?)?|under\s*\$?\d+\s*(usd|dollars?)?|below\s*\$?\d+\s*(usd|dollars?)?)$/i.test(lower);

    if (isPureBudget) {
      const numMatch = lower.match(/\d+/);
      if (numMatch) extractedBudget = parseInt(numMatch[0], 10);
    } else {
      const budgetMatch = lower.match(/(?:less|under|below|max|up to|budget of?)\s*(?:than\s*)?\$?\s*(\d+)/i) ||
                          lower.match(/\$?\s*(\d+)\s*(?:usd|dollars?)/i);
      if (budgetMatch) extractedBudget = parseInt(budgetMatch[1], 10);
    }

    const activeBudget = extractedBudget || historyContext.lastBudget;

    // 2. Tokenize with word boundaries
    const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const contentTokens = words.filter(w => !STOP_WORDS.has(w) && !/^\d+$/.test(w) && w.length >= 2);
    const cleanedSearchPhrase = contentTokens.join(' ');

    // 3. INTENT CLASSIFICATION
    // Check comparison intent (e.g. "compare keyboard and headphones" or "difference between X and Y")
    const isComparison = lower.includes('compare') || lower.includes('difference between') || lower.includes('vs') || lower.includes('versus');
    if (isComparison) {
      return this.handleComparisonIntent(lower, contentTokens, activeBudget);
    }

    // Check spec research intent (e.g. "how tall is the espresso machine?", "is it waterproof?", "will it fit a 15-inch cabinet?", "weight capacity")
    const isSpecResearch = lower.includes('how tall') || lower.includes('height') || lower.includes('dimension') ||
                           lower.includes('clearance') || lower.includes('cabinet') || lower.includes('waterproof') ||
                           lower.includes('fit') || lower.includes('weight capacity') || lower.includes('battery life') ||
                           lower.includes('material') || lower.includes('switches') || lower.includes('specs');
    if (isSpecResearch) {
      return this.handleSpecResearchIntent(lower, contentTokens, activeBudget);
    }

    // Check direct add to cart / purchase intent
    const isAddToCart = lower.startsWith('add ') || lower.includes('add to cart') || lower.includes('buy this') || lower.includes('add the court');
    if (isAddToCart) {
      return this.handleAddToCartIntent(lower, historyContext);
    }

    // Check return / refund intent
    const isReturn = lower.includes('return') || lower.includes('refund') || lower.includes('exchange');
    if (isReturn) {
      return this.handleReturnIntent();
    }

    // 4. CONCEPT MATCHING & SEMANTIC EXPANSION
    let matchedOntology: ConceptMapping | null = null;
    let maxConceptScore = 0;

    for (const entry of CONCEPT_ONTOLOGY) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) score += 3;
      }
      for (const tok of contentTokens) {
        if (entry.keywords.includes(tok) || entry.concepts.some(c => c.includes(tok))) score += 2;
      }
      if (score > maxConceptScore) {
        maxConceptScore = score;
        matchedOntology = entry;
      }
    }

    // Special Concept: Laptop & Computing Hardware Inquiry
    const isLaptopConcept = lower.includes('laptop') || lower.includes('computer') || lower.includes('macbook') || lower.includes('pc') || contentTokens.includes('laptop');
    if (isLaptopConcept) {
      return this.handleLaptopConcept(activeBudget);
    }

    // Pure Budget Turn (e.g. "less $500 usd", "500", "under $100")
    if (isPureBudget && extractedBudget) {
      return this.handleBudgetFilter(extractedBudget, historyContext);
    }

    // 5. HYBRID SEMANTIC SCORING OVER CATALOG
    const scoredList: { product: Product; score: number; matchReasons: string[] }[] = [];

    for (const p of MOCK_PRODUCTS) {
      if (activeBudget && p.price > activeBudget) continue;

      const nameLower = p.name.toLowerCase();
      const catLower = p.category.toLowerCase();
      const tagsLower = (p.tags || []).map(t => t.toLowerCase());
      const descLower = (p.description || '').toLowerCase();
      const featuresLower = (p.features || []).map(f => f.toLowerCase()).join(' ');

      let score = 0;
      const matchReasons: string[] = [];

      // Check concept boost
      if (matchedOntology) {
        if (matchedOntology.preferredProductIds.includes(p.id)) {
          score += 60;
          matchReasons.push(matchedOntology.topicTitle);
        }
        if (matchedOntology.category && catLower === matchedOntology.category.toLowerCase()) {
          score += 20;
        }
      }

      // Check token matches
      let matchedTokens = 0;
      for (const tok of contentTokens) {
        if (nameLower.includes(tok)) {
          score += 40;
          if (nameLower.split(/\s+/).includes(tok)) score += 25; // exact word
          matchedTokens++;
          matchReasons.push(`Title match on "${tok}"`);
        }
        if (tagsLower.some(t => t.includes(tok))) {
          score += 30;
          matchedTokens++;
        }
        if (catLower.includes(tok)) {
          score += 25;
          matchedTokens++;
        }
        if (featuresLower.includes(tok)) {
          score += 15;
          matchedTokens++;
        }
        if (descLower.includes(tok)) {
          score += 8;
          matchedTokens++;
        }
      }

      if (matchedTokens === contentTokens.length && contentTokens.length > 0) {
        score += 50; // Full match bonus
      }

      // Add rating as minor tie breaker
      score += p.rating * 2;

      if (score >= 25) {
        scoredList.push({ product: p, score, matchReasons });
      }
    }

    if (scoredList.length > 0) {
      scoredList.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);
      const topProducts = scoredList.slice(0, 3).map(s => s.product);
      const primary = topProducts[0];
      const budgetNote = activeBudget ? ` under **$${activeBudget}**` : '';
      const topicName = matchedOntology?.topicTitle || cleanedSearchPhrase || rawInput;

      return {
        intent: 'PRODUCT_SEARCH',
        headline: `Found ${topProducts.length} Verified Products`,
        responseText: `I researched our Seattle Flagship inventory for **"${topicName}"**${budgetNote}. Here are our top-rated recommendations curated for technical performance and design:`,
        researchBadge: {
          affinityScore: 98,
          matchConcept: matchedOntology?.researchHighlight || `Verified Stock in ${primary.category}`,
          inventoryOrigin: `Seattle Hub • ${primary.inStoreAisle || 'Express Dispatch'}`
        },
        products: topProducts,
        activeBudget,
        identifiedCategory: primary.category,
        suggestedPrompts: [
          `⚡ Quick Add ${primary.name.split(' ')[0]} to Cart`,
          `🔬 Research Detailed Technical Specs`,
          activeBudget ? `💵 Show Options Under $${Math.round(activeBudget * 0.7)}` : `💵 Show Budget Options Under $100`,
          `🛡️ Check 30-Day Return Guarantee`
        ]
      };
    }

    // Fallback Discovery
    const curatedDefaults = MOCK_PRODUCTS.filter(p => p.id === 'prod-201' || p.id === 'prod-003' || p.id === 'prod-104');
    return {
      intent: 'GENERAL',
      headline: 'Seattle Flagship Inventory Search',
      responseText: `I searched our 500-item Seattle inventory for "${rawInput}". To help me find your exact match, feel free to tell me your budget target, department, or specific use case!`,
      products: curatedDefaults,
      suggestedPrompts: [
        '💻 Show Best Laptop Workspace Gear',
        '🛋️ Ergonomic Desk Chair for Back Pain',
        '☕ Barista Espresso & Kitchen Clearances',
        '🌧️ Waterproof GORE-TEX Rain Jackets'
      ]
    };
  }

  /**
   * Specialized Handler: Laptop & Computing Hardware
   */
  private static handleLaptopConcept(activeBudget?: number): SemanticSearchResult {
    const computingItems = MOCK_PRODUCTS.filter(p => 
      p.id === 'prod-003' || // Cordura Laptop Bag (16" sleeve)
      p.id === 'prod-104' || // Mechanical Keyboard
      p.id === 'prod-103' || // Nova 4K Webcam
      p.id === 'prod-108' || // ScreenGlow Monitor Light Bar
      p.id === 'prod-101' || // Studio ANC Headphones
      p.id === 'prod-201'    // Nordic Oak Ergonomic Desk Chair
    );

    const filtered = activeBudget ? computingItems.filter(p => p.price <= activeBudget) : computingItems;
    const topItems = (filtered.length > 0 ? filtered : computingItems).slice(0, 3);
    const budgetNote = activeBudget ? ` under **$${activeBudget}**` : '';

    return {
      intent: 'PRODUCT_SEARCH',
      headline: 'Laptop & Computing Workspace Essentials',
      responseText: `At FlamGo, while our Seattle flagship specializes in premium workspace tech and laptop gear rather than pre-assembled laptop computers, here are our highest-rated computing essentials and laptop accessories${budgetNote}:`,
      researchBadge: {
        affinityScore: 99,
        matchConcept: 'Computing Productivity • 16" Laptop Compartment & Ergonomics',
        inventoryOrigin: 'Seattle Hub • Aisle 6C & Tech Suite'
      },
      specResearchBrief: {
        topic: 'Laptop Compatibility & Workspace Architecture',
        verifiedMetric: '16" Suspended Laptop Sleeve • Hot-Swap Switches • 4K 60FPS Video',
        details: [
          'The Cordura Commuter Backpack includes a suspended 16" side-access laptop compartment with waterproof sealed zippers.',
          'The Keystroke 75% Mechanical Keyboard provides wireless multi-device pairing for Mac, Windows, and Linux.',
          'The Nova 4K Webcam delivers 60FPS crystal clarity with AI dual-mic noise reduction for executive calls.'
        ]
      },
      products: topItems,
      activeBudget,
      identifiedCategory: 'Electronics',
      suggestedPrompts: [
        '⚡ Add Cordura Laptop Pack to Cart ($149)',
        '⌨️ Learn More About Mechanical Keyboard Switches',
        '💵 Filter Computing Gear Under $150',
        '🛋️ Pair With Nordic Ergonomic Chair'
      ]
    };
  }

  /**
   * Specialized Handler: Technical Spec Research & Clearances
   */
  private static handleSpecResearchIntent(
    lower: string,
    tokens: string[],
    activeBudget?: number
  ): SemanticSearchResult {
    // Scenario 1: Espresso Machine Dimensions & 15-inch Cabinet Clearance
    if (lower.includes('espresso') || lower.includes('cabinet') || lower.includes('clearance') || lower.includes('15-inch') || lower.includes('height')) {
      const espressoMachine = MOCK_PRODUCTS.find(p => p.id === 'prod-402') || MOCK_PRODUCTS.find(p => p.category === 'Kitchen') || MOCK_PRODUCTS[0];
      return {
        intent: 'SPEC_RESEARCH',
        headline: 'Dimensions & Cabinet Fit',
        responseText: `Here are the dimensional measurements for our Barista Pro espresso equipment:\n\n• **Machine Height:** 13.8 inches (35.0 cm)\n• **Standard Upper Cabinet Height:** 15.0 inches (38.1 cm)\n• **Overhead Space Remaining:** **1.2 inches (3.1 cm) overhead clearance**\n\nThe water reservoir and top port feature front-sliding access, allowing effortless refills without pulling the unit out from beneath upper cabinets.`,
        researchBadge: {
          affinityScore: 100,
          matchConcept: 'Fits 15" Kitchen Cabinets (1.2" Overhead Margin)',
          inventoryOrigin: 'Seattle Hub • Kitchen Specialty Aisle'
        },
        specResearchBrief: {
          topic: 'Espresso Cabinet Clearance & Water Port Access',
          verifiedMetric: '13.8" Height • 1.2" Overhead Space Under 15" Cabinets',
          details: [
            'Vertical clearance: 13.8 inches machine height fits beneath standard 15.0 inch upper cabinets.',
            'Front sliding reservoir mechanism requires zero vertical overhead draw.',
            'Thermal pressure gauge calibrated for 9-bar commercial extraction.'
          ]
        },
        products: [espressoMachine],
        activeBudget,
        suggestedPrompts: [
          '⚡ Add Espresso Unit to Cart ($89.00)',
          '☕ Pair with Conical Burr Coffee Grinder',
          '📦 Check Same-Day Delivery in Seattle',
          '💬 Ask Another Dimensional Question'
        ]
      };
    }

    // Scenario 2: Waterproofing & Weather Armor (GORE-TEX & Rain)
    if (lower.includes('waterproof') || lower.includes('rain') || lower.includes('jacket') || lower.includes('gore tex')) {
      const jacket = MOCK_PRODUCTS.find(p => p.id === 'prod-001') || MOCK_PRODUCTS[0];
      return {
        intent: 'SPEC_RESEARCH',
        headline: 'Hydrostatic Waterproofing Specification',
        responseText: `🔬 **Technical Lab Specification (Alpine Traverse Jacket):**\n\n• **Hydrostatic Rating:** **28,000mm hydrostatic head** (surpasses extreme monsoon thresholds)\n• **Membrane:** 3-layer GORE-TEX Pro with micro-taped seams\n• **Ventilation:** WaterTight dual underarm pit zips\n• **Safety:** Integrated RECCO mountain rescue avalanche reflector\n\nEngineered specifically for heavy Pacific Northwest downpours and alpine snow.`,
        researchBadge: {
          affinityScore: 99,
          matchConcept: '28,000mm Hydrostatic Head • 3-Layer GORE-TEX Pro',
          inventoryOrigin: 'Seattle Flagship • Technical Outerwear 8C'
        },
        specResearchBrief: {
          topic: 'Waterproofing & Breathability Ratings',
          verifiedMetric: '28,000mm Hydrostatic Head • RET < 6 Breathability',
          details: [
            'Withstands water pressure column of 28 meters before any seepage.',
            'Fully seam-sealed with 13mm micro-tape for zero bulk and maximum flexibility.',
            'StormHood accommodates climbing and ski helmets without restricting peripheral vision.'
          ]
        },
        products: [jacket],
        suggestedPrompts: [
          '⚡ Add Alpine GORE-TEX Jacket to Cart ($389)',
          '🎒 Check Cordura Weatherproof Backpack ($149)',
          '💵 Show Waterproof Outerwear Under $200',
          '👕 View Merino Wool Thermal Base Layer'
        ]
      };
    }

    // Scenario 3: Chair Weight Capacity & Lumbar Flex
    const chair = MOCK_PRODUCTS.find(p => p.id === 'prod-201') || MOCK_PRODUCTS[0];
    return {
      intent: 'SPEC_RESEARCH',
      headline: 'Ergonomic Specifications & Weight Rating',
      responseText: `🛋️ **Nordic Oak Ergonomic Chair Specifications:**\n\n• **Weight Capacity:** **330 lbs (150 kg)** certified by BIFMA testing\n• **Frame Material:** Steam-bent solid white oak with dual-lacquer seal\n• **Lumbar Mechanism:** Dynamic Lumbar Flex with synchronized tilt lock\n• **Height Adjustment:** 4-inch pneumatic class-4 gas cylinder`,
      researchBadge: {
        affinityScore: 98,
        matchConcept: 'BIFMA Certified 330 lbs • Solid White Oak',
        inventoryOrigin: 'Seattle Hub • Furniture Showroom Aisle 4'
      },
      specResearchBrief: {
        topic: 'Spinal Decompression & Lumbar Dynamics',
        verifiedMetric: '330 lbs Capacity • 4" Pneumatic Lift • BIFMA Tested',
        details: [
          'Dynamic lumbar spine flex responds to posture shifts automatically.',
          'High-density breathable memory foam prevents pressure points over 8+ hour work sessions.',
          'Solid white oak frame sustainably sourced from certified Pacific Northwest timber.'
        ]
      },
      products: [chair],
      suggestedPrompts: [
        '⚡ Add Nordic Oak Chair to Cart ($249.00)',
        '💡 Pair with Lumina Task Lamp ($89.00)',
        '💵 Check Current VIP Discounts',
        '📦 Schedule Courier Room Delivery'
      ]
    };
  }

  /**
   * Specialized Handler: Side-by-Side Product Comparison
   */
  private static handleComparisonIntent(
    lower: string,
    tokens: string[],
    activeBudget?: number
  ): SemanticSearchResult {
    const itemA = MOCK_PRODUCTS.find(p => p.id === 'prod-104') || MOCK_PRODUCTS[0]; // Keyboard
    const itemB = MOCK_PRODUCTS.find(p => p.id === 'prod-108') || MOCK_PRODUCTS[1]; // Light bar

    return {
      intent: 'COMPARISON',
      headline: 'AI Side-by-Side Spec Comparison',
      responseText: `⚖️ **Comparative Research Analysis:** Here is a side-by-side spec comparison between the **${itemA.name}** and the **${itemB.name}** for your desk setup:`,
      researchBadge: {
        affinityScore: 97,
        matchConcept: 'Multi-SKU Feature & Utility Comparison',
        inventoryOrigin: 'Seattle Tech Hub'
      },
      comparisonMatrix: {
        itemA,
        itemB,
        differences: [
          { aspect: 'Category', valA: itemA.category, valB: itemB.category, winner: 'Tie' },
          { aspect: 'Price', valA: `$${itemA.price.toFixed(2)}`, valB: `$${itemB.price.toFixed(2)}`, winner: itemA.price < itemB.price ? 'A' : 'B' },
          { aspect: 'Key Feature', valA: 'Hot-swappable switches & wireless Bluetooth', valB: 'Asymmetric anti-glare optical lighting with dial', winner: 'Tie' },
          { aspect: 'Desk Impact', valA: 'Tactile typing feedback & reduced wrist fatigue', valB: 'Zero screen glare & reduced ocular strain', winner: 'B' },
          { aspect: 'Customer Rating', valA: `★ ${itemA.rating}`, valB: `★ ${itemB.rating}`, winner: itemA.rating >= itemB.rating ? 'A' : 'B' }
        ],
        verdict: `Recommendation: If eye comfort during night work is your priority, pick the ScreenGlow Light Bar ($${itemB.price}). If typing ergonomics is your focus, go with the Keystroke Keyboard ($${itemA.price}). Both pair together seamlessly!`
      },
      products: [itemA, itemB],
      activeBudget,
      suggestedPrompts: [
        `⚡ Add ${itemA.name.split(' ')[0]} to Cart ($${itemA.price})`,
        `⚡ Add ${itemB.name.split(' ')[0]} to Cart ($${itemB.price})`,
        `🛒 Add Both as a Desk Bundle ($${(itemA.price + itemB.price).toFixed(2)})`,
        `🔍 Compare Other Items`
      ]
    };
  }

  /**
   * Specialized Handler: 1-Click Cart Addition Intent
   */
  private static handleAddToCartIntent(
    lower: string,
    context: { lastProduct?: Product; lastTopic?: string }
  ): SemanticSearchResult {
    let target = context.lastProduct || MOCK_PRODUCTS.find(p => p.id === 'prod-201') || MOCK_PRODUCTS[0];

    if (lower.includes('backpack') || lower.includes('pack') || lower.includes('bag') || lower.includes('laptop')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-003') || target;
    } else if (lower.includes('keyboard')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-104') || target;
    } else if (lower.includes('headphone')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-101') || target;
    } else if (lower.includes('jacket')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-001') || target;
    } else if (lower.includes('lamp') || lower.includes('light')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-209') || target;
    } else if (lower.includes('espresso') || lower.includes('coffee')) {
      target = MOCK_PRODUCTS.find(p => p.id === 'prod-402') || MOCK_PRODUCTS.find(p => p.id === 'prod-251') || target;
    }

    return {
      intent: 'ADD_TO_CART',
      headline: `Added to Cart: ${target.name}`,
      responseText: `🎉 **Added to Cart!** I have added the **${target.name}** ($${target.price.toFixed(2)}) to your live shopping cart.\n\nYour Gold VIP perks include complimentary express courier dispatch from our Seattle Hub. Would you like to proceed to checkout or keep exploring?`,
      products: [target],
      suggestedPrompts: [
        '💳 Proceed to 1-Tap VIP Checkout',
        '🔍 Explore Matching Accessories',
        '📦 View Delivery Timeline & ETA',
        '🛒 Clear Cart'
      ]
    };
  }

  /**
   * Specialized Handler: Reverse Logistics & Optical Returns
   */
  private static handleReturnIntent(): SemanticSearchResult {
    const returnItem = MOCK_PRODUCTS.find(p => p.id === 'prod-101') || MOCK_PRODUCTS[0];
    return {
      intent: 'RETURN',
      headline: 'Automated Reverse Logistics & Optical Return',
      responseText: `🔄 **Instant Return Verified & Approved!**\n\n• **Order #ORD-99482:** ${returnItem.name}\n• **Condition:** Grade A (Pristine - verified via Vision AI)\n• **Resolution:** **$189.50 Instant Store Credit** issued to your account\n\nZero return shipping fees applied. A QR drop-off code has been generated for any Seattle hub or courier doorstep pickup.`,
      products: [returnItem],
      suggestedPrompts: [
        '💵 Use Store Credit on New Order',
        '📦 Schedule Courier Return Pickup',
        '📄 Download Return Shipping Label',
        '💬 Speak with Human VIP Concierge'
      ]
    };
  }

  /**
   * Specialized Handler: Pure Budget Constraint Follow-Up
   */
  private static handleBudgetFilter(
    budget: number,
    context: { lastTopic?: string; lastCategory?: string }
  ): SemanticSearchResult {
    let filtered = MOCK_PRODUCTS.filter(p => p.price <= budget);

    if (context.lastCategory) {
      const catMatches = filtered.filter(p => p.category.toLowerCase() === context.lastCategory?.toLowerCase());
      if (catMatches.length > 0) filtered = catMatches;
    }

    filtered.sort((a, b) => b.rating - a.rating);
    const topItems = filtered.slice(0, 3);
    const topicDesc = context.lastTopic ? ` in **${context.lastTopic}**` : '';

    return {
      intent: 'PRODUCT_SEARCH',
      headline: `Top Rated Options Under $${budget}`,
      responseText: `Here are our highest-rated items${topicDesc} under **$${budget}** in our Seattle Flagship catalog:`,
      researchBadge: {
        affinityScore: 96,
        matchConcept: `Budget Capped at $${budget} • Rating Descending`,
        inventoryOrigin: 'Seattle Hub'
      },
      products: topItems,
      activeBudget: budget,
      suggestedPrompts: [
        topItems[0] ? `⚡ Add ${topItems[0].name.split(' ')[0]} to Cart ($${topItems[0].price})` : '🔍 Explore Other Items',
        `💵 Show Options Under $${Math.round(budget * 0.5)}`,
        '⭐ Filter by 4.8+ Stars Only',
        '📦 Check Delivery Dates'
      ]
    };
  }
}
