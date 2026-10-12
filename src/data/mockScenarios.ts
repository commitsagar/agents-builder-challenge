import { ReturnInspection, UserProfile, GpsTelemetry } from '../types';

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
      { step: 'BigQuery DML Update Executed & $145.00 Refunded', time: 'Oct 02, 10:15 AM', done: true }
    ]
  }
];
