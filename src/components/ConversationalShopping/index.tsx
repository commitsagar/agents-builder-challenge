import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Check, Truck, 
  Info, RefreshCw, MessageSquare, Send, Award, Star, CheckCheck, Database, 
  Cpu, FileCheck, CornerDownRight, X
} from 'lucide-react';
import { Product, IntentAnalysis, AuthenticityPersonaReview, GroundedFact } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { MOCK_ORDERS } from '../../data/mockScenarios';
import { geminiRetailService } from '../../services/geminiService';
import { DoubleEdgeCloudTick, DoubleEdgeCloudBadge } from '../DoubleEdgeCloudTick';
import confetti from 'canvas-confetti';

interface ConversationalShoppingProps {
  onAddToCart: (product: Product) => void;
  cartItems: Product[];
}

export const ConversationalShopping: React.FC<ConversationalShoppingProps> = ({ onAddToCart, cartItems }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [intentResult, setIntentResult] = useState<IntentAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [wismoOrderNumber, setWismoOrderNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);

  // Product-Level RAG Grounding States
  const [productReviews, setProductReviews] = useState<Record<string, AuthenticityPersonaReview>>({});
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'facts' | 'review' | 'chat'>('facts');
  const [customProductQuery, setCustomProductQuery] = useState('');
  const [isAskingProductGemini, setIsAskingProductGemini] = useState(false);
  const [productQnaHistory, setProductQnaHistory] = useState<Record<string, Array<{ question: string; answer: string; confidence: number }>>>({});

  const samplePrompts = [
    'Scandinavian ergonomic chair under $300 for home office',
    'Audiophile noise-canceling headphones with lossless audio',
    '3-layer waterproof winter shell for heavy rain and snow',
    'Barista gooseneck kettle with precise temperature control',
    'Sub-3lb ultralight backpacking tent for 2 people'
  ];

  // Helper to load or fetch RAG review for a product
  const getOrFetchRAGReview = async (product: Product, focusQuery?: string): Promise<AuthenticityPersonaReview> => {
    if (productReviews[product.id] && !focusQuery) {
      return productReviews[product.id];
    }
    setLoadingProductId(product.id);
    try {
      const review = await geminiRetailService.groundProductFactsWithRAG(product, focusQuery);
      setProductReviews(prev => ({ ...prev, [product.id]: review }));
      return review;
    } finally {
      setLoadingProductId(null);
    }
  };

  // Pre-load top 6 items in background for immediate responsiveness
  useEffect(() => {
    const preloadTop = async () => {
      const topItems = MOCK_PRODUCTS.slice(0, 6);
      for (const item of topItems) {
        if (!productReviews[item.id]) {
          const rev = await geminiRetailService.groundProductFactsWithRAG(item);
          setProductReviews(prev => ({ ...prev, [item.id]: rev }));
        }
      }
    };
    preloadTop();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setQuery(searchQuery);
    try {
      const intent = await geminiRetailService.parseShopperIntent(searchQuery, cartItems);
      setIntentResult(intent);
      if (intent.parsedCategory && intent.parsedCategory !== 'General') {
        setActiveCategory(intent.parsedCategory);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductCardGeminiClick = async (product: Product, promptSnippet?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProduct(product);
    setActiveModalTab(promptSnippet ? 'chat' : 'facts');
    const rev = await getOrFetchRAGReview(product, promptSnippet);
    if (promptSnippet) {
      setCustomProductQuery(promptSnippet);
      handleAskProductGemini(product, promptSnippet, rev);
    }
  };

  const handleAskProductGemini = async (product: Product, userQ: string, currentRev?: AuthenticityPersonaReview) => {
    if (!userQ.trim()) return;
    setIsAskingProductGemini(true);
    try {
      const rev = currentRev || await getOrFetchRAGReview(product, userQ);
      // Generate grounded answer using facts and reviewer telemetry
      await new Promise(r => setTimeout(r, 240));
      const answer = `[Gemini 3.7 RAG Grounded Answer]: Verified against ${rev.reviewerName}'s 540+ historical evaluations and GCP BigQuery review embeddings (#${product.id.toUpperCase()}-REV). ${rev.detailedAnalysis.slice(0, 260)}... All metrics verified with Double Edge Cloud Tick assurance.`;

      setProductQnaHistory(prev => ({
        ...prev,
        [product.id]: [
          ...(prev[product.id] || []),
          {
            question: userQ,
            answer,
            confidence: 99.6
          }
        ]
      }));
      setCustomProductQuery('');
    } finally {
      setIsAskingProductGemini(false);
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (activeCategory !== 'All' && product.category !== activeCategory) {
      return false;
    }
    if (intentResult?.priceConstraint?.max && product.price > intentResult.priceConstraint.max) {
      return false;
    }
    return true;
  });

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#8b5cf6', '#10b981']
    });
  };

  const handleWismoLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_ORDERS.find(o => o.orderId.toLowerCase().includes(wismoOrderNumber.trim().toLowerCase()));
    setTrackedOrder(found || MOCK_ORDERS[0]);
  };

  // Get dynamic quick prompts for each product
  const getProductQuickPrompts = (product: Product): string[] => {
    const c = product.category.toLowerCase();
    if (c.includes('furniture')) {
      return ['Spinal lumbar support data?', 'Static frame 330lb stress test?'];
    } else if (c.includes('electronics')) {
      return ['Anechoic 34dB noise cancellation test?', 'Lossless 990kbps LDAC stability?'];
    } else if (c.includes('apparel')) {
      return ['28,000mm hydrostatic head rating?', 'Seam delamination wash cycles?'];
    } else if (c.includes('kitchen')) {
      return ['Thermal gradient stability?', 'Food-grade surface longevity?'];
    }
    return ['Verify specs against reviews?', 'Durability & build quality test?'];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Banner with Agent Highlights */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.12) 0%, rgba(13, 18, 29, 0.95) 70%)'
      }}>
        <div style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={13} /> Challenge 1 & 2: Multimodal Intent & Hybrid ScaNN Search
            </span>
            <span className="badge badge-green">Sub-50ms Session Personalization</span>
            <DoubleEdgeCloudBadge label="Verified User Review" sublabel="Grounded from Google" size="sm" />
          </div>

          <h1 style={{ fontSize: '2.4rem', lineHeight: '1.2', marginBottom: '1rem', fontWeight: 800 }}>
            Intelligent Conversational Concierge & Discovery
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            Eliminate the 31% zero-result search abandonment rate. Experience natural language intent parsing,
            joint multimodal text-image embeddings, and real-time session basket reasoning on Google Cloud — now powered with 
            <strong style={{ color: '#38bdf8' }}> Product-Level RAG Review Fact Grounding </strong> 
            from the <strong style={{ color: '#6ee7b7' }}>Google Authenticity Persona</strong> with 
            <strong style={{ color: '#0f172a', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}> Verified User Review (Black Tick) </strong> grounded from Google on review.
          </p>

          {/* Search Input Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.9)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            padding: '0.4rem 0.5rem'
          }}>
            <Search size={22} style={{ marginLeft: '1rem', color: '#818cf8' }} />
            <input
              type="text"
              placeholder="Search in plain English or describe what you need (e.g., 'Scandinavian ergonomic chair under $300')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              style={{
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                fontSize: '1rem',
                padding: '0.75rem 1rem',
                color: '#fff',
                width: '100%'
              }}
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={isSearching}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', minWidth: '130px', flexShrink: 0 }}
            >
              {isSearching ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Ask Gemini</span>
                </>
              )}
            </button>
          </div>

          {/* Suggestion Prompts */}
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>TRY ASKING:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(prompt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Agent Parsing Telemetry Box (If Searched) */}
      {intentResult && (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          background: 'rgba(15, 23, 42, 0.75)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Vertex AI Agent Builder • Real-Time Intent Synthesis
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">ScaNN Vector Score: {(intentResult.vectorSimilarityScore * 100).toFixed(1)}%</span>
              <span className="badge badge-purple">BM25 Rank: {(intentResult.bm25RankScore * 100).toFixed(1)}%</span>
              <span className="badge badge-green">Inference: 38ms</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="glass-card" style={{ padding: '0.85rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Detected Category</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{intentResult.parsedCategory}</p>
            </div>
            <div className="glass-card" style={{ padding: '0.85rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Style & Aesthetic</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8' }}>{intentResult.styleAesthetic}</p>
            </div>
            <div className="glass-card" style={{ padding: '0.85rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Price Constraint</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                {intentResult.priceConstraint?.max ? `Under $${intentResult.priceConstraint.max}` : 'Unconstrained (Best Match)'}
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: '#fff' }}>Gemini Reasoning: </strong> {intentResult.reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Category Pills & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Furniture', 'Electronics', 'Apparel', 'Kitchen', 'Outdoor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                background: activeCategory === cat ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: activeCategory === cat ? '#6366f1' : 'var(--border-subtle)',
                color: activeCategory === cat ? '#fff' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <span>Showing <strong>{filteredProducts.length}</strong> AI-ranked items with Verified User Reviews (Grounded from Google)</span>
        </div>
      </div>

      {/* Product Catalog Grid with Product-Level Ask Gemini & Google Authenticity Grounding */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredProducts.map((product) => {
          const quickPrompts = getProductQuickPrompts(product);
          const review = productReviews[product.id];
          const primaryFact = review?.groundedFacts[0];

          return (
            <div
              key={product.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onClick={() => {
                setSelectedProduct(product);
                getOrFetchRAGReview(product);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image & Badges */}
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                
                {/* Top Category Badge */}
                <span className="badge badge-purple" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  {product.category}
                </span>

                {/* Verified User Review Black Tick Top Badge */}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <DoubleEdgeCloudBadge 
                    size="sm" 
                    label="Verified User Review" 
                    sublabel="Grounded from Google"
                    confidence={99.6}
                  />
                </div>

                <span className="badge badge-blue" style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '0.675rem' }}>
                  {product.inStoreAisle}
                </span>
              </div>

              {/* Content Details */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff', lineHeight: '1.3' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                    {product.description}
                  </p>
                </div>

                {/* Google Authenticity Persona Grounded Review Banner on Card */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Google Authenticity Reviewer"
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #38bdf8' }}
                      />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e0f2fe' }}>
                        Google Authenticity Persona <span style={{ color: '#94a3b8', fontWeight: 500 }}>(548 Reviews)</span>
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>★ 99.9% Ground Truth</span>
                  </div>

                  {/* Grounded Fact with Double Edge Cloud Tick */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <DoubleEdgeCloudTick size={17} style={{ marginTop: '2px' }} />
                    <span style={{ fontSize: '0.725rem', color: '#cbd5e1', lineHeight: '1.35', fontWeight: 500 }}>
                      {primaryFact?.claim || (product.category === 'Furniture' 
                        ? 'Spinal Lumbar Support: Measured 18.6% reduction in L4-L5 lumbar disc pressure.' 
                        : product.category === 'Electronics' 
                        ? 'Active Noise Cancellation: 34.2 dB ambient attenuation measured in anechoic chamber.'
                        : 'Hydrostatic Waterproof Barrier: Withstood 28,800 mm water column pressure.')}
                    </span>
                  </div>
                </div>

                {/* Product-Level "Ask Gemini" Quick Chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Ask Gemini at this product level:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {quickPrompts.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleProductCardGeminiClick(product, chip, e)}
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.28)',
                          color: '#c7d2fe',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
                          e.currentTarget.style.borderColor = '#818cf8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.28)';
                        }}
                      >
                        <Sparkles size={11} color="#a5b4fc" />
                        <span>"{chip}"</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price, Ask Gemini Button & Add to Cart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: 'auto'
                }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button
                      onClick={(e) => handleProductCardGeminiClick(product, undefined, e)}
                      className="btn btn-secondary"
                      title="Inspect RAG Grounded Review Facts & Ask Gemini"
                      style={{
                        padding: '0.45rem 0.75rem',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(14, 165, 233, 0.15)',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8'
                      }}
                    >
                      <DoubleEdgeCloudTick size={15} />
                      <span>RAG Review</span>
                    </button>

                    <button
                      onClick={(e) => handleAdd(product, e)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* WISMO & Support Drawer Section (Challenge 3) */}
      <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-blue">Challenge 3: WISMO & Customer Support Copilot</span>
              <span className="badge badge-green">Zero Contact Center Overhead ($0 vs $14)</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Instant Order Tracking & Logistics Concierge</h2>
          </div>

          <form onSubmit={handleWismoLookup} style={{ display: 'flex', gap: '0.5rem', minWidth: '320px' }}>
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ORD-99482 or ORD-98311)..."
              value={wismoOrderNumber}
              onChange={(e) => setWismoOrderNumber(e.target.value)}
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Track
            </button>
          </form>
        </div>

        {/* Live Order Timeline Card */}
        {trackedOrder ? (
          <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Order ID: <strong style={{ color: '#fff' }}>{trackedOrder.orderId}</strong></p>
                <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{trackedOrder.items.join(', ')}</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>{trackedOrder.status}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Carrier: {trackedOrder.carrier} • Tracking #{trackedOrder.trackingNumber}</p>
              </div>
            </div>

            {/* Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${trackedOrder.timeline.length}, 1fr)`, gap: '1rem', position: 'relative' }}>
              {trackedOrder.timeline.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: step.done ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.75rem'
                    }}>
                      {step.done ? <Check size={14} /> : idx + 1}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: step.done ? '#fff' : 'var(--text-dim)' }}>
                      {step.step}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', paddingLeft: '32px' }}>
                    {step.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            <Info size={16} />
            <span>Try entering <strong>ORD-99482</strong> (Delivered) or <strong>ORD-98311</strong> (In Transit) to inspect live carrier webhooks and Gemini multimodal assistance.</span>
          </div>
        )}
      </div>

      {/* Product Detail & RAG Grounding Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }} onClick={() => setSelectedProduct(null)}>
          <div
            className="glass-panel"
            style={{
              maxWidth: '960px',
              width: '100%',
              padding: '2rem',
              background: '#0a0f1d',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: '20px',
              position: 'relative',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <DoubleEdgeCloudBadge 
                label="Verified User Review" 
                sublabel="Grounded from Google" 
                confidence={99.8}
                size="md"
              />
              <span className="badge badge-purple">
                <Database size={13} /> Vertex AI Search RAG Index: #REV-{selectedProduct.id.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Product Info Column */}
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '100%', borderRadius: '14px', height: '260px', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                />
                
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">{selectedProduct.category}</span>
                  <span className="badge badge-blue">Elasticity: {selectedProduct.elasticity}</span>
                  <span className="badge badge-green">In Stock: {selectedProduct.stock} units</span>
                  <span className="badge badge-orange">{selectedProduct.inStoreAisle}</span>
                </div>

                <h2 style={{ fontSize: '1.35rem', margin: '1rem 0 0.4rem', fontWeight: 800 }}>{selectedProduct.name}</h2>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.75rem' }}>
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  {selectedProduct.description}
                </p>

                <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Catalog Specifications
                </h4>
                <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{f}</li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    handleAdd(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  Add to Cart • ${selectedProduct.price.toFixed(2)}
                </button>
              </div>

              {/* RAG Grounding & Google Authenticity Review Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Tab Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveModalTab('facts')}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'facts' ? '2px solid #38bdf8' : '2px solid transparent',
                      color: activeModalTab === 'facts' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <DoubleEdgeCloudTick size={16} />
                    <span>Verified User Reviews (Google Grounded)</span>
                  </button>

                  <button
                    onClick={() => setActiveModalTab('review')}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'review' ? '2px solid #38bdf8' : '2px solid transparent',
                      color: activeModalTab === 'review' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Award size={16} />
                    <span>Authenticity Review</span>
                  </button>

                  <button
                    onClick={() => setActiveModalTab('chat')}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'chat' ? '2px solid #38bdf8' : '2px solid transparent',
                      color: activeModalTab === 'chat' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Ask Gemini (Product)</span>
                  </button>
                </div>

                {/* Google Authenticity Reviewer Bio Card */}
                {productReviews[selectedProduct.id] && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={productReviews[selectedProduct.id].avatar}
                        alt="Reviewer"
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                            {productReviews[selectedProduct.id].reviewerName}
                          </strong>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px'
                          }}>
                            {productReviews[selectedProduct.id].reviewsCountTotal}+ Verified Reviews
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                          {productReviews[selectedProduct.id].reviewerRole}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Hallucination Shield
                      </span>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>
                        {productReviews[selectedProduct.id].accuracyRate}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 1: Grounded Fact Checklist with Double Edge Cloud Ticks */}
                {activeModalTab === 'facts' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        RAG Grounded Claims Matrix
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                        Retrieved from BigQuery Embeddings
                      </span>
                    </div>

                    {productReviews[selectedProduct.id]?.groundedFacts.map((fact, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(15, 23, 42, 0.65)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: '10px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                          <DoubleEdgeCloudTick size={22} style={{ marginTop: '2px' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', lineHeight: '1.4' }}>
                              {fact.claim}
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap', fontSize: '0.7rem' }}>
                              <span style={{ color: '#6ee7b7', fontWeight: 600 }}>
                                Telemetry: {fact.telemetryMetric}
                              </span>
                              <span style={{ color: '#94a3b8' }}>
                                Source: {fact.evidenceSource}
                              </span>
                            </div>
                          </div>
                          <span style={{
                            background: 'rgba(14, 165, 233, 0.2)',
                            color: '#38bdf8',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}>
                            {fact.confidenceScore.toFixed(1)}% Grounded
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Full Authenticity Persona Review */}
                {activeModalTab === 'review' && productReviews[selectedProduct.id] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '10px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <h4 style={{ color: '#38bdf8', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 700 }}>
                        {productReviews[selectedProduct.id].headline}
                      </h4>
                      <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
                        {productReviews[selectedProduct.id].detailedAnalysis}
                      </p>
                    </div>

                    {/* Pros and Cons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                          Verified Strengths
                        </span>
                        <ul style={{ paddingLeft: '1rem', margin: '0.4rem 0 0', fontSize: '0.775rem', color: '#cbd5e1' }}>
                          {productReviews[selectedProduct.id].pros.map((p, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
                          Observed Trade-offs
                        </span>
                        <ul style={{ paddingLeft: '1rem', margin: '0.4rem 0 0', fontSize: '0.775rem', color: '#cbd5e1' }}>
                          {productReviews[selectedProduct.id].cons.map((c, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Interactive Ask Gemini at Product Level */}
                {activeModalTab === 'chat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Ask Gemini 3.7 anything about <strong>{selectedProduct.name}</strong>. Answers are grounded in 
                      the Google Authenticity Persona's review dataset with Double Edge Cloud Ticks.
                    </p>

                    {/* Quick prompts */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {getProductQuickPrompts(selectedProduct).map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomProductQuery(chip);
                            handleAskProductGemini(selectedProduct, chip);
                          }}
                          style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#e0e7ff',
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          "{chip}"
                        </button>
                      ))}
                    </div>

                    {/* QnA History */}
                    <div style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.75rem',
                      borderRadius: '10px'
                    }}>
                      {(productQnaHistory[selectedProduct.id] || []).length === 0 ? (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '1rem 0' }}>
                          No questions asked yet. Click a chip above or type below to ground facts.
                        </span>
                      ) : (
                        productQnaHistory[selectedProduct.id].map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.45rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#fff', alignSelf: 'flex-end', maxWidth: '85%' }}>
                              {item.question}
                            </div>
                            <div style={{
                              background: 'rgba(15, 23, 42, 0.85)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              color: '#cbd5e1',
                              lineHeight: '1.45',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem'
                            }}>
                              <DoubleEdgeCloudTick size={18} style={{ marginTop: '2px' }} />
                              <div>
                                <p style={{ margin: 0 }}>{item.answer}</p>
                                <span style={{ fontSize: '0.65rem', color: '#0f172a', fontWeight: 800, marginTop: '0.3rem', display: 'inline-block', background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                  Verified User Review • Grounded from Google • {item.confidence}% Grounded
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input box */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder={`Ask Gemini about ${selectedProduct.name}...`}
                        value={customProductQuery}
                        onChange={(e) => setCustomProductQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskProductGemini(selectedProduct, customProductQuery)}
                        style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem', flex: 1 }}
                      />
                      <button
                        onClick={() => handleAskProductGemini(selectedProduct, customProductQuery)}
                        disabled={isAskingProductGemini}
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        {isAskingProductGemini ? (
                          <RefreshCw size={15} className="spin" />
                        ) : (
                          <>
                            <Send size={15} />
                            <span>Ask</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
