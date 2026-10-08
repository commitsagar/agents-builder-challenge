import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, Bot, MessageSquare, ShoppingBag, 
  ChevronDown, ArrowRight, CornerDownLeft, RotateCcw, Truck, 
  Search, Check, ShieldCheck, ExternalLink, Zap
} from 'lucide-react';
import { Product } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { geminiRetailService } from '../../services/geminiService';
import confetti from 'canvas-confetti';

interface VirtualAssistantProps {
  onAddToCart: (product: Product) => void;
  onSelectCategory?: (category: string) => void;
  onNavigateView?: (view: string) => void;
  isCartOpen?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  thinkingTrace?: string;
  recommendedProducts?: Product[];
  actionLink?: { label: string; view: string };
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  onAddToCart,
  onSelectCategory,
  onNavigateView,
  isCartOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "👋 Hi there! I'm FlamGo AI, your personal shopping concierge powered by Gemini 3.7 Flash. I can help you discover items across all 10 departments, check physical aisle stock, or track orders. What are you looking for today?",
      timestamp: 'Just now',
      thinkingTrace: 'Gemini 3.7 Flash initialized with 2,048 reasoning budget. Connected to Firestore inventory catalog & local store fulfillment hubs.'
    }
  ]);

  const quickPrompts = [
    { label: '🛋️ Modern ergonomic desk chairs', query: 'Recommend modern ergonomic chairs for my home office' },
    { label: '🎧 Studio ANC headphones', query: 'What are your best studio noise canceling headphones under $250?' },
    { label: '⚡ Today’s best deals', query: 'Show me the biggest discounts and deals right now' },
    { label: '📦 Track order ORD-99482', query: 'Where is my order ORD-99482 right now?' },
    { label: '🔄 Live video returns', query: 'How does the instant video return and refund process work?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const lower = text.toLowerCase();
      let matchedProducts: Product[] = [];
      let replyText = '';
      let thinkingTrace = '';
      let actionLink: { label: string; view: string } | undefined = undefined;

      // 1. Order Tracking Query
      if (lower.includes('ord-') || lower.includes('track') || lower.includes('where is my order')) {
        replyText = "I located your order **ORD-99482** (Aura Pro ANC Studio Headphones). It is currently **Out for Delivery** via FedEx Priority van #7! The driver is 1.4 miles away with estimated dropoff in 22 minutes.";
        thinkingTrace = "Gemini 3.7 Flash parsed WISMO intent. Queried simulated carrier telematics webhook for ORD-99482. Extracted GPS coordinates (47.6085, -122.3392).";
        actionLink = { label: 'Open Live GPS Vehicle Map', view: 'gps' };
      }
      // 2. Return / Refund Query
      else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
        replyText = "With our **FlamGo Care Live Video Return**, you don't have to pack boxes or wait days for return approval. Start a 20-second live camera triage with our multimodal agent to verify barcode integrity and wear-and-tear for an instant refund!";
        thinkingTrace = "Gemini 3.7 Flash evaluated reverse logistics triage rules. Sub-20 second optical validation workflow triggered.";
        actionLink = { label: 'Start Live Video Return Call', view: 'live-return' };
      }
      // 3. Product Discovery & Deals Query
      else {
        // Run intent parser via Gemini 3.7 Flash service
        const intent = await geminiRetailService.parseShopperIntent(text);
        thinkingTrace = `Gemini 3.7 Flash Extended Thinking (${intent.styleAesthetic || 'Modern'} aesthetic): Category ${intent.parsedCategory}, Vector Similarity Score: ${intent.vectorSimilarityScore}, BM25 Score: ${intent.bm25RankScore}.`;

        // Filter products matching category or search keywords
        if (lower.includes('deal') || lower.includes('discount')) {
          matchedProducts = MOCK_PRODUCTS.filter((p) => (p.originalPrice || 0) > p.price).slice(0, 3);
          replyText = `Here are today's top deals with up to 35% discount across verified local store inventory:`;
        } else if (intent.parsedCategory && intent.parsedCategory !== 'General') {
          matchedProducts = MOCK_PRODUCTS.filter((p) => p.category === intent.parsedCategory).slice(0, 3);
          replyText = `Based on your request, I found these top-rated items in **${intent.parsedCategory}** matching your preferences:`;
        } else {
          matchedProducts = MOCK_PRODUCTS.filter((p) => 
            p.name.toLowerCase().includes(lower) || 
            p.tags.some(t => lower.includes(t.toLowerCase()))
          ).slice(0, 3);
          
          if (matchedProducts.length === 0) {
            matchedProducts = MOCK_PRODUCTS.slice(0, 3);
          }
          replyText = `Here are our recommended selections tailored to your search with immediate 2-hour local delivery:`;
        }
      }

      await new Promise((r) => setTimeout(r, 600));

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinkingTrace,
        recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
        actionLink
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Virtual assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I encountered an issue connecting to the model, but I'm here to help! Try exploring our 10 departments above or click one of the quick suggestions.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddProduct = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(prod);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#16a34a', '#ea580c']
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: isCartOpen ? '480px' : '24px',
      zIndex: 990,
      transition: 'right 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.25s ease',
      opacity: isCartOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 1,
      pointerEvents: isCartOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'none' : 'auto',
      transform: isCartOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'scale(0.9)' : 'scale(1)'
    }}>
      {/* Floating Avatar Trigger Button (When Minimized) */}
      {!isOpen && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Teaser Bubble */}
          <div
            onClick={() => setIsOpen(true)}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.06)',
              borderRadius: '20px',
              padding: '0.55rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: 'bounceSubtle 3s infinite'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Gemini 3.7
            </span>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
              Chat with FlamGo AI
            </span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>

          {/* Glowing Avatar Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open FlamGo AI Virtual Assistant"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #2563eb 100%)',
              border: '3px solid #ffffff',
              boxShadow: '0 10px 25px -4px rgba(234, 88, 12, 0.45), 0 4px 10px -4px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'transform 0.2s ease',
              padding: 0,
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Friendly Avatar Image with AI Aura */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="FlamGo AI Virtual Assistant Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Small Online Badge */}
            <span style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #ffffff',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
            }} />
          </button>
        </div>
      )}

      {/* Expanded Interactive Assistant Chat Window */}
      {isOpen && (
        <div style={{
          width: '390px',
          maxWidth: 'calc(100vw - 32px)',
          height: '580px',
          maxHeight: 'calc(100vh - 100px)',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInUp 0.25s ease'
        }}>
          {/* Assistant Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '42px', height: '42px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="FlamGo AI Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #38bdf8'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #0f172a'
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>FlamGo AI Concierge</strong>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px'
                  }}>
                    3.7 Flash
                  </span>
                </div>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={11} color="#38bdf8" /> Extended Thinking Active
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Minimize assistant"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#cbd5e1',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel Bar */}
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.5rem 0.75rem',
            overflowX: 'auto',
            display: 'flex',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            background: '#fdfdfe'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(37,99,235,0.2)' : 'none'
                  }}
                >
                  {msg.text}

                  {/* Thinking Trace (Collapsible) */}
                  {msg.thinkingTrace && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px dashed #cbd5e1' }}>
                      <button
                        onClick={() => setShowThinking(!showThinking)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: 0
                        }}
                      >
                        <Zap size={11} />
                        <span>{showThinking ? 'Hide Gemini 3.7 Thinking' : 'View Gemini 3.7 Reasoning Trace'}</span>
                      </button>
                      {showThinking && (
                        <p style={{
                          fontSize: '0.7rem',
                          color: '#475569',
                          marginTop: '0.3rem',
                          background: 'rgba(255,255,255,0.7)',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontFamily: 'monospace'
                        }}>
                          {msg.thinkingTrace}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Link Button */}
                  {msg.actionLink && onNavigateView && (
                    <button
                      onClick={() => {
                        onNavigateView(msg.actionLink!.view);
                        setIsOpen(false);
                      }}
                      style={{
                        marginTop: '0.65rem',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <span>{msg.actionLink.label}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {/* Interactive Product Recommendation Cards Inside Chat */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem'
                  }}>
                    {msg.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{
                            fontSize: '0.775rem',
                            color: '#0f172a',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {prod.name}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>
                              ${prod.price.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 600 }}>
                              • {prod.inStoreAisle || 'Aisle 3A'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleAddProduct(prod, e)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            color: '#2563eb',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.6rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            flexShrink: 0
                          }}
                        >
                          <ShoppingBag size={12} />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', padding: '0 0.25rem' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', padding: '0.25rem' }}>
                <Sparkles size={14} className="spin" color="#2563eb" />
                <span>Gemini 3.7 Flash thinking & analyzing catalog...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '0.75rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              placeholder="Ask anything (e.g., 'Find coffee gear under $50')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '0.55rem 0.95rem',
                fontSize: '0.825rem',
                outline: 'none',
                color: '#0f172a'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: inputValue.trim() ? '#2563eb' : '#e2e8f0',
                color: '#ffffff',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s ease'
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
