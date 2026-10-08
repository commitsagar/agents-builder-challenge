import { ReturnInspection, PhantomAnomaly, PlanogramAudit, DemandForecastPoint, UserProfile, GpsTelemetry, BasketAffinityRule, CustomerSegment } from '../types';

export const B2C_PROFILE: UserProfile = {
  id: 'usr-b2c-901',
  name: 'Alex Rivera',
  email: 'alex.rivera@omnimember.com',
  role: 'Prime Omnichannel VIP Shopper',
  persona: 'B2C',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  tier: 'VIP Gold Member',
  points: 1450,
  address: '742 Evergreen Pike, Seattle, WA 98101',
  storeId: 'Store #402 (Seattle Flagship)'
};

export const B2B_PROFILE: UserProfile = {
  id: 'usr-b2b-108',
  name: 'Elena Rostova',
  email: 'elena.rostova@omnicommerce.corp',
  role: 'Regional Director of Supply Chain & Retail Ops',
  persona: 'B2B',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  organization: 'OmniCommerce Enterprise Operations (Pacific Northwest)',
  storeId: 'District 4 (18 Stores • Hub #402 Seattle)'
};

export const ORDER_GPS_DATABASE: { [key: string]: GpsTelemetry } = {
  'ORD-99482': {
    orderId: 'ORD-99482',
    destinationAddress: '742 Evergreen Pike, Seattle, WA 98101',
    destinationCity: 'Seattle, WA',
    originHub: 'Seattle Flagship Hub #402 (SODO District)',
    items: ['Nordic Oak Ergonomic Desk Chair', 'Recycled All-Weather Commuter Backpack'],
    courierName: 'Marcus Vance',
    courierRating: 4.98,
    vehiclePlate: 'WA-992-OMNI',
    vehicleModel: 'Ford E-Transit Electric Van',
    currentSpeedMph: 27,
    remainingDistanceMiles: 0.8,
    etaMinutes: 6,
    cargoTempF: 65.2,
    progressPercentage: 86,
    trafficCondition: 'Moderate',
    turnByTurnInstruction: 'In 350 ft, turn right onto 4th Ave toward Pike St',
    status: 'In Transit (Live GPS)',
    steps: [
      { title: 'Warehouse Dispatched (Hub #402)', time: '02:15 PM', completed: true },
      { title: 'Highway 99 Corridor Transit', time: '02:35 PM', completed: true },
      { title: 'In Neighborhood: 4th Ave & Pike St', time: '02:51 PM', completed: true, current: true },
      { title: 'Arrival at 742 Evergreen Pike', time: 'Est 02:58 PM', completed: false }
    ]
  },
  'ORD-98311': {
    orderId: 'ORD-98311',
    destinationAddress: '450 Mission St, San Francisco, CA 94105',
    destinationCity: 'San Francisco, CA',
    originHub: 'Bay Area Urban Hub #108 (SOMA Logistics)',
    items: ['ANC Wireless Studio Headphones', '65W GaN Dual USB-C Fast Charger'],
    courierName: 'Sarah Jenkins',
    courierRating: 4.99,
    vehiclePlate: 'CA-771-OMNI',
    vehicleModel: 'Rivian EDV Delivery Van',
    currentSpeedMph: 22,
    remainingDistanceMiles: 1.4,
    etaMinutes: 9,
    cargoTempF: 67.0,
    progressPercentage: 72,
    trafficCondition: 'Light',
    turnByTurnInstruction: 'In 500 ft, continue straight on Mission St past Fremont St',
    status: 'Out for Delivery (Google Maps Tracked)',
    steps: [
      { title: 'Dispatched from SOMA Hub #108', time: '01:30 PM', completed: true },
      { title: 'Approaching Financial District Corridor', time: '01:55 PM', completed: true },
      { title: 'En route on Mission St near 1st Ave', time: '02:10 PM', completed: true, current: true },
      { title: 'Arrival at 450 Mission St', time: 'Est 02:20 PM', completed: false }
    ]
  },
  'ORD-97405': {
    orderId: 'ORD-97405',
    destinationAddress: '1100 Congress Ave, Austin, TX 78701',
    destinationCity: 'Austin, TX',
    originHub: 'Austin Central Fulfillment Hub #218',
    items: ['Precision Gooseneck Electric Kettle', 'Brushed Stainless Steel French Press'],
    courierName: 'David Chen',
    courierRating: 4.95,
    vehiclePlate: 'TX-440-OMNI',
    vehicleModel: 'Mercedes eSprinter Delivery Van',
    currentSpeedMph: 31,
    remainingDistanceMiles: 2.1,
    etaMinutes: 12,
    cargoTempF: 68.5,
    progressPercentage: 58,
    trafficCondition: 'Heavy',
    turnByTurnInstruction: 'In 0.2 mi, exit right onto 11th St toward Congress Ave',
    status: 'In Transit (Live GPS)',
    steps: [
      { title: 'Package Scanned at Austin Hub #218', time: '11:45 AM', completed: true },
      { title: 'Transit via I-35 Frontage Road', time: '12:20 PM', completed: true },
      { title: 'Approaching Capitol District', time: '12:40 PM', completed: true, current: true },
      { title: 'Delivery to 1100 Congress Ave', time: 'Est 12:55 PM', completed: false }
    ]
  },
  'ORD-96102': {
    orderId: 'ORD-96102',
    destinationAddress: '600 N Michigan Ave, Chicago, IL 60611',
    destinationCity: 'Chicago, IL',
    originHub: 'Chicago Metro Hub #056 (Michigan Ave)',
    items: ['Pure Linen Washed Oversized Throw Blanket', 'Hand-Poured Soy Wax Candle'],
    courierName: 'Aisha Morales',
    courierRating: 4.97,
    vehiclePlate: 'IL-883-OMNI',
    vehicleModel: 'Ford E-Transit Electric Van',
    currentSpeedMph: 19,
    remainingDistanceMiles: 0.5,
    etaMinutes: 4,
    cargoTempF: 63.8,
    progressPercentage: 92,
    trafficCondition: 'Light',
    turnByTurnInstruction: 'In 400 ft, slight right onto Michigan Ave Bridge',
    status: 'Arriving Shortly (Final Mile)',
    steps: [
      { title: 'Package Dispatched from Hub #056', time: '03:10 PM', completed: true },
      { title: 'Transit via Lake Shore Drive Arterial', time: '03:30 PM', completed: true },
      { title: 'Turning onto Michigan Ave Magnificent Mile', time: '03:48 PM', completed: true, current: true },
      { title: 'Doorstep Drop at 600 N Michigan Ave', time: 'Est 03:52 PM', completed: false }
    ]
  }
};

export const MOCK_GPS_TELEMETRY: GpsTelemetry = ORDER_GPS_DATABASE['ORD-99482'];

export const MOCK_BASKET_AFFINITY_RULES: BasketAffinityRule[] = [
  {
    antecedent: ['Nordic Oak Ergonomic Desk Chair'],
    consequent: 'Solid Walnut Monitor Stand',
    support: 0.38,
    confidence: 0.74,
    lift: 3.82,
    revenueImpact: '+$42.5K / month (+18% attach rate)'
  },
  {
    antecedent: ['ANC Wireless Studio Headphones'],
    consequent: '65W GaN Dual USB-C Fast Charger',
    support: 0.44,
    confidence: 0.81,
    lift: 4.15,
    revenueImpact: '+$58.2K / month (+24% attach rate)'
  },
  {
    antecedent: ['Precision Gooseneck Electric Kettle'],
    consequent: 'Brushed Stainless Steel French Press',
    support: 0.29,
    confidence: 0.68,
    lift: 3.40,
    revenueImpact: '+$21.8K / month (+15% attach rate)'
  },
  {
    antecedent: ['Ultra-Dense Eco Rubber Yoga Mat'],
    consequent: 'Double-Wall Vacuum Insulated Bottle',
    support: 0.52,
    confidence: 0.87,
    lift: 4.90,
    revenueImpact: '+$64.1K / month (+29% attach rate)'
  }
];

export const MOCK_CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: 'SEG-001',
    name: 'Omnichannel Champions (Top 5%)',
    size: 14200,
    percentOfRevenue: 41.5,
    avgOrderValue: 284.50,
    churnRisk: 'Low',
    recommendedPlaybook: 'Instant VIP live video returns, early access to limited edition drops, personalized concierge.',
    tags: ['High LTV', 'App + In-Store Shopper', 'Loyalty Tier Gold']
  },
  {
    id: 'SEG-002',
    name: 'Fast-Moving Digital Natives',
    size: 48900,
    percentOfRevenue: 27.2,
    avgOrderValue: 92.10,
    churnRisk: 'Medium',
    recommendedPlaybook: 'Flash weekend bundle notifications, conversational RAG chat recommendations, 2-hr delivery alerts.',
    tags: ['Mobile First', 'High Frequency', 'Price Elastic']
  },
  {
    id: 'SEG-003',
    name: 'Commercial & B2B Bulk Accounts',
    size: 3120,
    percentOfRevenue: 21.8,
    avgOrderValue: 1450.00,
    churnRisk: 'Low',
    recommendedPlaybook: 'Volume tier discounts, scheduled pallet replenishment, dedicated account executive.',
    tags: ['Office Furnishing', 'Credit Terms Net-30', 'Bulk Cartons']
  },
  {
    id: 'SEG-004',
    name: 'At-Risk / Lapsed Shoppers',
    size: 19800,
    percentOfRevenue: 9.5,
    avgOrderValue: 64.00,
    churnRisk: 'High',
    recommendedPlaybook: 'Automated win-back dynamic credit ($15 coupon on abandoned high-affinity category).',
    tags: ['Inactive >60d', 'Price Sensitive', 'High Return Probability']
  }
];

export const MOCK_LIVE_CALL_SCENARIOS = [
  {
    id: 'CALL-001',
    sku: 'prod-001',
    productName: 'Nordic Oak Ergonomic Desk Chair',
    orderId: 'ORD-99482',
    liveVideoFeedUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    barcodeDetected: 'EAN-770982-CHAIR-OK',
    tamperSeal: 'Pristine & Intact',
    surfaceCondition: 'Grade A+ (Zero scratches detected)',
    serialNumber: 'SN-OAK-99201-PASSED',
    transcript: [
      { sender: 'agent', text: 'Hello Alex! OmniCare Live Vision is connected. Please hold your camera towards the product tag and base.', time: '00:03' },
      { sender: 'user', text: 'Sure, pointing it at the wooden armrest and the serial label underneath.', time: '00:08' },
      { sender: 'agent', text: 'Holographic QA seal and barcode detected. Serial SN-OAK-99201 verified against order ORD-99482 records.', time: '00:14' },
      { sender: 'agent', text: 'Zero abrasion or structural defects detected. Instant $249.99 refund approved! Our zero-box courier will collect it tomorrow.', time: '00:20' }
    ],
    recommendedDisposition: 'Instant Auto-Refund ($249.99 credited to Visa • Zero packaging required)',
    fraudScore: 0.8
  },
  {
    id: 'CALL-002',
    sku: 'prod-002',
    productName: 'ANC Wireless Studio Headphones',
    orderId: 'ORD-98311',
    liveVideoFeedUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    barcodeDetected: 'EAN-889123-HEADPHONES-ERR',
    tamperSeal: 'Broken / Third-Party Tape',
    surfaceCondition: 'Grade C (Heavy Scuffing on left gimbal)',
    serialNumber: 'SN-AURA-UNKNOWN (Checksum mismatch)',
    transcript: [
      { sender: 'agent', text: 'OmniCare Live Vision active. Scanning headphone pivot joint...', time: '00:02' },
      { sender: 'agent', text: 'Notice: Pivot joint serial engraved does not match factory OEM format. Headband cushion appears replaced.', time: '00:11' },
      { sender: 'agent', text: 'Flagged for security review. Transferring to senior fraud specialist for manual evaluation.', time: '00:18' }
    ],
    recommendedDisposition: 'Hold for Level-2 Fraud Audit (Counterfeit / Swap substitution risk: 91%)',
    fraudScore: 91.2
  }
];

export const RETURN_INSPECTION_PRESETS: ReturnInspection[] = [
  {
    id: 'RET-8921',
    orderId: 'ORD-99482',
    sku: 'prod-003',
    productName: 'Recycled All-Weather Commuter Backpack',
    purchasePrice: 89.00,
    customerClaim: 'Size fits slightly loose across shoulders. Never worn outside, tags intact.',
    uploadedImageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    analysis: {
      visualAuthenticityScore: 98,
      wearAndTearGrade: 'A (Pristine)',
      tagDetected: true,
      serialMatch: true,
      fraudProbability: 2.1,
      geminiVisionNotes: 'Pristine factory condition. Original woven tag and barcode hangtag verified in correct placement. Zero fabric pilling detected.',
      disposition: 'Instant Auto-Refund ($ Store Credit)',
      processingCostSavings: 13.60
    },
    status: 'approved',
    timestamp: '2 mins ago'
  },
  {
    id: 'RET-8922',
    orderId: 'ORD-98311',
    sku: 'prod-002',
    productName: 'ANC Wireless Studio Headphones',
    customerClaim: 'Sound cutting out on left channel. Kept in box since delivery.',
    purchasePrice: 189.50,
    uploadedImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    analysis: {
      visualAuthenticityScore: 41,
      wearAndTearGrade: 'F (Counterfeit / Damaged)',
      tagDetected: false,
      serialMatch: false,
      fraudProbability: 92.4,
      geminiVisionNotes: 'High-risk anomaly detected: Engraved serial on hinge band fails cryptographic checksum. Visible scratches and third-party ear cushion swap. Probable counterfeit return substitution.',
      disposition: 'Quarantine: Manual Anti-Fraud Review',
      processingCostSavings: 189.50
    },
    status: 'quarantined',
    timestamp: '14 mins ago'
  },
  {
    id: 'RET-8923',
    orderId: 'ORD-97405',
    sku: 'prod-001',
    productName: 'Nordic Oak Ergonomic Desk Chair',
    customerClaim: 'Slight cosmetic scuff on back leg upon unboxing.',
    purchasePrice: 249.99,
    uploadedImageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    analysis: {
      visualAuthenticityScore: 95,
      wearAndTearGrade: 'B (Minor Wear)',
      tagDetected: true,
      serialMatch: true,
      fraudProbability: 6.8,
      geminiVisionNotes: 'Structural integrity intact. Minor superficial clear-coat abrasion on lower rear leg. Qualifies for secondary marketplace refurbishment.',
      disposition: 'Route to B-Stock Liquidation (62% recovery)',
      processingCostSavings: 11.20
    },
    status: 'liquidate',
    timestamp: '45 mins ago'
  }
];

export const MOCK_PHANTOM_ANOMALIES: PhantomAnomaly[] = [
  {
    id: 'PHANTOM-401',
    sku: 'prod-002',
    productName: 'ANC Wireless Studio Headphones',
    category: 'Electronics',
    storeLocation: 'Flagship Store #402 (Downtown Seattle)',
    erpLedgerStock: 14,
    posSalesVelocity7d: 0,
    predictedPhysicalStock: 0,
    discrepancyDelta: 14,
    phantomRiskScore: 94.6,
    potentialLostRevenue: 2653.00,
    recommendedAction: 'Trigger urgent associate handheld cycle count: Aisle 2A Bay 3. High theft susceptibility or misplaced backroom box.',
    status: 'flagged'
  },
  {
    id: 'PHANTOM-402',
    sku: 'prod-010',
    productName: '65W GaN Dual USB-C Fast Charger',
    category: 'Electronics',
    storeLocation: 'Store #218 (Bellevue Square)',
    erpLedgerStock: 42,
    posSalesVelocity7d: 1,
    predictedPhysicalStock: 8,
    discrepancyDelta: 34,
    phantomRiskScore: 88.2,
    potentialLostRevenue: 1359.66,
    recommendedAction: 'Cycle-count locked showcase cabinet #2. Discrepancy between receiving dock scan and retail floor shelf.',
    status: 'investigating'
  },
  {
    id: 'PHANTOM-403',
    sku: 'prod-004',
    productName: 'Precision Gooseneck Electric Kettle',
    category: 'Kitchen',
    storeLocation: 'Store #056 (Tacoma Central)',
    erpLedgerStock: 21,
    posSalesVelocity7d: 1,
    predictedPhysicalStock: 8,
    discrepancyDelta: 13,
    phantomRiskScore: 73.1,
    potentialLostRevenue: 845.00,
    recommendedAction: 'Verify top-stock riser location in Aisle 3A. Restock shelf display from secondary overstock bin.',
    status: 'flagged'
  }
];

export const MOCK_DEMAND_FORECAST: DemandForecastPoint[] = [
  { date: 'Oct 01', historicalSales: 45, forecastedDemand: 45, upperConfidence: 52, lowerConfidence: 38, weatherFactor: 'Mild (68°F)' },
  { date: 'Oct 02', historicalSales: 52, forecastedDemand: 50, upperConfidence: 58, lowerConfidence: 42, weatherFactor: 'Sunny (72°F)' },
  { date: 'Oct 03', historicalSales: 61, forecastedDemand: 59, upperConfidence: 67, lowerConfidence: 51, weatherFactor: 'Rain (55°F)' },
  { date: 'Oct 04', historicalSales: 58, forecastedDemand: 60, upperConfidence: 69, lowerConfidence: 51, weatherFactor: 'Rain (53°F)' },
  { date: 'Oct 05', historicalSales: 74, forecastedDemand: 72, upperConfidence: 82, lowerConfidence: 62, weatherFactor: 'Cool (50°F)', eventFactor: 'Autumn Promo Launch' },
  { date: 'Oct 06', historicalSales: 89, forecastedDemand: 86, upperConfidence: 98, lowerConfidence: 74, weatherFactor: 'Overcast (48°F)' },
  { date: 'Oct 07', forecastedDemand: 95, upperConfidence: 110, lowerConfidence: 80, weatherFactor: 'Cold Front (42°F)', eventFactor: 'Weekend Peak' },
  { date: 'Oct 08', forecastedDemand: 104, upperConfidence: 122, lowerConfidence: 86, weatherFactor: 'Rain & Wind (40°F)', eventFactor: 'Weekend Peak' },
  { date: 'Oct 09', forecastedDemand: 82, upperConfidence: 96, lowerConfidence: 68, weatherFactor: 'Clear (45°F)' },
  { date: 'Oct 10', forecastedDemand: 78, upperConfidence: 90, lowerConfidence: 66, weatherFactor: 'Clear (47°F)' },
  { date: 'Oct 11', forecastedDemand: 85, upperConfidence: 99, lowerConfidence: 71, weatherFactor: 'Partly Cloudy' },
  { date: 'Oct 12', forecastedDemand: 91, upperConfidence: 106, lowerConfidence: 76, weatherFactor: 'Mild' },
  { date: 'Oct 13', forecastedDemand: 115, upperConfidence: 135, lowerConfidence: 95, weatherFactor: 'Chilly', eventFactor: 'Member VIP Flash Day' },
  { date: 'Oct 14', forecastedDemand: 122, upperConfidence: 144, lowerConfidence: 100, weatherFactor: 'Rain', eventFactor: 'Weekend Surge' }
];

export const MOCK_PLANOGRAM_AUDIT: PlanogramAudit = {
  id: 'PLANO-701',
  aisle: 'Aisle 4B (Home Office & Ergonomics)',
  bayNumber: 'Bay 02 - Shelves A through D',
  imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
  totalFacings: 24,
  outOfStockGaps: 3,
  misplacedItems: 2,
  compliancePercentage: 79.2,
  detectedIssues: [
    {
      type: 'Stock Gap',
      shelfLevel: 'Tier 2 (Eye-Level Prime)',
      description: 'Nordic Oak Chair facing #2 empty. 3 adjacent units pushed forward to mask void.',
      severity: 'High'
    },
    {
      type: 'Misplaced SKU',
      shelfLevel: 'Tier 3 (Lower Deck)',
      description: 'Lumina Lamp carton placed in Chair cushion display slot.',
      severity: 'Medium'
    },
    {
      type: 'Missing Price Tag',
      shelfLevel: 'Tier 1 (Top Riser)',
      description: 'Electronic Shelf Label (ESL #04-88) unlinked or unpowered.',
      severity: 'Low'
    }
  ]
};

export const MOCK_ORDERS = [
  {
    orderId: 'ORD-99482',
    date: 'Oct 3, 2026',
    items: ['Recycled All-Weather Commuter Backpack', 'Nordic Oak Ergonomic Desk Chair'],
    total: 338.99,
    status: 'In Transit (Live GPS)',
    carrier: 'OmniExpress Fleet (EV-Van #09)',
    trackingNumber: 'OMNI-GPS-99482-SEA',
    deliveryLocation: '742 Evergreen Pike, Seattle, WA',
    timeline: [
      { step: 'Order Placed & Stock Reserved', time: 'Oct 03, 10:14 AM', done: true },
      { step: 'Fulfillment Center Pick & Pack', time: 'Oct 03, 11:30 AM', done: true },
      { step: 'Carrier Hub Scan (Seattle Hub #402)', time: 'Oct 03, 01:12 PM', done: true },
      { step: 'Out for Delivery (Marcus Vance - 0.8 mi away)', time: 'Today, 02:30 PM', done: true }
    ]
  },
  {
    orderId: 'ORD-98311',
    date: 'Oct 4, 2026',
    items: ['ANC Wireless Studio Headphones'],
    total: 189.50,
    status: 'Delivered',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-99018471-US',
    deliveryLocation: 'San Francisco, CA',
    timeline: [
      { step: 'Order Placed', time: 'Oct 04, 08:00 AM', done: true },
      { step: 'WMS Pick & Pack', time: 'Oct 04, 09:20 AM', done: true },
      { step: 'Carrier Hub Scan', time: 'Oct 04, 02:40 PM', done: true },
      { step: 'Delivered to Porch', time: 'Oct 05, 11:15 AM', done: true }
    ]
  },
  {
    orderId: 'ORD-97405',
    date: 'Oct 5, 2026',
    items: ['Precision Gooseneck Electric Kettle', 'Brushed Stainless Steel French Press'],
    total: 218.00,
    status: 'Out for Delivery',
    carrier: 'Mercedes eSprinter Delivery',
    trackingNumber: 'TX-440-OMNI',
    deliveryLocation: '1100 Congress Ave, Austin, TX',
    timeline: [
      { step: 'Order Verified & Stock Reserved', time: 'Oct 05, 11:00 AM', done: true },
      { step: 'Aisle 4B Pick & Clean Pack', time: 'Oct 05, 11:45 AM', done: true },
      { step: 'En Route with Electric Fleet', time: 'Today, 12:20 PM', done: true }
    ]
  },
  {
    orderId: 'ORD-96102',
    date: 'Oct 2, 2026',
    items: ['Pure Linen Washed Oversized Throw Blanket'],
    total: 145.00,
    status: 'Cancelled',
    cancellationReason: 'Ordered by mistake / duplicate purchase',
    cancelledAt: '2026-10-02 14:10:00',
    bqJobId: 'bqjob_dml_96102_prev',
    carrier: 'OmniExpress Fleet',
    trackingNumber: 'OMNI-CHI-96102',
    deliveryLocation: '600 N Michigan Ave, Chicago, IL',
    timeline: [
      { step: 'Order Placed', time: 'Oct 02, 09:00 AM', done: true },
      { step: 'Customer Cancel Requested', time: 'Oct 02, 10:15 AM', done: true },
      { step: 'BigQuery DML Update Executed & $145.00 Refunded', time: 'Oct 02, 10:15 AM', done: true }
    ]
  }
];
