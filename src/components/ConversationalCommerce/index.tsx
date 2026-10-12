import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Bot, Truck, Smartphone, Camera, Mic, MicOff, 
  CheckCircle2, ChevronRight, Volume2, VolumeX, 
  Search, RefreshCw, Send, ArrowRight,
  ShieldCheck, Package, RotateCcw,
  ShoppingBag, CreditCard, User, Zap, MapPin,
  MessageSquare, Eye, X, Check, Plus, Heart, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { Product } from '../../types';
import { SemanticCatalogEngine, SemanticSearchResult } from '../../utils/semanticCatalogEngine';

interface ConversationalCommerceProps {
  onAddToCart?: (product: any) => void;
  onNavigateView?: (view: string) => void;
  isB2CPersona?: boolean;
  initialUseCase?: '01' | '02' | '03';
  isModal?: boolean;
  onClose?: () => void;
}

interface TextChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  items?: Product[];
  researchBadge?: SemanticSearchResult['researchBadge'];
  specResearchBrief?: SemanticSearchResult['specResearchBrief'];
  comparisonMatrix?: SemanticSearchResult['comparisonMatrix'];
  suggestedPrompts?: string[];
  timestamp: string;
}

interface VoiceSessionMessage {
  id: string;
  sender: 'aria' | 'user';
  text: string;
  actionType?: 'order' | 'return' | 'recommendation' | 'general' | 'search' | 'deflection';
  researchBadge?: SemanticSearchResult['researchBadge'];
  specResearchBrief?: SemanticSearchResult['specResearchBrief'];
  comparisonMatrix?: SemanticSearchResult['comparisonMatrix'];
  suggestedPrompts?: string[];
  pendingProposal?: {
    type: 'bundle' | 'single';
    title: string;
    items: Product[];
    total: number;
  };
  orderReceipt?: {
    orderId: string;
    items: Array<{ name: string; price: number; image: string; quantity: number }>;
    total: number;
    deliveryTime: string;
    carrier: string;
    trackingNumber: string;
    deliveryLocation: string;
  };
  returnCard?: {
    orderId: string;
    productName: string;
    price: number;
    image: string;
    status: 'scanning' | 'approved';
    reason: string;
    authenticityScore: number;
    conditionGrade: string;
    refundAmount: number;
  };
  items?: Product[];
  timestamp: string;
}

interface SearchContext {
  lastTopic?: string;
  lastCategory?: string;
  lastBudget?: number;
  lastProduct?: Product;
}

export const ConversationalCommerce: React.FC<ConversationalCommerceProps> = ({
  onAddToCart,
  onNavigateView,
  initialUseCase = '01',
  isModal = false,
  onClose
}) => {
  // Navigation & Feature Mode
  const [activeFeature, setActiveFeature] = useState<'text-chat' | 'voice-avatar' | 'doms-wismo' | 'whatsapp'>('text-chat');

  useEffect(() => {
    if (initialUseCase === '02') setActiveFeature('doms-wismo');
    else if (initialUseCase === '03') setActiveFeature('whatsapp');
    else setActiveFeature('text-chat');
  }, [initialUseCase]);

  // Product Detail Inspection Modal State
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});

  // Conversational Search Context (Remembers topics like "laptop" when followed by "less $500 usd" or "500")
  const [chatSearchContext, setChatSearchContext] = useState<SearchContext>({});

  // Customer Profile
  const customerProfile = {
    name: 'Alex Rivera',
    tier: 'FlamGo Elite Gold VIP',
    clv: '$2,840',
    topAffinity: 'Minimalist Scandinavian & Artisan Coffee',
    affinityScores: [
      { category: 'Home Office & Ergonomics', score: 98 },
      { category: 'Artisan Kitchen & Espresso', score: 96 },
      { category: 'Studio ANC Headphones', score: 92 },
      { category: 'Technical Outdoor', score: 85 }
    ],
    lastOrder: {
      id: 'ORD-99482',
      name: 'ANC Wireless Studio Headphones',
      price: 189.50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
    }
  };

  // Verified Scandinavian chair & lamp from catalog
  const scandinavianChair: Product = MOCK_PRODUCTS.find(p => p.id === 'prod-201') || {
    id: 'prod-201',
    name: 'Nordic Oak Minimalist Ergonomic Desk Chair',
    category: 'Furniture',
    price: 249.00,
    rating: 4.85,
    reviewsCount: 342,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
    description: 'Clean Scandinavian silhouette constructed with steam-bent solid white oak and breathable memory foam cushioning.',
    features: ['Solid White Oak frame', 'Pneumatic 4-inch height lift', 'Tilt lock mechanism with Lumbar Flex', 'Weight capacity: 330 lbs'],
    tags: ['scandinavian', 'minimalist', 'ergonomic', 'oak', 'workspace'],
    elasticity: -1.35
  };

  const luminaLamp: Product = MOCK_PRODUCTS.find(p => p.id === 'prod-209') || {
    id: 'prod-209',
    name: 'Lumina Architect Counterbalance Task Lamp',
    category: 'Furniture',
    price: 89.00,
    rating: 4.80,
    reviewsCount: 265,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    description: 'Precision spring-balanced arm with 3000K-6000K stepless color temperature adjustment and 95+ CRI illumination.',
    features: ['High CRI 95+ flicker-free LED', 'Touch dimmer with memory', 'Clamp or heavy weighted base', '50,000 hour rated lifespan'],
    tags: ['lamp', 'task light', 'lighting', 'led', 'architectural'],
    elasticity: -1.6
  };

  // =========================================================================
  // SILENT BACKEND GUARDRAIL CHECK
  // =========================================================================
  const evaluateGuardrailSilently = (input: string): { isSafe: boolean; deflection?: string } => {
    const lower = input.toLowerCase().trim();

    // 1. Prompt Injection & Jailbreak Defense
    const injectionPatterns = [
      /ignore (all |previous |system )?instructions/i,
      /override (system |safety |guardrails?|rules?)/i,
      /you are now (dan|unrestricted|jailbreak|chaos)/i,
      /system prompt/i,
      /disregard (safety|guidelines)/i,
      /act as (an unfiltered|a malicious|developer mode)/i,
      /bypass (auth|security|filters?|rules?)/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(lower)) {
        return {
          isSafe: false,
          deflection: "I apologize, but I am designed specifically to assist you with shopping at FlamGo. I cannot modify my system instructions. How can I assist you with products from our catalog today?"
        };
      }
    }

    // 2. Catalog & Price Grounding Defense
    const priceAttackPatterns = [
      /give (it |me )?(for )?free/i,
      /change (the )?price to/i,
      /set (the )?price (to|=) ?\$?0/i,
      /set (the )?price (to|=) ?\$?1/i,
      /give (me )?(a )?(99%|90%|95%|100%) discount/i,
      /make it (cost )?\$?0/i,
      /hack (the )?price/i,
      /override price/i
    ];

    for (const pattern of priceAttackPatterns) {
      if (pattern.test(lower)) {
        return {
          isSafe: false,
          deflection: "I'm sorry Alex, but all pricing is verified from our store inventory system and cannot be altered. The Nordic Oak Ergonomic Chair is currently $249.00 with complimentary same-day VIP delivery. Can I help you with any other items in your budget?"
        };
      }
    }

    // 3. Dangerous Goods & Toxicity Filter
    const harmfulPatterns = [
      /(weapons?|explosives?|bomb|guns?|ammunition)/i,
      /(illegal drugs?|cocaine|heroin)/i,
      /(kill|harm|suicide|destroy)/i,
      /(hate speech|slurs)/i
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(lower)) {
        return {
          isSafe: false,
          deflection: "I'm sorry, but I can only assist with verified retail merchandise available at FlamGo, such as furniture, electronics, apparel, and kitchen items."
        };
      }
    }

    // 4. PII Protection
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(lower) || /\b(?:\d{4}[ -]?){3}\d{4}\b/.test(lower)) {
      return {
        isSafe: false,
        deflection: "For your security, please don't share raw credit card numbers or sensitive IDs. Your saved payment method (Visa ending •••• 4242) is already securely stored for 1-tap checkout."
      };
    }

    return { isSafe: true };
  };

  // 1-Click Add to Cart Helper
  const handleItemAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedProductIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds(prev => ({ ...prev, [product.id]: false }));
    }, 2500);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });
  };



  // =========================================================================
  // FEATURE 1: DEDICATED INDEPENDENT TEXT CHAT COMMERCE ASSISTANT
  // =========================================================================
  const [textChatInput, setTextChatInput] = useState('');
  const [isTextChatTyping, setIsTextChatTyping] = useState(false);
  const textChatBottomRef = useRef<HTMLDivElement>(null);

  const [textMessages, setTextMessages] = useState<TextChatMessage[]>([
    {
      id: 'tc-init',
      sender: 'ai',
      text: "👋 Welcome to FlamGo Text Assistant! Ask about any product, check technical clearances, or search our 500-item Seattle inventory by category or budget.",
      timestamp: 'Just now'
    }
  ]);

  const handleSendTextChat = (overrideQuery?: string) => {
    const q = (overrideQuery || textChatInput).trim();
    if (!q) return;

    const userMsg: TextChatMessage = {
      id: `tc-user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTextMessages(prev => [...prev, userMsg]);
    setTextChatInput('');
    setIsTextChatTyping(true);

    // Silent backend guardrail check
    const guardrail = evaluateGuardrailSilently(q);
    if (!guardrail.isSafe) {
      setTimeout(() => {
        setTextMessages(prev => [
          ...prev,
          {
            id: `tc-ai-${Date.now()}`,
            sender: 'ai',
            text: guardrail.deflection || "I cannot process this request.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTextChatTyping(false);
      }, 350);
      return;
    }

    const lower = q.toLowerCase();

    setTimeout(() => {
      // 1. Natural greeting check
      if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower === 'good morning') {
        setTextMessages(prev => [
          ...prev,
          {
            id: `tc-ai-${Date.now()}`,
            sender: 'ai',
            text: "Hi Alex! How can I assist you with your shopping today? Feel free to ask about any product specs, test clearances, search our 500-item Seattle inventory, or order with 1-click.",
            suggestedPrompts: [
              '💻 Can I order a laptop?',
              '🛋️ Ergonomic chair for back pain',
              '☕ Barista espresso 15" cabinet clearance',
              '🌧️ Seattle waterproof rain jackets'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTextChatTyping(false);
        return;
      }

      // 2. Order tracking & status check
      if (lower.includes('track') || lower.includes('where is my order') || lower.includes('delivery status')) {
        setTextMessages(prev => [
          ...prev,
          {
            id: `tc-ai-${Date.now()}`,
            sender: 'ai',
            text: `📦 **Live Dispatch Status (Order #ORD-99482):**\n\n• **Status:** Out for Delivery (Final Mile)\n• **Carrier:** FlamGo Clean Fleet (EV-Van #09)\n• **Driver:** Marcus Vance (Rating: 4.98 ★)\n• **Live ETA:** 14 minutes remaining (0.8 mi away in Seattle)\n\nYou can switch to our DOMS & Returns view or Live GPS tracker for real-time map telemetry.`,
            suggestedPrompts: [
              '📍 View Live GPS Delivery Van',
              '🔄 Request Optical Return',
              '💬 Speak with Concierge Driver'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTextChatTyping(false);
        return;
      }

      // 3. Process with Semantic Catalog Engine
      const searchResult = SemanticCatalogEngine.processQuery(q, chatSearchContext);

      // If intent is ADD_TO_CART, actually add the product to the user's live cart
      if (searchResult.intent === 'ADD_TO_CART' && searchResult.products.length > 0) {
        handleItemAddToCart(searchResult.products[0]);
      }

      // If intent is RETURN, update order storage
      if (searchResult.intent === 'RETURN') {
        const orderId = 'ORD-99482';
        try {
          const existing = JSON.parse(localStorage.getItem('flamgo_orders') || '[]');
          const updated = existing.map((o: any) => o.orderId === orderId ? { ...o, status: 'Returned & Refunded ($ Store Credit)' } : o);
          localStorage.setItem('flamgo_orders', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.warn('Storage error on return:', e);
        }
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      // Update multi-turn search context
      setChatSearchContext({
        lastTopic: searchResult.identifiedCategory || searchResult.headline,
        lastCategory: searchResult.identifiedCategory || chatSearchContext.lastCategory,
        lastBudget: searchResult.activeBudget || chatSearchContext.lastBudget,
        lastProduct: searchResult.products[0] || chatSearchContext.lastProduct
      });

      setTextMessages(prev => [
        ...prev,
        {
          id: `tc-ai-${Date.now()}`,
          sender: 'ai',
          text: searchResult.responseText,
          items: searchResult.products,
          researchBadge: searchResult.researchBadge,
          specResearchBrief: searchResult.specResearchBrief,
          comparisonMatrix: searchResult.comparisonMatrix,
          suggestedPrompts: searchResult.suggestedPrompts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTextChatTyping(false);
    }, 380);
  };

  useEffect(() => {
    textChatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [textMessages, isTextChatTyping]);

  // =========================================================================
  // FEATURE 2: INDEPENDENT INTELLIGENCE AVATAR (NATURAL MULTI-TURN CONVERSATION)
  // =========================================================================
  const [pendingProposal, setPendingProposal] = useState<{
    type: 'bundle' | 'single';
    title: string;
    items: Product[];
    total: number;
  } | null>(null);

  const [avatarVoiceMessages, setAvatarVoiceMessages] = useState<VoiceSessionMessage[]>([
    {
      id: 'voice-init',
      sender: 'aria',
      text: "👋 Hi Alex! I'm **Aria**, your Intelligence Shopping Avatar.\n\nTap the microphone to speak naturally. You can say hello, search products, ask for curated recommendations, place voice orders, or request returns.",
      actionType: 'general',
      timestamp: 'Just now'
    }
  ]);

  const [isAvatarListening, setIsAvatarListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [voiceSpeechError, setVoiceSpeechError] = useState<string | null>(null);
  const voiceBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleAvatarVoiceInput(transcript);
          }
          setIsAvatarListening(false);
          setAvatarState('idle');
        };

        recognition.onerror = () => {
          setIsAvatarListening(false);
          setAvatarState('idle');
          setVoiceSpeechError('Voice recording ended. You can also tap sample voice prompts below.');
          setTimeout(() => setVoiceSpeechError(null), 3500);
        };

        recognition.onend = () => {
          setIsAvatarListening(false);
          if (avatarState === 'listening') setAvatarState('idle');
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition failed:', err);
      }
    }
  }, [avatarState, pendingProposal]);

  // SpeechSynthesis
  const speakAriaVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`\n]/g, ' ').replace(/\s+/g, ' ').slice(0, 240);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria'));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => {
        setIsAvatarSpeaking(true);
        setAvatarState('speaking');
      };
      utterance.onend = () => {
        setIsAvatarSpeaking(false);
        setAvatarState('idle');
      };
      utterance.onerror = () => {
        setIsAvatarSpeaking(false);
        setAvatarState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsAvatarSpeaking(false);
      setAvatarState('idle');
    }
  };

  const toggleAvatarMic = () => {
    if (!recognitionRef.current) {
      if (pendingProposal) {
        handleAvatarVoiceInput("Yes please add to cart");
      } else {
        handleAvatarVoiceInput("Hello");
      }
      return;
    }

    if (isAvatarListening) {
      recognitionRef.current.stop();
      setIsAvatarListening(false);
      setAvatarState('idle');
    } else {
      try {
        setIsAvatarListening(true);
        setAvatarState('listening');
        recognitionRef.current.start();
      } catch (e) {
        setIsAvatarListening(false);
        setAvatarState('idle');
      }
    }
  };

  // Avatar executes Voice Order
  const executeVoiceOrder = (products: Product[]) => {
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalAmount = products.reduce((acc, p) => acc + p.price, 0);

    const newOrder = {
      orderId: newOrderId,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: products.map(p => `${p.name} (x1)`),
      total: totalAmount,
      status: 'Out for Delivery (Express 2-Hour Courier)',
      carrier: 'FlamGo Express EV Fleet (Seattle Downtown #402)',
      trackingNumber: `FLAM-${newOrderId}-EXPRESS`,
      deliveryLocation: '742 Evergreen Pike, Seattle, WA 98101',
      timeline: [
        { step: 'Order Placed & Confirmed via Voice', time: 'Just now', done: true },
        { step: 'Prepared at Seattle Flagship', time: 'Just now', done: true },
        { step: 'In-Store Picking & Packing Complete', time: 'In Progress', done: true },
        { step: 'Courier Hand-off & Express 2-Hour Delivery', time: 'Estimated within 120 mins', done: false }
      ],
      orderedProducts: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.image,
        category: p.category || 'Voice Order'
      }))
    };

    try {
      const existing = JSON.parse(localStorage.getItem('flamgo_orders') || '[]');
      localStorage.setItem('flamgo_orders', JSON.stringify([newOrder, ...existing]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('Storage error on voice order:', e);
    }

    if (onAddToCart) {
      products.forEach(p => onAddToCart(p));
    }

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#16a34a', '#8b5cf6', '#fbbf24']
    });

    const productNamesList = products.map(p => `**${p.name}** ($${p.price.toFixed(2)})`).join(' and ');
    const reply = `🎉 **Voice Order Confirmed & Added to Cart!**\n\nI have placed your order for ${productNamesList} (Total: **$${totalAmount.toFixed(2)}**).\n\n⚡ Dispatched via **Express 2-Hour Courier** from Seattle Downtown Flagship with tracking ID **#${newOrderId}**.`;

    setAvatarVoiceMessages(prev => [
      ...prev,
      {
        id: `voice-ord-${Date.now()}`,
        sender: 'aria',
        text: reply,
        actionType: 'order',
        items: products,
        orderReceipt: {
          orderId: newOrderId,
          items: products.map(p => ({ name: p.name, price: p.price, image: p.image, quantity: 1 })),
          total: totalAmount,
          deliveryTime: 'Within 120 minutes (Express EV Courier)',
          carrier: 'FlamGo Clean Fleet (EV-Van #09)',
          trackingNumber: `FLAM-${newOrderId}-EXPRESS`,
          deliveryLocation: '742 Evergreen Pike, Seattle, WA 98101'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setAvatarState('speaking');
    const spokenSummary = products.length > 1
      ? `Done Alex! I've added both the Nordic Oak Chair and Lumina Task Lamp to your cart and confirmed your VIP voice order. Express 2-Hour Courier delivery is on the way!`
      : `Order confirmed! I have placed your order for ${products[0].name} for $${products[0].price.toFixed(2)}. Express 2-Hour Courier delivery is dispatched with tracking ID ${newOrderId}.`;

    speakAriaVoice(spokenSummary);
    setPendingProposal(null);
  };

  // Avatar executes Optical Return
  const executeVoiceReturn = (orderId: string = 'ORD-99482', reason: string = 'Surface scuff, never worn with tags intact.') => {
    const product = customerProfile.lastOrder;

    setAvatarVoiceMessages(prev => [
      ...prev,
      {
        id: `voice-ret-scan-${Date.now()}`,
        sender: 'aria',
        text: `🔍 **Optical Scanner Active:** Running camera verification on order **#${orderId}** (${product.name}). Reason: *"${reason}"*`,
        actionType: 'return',
        returnCard: {
          orderId,
          productName: product.name,
          price: product.price,
          image: product.image,
          status: 'scanning',
          reason,
          authenticityScore: 98.6,
          conditionGrade: 'Scanning...',
          refundAmount: product.price
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setAvatarState('thinking');

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('flamgo_orders') || '[]');
        const updated = existing.map((o: any) => o.orderId === orderId ? { ...o, status: 'Returned & Refunded ($ Store Credit)' } : o);
        localStorage.setItem('flamgo_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.warn('Storage error:', e);
      }

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#10b981', '#38bdf8']
      });

      const approvalText = `✅ **Return Approved!**\n\n• **Item:** ${product.name}\n• **Authenticity:** Verified Authentic (Grade A)\n• **Resolution:** **$${product.price.toFixed(2)} Store Credit** credited to your account immediately.`;

      setAvatarVoiceMessages(prev => [
        ...prev,
        {
          id: `voice-ret-app-${Date.now()}`,
          sender: 'aria',
          text: approvalText,
          actionType: 'return',
          returnCard: {
            orderId,
            productName: product.name,
            price: product.price,
            image: product.image,
            status: 'approved',
            reason,
            authenticityScore: 98.6,
            conditionGrade: 'Grade A (Pristine)',
            refundAmount: product.price
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setAvatarState('speaking');
      speakAriaVoice(`Your return for ${product.name} has been verified and approved. An instant refund of $${product.price.toFixed(2)} has been credited to your saved account!`);
      setPendingProposal(null);
    }, 1200);
  };

  // =========================================================================
  // NATURAL MULTI-TURN CONVERSATION HANDLER (AVATAR VOICE & PROMPTS)
  // =========================================================================
  const handleAvatarVoiceInput = (spokenText: string) => {
    const rawInput = spokenText.trim();
    if (!rawInput) return;

    const userMsg: VoiceSessionMessage = {
      id: `v-user-${Date.now()}`,
      sender: 'user',
      text: rawInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAvatarVoiceMessages(prev => [...prev, userMsg]);
    setAvatarState('thinking');

    // 1. Silent backend guardrail check
    const guardrail = evaluateGuardrailSilently(rawInput);
    if (!guardrail.isSafe) {
      setTimeout(() => {
        const deflection = guardrail.deflection || "I apologize, but I cannot fulfill that request.";
        setAvatarVoiceMessages(prev => [
          ...prev,
          {
            id: `v-deflect-${Date.now()}`,
            sender: 'aria',
            text: deflection,
            actionType: 'deflection',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setAvatarState('speaking');
        speakAriaVoice(deflection);
      }, 400);
      return;
    }

    const lower = rawInput.toLowerCase();

    // 2. Multi-turn confirmation check (resolves affirmative responses to pending proposals)
    // Matches: "Yes please add the court..." (phonetic ASR typo), "yes please", "sure", "add to cart", "confirm"
    const isAffirmative = 
      lower.includes('yes') || 
      lower.includes('sure') || 
      lower.includes('please') || 
      lower.includes('confirm') || 
      lower.includes('proceed') || 
      lower.includes('court') || // ASR error for "cart"
      lower.includes('cart') || 
      lower.includes('add') || 
      lower.includes('place') || 
      lower.includes('buy it') ||
      lower.includes('order it') ||
      lower.includes('do it');

    if (pendingProposal && isAffirmative) {
      setTimeout(() => {
        executeVoiceOrder(pendingProposal.items);
      }, 500);
      return;
    }

    // 3. User says "Hello" or friendly greeting:
    // REAL CONVERSATION: Greets warmly, does NOT force a pre-canned product proposal!
    const isGreeting = /^(hello|hi|hey|good morning|good afternoon|good evening|howdy)/i.test(lower);
    if (isGreeting && !lower.includes('recommend') && !lower.includes('suggest') && !lower.includes('order') && !lower.includes('search')) {
      setTimeout(() => {
        const greetingReply = `👋 Hello Alex! Great to see you. How can I help you today?\n\nWould you like curated design recommendations for your home, help finding a specific product, or to track an order?`;
        
        setAvatarVoiceMessages(prev => [
          ...prev,
          {
            id: `voice-greet-${Date.now()}`,
            sender: 'aria',
            text: greetingReply,
            actionType: 'general',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        setAvatarState('speaking');
        speakAriaVoice(`Hello Alex! Great to see you. How can I help you today? Would you like curated design recommendations for your home, help finding a specific product, or to track an order?`);
      }, 500);
      return;
    }

    // 4. User asks for recommendations:
    // e.g. "recommend", "suggest", "scandinavian", "what do you recommend", "home office recommendations"
    if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('scandinavian') || lower.includes('taste profile') || lower.includes('what should i get')) {
      setTimeout(() => {
        const proposalItems = [scandinavianChair, luminaLamp];
        const bundleTotal = scandinavianChair.price + luminaLamp.price;

        setPendingProposal({
          type: 'bundle',
          title: 'Scandinavian Ergonomic Workspace Pairing',
          items: proposalItems,
          total: bundleTotal
        });

        const reply = `Alex, based on your Gold VIP taste profile in Scandinavian design, I recommend pairing the **${scandinavianChair.name} ($${scandinavianChair.price.toFixed(2)})** with our **${luminaLamp.name} ($${luminaLamp.price.toFixed(2)})**.\n\nWould you like me to place the voice order for you?`;

        setAvatarVoiceMessages(prev => [
          ...prev,
          {
            id: `voice-rec-${Date.now()}`,
            sender: 'aria',
            text: reply,
            actionType: 'recommendation',
            items: proposalItems,
            pendingProposal: {
              type: 'bundle',
              title: 'Scandinavian Ergonomic Workspace Pairing',
              items: proposalItems,
              total: bundleTotal
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        setAvatarState('speaking');
        speakAriaVoice(`Alex, based on your Gold VIP taste profile in Scandinavian design, I recommend pairing the Nordic Oak Ergonomic Chair ($249.00) with our Lumina Architect Task Lamp ($89.00). Would you like me to place the voice order for you?`);
      }, 600);
      return;
    }

    // 5. User requests return
    if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
      setTimeout(() => {
        executeVoiceReturn('ORD-99482', rawInput.length > 15 ? rawInput : 'Superficial scuff on package, tags intact.');
      }, 600);
      return;
    }

    // 6. Direct product order request
    if (lower.includes('order') || lower.includes('buy') || lower.includes('purchase')) {
      setTimeout(() => {
        let targetProduct = scandinavianChair;

        if (lower.includes('lamp') || lower.includes('light')) {
          targetProduct = luminaLamp;
        } else if (lower.includes('espresso') || lower.includes('barista') || lower.includes('coffee')) {
          targetProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-251') || MOCK_PRODUCTS.find(p => p.id === 'prod-402') || targetProduct;
        } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('anc')) {
          targetProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-101') || targetProduct;
        } else if (lower.includes('keyboard')) {
          targetProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-104') || targetProduct;
        } else if (lower.includes('pack') || lower.includes('backpack') || lower.includes('laptop')) {
          targetProduct = MOCK_PRODUCTS.find(p => p.id === 'prod-003') || targetProduct;
        }

        executeVoiceOrder([targetProduct]);
      }, 600);
      return;
    }

    // 7. Conversational search via voice with Semantic Catalog Engine
    setTimeout(() => {
      const searchResult = SemanticCatalogEngine.processQuery(rawInput, chatSearchContext);
      setChatSearchContext({
        lastTopic: searchResult.identifiedCategory || searchResult.headline,
        lastCategory: searchResult.identifiedCategory || chatSearchContext.lastCategory,
        lastBudget: searchResult.activeBudget || chatSearchContext.lastBudget,
        lastProduct: searchResult.products[0] || chatSearchContext.lastProduct
      });

      setAvatarVoiceMessages(prev => [
        ...prev,
        {
          id: `voice-search-${Date.now()}`,
          sender: 'aria',
          text: searchResult.responseText,
          actionType: 'search',
          items: searchResult.products,
          researchBadge: searchResult.researchBadge,
          specResearchBrief: searchResult.specResearchBrief,
          comparisonMatrix: searchResult.comparisonMatrix,
          suggestedPrompts: searchResult.suggestedPrompts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setAvatarState('speaking');
      const spokenSummary = searchResult.headline 
        ? `${searchResult.headline}. ${searchResult.responseText.replace(/\*\*/g, '').replace(/•/g, '').slice(0, 130)}` 
        : searchResult.responseText.replace(/\*\*/g, '').replace(/•/g, '').slice(0, 140);
      speakAriaVoice(spokenSummary);
    }, 600);
  };

  useEffect(() => {
    voiceBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [avatarVoiceMessages]);

  // =========================================================================
  // FEATURE 3: DOMS WISMO & VISION AI
  // =========================================================================
  const [wismoId, setWismoId] = useState('ORD-99482');
  const [wismoData, setWismoData] = useState<any>(null);

  const handleQueryDOMS = () => {
    setWismoData({
      orderId: wismoId,
      status: 'OUT_FOR_DELIVERY_FINAL_MILE',
      carrier: 'FlamGo Clean Fleet (EV-Van #09)',
      driver: 'Marcus Vance (Rating: 4.98 ★)',
      liveEta: '14 minutes remaining (0.8 mi away)',
      wmsHub: 'Seattle SODO Distribution Center #402',
      items: ['Nordic Oak Ergonomic Desk Chair', 'Recycled All-Weather Backpack']
    });
  };

  // =========================================================================
  // FEATURE 4: VIP CONCIERGE CARE (CUSTOMER-FIRST, WARM & NON-TECHNICAL)
  // =========================================================================
  const [whatsappChat, setWhatsappChat] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hi Alex! 👋 We have your Nordic Oak Ergonomic Desk Chair ($249.00) saved in your cart. Did you have any quick questions about same-day Seattle delivery, assembly, or exclusive VIP savings before completing your order?',
      time: '10:14 AM'
    }
  ]);

  const handleResolveConciergeInquiry = (inquiryType: 'assembly' | 'delivery' | 'pricing') => {
    let userText = '';
    let botReply = '';

    if (inquiryType === 'assembly') {
      userText = 'How easy is it to set up this chair at home?';
      botReply = '🛠️ Great news, Alex! The Nordic Oak chair arrives 90% pre-assembled in the box. Everything you need is included, and it takes under 5 minutes to set up with our quick-lock tool.';
    } else if (inquiryType === 'delivery') {
      userText = 'Can I receive this delivered to my home today?';
      botReply = '⚡ Yes! As a Gold VIP customer in Seattle, you receive complimentary same-day delivery via our Clean Fleet EV couriers. It can be at your door within 120 minutes with zero courier fee.';
    } else {
      userText = 'Are there any member discounts or vouchers available?';
      botReply = '🎁 Absolutely, Alex! As our Gold VIP member, I can apply a direct $20 voucher code "OAK20" to your cart right now, bringing your total to just $229.00 with free delivery.';
    }

    setWhatsappChat(prev => [
      ...prev,
      { sender: 'user', text: userText, time: '10:15 AM' },
      { sender: 'bot', text: botReply, time: '10:15 AM' }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. CLEAN RETAIL HEADER BANNER */}
      {!isModal && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid #334155',
          borderRadius: '18px',
          padding: '1.5rem 2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Sparkles size={14} />
              <span>Personalized for {customerProfile.name} • {customerProfile.tier}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem 0', lineHeight: 1.2 }}>
              Conversational eCommerce Suite
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.5, margin: 0, maxWidth: '640px' }}>
              Search across 500+ Seattle catalog items by name or budget, get Scandinavian design recommendations, and buy using 1-click add to cart.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', border: '1px solid rgba(255,255,255,0.15)' }}>
              ⚡ Seattle Flagship Active
            </span>
          </div>
        </div>
      )}

      {/* 2. INDEPENDENT FEATURE SELECTOR SWITCHER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '0.9rem 1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Active Feature:</span>
          <span style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 700 }}>
            {activeFeature === 'text-chat' && '💬 Text Shopping Assistant (Multi-Turn Catalog & Budget Search)'}
            {activeFeature === 'voice-avatar' && '🎙️ Intelligence Avatar Aria (Voice Orders, Returns & Recommendations)'}
            {activeFeature === 'doms-wismo' && '📦 DOMS Telematics & Vision AI'}
            {activeFeature === 'whatsapp' && '💬 VIP Concierge Assistance'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFeature('text-chat')}
            style={{
              background: activeFeature === 'text-chat' ? '#2563eb' : '#f8fafc',
              color: activeFeature === 'text-chat' ? '#ffffff' : '#475569',
              border: activeFeature === 'text-chat' ? '1px solid #2563eb' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            💬 Text Chat Assistant
          </button>

          <button
            onClick={() => setActiveFeature('voice-avatar')}
            style={{
              background: activeFeature === 'voice-avatar' ? '#7c3aed' : '#f8fafc',
              color: activeFeature === 'voice-avatar' ? '#ffffff' : '#475569',
              border: activeFeature === 'voice-avatar' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Mic size={13} />
            <span>🎙️ Intelligence Avatar (Voice Orders & Returns)</span>
          </button>

          <button
            onClick={() => setActiveFeature('doms-wismo')}
            style={{
              background: activeFeature === 'doms-wismo' ? '#16a34a' : '#f8fafc',
              color: activeFeature === 'doms-wismo' ? '#ffffff' : '#475569',
              border: activeFeature === 'doms-wismo' ? '1px solid #16a34a' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📦 DOMS & Returns
          </button>

          <button
            onClick={() => setActiveFeature('whatsapp')}
            style={{
              background: activeFeature === 'whatsapp' ? '#ea580c' : '#f8fafc',
              color: activeFeature === 'whatsapp' ? '#ffffff' : '#475569',
              border: activeFeature === 'whatsapp' ? '1px solid #ea580c' : '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            💬 VIP Concierge Support
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: DEDICATED INDEPENDENT TEXT CHAT COMMERCE ASSISTANT             */}
      {/* ========================================================================= */}
      {activeFeature === 'text-chat' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.75rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MessageSquare size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Text Shopping Assistant
                </h3>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Type naturally to research products, filter by budget, inspect full specifications, and add items to cart with 1 click.
              </p>
            </div>

            <button
              onClick={() => setActiveFeature('voice-avatar')}
              style={{
                background: '#faf5ff',
                color: '#7c3aed',
                border: '1px solid #d8b4fe',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Mic size={14} color="#7c3aed" />
              <span>Switch to Intelligence Avatar (Voice Orders)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Quick Helpful Customer Questions */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Try Asking:</span>
            <button
              onClick={() => handleSendTextChat('can I order a laptop')}
              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              💻 "can I order a laptop"
            </button>
            <button
              onClick={() => handleSendTextChat('less $500 usd')}
              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              💰 "less $500 usd"
            </button>
            <button
              onClick={() => handleSendTextChat('Will this espresso machine fit under 15-inch cabinets?')}
              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              📐 "Will espresso machine fit under 15-inch cabinets?"
            </button>
            <button
              onClick={() => handleSendTextChat('Recommend an ergonomic desk chair')}
              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              🛋️ "Recommend ergonomic chair"
            </button>
          </div>

          {/* Text Chat History */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem',
            minHeight: '340px',
            maxHeight: '480px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {textMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.4rem',
                  width: '100%'
                }}
              >
                <div style={{
                  maxWidth: msg.sender === 'user' ? '75%' : '85%',
                  padding: '0.85rem 1.15rem',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>

                {/* AI Research Insight Badge */}
                {msg.researchBadge && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                    border: '1px solid #c4b5fd',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: '#6d28d9',
                    marginTop: '0.15rem',
                    boxShadow: '0 1px 3px rgba(109, 40, 217, 0.08)'
                  }}>
                    <Sparkles size={12} color="#7c3aed" />
                    <span>🎯 {msg.researchBadge.affinityScore}% Semantic Affinity</span>
                    <span style={{ color: '#a78bfa' }}>•</span>
                    <span>{msg.researchBadge.matchConcept}</span>
                    <span style={{ color: '#a78bfa' }}>•</span>
                    <span style={{ color: '#475569' }}>{msg.researchBadge.inventoryOrigin}</span>
                  </div>
                )}

                {/* Verified Technical & Dimensional Spec Brief */}
                {msg.specResearchBrief && (
                  <div style={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '0.9rem 1.15rem',
                    color: '#f8fafc',
                    width: '100%',
                    maxWidth: '560px',
                    marginTop: '0.35rem',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                      <ShieldCheck size={14} color="#38bdf8" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Dimensions & Key Specifications
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                      {msg.specResearchBrief.verifiedMetric}
                    </div>

                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {msg.specResearchBrief.details.map((d, i) => (
                        <li key={i} style={{ marginBottom: '0.2rem' }}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Side-by-Side Spec Comparison Matrix */}
                {msg.comparisonMatrix && (
                  <div style={{
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.9rem 1.1rem',
                    width: '100%',
                    maxWidth: '560px',
                    marginTop: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      <Zap size={15} color="#2563eb" />
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Side-by-Side Spec Matrix</strong>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.775rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '0.45rem', textAlign: 'left', color: '#64748b' }}>Aspect</th>
                            <th style={{ padding: '0.45rem', textAlign: 'left', color: '#2563eb' }}>{msg.comparisonMatrix.itemA.name.slice(0, 18)}...</th>
                            <th style={{ padding: '0.45rem', textAlign: 'left', color: '#7c3aed' }}>{msg.comparisonMatrix.itemB.name.slice(0, 18)}...</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.comparisonMatrix.differences.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '0.45rem', fontWeight: 700, color: '#334155' }}>{row.aspect}</td>
                              <td style={{ padding: '0.45rem', color: '#0f172a' }}>{row.valA}</td>
                              <td style={{ padding: '0.45rem', color: '#0f172a' }}>{row.valB}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p style={{ margin: '0.65rem 0 0', fontSize: '0.775rem', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      💡 {msg.comparisonMatrix.verdict}
                    </p>
                  </div>
                )}

                {/* Items in Text Chat with Look at Details & 1-Click Cart */}
                {msg.items && msg.items.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', width: '100%', maxWidth: '560px', marginTop: '0.25rem' }}>
                    {msg.items.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={it.image} alt={it.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: '0.825rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                              <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 800 }}>${it.price.toFixed(2)}</span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>★ {it.rating}</span>
                              <span style={{ fontSize: '0.675rem', background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#475569' }}>Stock: {it.stock}</span>
                            </div>
                          </div>
                        </div>

                        {it.features && it.features.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {it.features.slice(0, 2).map((feat, fi) => (
                              <span key={fi} style={{ fontSize: '0.65rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                {feat.length > 30 ? feat.slice(0, 28) + '...' : feat}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setInspectingProduct(it)}
                            style={{
                              flex: 1,
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Eye size={12} />
                            <span>Look at Details</span>
                          </button>

                          <button
                            onClick={() => handleItemAddToCart(it)}
                            style={{
                              flex: 1,
                              background: addedProductIds[it.id] ? '#16a34a' : '#2563eb',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#ffffff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {addedProductIds[it.id] ? <Check size={12} /> : <ShoppingBag size={12} />}
                            <span>{addedProductIds[it.id] ? '✓ Added' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Clickable Suggested Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: '560px', marginTop: '0.35rem' }}>
                    {msg.suggestedPrompts.map((promptText, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendTextChat(promptText)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '9999px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>{promptText}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTextChatTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem' }}>
                <RefreshCw size={14} className="animate-spin" />
                <span>Text Assistant searching catalog...</span>
              </div>
            )}
            <div ref={textChatBottomRef} />
          </div>

          {/* Text Input Row */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search products or ask: 'can I order a laptop', 'under $500', 'desk chairs'..."
              value={textChatInput}
              onChange={(e) => setTextChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTextChat()}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={() => handleSendTextChat()}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 2: INDEPENDENT INTELLIGENCE AVATAR (NATURAL MULTI-TURN COMMERCE)  */}
      {/* ========================================================================= */}
      {activeFeature === 'voice-avatar' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT: LIVE INTELLIGENCE AVATAR VOICE WORKSPACE */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #e9d5ff',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            
            {/* AVATAR HERO PRESENCE */}
            <div style={{
              background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: avatarState === 'listening' ? 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)' :
                                avatarState === 'speaking' ? 'radial-gradient(circle, #10b981 0%, #047857 100%)' :
                                avatarState === 'thinking' ? 'radial-gradient(circle, #a855f7 0%, #7e22ce 100%)' :
                                'radial-gradient(circle, #8b5cf6 0%, #6d28d9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    boxShadow: avatarState === 'listening' ? '0 0 24px rgba(239, 68, 68, 0.8)' :
                               avatarState === 'speaking' ? '0 0 24px rgba(16, 185, 129, 0.8)' :
                               avatarState === 'thinking' ? '0 0 24px rgba(168, 85, 247, 0.8)' :
                               '0 0 16px rgba(139, 92, 246, 0.5)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Bot size={30} />
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: avatarState === 'listening' ? '#ef4444' :
                                avatarState === 'speaking' ? '#10b981' :
                                avatarState === 'thinking' ? '#a855f7' : '#22c55e',
                    border: '2px solid #2e1065'
                  }} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>Aria</strong>
                    <span style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>• Intelligence Shopping Avatar</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      background: avatarState === 'listening' ? '#fecaca' :
                                  avatarState === 'speaking' ? '#dcfce7' :
                                  avatarState === 'thinking' ? '#f3e8ff' : 'rgba(255,255,255,0.15)',
                      color: avatarState === 'listening' ? '#b91c1c' :
                             avatarState === 'speaking' ? '#15803d' :
                             avatarState === 'thinking' ? '#6d28d9' : '#e9d5ff'
                    }}>
                      {avatarState === 'listening' ? '🎙️ Listening via Mic' :
                       avatarState === 'speaking' ? '🔊 Speaking Aloud' :
                       avatarState === 'thinking' ? '⚡ Thinking...' : '🟢 Ready for Voice'}
                    </span>
                  </div>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#c4b5fd' }}>
                    Conversational voice shopping: Speaks naturally, remembers dialogue context, and places 1-click orders.
                  </p>
                </div>
              </div>

              {isAvatarSpeaking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.75rem', borderRadius: '10px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#34d399', borderRadius: '2px', animation: 'pulse 0.6s infinite' }} />
                  <div style={{ width: '3px', height: '24px', background: '#34d399', borderRadius: '2px', animation: 'pulse 0.4s infinite' }} />
                  <div style={{ width: '3px', height: '12px', background: '#34d399', borderRadius: '2px', animation: 'pulse 0.8s infinite' }} />
                  <div style={{ width: '3px', height: '20px', background: '#34d399', borderRadius: '2px', animation: 'pulse 0.5s infinite' }} />
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, marginLeft: '0.35rem' }}>Aria Speaking...</span>
                </div>
              )}
            </div>

            {/* MULTI-TURN CONTEXT BANNER (Active only when a recommendation is pending) */}
            {pendingProposal && (
              <div style={{
                background: '#fdf4ff',
                border: '1.5px solid #f0abfc',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fae8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c026d3' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#86198f', textTransform: 'uppercase' }}>
                      Active Proposal: {pendingProposal.title}
                    </span>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>
                      Total: ${pendingProposal.total.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button
                    onClick={() => handleAvatarVoiceInput("Yes please add the court...")}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.775rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Check size={14} />
                    <span>"Yes please add to cart"</span>
                  </button>
                  <button
                    onClick={() => setPendingProposal(null)}
                    style={{
                      background: 'transparent',
                      color: '#64748b',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* REALISTIC CUSTOMER VOICE PROMPTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                  Suggested Voice Commands:
                </span>
                <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>
                  Tap to speak to Aria
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAvatarVoiceInput("Hello")}
                  style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>"Hello"</span>
                </button>

                <button
                  onClick={() => handleAvatarVoiceInput("Suggest Scandinavian design recommendations for my space")}
                  style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#6d28d9', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={13} color="#7c3aed" />
                  <span>"Suggest Scandinavian recommendations"</span>
                </button>

                <button
                  onClick={() => handleAvatarVoiceInput("Yes please add the court...")}
                  style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Check size={13} color="#10b981" />
                  <span>"Yes please add the court..."</span>
                </button>

                <button
                  onClick={() => handleAvatarVoiceInput("Order the Barista Pro espresso machine")}
                  style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Zap size={13} color="#2563eb" />
                  <span>"Order Barista Pro"</span>
                </button>

                <button
                  onClick={() => handleAvatarVoiceInput("I want to return order ORD-99482")}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <RotateCcw size={13} color="#dc2626" />
                  <span>"Return order ORD-99482"</span>
                </button>
              </div>
            </div>

            {/* Voice Conversation Stream */}
            <div style={{
              background: '#fcfaff',
              border: '1px solid #ede9fe',
              borderRadius: '16px',
              padding: '1.25rem',
              minHeight: '360px',
              maxHeight: '520px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              {avatarVoiceMessages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.5rem',
                    width: '100%'
                  }}
                >
                  <div style={{
                    maxWidth: msg.sender === 'user' ? '78%' : '88%',
                    padding: '0.95rem 1.25rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: msg.sender === 'user' ? '#7c3aed' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    fontSize: '0.875rem',
                    lineHeight: 1.55,
                    border: msg.sender === 'user' ? 'none' : '1px solid #e9d5ff',
                    boxShadow: '0 2px 6px rgba(124, 58, 237, 0.04)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>

                  {/* AI Research Insight Badge in Voice Stream */}
                  {msg.researchBadge && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                      border: '1px solid #c4b5fd',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: '#6d28d9',
                      marginTop: '0.15rem',
                      boxShadow: '0 1px 3px rgba(109, 40, 217, 0.08)'
                    }}>
                      <Sparkles size={12} color="#7c3aed" />
                      <span>🎯 {msg.researchBadge.affinityScore}% Semantic Affinity</span>
                      <span style={{ color: '#a78bfa' }}>•</span>
                      <span>{msg.researchBadge.matchConcept}</span>
                      <span style={{ color: '#a78bfa' }}>•</span>
                      <span style={{ color: '#475569' }}>{msg.researchBadge.inventoryOrigin}</span>
                    </div>
                  )}

                  {/* Verified Spec & Clearance Brief in Voice Stream */}
                  {msg.specResearchBrief && (
                    <div style={{
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      color: '#f8fafc',
                      width: '100%',
                      maxWidth: '560px',
                      marginTop: '0.35rem',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                        <ShieldCheck size={14} color="#38bdf8" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Product Dimensions & Key Specifications
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                        {msg.specResearchBrief.verifiedMetric}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        {msg.specResearchBrief.details.map((d, i) => (
                          <li key={i} style={{ marginBottom: '0.2rem' }}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Side-by-Side Spec Comparison Matrix in Voice Stream */}
                  {msg.comparisonMatrix && (
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '0.9rem 1.1rem',
                      width: '100%',
                      maxWidth: '560px',
                      marginTop: '0.35rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                        <Zap size={15} color="#7c3aed" />
                        <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Side-by-Side Spec Matrix</strong>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.775rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                              <th style={{ padding: '0.45rem', textAlign: 'left', color: '#64748b' }}>Aspect</th>
                              <th style={{ padding: '0.45rem', textAlign: 'left', color: '#2563eb' }}>{msg.comparisonMatrix.itemA.name.slice(0, 18)}...</th>
                              <th style={{ padding: '0.45rem', textAlign: 'left', color: '#7c3aed' }}>{msg.comparisonMatrix.itemB.name.slice(0, 18)}...</th>
                            </tr>
                          </thead>
                          <tbody>
                            {msg.comparisonMatrix.differences.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.45rem', fontWeight: 700, color: '#334155' }}>{row.aspect}</td>
                                <td style={{ padding: '0.45rem', color: '#0f172a' }}>{row.valA}</td>
                                <td style={{ padding: '0.45rem', color: '#0f172a' }}>{row.valB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p style={{ margin: '0.65rem 0 0', fontSize: '0.775rem', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        💡 {msg.comparisonMatrix.verdict}
                      </p>
                    </div>
                  )}

                  {/* Interactive Product Cards in Voice Stream */}
                  {msg.items && msg.items.length > 0 && !msg.orderReceipt && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '0.85rem',
                      width: '100%',
                      maxWidth: '560px',
                      marginTop: '0.2rem'
                    }}>
                      {msg.items.map((prod) => (
                        <div
                          key={prod.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '12px',
                            padding: '0.9rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.65rem',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prod.name}
                              </strong>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                                <span style={{ fontSize: '0.925rem', fontWeight: 800, color: '#16a34a' }}>
                                  ${prod.price.toFixed(2)}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                  ★ {prod.rating} ({prod.reviewsCount})
                                </span>
                                <span style={{ fontSize: '0.675rem', background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#475569' }}>
                                  Stock: {prod.stock}
                                </span>
                              </div>
                            </div>
                          </div>

                          {prod.features && prod.features.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {prod.features.slice(0, 2).map((feat, fi) => (
                                <span key={fi} style={{ fontSize: '0.65rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                  {feat.length > 30 ? feat.slice(0, 28) + '...' : feat}
                                </span>
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '0.45rem', marginTop: 'auto' }}>
                            <button
                              onClick={() => setInspectingProduct(prod)}
                              style={{
                                flex: 1,
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                padding: '0.4rem 0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <Eye size={13} />
                              <span>Look at Details</span>
                            </button>

                            <button
                              onClick={() => handleItemAddToCart(prod)}
                              style={{
                                flex: 1,
                                background: addedProductIds[prod.id] ? '#16a34a' : '#7c3aed',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.4rem 0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.3rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {addedProductIds[prod.id] ? <Check size={13} /> : <ShoppingBag size={13} />}
                              <span>{addedProductIds[prod.id] ? '✓ In Cart' : '1-Click Add'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Clickable Suggested Prompts for Voice */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && !msg.orderReceipt && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: '560px', marginTop: '0.35rem' }}>
                      {msg.suggestedPrompts.map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleAvatarVoiceInput(promptText)}
                          style={{
                            background: '#faf5ff',
                            border: '1px solid #ddd6fe',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            color: '#6d28d9',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <span>{promptText}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Order Receipt Card */}
                  {msg.orderReceipt && (
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #86efac',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      width: '100%',
                      maxWidth: '520px',
                      boxShadow: '0 4px 16px rgba(22, 163, 74, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={13} />
                          <span>Voice Order Confirmed • #{msg.orderReceipt.orderId}</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Visa •••• 4242</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {msg.orderReceipt.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <div style={{ flexGrow: 1 }}>
                              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{item.name}</strong>
                              <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#16a34a' }}>${item.price.toFixed(2)}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                              ✓ Added to Cart
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Charged (Gold VIP):</span>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>${msg.orderReceipt.total.toFixed(2)}</strong>
                      </div>

                      {onNavigateView && (
                        <button
                          onClick={() => onNavigateView('gps')}
                          style={{
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.6rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <MapPin size={14} />
                          <span>Track Express Courier on Live GPS</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Optical Return Card */}
                  {msg.returnCard && (
                    <div style={{
                      background: msg.returnCard.status === 'approved' ? '#f0fdf4' : '#ffffff',
                      border: msg.returnCard.status === 'approved' ? '1.5px solid #86efac' : '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      width: '100%',
                      maxWidth: '500px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: msg.returnCard.status === 'approved' ? '#dcfce7' : '#fee2e2',
                          color: msg.returnCard.status === 'approved' ? '#166534' : '#b91c1c'
                        }}>
                          {msg.returnCard.status === 'approved' ? '✓ Instant Store Credit Issued' : '📷 Scanning Item...'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Order #{msg.returnCard.orderId}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <img
                          src={msg.returnCard.image}
                          alt={msg.returnCard.productName}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block' }}>{msg.returnCard.productName}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Reason: "{msg.returnCard.reason}"</span>
                          {msg.returnCard.status === 'approved' && (
                            <div style={{ marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>
                                +${msg.returnCard.refundAmount.toFixed(2)} Store Credit
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
              <div ref={voiceBottomRef} />
            </div>

            {/* LIVE VOICE RECORDING CONTROLLER */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #ddd6fe',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: isAvatarListening ? '0 0 16px rgba(239, 68, 68, 0.25)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button
                  onClick={toggleAvatarMic}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: isAvatarListening ? '#dc2626' : '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isAvatarListening ? '0 0 16px rgba(220, 38, 38, 0.5)' : '0 4px 12px rgba(124, 58, 237, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                  title={isAvatarListening ? 'Listening... click to stop' : 'Click to Speak via Microphone'}
                >
                  {isAvatarListening ? <MicOff size={25} /> : <Mic size={25} />}
                </button>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                    {isAvatarListening ? '🎙️ Listening to your voice now...' : 'Tap the Mic to Speak to Aria'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Say: "Hello" • "Suggest recommendations" • "Yes please add to cart" • "Return order"
                  </span>
                </div>
              </div>

              {isAvatarSpeaking && (
                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsAvatarSpeaking(false);
                  }}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Stop Audio
                </button>
              )}
            </div>

            {voiceSpeechError && (
              <span style={{ fontSize: '0.75rem', color: '#ea580c' }}>{voiceSpeechError}</span>
            )}
          </div>

          {/* RIGHT: HYPER-PERSONALIZATION INTELLIGENCE CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.35rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Aria Personalization Engine
                </span>
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.675rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                  VIP Gold Profile
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', fontWeight: 800, fontSize: '1rem', border: '1px solid #ddd6fe' }}>
                  AR
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{customerProfile.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Seattle, WA • CLV: {customerProfile.clv}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Aesthetic Affinity</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#6d28d9' }}>
                  {customerProfile.topAffinity}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Taste Affinity Scores</span>
                {customerProfile.affinityScores.map((aff, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', marginBottom: '0.15rem' }}>
                      <span>{aff.category}</span>
                      <strong style={{ color: '#0f172a' }}>{aff.score}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${aff.score}%`,
                        height: '100%',
                        background: i === 0 ? '#7c3aed' : i === 1 ? '#2563eb' : i === 2 ? '#ea580c' : '#16a34a',
                        borderRadius: '9999px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Optical Return Trigger Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, fontSize: '0.85rem' }}>
                  <RotateCcw size={15} color="#ea580c" />
                  <span>Recent Purchase Return</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>#{customerProfile.lastOrder.id}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={customerProfile.lastOrder.image}
                  alt={customerProfile.lastOrder.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#0f172a', display: 'block' }}>{customerProfile.lastOrder.name}</strong>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>${customerProfile.lastOrder.price.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleAvatarVoiceInput(`Return order ${customerProfile.lastOrder.id}`)}
                style={{
                  background: '#ffffff',
                  color: '#b91c1c',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Camera size={13} />
                <span>Voice Return with Optical Scan</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: DOMS WISMO & VISION AI                                         */}
      {/* ========================================================================= */}
      {activeFeature === 'doms-wismo' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div>
            <span className="badge badge-green">DOMS & WMS Direct API Integration</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem 0' }}>
              Autonomous WISMO Query & Vision AI Return Triage
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Test autonomous post-purchase resolution connecting live order fulfillment ledgers and computer vision verification.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>Query Order ID in DOMS:</span>
              <input
                type="text"
                value={wismoId}
                onChange={(e) => setWismoId(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
              />
              <button onClick={handleQueryDOMS} className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}>
                <Search size={14} />
                <span>Execute Real-Time API Query</span>
              </button>
            </div>

            {wismoData && (
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>DOMS DISPATCH STATUS</span>
                  <strong style={{ color: '#16a34a', fontSize: '0.95rem' }}>⚡ {wismoData.status}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>COURIER FLEET & DRIVER</span>
                  <strong style={{ color: '#0f172a' }}>{wismoData.driver}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>WMS ORIGIN</span>
                  <strong style={{ color: '#0f172a' }}>{wismoData.wmsHub}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>TELEMATICS ETA</span>
                  <strong style={{ color: '#2563eb' }}>{wismoData.liveEta}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 4: VIP CONCIERGE CARE (CUSTOMER-FIRST, WARM & REFINED COPYWRITING) */}
      {/* ========================================================================= */}
      {activeFeature === 'whatsapp' && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Phone UI Simulator */}
          <div style={{
            background: '#0b141a',
            borderRadius: '24px',
            padding: '1.25rem',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            maxWidth: '420px',
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #202c33', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>
                FG
              </div>
              <div>
                <strong style={{ fontSize: '0.925rem', color: '#e9edef', display: 'block' }}>FlamGo VIP Concierge</strong>
                <span style={{ fontSize: '0.7rem', color: '#25d366' }}>● Dedicated Personal Shopping Assistant</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: '260px' }}>
              {whatsappChat.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === 'user' ? '#005c4b' : '#202c33',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    lineHeight: 1.4,
                    color: '#e9edef'
                  }}
                >
                  <p style={{ margin: 0 }}>{m.text}</p>
                  <span style={{ fontSize: '0.65rem', color: '#8696a0', float: 'right', marginTop: '0.2rem' }}>{m.time}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', background: '#202c33', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#8696a0', display: 'block', marginBottom: '0.35rem' }}>Exclusive VIP Member Checkout:</span>
              <button
                onClick={() => alert('1-Tap Checkout Token Confirmed: $229.00 charged to saved Visa ending 4242. Order prepared at Seattle Flagship with $20 VIP Voucher!')}
                style={{
                  background: '#25d366',
                  color: '#0b141a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Apply $20 VIP Voucher & Complete Order ($229.00)
              </button>
            </div>
          </div>

          {/* Customer-First VIP Concierge Assistant Topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="badge badge-orange" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
                ✨ 24/7 VIP Concierge Support
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0.25rem 0' }}>
                Personalized Shopping & Order Assistance
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Have questions before completing your order? Chat with our Seattle Flagship concierge for instant answers on home assembly, same-day delivery, and VIP rewards.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => handleResolveConciergeInquiry('assembly')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.9rem 1.15rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.875rem' }}>
                    🛠️ Easy 5-Minute Home Assembly
                  </strong>
                  <span style={{ color: '#64748b' }}>"How easy is it to set up this chair at home?"</span>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </button>

              <button
                onClick={() => handleResolveConciergeInquiry('delivery')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.9rem 1.15rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.875rem' }}>
                    ⚡ Same-Day Express Delivery in Seattle
                  </strong>
                  <span style={{ color: '#64748b' }}>"Can I receive this delivered to my home today?"</span>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </button>

              <button
                onClick={() => handleResolveConciergeInquiry('pricing')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.9rem 1.15rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.875rem' }}>
                    🎁 Exclusive VIP Welcome Voucher
                  </strong>
                  <span style={{ color: '#64748b' }}>"Are there any special member discounts or vouchers available?"</span>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT DETAIL INSPECTION MODAL (Look at Product Details)                  */}
      {/* ========================================================================= */}
      {inspectingProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setInspectingProduct(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)', gap: '1.5rem', alignItems: 'start' }}>
              <img
                src={inspectingProduct.image}
                alt={inspectingProduct.name}
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '14px', border: '1px solid #e2e8f0' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {inspectingProduct.category} • SKU #{inspectingProduct.id}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                  {inspectingProduct.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a' }}>
                    ${inspectingProduct.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    ★ {inspectingProduct.rating} ({inspectingProduct.reviewsCount} verified reviews)
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content', fontWeight: 700 }}>
                  ✓ In Stock: {inspectingProduct.stock} units at Seattle Downtown Hub
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>Description</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {inspectingProduct.description}
              </p>
            </div>

            {inspectingProduct.features && inspectingProduct.features.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>Key Features & Specifications</h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#475569', lineHeight: 1.6 }}>
                  {inspectingProduct.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  handleItemAddToCart(inspectingProduct);
                  setInspectingProduct(null);
                }}
                style={{
                  flex: 1,
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShoppingBag size={16} />
                <span>1-Click Add to Cart (${inspectingProduct.price.toFixed(2)})</span>
              </button>

              <button
                onClick={() => {
                  executeVoiceOrder([inspectingProduct]);
                  setInspectingProduct(null);
                }}
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Mic size={16} />
                <span>Instant Voice Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
