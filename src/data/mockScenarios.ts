import { ReturnInspection, UserProfile, GpsTelemetry, PhantomAnomaly, CustomerSegment, BasketAffinityRule } from '../types';

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

export const STORE_MANAGER_PROFILE: UserProfile = {
  id: 'usr-mgr-104',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@flamgo-retail.internal',
  role: 'Store General Manager & Admin Director',
  persona: 'MANAGER',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  tier: 'Store Admin & Inventory Director',
  address: 'Seattle Flagship STORE-104, 500 Pine St, Seattle, WA',
  storeId: 'STORE-104 (Seattle Flagship)'
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
      { step: 'Order Placed & Confirmed', time: 'Oct 03, 10:14 AM', done: true },
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
      { step: 'Order Verified & Confirmed', time: 'Oct 05, 11:00 AM', done: true },
      { step: 'Item Inspection & Clean Pack', time: 'Oct 05, 11:45 AM', done: true },
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
      { step: 'Order Cancelled & $145.00 Refunded to Payment Method', time: 'Oct 02, 10:15 AM', done: true }
    ]
  }
];

export const MOCK_PHANTOM_ANOMALIES: PhantomAnomaly[] = [
  {
    id: 'PHANTOM-8821',
    sku: 'prod-002',
    productName: 'Aura Pro Active Noise-Canceling Wireless Studio Headphones',
    category: 'Electronics',
    storeLocation: 'Store #104 (Seattle Flagship) • Aisle 1A Bay 3',
    erpLedgerStock: 14,
    posSalesVelocity7d: 0,
    predictedPhysicalStock: 0,
    discrepancyDelta: -14,
    phantomRiskScore: 94.6,
    potentialLostRevenue: 4899.86,
    recommendedAction: 'Dispatch associate cycle count to Aisle 1A Bay 3 (High Theft / Phantom Shrink)',
    status: 'flagged'
  },
  {
    id: 'PHANTOM-8822',
    sku: 'prod-004',
    productName: 'Artisan Precision Pour-Over Gooseneck Kettle',
    category: 'Kitchen',
    storeLocation: 'Store #104 (Seattle Flagship) • Aisle 4C Bay 2',
    erpLedgerStock: 18,
    posSalesVelocity7d: 1,
    predictedPhysicalStock: 6,
    discrepancyDelta: -12,
    phantomRiskScore: 78.4,
    potentialLostRevenue: 1674.00,
    recommendedAction: 'Cycle count bay 4C. Check backroom overflow bin B-12 for unstocked carton.',
    status: 'flagged'
  },
  {
    id: 'PHANTOM-8823',
    sku: 'prod-005',
    productName: 'Solace Merino Wool Thermal Knit Crew Sweater',
    category: 'Apparel',
    storeLocation: 'Store #104 (Seattle Flagship) • Aisle 2B Fixture 4',
    erpLedgerStock: 22,
    posSalesVelocity7d: 0,
    predictedPhysicalStock: 8,
    discrepancyDelta: -14,
    phantomRiskScore: 82.1,
    potentialLostRevenue: 1750.00,
    recommendedAction: 'Audit fitting room return racks & verify RFID hanger sensors.',
    status: 'flagged'
  },
  {
    id: 'PHANTOM-8824',
    sku: 'prod-001',
    productName: 'Nordic Oak Minimalist Ergonomic Desk Chair',
    category: 'Furniture',
    storeLocation: 'Store #104 (Seattle Flagship) • Aisle 3A Floor Display',
    erpLedgerStock: 24,
    posSalesVelocity7d: 11,
    predictedPhysicalStock: 24,
    discrepancyDelta: 0,
    phantomRiskScore: 4.2,
    potentialLostRevenue: 0,
    recommendedAction: 'Stock verified healthy. Normal POS sales velocity matching ledger.',
    status: 'resolved'
  }
];

export const MOCK_CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: 'seg-vip-champions',
    name: 'VIP Omnichannel Champions (Top 8%)',
    size: 11360,
    percentOfRevenue: 48.2,
    avgOrderValue: 286.40,
    churnRisk: 'Low',
    tags: ['High Lifetime Value', '2-Hour Delivery User', 'Low Return Rate', 'High NPS (94)'],
    recommendedPlaybook: 'Automatic 2-Hour Express Delivery priority, early access to Scandinavian furniture drops, zero-box return VIP pickup.'
  },
  {
    id: 'seg-aesthetic-aficionados',
    name: 'Aesthetic & Design Aficionados (24%)',
    size: 34100,
    percentOfRevenue: 26.5,
    avgOrderValue: 164.20,
    churnRisk: 'Low',
    tags: ['Scandinavian Design', 'Specialty Coffee', 'Audiophile Acoustics'],
    recommendedPlaybook: 'Curated category bundles with cross-sell discounts (e.g. Architect Lamp + Ergonomic Chair).'
  },
  {
    id: 'seg-deal-seekers',
    name: 'Price-Conscious & Lightning Deal Seekers (36%)',
    size: 51140,
    percentOfRevenue: 15.8,
    avgOrderValue: 68.50,
    churnRisk: 'Medium',
    tags: ['Flash Sale Driven', 'High Cart Abandonment', 'Price Elasticity -1.8'],
    recommendedPlaybook: 'Targeted conversational WhatsApp cart nudges with 5% limited-time incentive; low-margin clearance.'
  },
  {
    id: 'seg-at-risk',
    name: 'At-Risk & Inactive Cohort (32%)',
    size: 45450,
    percentOfRevenue: 9.5,
    avgOrderValue: 82.00,
    churnRisk: 'High',
    tags: ['No purchase in 90d', 'Previous return dispute', 'Low engagement'],
    recommendedPlaybook: 'Win-back concierge engagement powered by FlamIA with personalized recommendations based on previous browsing.'
  }
];

export const MOCK_BASKET_AFFINITIES: BasketAffinityRule[] = [
  {
    antecedent: ['Nordic Oak Ergonomic Chair'],
    consequent: 'Lumina Architect Counterbalance Task Lamp',
    support: 0.18,
    confidence: 0.72,
    lift: 3.4,
    revenueImpact: '+$42,800/mo'
  },
  {
    antecedent: ['Aura Pro ANC Headphones'],
    consequent: '65W GaN Dual USB-C Fast Charger',
    support: 0.22,
    confidence: 0.68,
    lift: 2.9,
    revenueImpact: '+$28,400/mo'
  },
  {
    antecedent: ['Precision Gooseneck Electric Kettle'],
    consequent: 'Double-Walled Borosilicate Glass Carafe',
    support: 0.14,
    confidence: 0.65,
    lift: 3.8,
    revenueImpact: '+$19,200/mo'
  }
];

