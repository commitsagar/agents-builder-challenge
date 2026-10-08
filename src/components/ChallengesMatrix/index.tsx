import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Database, ShoppingBag, Truck, Building2, DollarSign, 
  Layers, CheckCircle2, ArrowRight, HeartHandshake, Leaf, Users, AlertTriangle,
  Fingerprint, Search, Bot, TrendingUp, AlertCircle, Cpu, Network, Lock, Zap,
  Scale, FileText, ArrowLeftRight, MessageSquare
} from 'lucide-react';
import { ConversationalCommerce } from '../ConversationalCommerce';

export interface ChallengeItem {
  id: number;
  title: string;
  pillar: 'Customer Experience' | 'Supply Chain & Inventory' | 'Store Operations' | 'Financial & Governance';
  problem: string;
  socialImpact: string;
  solutionStrategy: string;
  operationalCapability: string;
  enterpriseIntegrations: string;
  liveDemoFeature: string;
}

export interface DualChallengeDimension {
  id: number;
  dimension: string;
  tagline: string;
  b2cManifestation: string;
  b2bManifestation: string;
  b2cSolution: {
    system: string;
    algorithm: string;
    techStack: string[];
    formulaOrLogic: string;
    kpi: string;
    activeFeature: string;
  };
  b2bSolution: {
    system: string;
    algorithm: string;
    techStack: string[];
    formulaOrLogic: string;
    kpi: string;
    activeFeature: string;
  };
  keyDivergence: string;
}

export const DUAL_CHALLENGE_DIMENSIONS: DualChallengeDimension[] = [
  {
    id: 1,
    dimension: 'Identity Resolution & Profiling',
    tagline: 'Anonymous Multi-Touch Shoppers vs. Hierarchical Buying Centers',
    b2cManifestation: 'Resolving individual, anonymous users across ephemeral browser cookies, mobile device fingerprints, and physical store POS scans.',
    b2bManifestation: 'Resolving complex buying centers and account hierarchies (linking individual purchasers, technical evaluators, and finance approvers to a parent corporate entity).',
    b2cSolution: {
      system: 'Hybrid Deterministic/Probabilistic Identity Graph Engine',
      algorithm: 'Connected Components Graph Traversal with Temporal-Spatial Co-occurrence Decay (30-day half-life)',
      techStack: ['Cloud Spanner Graph', 'Cloud Pub/Sub', 'Cloud Dataflow', 'Cloud Firestore'],
      formulaOrLogic: 'Edge Weight = w_det(TokenizedCard, Email) + w_prob(IP, WebGL, BeaconGeofence) with Stitch Threshold τ ≥ 0.85',
      kpi: '>88% session stitch rate across web & in-store POS; <15ms session hydration',
      activeFeature: 'B2C Shopper Storefront & Cross-Store Geofence Cart Hydration'
    },
    b2bSolution: {
      system: 'Corporate Entity Hierarchy & Multi-Role Buying Center Graph',
      algorithm: 'SAML 2.0 / SCIM JIT Directory Sync with D&B (DUNS) Enterprise Master Data Management (MDM)',
      techStack: ['Cloud Identity', 'BigQuery Graph', 'IAM Role Matrix', 'D&B / OpenCorporates API'],
      formulaOrLogic: 'ParentCorp ➔ Subsidiary ➔ Facility/CostCenter ➔ UserRole(Requisitioner | TechEvaluator | Approver | AP)',
      kpi: '100% deterministic billing attribution and MSA contract compliance',
      activeFeature: 'B2B Enterprise Portal Multi-Store Director Role & MDM Console'
    },
    keyDivergence: 'B2C resolves high-entropy ephemeral device traces into a single consumer, while B2B maps multiple authenticated human personas into a unified legal corporate contract.'
  },
  {
    id: 2,
    dimension: 'Product Discovery & Cold Starts',
    tagline: 'Sub-Second Micro-Session Intent vs. Parametric Entitlement Retrieval',
    b2cManifestation: 'Inferring real-time purchase intent from short micro-sessions (dwell time, scroll speed) for unauthenticated or first-time shoppers.',
    b2bManifestation: 'Executing high-precision parametric searches across dense technical specs, part numbers, schema cross-references, and contract-specific catalog entitlements.',
    b2cSolution: {
      system: 'Streaming Session Transformer & Hybrid Multimodal Vector Search',
      algorithm: 'SASRec / BERT4Rec Dynamic Session Vectors paired with ScaNN nearest neighbor similarity',
      techStack: ['Vertex AI Search for Commerce', 'Gemini 3.7 Flash', 'ScaNN Index', 'Cloud Run'],
      formulaOrLogic: 'v_session(t) = ∑ w_i · e_item_i where w_i = f(dwell_time, scroll_deceleration, hover_zoom)',
      kpi: 'Search abandonment reduced from 31% to <2.4%; Sub-40ms vector retrieval',
      activeFeature: 'Storefront Semantic Search Bar & Conversational Shopping Concierge'
    },
    b2bSolution: {
      system: 'Strict Parametric Faceted Search & Contract Entitlement Gateway',
      algorithm: 'Dual-Stage Retrieval (Boolean Parameter Filter + Vector Synonym Expansion) with OPA Entitlements',
      techStack: ['Cloud Spanner FTS', 'Open Policy Agent (OPA)', 'Vertex AI Embeddings', 'Parts Cross-Ref Graph'],
      formulaOrLogic: 'SELECT * FROM catalog WHERE org_id = :tenant AND sku IN (contract_entitlements) AND tolerance ≤ 0.02mm',
      kpi: 'Sub-10ms exact parametric match across 1M+ SKUs; 0% unentitled catalog leaks',
      activeFeature: 'Parametric Technical Catalog & Contract Pricing Engine'
    },
    keyDivergence: 'B2C discovers fuzzy emotional intent from silent behavioral cues; B2B requires mathematically exact tolerances, MIL-SPEC equivalents, and legally bounded price books.'
  },
  {
    id: 3,
    dimension: 'Conversational Agent Hallucination',
    tagline: 'Consumer Promo Code Hallucinations vs. Promissory Estoppel Under Contract Law',
    b2cManifestation: 'LLMs hallucinating consumer discount codes, fabric specifications, or return policy windows.',
    b2bManifestation: 'LLMs committing to unauthorized tiered volume pricing, binding service level agreements (SLAs), credit terms, or delivery schedules under promissory estoppel.',
    b2cSolution: {
      system: 'Model Context Protocol (MCP) Decoupling & NeMo Regex Guardrails',
      algorithm: 'Deterministic Tool Calling: model possesses zero internal parametric memory of promo codes or policies',
      techStack: ['Model Context Protocol (MCP)', 'NeMo Guardrails', 'Vertex AI Search Grounding'],
      formulaOrLogic: 'Post-generation regex intercepts ^[A-Z0-9]{4,15}$; matches strictly against Firestore active promo cache',
      kpi: '0.00% hallucinated coupons; 100% verified citation grounding on return windows',
      activeFeature: 'MCP Shopping Concierge & Deterministic Promotion Hydration'
    },
    b2bSolution: {
      system: 'UCC Article 2 Non-Binding Wrapper & Enterprise CPQ State Machine',
      algorithm: 'Cryptographic Non-Binding Disclaimer Injection + Deal Desk Human-in-the-Loop (HITL) Threshold Escalation',
      techStack: ['Google Agent Development Kit (ADK)', 'Enterprise CPQ', 'Cloud KMS', 'Deal Desk Webhooks'],
      formulaOrLogic: 'Quotes > $25k or discounts > 10% lock agent state machine until authorized officer signs off',
      kpi: 'Zero legal liability under promissory estoppel; 100% cryptographic audit trail',
      activeFeature: 'ADK Multi-Agent Orchestrator with CPQ Margin Guard'
    },
    keyDivergence: 'B2C hallucinations cause customer support friction and minor margin leakage; B2B hallucinations create multi-million dollar legally binding contracts enforceable in commercial court.'
  },
  {
    id: 4,
    dimension: 'Demand Forecasting & Replenishment',
    tagline: 'High-Velocity Weather/Traffic Curves vs. Heavy-Tailed Bullwhip Distributions',
    b2cManifestation: 'High-velocity, intermittent sales across thousands of store shelves subject to localized weather, foot traffic, and promotion spikes.',
    b2bManifestation: '"Lumpy," low-frequency, high-value order distributions where single large orders distort baseline forecasts and trigger the bullwhip effect.',
    b2cSolution: {
      system: 'BigQuery ML Temporal Fusion Transformers (TFT)',
      algorithm: 'Multi-Horizon Deep Time-Series with Croston’s SBA for intermittent, slow-moving shelf SKUs',
      techStack: ['BigQuery ML TFT', 'NOAA Weather API', 'Store Foot-Traffic Sensors', 'Pub/Sub'],
      formulaOrLogic: 'Dynamic Reorder: s = μ_L · μ_D + Z_α · √(μ_L · σ_D² + μ_D² · σ_L²) conditioned on local weather lift',
      kpi: '92.4% stockout reduction; 34% reduction in perishable grocery spoilage',
      activeFeature: '14-Day Demand Forecasting Curve with Weather & Promotional Lift'
    },
    b2bSolution: {
      system: 'Compound Poisson & Extreme Value Theory (EVT) with CPFR',
      algorithm: 'Decoupled Arrival Process (Negative Binomial) + Order Size (Generalized Pareto) + EDI 830/852 Sync',
      techStack: ['Cloud Dataflow', 'BigQuery Analytics', 'EDI 830/852 Ingestion', 'Cloud Spanner ATP'],
      formulaOrLogic: 'Forecast driven by buyer downstream consumption telemetry rather than sporadic batch purchase spikes',
      kpi: 'Bullwhip amplification dampened by 68%; Factory production runs stabilized',
      activeFeature: 'Executive KPI Dashboard & Supply Chain Capacity Allocation'
    },
    keyDivergence: 'B2C models high-frequency Poisson micro-transactions driven by localized weather and promotions; B2B models sporadic, heavy-tailed capital orders that disrupt upstream factory capacity.'
  },
  {
    id: 5,
    dimension: 'Inventory Reality & Phantom Stock',
    tagline: 'Store Shrink & BOPIS Failures vs. Cross-Dock & In-Transit Receiving Discrepancies',
    b2cManifestation: 'On-shelf store shrinkage, shoplifting, misplaced SKUs, and Buy Online, Pick Up In Store (BOPIS) fulfillment failures.',
    b2bManifestation: 'Pallet/container-level cross-docking errors, transit damage write-off lags, untracked consignments, and bulk receiving discrepancies.',
    b2cSolution: {
      system: 'Bayesian Velocity Anomaly Radar & Planogram Computer Vision',
      algorithm: 'Bayesian Discrepancy Detection: P(Phantom | Zero Sales in Δt, High Footfall) > 0.85 triggers mobile alert',
      techStack: ['Vertex AI Vision (YOLOv10)', 'Cloud Dataflow', 'Associate Handheld PWA'],
      formulaOrLogic: 'SKUs with ≤ 2 units dynamically quarantined from 1-hour BOPIS to prevent order cancellation',
      kpi: 'Phantom detection latency reduced from 3 weeks to <4 hours; 98.6% on-shelf availability',
      activeFeature: 'Phantom Inventory Radar & Planogram Shelf Computer Vision Audit'
    },
    b2bSolution: {
      system: 'Multi-Node RFID Serialization & 3-Way Receiving Discrepancy Pipeline',
      algorithm: 'Automated Advanced Shipping Notice (ASN) Reconciliation against EDI 856 and PO Ledgers',
      techStack: ['RFID Dock Portals', 'Cellular/BLE IoT Loggers', 'Cloud Spanner', 'EDI 812 Debit Memos'],
      formulaOrLogic: 'Physical Gate Scan vs. Manifest: Variance auto-generates Supplier Shortage Debit Memo before ERP commit',
      kpi: 'Cross-dock write-off lag reduced from 21 days to real-time dock intake; 0 unverified receipts',
      activeFeature: 'Supplier Automated Document & Packing Slip Processing'
    },
    keyDivergence: 'B2C phantom stock occurs at the individual shelf/shopper interface (shrinkage, misplaced items); B2B occurs at the pallet/container freight custody handoff.'
  },
  {
    id: 6,
    dimension: 'Fraud & Policy Exploitation',
    tagline: 'Wardrobing & Empty Boxes vs. Credit Line Exploitation & Invoice Diversion',
    b2cManifestation: 'First-party return abuse: wardrobing, friendly chargebacks, and empty-box package returns.',
    b2bManifestation: 'Credit line exploitation, automated gray-market arbitrage, invoice fraud, and enterprise account takeover (ATO).',
    b2cSolution: {
      system: 'OmniCare WebRTC Live Video Optical Triage & Carrier Telematics',
      algorithm: 'Multimodal Gemini Pro inspection of holographic seals, fabric weave texture, and serial barcodes in <20s',
      techStack: ['WebRTC', 'Gemini 3.7 Pro Multimodal', 'Carrier Scale Scan APIs (UPS/FedEx)'],
      formulaOrLogic: '|Carrier Scale Weight - Expected Master SKU Mass| > ε ➔ Auto-flag empty box fraud before refund',
      kpi: 'Return processing costs cut from $14.00 to $0.40; Return fraud reduced by 87%',
      activeFeature: 'OmniCare Live Video & Computer Vision Return Call (<20s Triage)'
    },
    b2bSolution: {
      system: 'Continuous Trade Credit Telematics & Document AI 3-Way Invoice Match',
      algorithm: 'Real-time D&B Credit Monitoring + Google Cloud Document AI Three-Way Invoice Verification',
      techStack: ['Google Cloud Document AI', 'D&B / Experian Business APIs', 'FIDO2 / WebAuthn MFA'],
      formulaOrLogic: 'Bank routing change or delivery to non-corporate address triggers out-of-band dual-custody verification',
      kpi: 'Zero invoice diversion losses; 100% protection against fraudulent Net-60 credit defaults',
      activeFeature: 'Tokenized Checkout Protocol & Real-Time Risk Scoring Engine'
    },
    keyDivergence: 'B2C fraud is diffuse, high-frequency, and low dollar-value per occurrence; B2B fraud is targeted, sophisticated, and capable of single-incident losses exceeding $1M.'
  },
  {
    id: 7,
    dimension: 'Agentic Disintermediation (A2A)',
    tagline: 'Shopping Agent Basket Dismantling vs. Autonomous Procurement Bot Negotiations',
    b2cManifestation: 'Third-party consumer shopping agents (e.g., ChatGPT, Perplexity) comparing merchant prices and dismantling retailer-owned shopping baskets.',
    b2bManifestation: 'Autonomous procurement bots negotiating programmatic contracts directly against headless supplier APIs within predefined corporate policy envelopes.',
    b2cSolution: {
      system: 'Universal Commerce Protocol (UCP) Differentiated Value Bundling',
      algorithm: 'Dynamic Total-Cost-of-Ownership (TCO) Payload Synthesis Influencing External Agent Reward Functions',
      techStack: ['Universal Commerce Protocol (UCP)', 'Google Cloud Armor', 'Cloud Endpoints API Gateway'],
      formulaOrLogic: 'Respond with bundled value (Free 2-hr pickup + 2-yr warranty + 5% cashback) rather than commodity raw price',
      kpi: 'Retained >91% of proprietary basket conversion against external price-scraping agents',
      activeFeature: 'Agentic Commerce Protocol (ACP) & Differentiated Value Bundles'
    },
    b2bSolution: {
      system: 'Autonomous Supplier Sales Agent (Programmatic A2A Counter-Negotiator)',
      algorithm: 'Multi-Attribute Utility Trading: trades price discounts for favorable payment terms and delivery windows',
      techStack: ['Google ADK Multi-Agent System', 'Gemini 3.7 Flash', 'mTLS', 'Machine-Readable Contracts'],
      formulaOrLogic: 'Enforces hard coded margin floor: μ_min ≥ 18%; Trades 2% price cut for Net-10 terms vs Net-60',
      kpi: '>65% of routine programmatic contracts closed autonomously while protecting gross margin floors',
      activeFeature: 'ADK Multi-Agent Orchestrator & Programmatic Contract Engine'
    },
    keyDivergence: 'B2C defends consumer basket economics against third-party bot price comparison; B2B actively engages buyer procurement bots via automated programmatic counter-offers.'
  }
];

export const RETAIL_CHALLENGES: ChallengeItem[] = [
  {
    id: 1,
    title: 'Product Discovery Friction & Search Abandonment',
    pillar: 'Customer Experience',
    problem: 'Traditional keyword search fails on natural language, conversational, or budget-based queries, causing 31% zero-result searches and customer abandonment.',
    socialImpact: 'Accessible shopping for elderly, voice-first, and non-technical consumers.',
    solutionStrategy: 'Semantic natural language intent understanding with multimodal visual search that interprets complex customer needs and conversational context.',
    operationalCapability: 'Hybrid vector catalog indexing and real-time sub-second product matching across physical and digital inventory.',
    enterpriseIntegrations: 'Enterprise e-commerce catalogs, mobile app search, POS kiosks',
    liveDemoFeature: 'Storefront Semantic Search Bar & Conversational Shopping Concierge'
  },
  {
    id: 2,
    title: 'Omnichannel Data Disconnects & Low-Latency Personalization',
    pillar: 'Customer Experience',
    problem: 'Fragmented store POS, mobile app, and web browsing data lead to disconnected customer profiles and irrelevant product recommendations.',
    socialImpact: 'Eliminates wasted shopping trips and mismatched fulfillment orders.',
    solutionStrategy: 'Unified omnichannel customer profile reasoning that predicts in-the-moment shopper intent and curates dynamic personalized bundles.',
    operationalCapability: 'Sub-second session state hydration and real-time cross-store inventory locator down to in-store aisle coordinates.',
    enterpriseIntegrations: 'Omnichannel CRM, store loyalty programs, digital storefronts',
    liveDemoFeature: 'Live In-Store Aisle Coordinate Mapping & Session Basket Recommendations'
  },
  {
    id: 3,
    title: 'High Support Overhead & WISMO Inquiries',
    pillar: 'Customer Experience',
    problem: 'Repetitive "Where Is My Order?" inquiries drain customer support teams and create delivery uncertainty for shoppers.',
    socialImpact: '24/7 transparent order visibility, eliminating anxiety for expectant delivery recipients.',
    solutionStrategy: 'Automated proactive tracking assistant providing live shipment telematics, vehicle movement, and dynamic ETA updates.',
    operationalCapability: 'Live Google Maps vehicle telematics with real-time speed, distance countdown, and route traffic monitoring.',
    enterpriseIntegrations: 'Fleet telematics, logistics dispatch, customer notification hubs',
    liveDemoFeature: 'Live Google Maps Item Tracker with near real-time telematics and speed/ETA countdown'
  },
  {
    id: 4,
    title: 'Supply Chain Volatility & Demand Forecasting Errors',
    pillar: 'Supply Chain & Inventory',
    problem: 'Legacy sales averages fail to anticipate local trend shifts, weather changes, and regional promotions, causing costly stockouts.',
    socialImpact: 'Cuts industrial supply chain overproduction and transportation fuel burn.',
    solutionStrategy: 'Multi-horizon predictive demand modeling that blends historical sales velocity, local weather forecasts, and calendar promotional lift.',
    operationalCapability: 'Automated 14-day store-level inventory replenishment triggers with anomaly dampening.',
    enterpriseIntegrations: 'Enterprise ERP ledgers, warehouse distribution networks, supplier EDI',
    liveDemoFeature: '14-Day Demand Forecasting Curve with Weather & Promotional Factors'
  },
  {
    id: 5,
    title: 'Phantom Inventory (Record vs. Physical Discrepancies)',
    pillar: 'Supply Chain & Inventory',
    problem: 'System ledgers show stock that is physically missing or misplaced in stores, preventing automated reorders and frustrating store shoppers.',
    socialImpact: 'Protects store retail jobs by preventing shrink-induced branch closures.',
    solutionStrategy: 'Real-time sales velocity anomaly detection that flags suspected shelf discrepancies within minutes of POS deviation.',
    operationalCapability: 'Automated task dispatch to store associate mobile devices with prioritized cycle-count walking routes.',
    enterpriseIntegrations: 'In-store POS systems, inventory management software, associate mobile handhelds',
    liveDemoFeature: 'Phantom Inventory Radar with instant associate cycle-count alerts'
  },
  {
    id: 6,
    title: 'Reverse Logistics Cost Drain & Return Fraud',
    pillar: 'Supply Chain & Inventory',
    problem: 'Customer returns consume up to 7% of gross sales, while manual inspection delays and fraudulent returns erode retail operating margins.',
    socialImpact: 'Zero-Landfill Circular Economy: Optically grades items for B-stock refurbishment instead of discarding to landfills.',
    solutionStrategy: 'Live video computer vision triage that verifies item condition, authenticates serial tags, and checks holographic seals in under 20 seconds.',
    operationalCapability: 'Instant automated refund authorization and dynamic circular disposition routing (restock, liquidate, refurbish).',
    enterpriseIntegrations: 'Reverse logistics platforms, return carrier networks, customer billing gateways',
    liveDemoFeature: 'OmniCare Live Video & Computer Vision Return Call (Instant approval in < 20s)'
  },
  {
    id: 7,
    title: 'Fresh Grocery Spoilage & Perishable Food Waste',
    pillar: 'Supply Chain & Inventory',
    problem: 'Rigid ordering cycles cause fresh produce and perishable goods to spoil before sale, hurting thin grocery operating margins.',
    socialImpact: 'Global Food Waste Prevention: Drastically curbs greenhouse emissions from decomposing unsold produce.',
    solutionStrategy: 'Shelf-life decay modeling with hyper-local weather tracking to forecast exact perishable sell-through rates.',
    operationalCapability: 'Dynamic markdown optimization with price elasticity guards to accelerate sell-through before expiration.',
    enterpriseIntegrations: 'Produce vendor EDI, electronic shelf tags, store POS pricing engines',
    liveDemoFeature: 'Dynamic Markdown Back-Office with Price Elasticity Guard'
  },
  {
    id: 8,
    title: 'In-Store Planogram Non-Compliance & Shelf Gaps',
    pillar: 'Store Operations',
    problem: 'Misplaced merchandise and visual merchandising errors disrupt store operations and lead to undetected out-of-stock voids.',
    socialImpact: 'Ensures shoppers can quickly find essential groceries and daily necessities.',
    solutionStrategy: 'Automated computer vision audit of shelf photographs that detects missing facings, misplaced items, and unlinked price tags.',
    operationalCapability: 'Visual planogram discrepancy heatmaps and automated associate restock task generation.',
    enterpriseIntegrations: 'Store ceiling camera feeds, associate mobile cameras, electronic shelf labels',
    liveDemoFeature: 'Store Shelf Planogram Computer Vision (Eye-level void & misplaced item detector)'
  },
  {
    id: 9,
    title: 'Frontline Workforce Readiness & Scheduling Friction',
    pillar: 'Store Operations',
    problem: 'High retail staff turnover (~60%) and manual scheduling lead to store understaffing during peak foot-traffic hours.',
    socialImpact: 'Mitigates frontline retail associate burnout and creates predictable, stress-free work shifts.',
    solutionStrategy: 'Foot-traffic-aware labor modeling that aligns associate staffing levels with predicted shopper density.',
    operationalCapability: 'Intelligent shift allocation and direct mobile task dispatch with ergonomic aisle routing.',
    enterpriseIntegrations: 'Workforce management suites, employee mobile apps, store biometric timeclocks',
    liveDemoFeature: 'Associate Handheld Task Dispatch in Phantom Inventory Radar'
  },
  {
    id: 10,
    title: 'Vendor Document Processing & Invoice Paperwork',
    pillar: 'Store Operations',
    problem: 'Inconsistent supplier invoice formats and manual paper packing slips cause data-entry lag and delayed supplier payments.',
    socialImpact: 'Accelerates payment cycles for small-business local suppliers and agricultural growers.',
    solutionStrategy: 'Intelligent document understanding that extracts line items, purchase orders, and tax details from scanned paperwork.',
    operationalCapability: 'Automated three-way invoice matching between purchase orders, warehouse receiving logs, and vendor invoices.',
    enterpriseIntegrations: 'Accounts payable ERPs, vendor self-service portals, electronic document archives',
    liveDemoFeature: 'Automated Supplier Document & Invoice Processing'
  },
  {
    id: 11,
    title: 'Slow Product Content Production & Catalog Bottlenecks',
    pillar: 'Store Operations',
    problem: 'Manually writing localized marketing descriptions, SEO metadata, and product tags for thousands of SKUs delays catalog launches.',
    socialImpact: 'Empowers diverse small vendors and artisans to launch multilingual catalogs in minutes.',
    solutionStrategy: 'Automated multimodal content generation creating rich, search-optimized descriptions, bullet highlights, and category tags.',
    operationalCapability: 'Batch catalog enrichment pipeline generating compliant e-commerce listings in dozens of languages simultaneously.',
    enterpriseIntegrations: 'Product Information Management (PIM) systems, digital asset managers, e-commerce CMS',
    liveDemoFeature: 'AI Attribute & Natural Language Tag Extraction in Storefront'
  },
  {
    id: 12,
    title: 'Financial Constraints & "The Pilot Trap"',
    pillar: 'Financial & Governance',
    problem: 'Sub-5% net retail margins prevent heavy upfront tech investments, leaving many commercial innovation projects stuck in pilot stages.',
    socialImpact: 'Democratizes enterprise-grade digital tools for regional independent merchants and cooperatives.',
    solutionStrategy: 'Modular, pay-per-use operational deployment where systems scale dynamically with transactional volume.',
    operationalCapability: 'Elastic cloud infrastructure that scales to zero during quiet periods, eliminating idle maintenance overhead.',
    enterpriseIntegrations: 'Cloud billing management, multi-tenant merchant stores, merchant cost dashboards',
    liveDemoFeature: 'Elastic Cloud Architecture with Zero Idle Maintenance Overhead'
  },
  {
    id: 13,
    title: 'Synthetic Identity Fraud & Account Takeovers',
    pillar: 'Financial & Governance',
    problem: 'Automated fraud networks blend genuine and synthetic credentials to bypass basic checkout rules, causing chargebacks.',
    socialImpact: 'Protects consumer financial security, identity integrity, and digital trust.',
    solutionStrategy: 'Real-time transaction risk scoring using behavioural analysis and identity graph risk verification.',
    operationalCapability: 'Tokenized checkout protocols and sub-100ms risk scoring without adding friction to legitimate customers.',
    enterpriseIntegrations: 'Payment gateways, tokenized vault providers, fraud investigation queues',
    liveDemoFeature: 'Tokenized Checkout Protocol & Real-Time Risk Scoring'
  },
  {
    id: 14,
    title: 'Blanket Discounting & Margin Erosion',
    pillar: 'Financial & Governance',
    problem: 'Broad calendar promotions offer discounts to customers who would have paid full price, eroding merchant gross margins.',
    socialImpact: 'Replaces predatory discounting with equitable, personalized customer value.',
    solutionStrategy: 'Price elasticity modeling that calculates product sensitivity curves to find optimal promotional balance.',
    operationalCapability: 'Automated margin-guard engine that enforces strict profit floor limits before any promotional bundle or discount is published.',
    enterpriseIntegrations: 'E-commerce pricing engines, store POS systems, merchant pricing consoles',
    liveDemoFeature: 'Dynamic Pricing & Margin Guard (simulating price elasticity before discounting)'
  },
  {
    id: 15,
    title: 'Regulatory Compliance & Algorithmic Oversight',
    pillar: 'Financial & Governance',
    problem: 'Stringent consumer privacy regulations (GDPR, CCPA, EU AI Act) penalize opaque consumer tracking and biased algorithms.',
    socialImpact: 'Sovereign consumer data privacy, ethical AI governance, and transparent commerce.',
    solutionStrategy: 'Privacy-first data architecture with explainable reasoning and automatic de-identification of sensitive customer details.',
    operationalCapability: 'Zero-trust enterprise governance with comprehensive audit logging, role-based controls, and deterministic transaction grounding.',
    enterpriseIntegrations: 'Enterprise compliance audit logs, identity security providers, governance consoles',
    liveDemoFeature: 'Enterprise Compliance, Privacy & Zero-Trust Governance Panel'
  }
];

export const ChallengesMatrix: React.FC = () => {
  // Top-level Matrix View: Conversational Commerce vs Dual B2C vs B2B Dimensions vs. 15 Retail Pillars
  const [activeMatrixTab, setActiveMatrixTab] = useState<'conversational' | 'dual7' | 'pillars15'>('conversational');

  // Dual 7 Dimensions State
  const [selectedDimensionId, setSelectedDimensionId] = useState<number>(1);
  const selectedDimension = DUAL_CHALLENGE_DIMENSIONS.find(d => d.id === selectedDimensionId) || DUAL_CHALLENGE_DIMENSIONS[0];

  // 15 Pillars State
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedChallengeId, setSelectedChallengeId] = useState<number>(1);

  const pillars = [
    { id: 'all', label: 'All 15 Strategic Pillars', count: 15 },
    { id: 'Customer Experience', label: 'Customer Experience', count: 3 },
    { id: 'Supply Chain & Inventory', label: 'Supply Chain & Inventory', count: 4 },
    { id: 'Store Operations', label: 'Store Operations', count: 4 },
    { id: 'Financial & Governance', label: 'Financial & Governance', count: 4 },
  ];

  const filteredChallenges = selectedPillar === 'all'
    ? RETAIL_CHALLENGES
    : RETAIL_CHALLENGES.filter(c => c.pillar === selectedPillar);

  const selectedChallenge = RETAIL_CHALLENGES.find(c => c.id === selectedChallengeId) || RETAIL_CHALLENGES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Primary View Switcher */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interactive Challenge Resolution Matrix
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0' }}>
            {activeMatrixTab === 'conversational'
              ? 'Conversational Commerce Solutions'
              : activeMatrixTab === 'dual7' 
                ? '7 Core Dimensions: B2C vs. B2B Manifestation Resolution' 
                : '15 Enterprise Retail Challenges & Social Impact Pillars'}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveMatrixTab('conversational')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeMatrixTab === 'conversational' ? '#0f172a' : 'transparent',
              color: activeMatrixTab === 'conversational' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Bot size={15} />
            <span>Conversational Commerce</span>
            <span style={{
              background: activeMatrixTab === 'conversational' ? '#2563eb' : '#cbd5e1',
              color: '#ffffff',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              fontSize: '0.7rem'
            }}>5</span>
          </button>

          <button
            onClick={() => setActiveMatrixTab('dual7')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeMatrixTab === 'dual7' ? '#0f172a' : 'transparent',
              color: activeMatrixTab === 'dual7' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeftRight size={15} />
            <span>7 B2C vs B2B Dimensions</span>
            <span style={{
              background: activeMatrixTab === 'dual7' ? '#2563eb' : '#cbd5e1',
              color: '#ffffff',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              fontSize: '0.7rem'
            }}>7</span>
          </button>

          <button
            onClick={() => setActiveMatrixTab('pillars15')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '9px',
              border: 'none',
              background: activeMatrixTab === 'pillars15' ? '#0f172a' : 'transparent',
              color: activeMatrixTab === 'pillars15' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={15} />
            <span>15 Retail Strategic Pillars</span>
            <span style={{
              background: activeMatrixTab === 'pillars15' ? '#2563eb' : '#cbd5e1',
              color: '#ffffff',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              fontSize: '0.7rem'
            }}>15</span>
          </button>
        </div>
      </div>

      {/* VIEW 0: CONVERSATIONAL COMMERCE SOLUTIONS & USE CASES */}
      {activeMatrixTab === 'conversational' && (
        <ConversationalCommerce />
      )}

      {/* VIEW 1: 7 B2C vs B2B CHALLENGE DIMENSIONS */}
      {activeMatrixTab === 'dual7' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Dimension Selector Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '0.85rem'
          }}>
            {DUAL_CHALLENGE_DIMENSIONS.map(dim => {
              const isSelected = dim.id === selectedDimension.id;
              return (
                <div
                  key={dim.id}
                  onClick={() => setSelectedDimensionId(dim.id)}
                  style={{
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: isSelected ? '#2563eb' : '#64748b',
                      background: isSelected ? '#eff6ff' : '#f1f5f9',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}>
                      Dimension #{dim.id}
                    </span>
                    {isSelected && <CheckCircle2 size={14} color="#2563eb" />}
                  </div>
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.3 }}>
                    {dim.dimension}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.3 }}>
                    {dim.tagline}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Dual Comparison Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-blue">Dimension #{selectedDimension.id} Deep Dive</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Google Cloud AI & Agentic Architecture</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                {selectedDimension.dimension}
              </h2>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1.15rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.825rem', color: '#475569', textTransform: 'uppercase' }}>Fundamental Divergence: </strong>
                <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>{selectedDimension.keyDivergence}</span>
              </div>
            </div>

            {/* Side-by-Side B2C vs B2B Comparison Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
              
              {/* B2C Manifestation & Solution Column */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    B2C
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>Consumer Manifestation</strong>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Individual Shoppers & Ephemeral Traffic</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Challenge Manifestation
                  </span>
                  <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    {selectedDimension.b2cManifestation}
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    Engineered System & Architecture
                  </span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedDimension.b2cSolution.system}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem' }}>
                    {selectedDimension.b2cSolution.algorithm}
                  </div>
                </div>

                <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.85rem 1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.775rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.675rem', marginBottom: '0.25rem' }}>ALGORITHMIC LOGIC / FORMULA:</div>
                  {selectedDimension.b2cSolution.formulaOrLogic}
                </div>

                <div>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Technology Stack
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedDimension.b2cSolution.techStack.map((tech, idx) => (
                      <span key={idx} style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    Target SLA: {selectedDimension.b2cSolution.kpi}
                  </span>
                </div>
              </div>

              {/* B2B Manifestation & Solution Column */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#7c3aed', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    B2B
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>Enterprise Manifestation</strong>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Corporate Accounts & Governed Contracts</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Challenge Manifestation
                  </span>
                  <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                    {selectedDimension.b2bManifestation}
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    Engineered System & Architecture
                  </span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedDimension.b2bSolution.system}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem' }}>
                    {selectedDimension.b2bSolution.algorithm}
                  </div>
                </div>

                <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.85rem 1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.775rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.675rem', marginBottom: '0.25rem' }}>CONTRACTUAL / ENTITLEMENT MODEL:</div>
                  {selectedDimension.b2bSolution.formulaOrLogic}
                </div>

                <div>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Technology Stack
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedDimension.b2bSolution.techStack.map((tech, idx) => (
                      <span key={idx} style={{ background: '#faf5ff', color: '#7c3aed', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    Target SLA: {selectedDimension.b2bSolution.kpi}
                  </span>
                </div>
              </div>

            </div>

            {/* Active Live Feature in App Banner */}
            <div style={{
              marginTop: '1.75rem',
              padding: '1.15rem 1.35rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#166534', display: 'block' }}>
                    Active Live Capabilities in Platform:
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#15803d' }}>
                    • B2C: {selectedDimension.b2cSolution.activeFeature} &nbsp;|&nbsp; • B2B: {selectedDimension.b2bSolution.activeFeature}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                Verified in Codebase
              </span>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: 15 RETAIL STRATEGIC PILLARS */}
      {activeMatrixTab === 'pillars15' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Pillar Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {pillars.map(p => {
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPillar(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '10px',
                    background: isSelected ? '#0f172a' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 6px rgba(15, 23, 42, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{p.label}</span>
                  <span style={{
                    background: isSelected ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.725rem',
                    fontWeight: 700
                  }}>
                    {p.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid of Challenges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredChallenges.map(item => {
              const isSelected = item.id === selectedChallenge.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedChallengeId(item.id)}
                  style={{
                    background: '#ffffff',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        background: '#eff6ff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Challenge #{item.id}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
                        {item.pillar}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {item.problem}
                    </p>
                  </div>

                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '0.75rem',
                    fontSize: '0.775rem',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 600
                  }}>
                    <CheckCircle2 size={13} />
                    <span>Active Capability: {item.liveDemoFeature.split(':')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Challenge Deep-Dive Solution Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-blue">Challenge #{selectedChallenge.id} Deep Dive</span>
                  <span className="badge badge-purple">{selectedChallenge.pillar}</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedChallenge.title}
                </h2>
              </div>

              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <HeartHandshake size={16} />
                <span>Social & Economic Impact Aligned</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              
              {/* Column 1: Solution Strategy & Social Impact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Intelligent Strategy & Solution
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                    {selectedChallenge.solutionStrategy}
                  </p>
                </div>

                <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Social & Environmental Impact
                  </span>
                  <p style={{ fontSize: '0.9rem', color: '#15803d', margin: 0, lineHeight: 1.5 }}>
                    {selectedChallenge.socialImpact}
                  </p>
                </div>
              </div>

              {/* Column 2: Operational Capability & Live Active Feature */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Enterprise Operational Capability
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                    {selectedChallenge.operationalCapability}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                    Enterprise Integrations: {selectedChallenge.enterpriseIntegrations}
                  </div>
                </div>

                <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                    Active Platform Feature in Portal
                  </span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', margin: 0 }}>
                    {selectedChallenge.liveDemoFeature}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
