export interface Product {
  id: string;
  name: string;
  category: 'Furniture' | 'Apparel' | 'Electronics' | 'Kitchen' | 'Outdoor' | 'Fitness' | 'Home & Decor' | 'Beauty' | 'Gourmet' | 'Toys & Hobbies' | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  image: string;
  description: string;
  features: string[];
  tags: string[];
  elasticity: number; // e.g. -1.4
  inStoreAisle?: string;
  returnRiskScore?: number; // 0-100
}

export interface IntentAnalysis {
  rawQuery: string;
  parsedCategory: string;
  extractedAttributes: { [key: string]: string };
  priceConstraint?: { max?: number; min?: number };
  styleAesthetic?: string;
  vectorSimilarityScore: number;
  bm25RankScore: number;
  reasoning: string;
}

export interface ReturnInspection {
  id: string;
  orderId: string;
  sku: string;
  productName: string;
  purchasePrice: number;
  customerClaim: string;
  uploadedImageUrl: string;
  analysis: {
    visualAuthenticityScore: number; // 0 - 100
    wearAndTearGrade: 'A (Pristine)' | 'B (Minor Wear)' | 'C (Heavy Wear)' | 'F (Counterfeit / Damaged)';
    tagDetected: boolean;
    serialMatch: boolean;
    fraudProbability: number; // 0 - 100
    geminiVisionNotes: string;
    disposition: 'Instant Auto-Refund ($ Store Credit)' | 'Route to B-Stock Liquidation (62% recovery)' | 'Quarantine: Manual Anti-Fraud Review';
    processingCostSavings: number; // e.g. $13.20 saved
  };
  status: 'approved' | 'quarantined' | 'liquidate';
  timestamp: string;
}

export interface DemandForecastPoint {
  date: string;
  historicalSales?: number;
  forecastedDemand: number;
  upperConfidence: number;
  lowerConfidence: number;
  weatherFactor: string;
  eventFactor?: string;
}

export interface GroundedFact {
  claim: string;
  doubleEdgeCloudTick: boolean;
  confidenceScore: number; // e.g. 99.4
  evidenceSource: string; // e.g. "GCP BigQuery Review Embeddings #REV-8831"
  telemetryMetric: string; // e.g. "420 hrs tested, 18% spinal decompression"
}

export interface AuthenticityPersonaReview {
  reviewerName: string;
  reviewerRole: string;
  reviewsCountTotal: number; // e.g. 542
  accuracyRate: string; // e.g. "99.8% Ground Truth Score"
  avatar: string;
  badge: string;
  headline: string;
  detailedAnalysis: string;
  groundedFacts: GroundedFact[];
  pros: string[];
  cons: string[];
  ragCitation: string;
}

export interface PhantomAnomaly {
  id: string;
  sku: string;
  productName: string;
  category: string;
  storeLocation: string;
  erpLedgerStock: number;
  posSalesVelocity7d: number;
  predictedPhysicalStock: number;
  discrepancyDelta: number;
  phantomRiskScore: number; // 0 - 100
  potentialLostRevenue: number;
  recommendedAction: string;
  status: 'flagged' | 'investigating' | 'resolved';
}

export interface PlanogramAudit {
  id: string;
  aisle: string;
  bayNumber: string;
  imageUrl: string;
  totalFacings: number;
  outOfStockGaps: number;
  misplacedItems: number;
  compliancePercentage: number;
  detectedIssues: {
    type: 'Stock Gap' | 'Misplaced SKU' | 'Missing Price Tag';
    shelfLevel: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PersonaType = 'B2C' | 'B2B';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  persona: PersonaType;
  avatar: string;
  organization?: string;
  storeId?: string;
  tier?: string;
  points?: number;
  address?: string;
}

export interface GpsTelemetry {
  orderId: string;
  destinationAddress: string;
  destinationCity: string;
  originHub: string;
  items: string[];
  courierName: string;
  courierRating: number;
  vehiclePlate: string;
  vehicleModel: string;
  currentSpeedMph: number;
  remainingDistanceMiles: number;
  etaMinutes: number;
  cargoTempF: number;
  progressPercentage: number;
  trafficCondition: 'Light' | 'Moderate' | 'Heavy';
  turnByTurnInstruction: string;
  status: string;
  steps: { title: string; time: string; completed: boolean; current?: boolean }[];
}

export interface BasketAffinityRule {
  antecedent: string[];
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
  revenueImpact: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  percentOfRevenue: number;
  avgOrderValue: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  recommendedPlaybook: string;
  tags: string[];
}
