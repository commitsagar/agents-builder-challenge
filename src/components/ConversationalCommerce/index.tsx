import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Bot, Truck, Smartphone, Camera, Mic, MicOff, 
  FileText, CheckCircle2, ChevronRight, Volume2, VolumeX, 
  Search, RefreshCw, Send, Check, CornerDownRight, ArrowRight,
  ShieldCheck, Info, Building2, Package, Layers, ExternalLink,
  RotateCcw
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { geminiRetailService } from '../../services/geminiService';

interface ConversationalCommerceProps {
  onAddToCart?: (product: any) => void;
  onNavigateView?: (view: string) => void;
  isB2CPersona?: boolean;
  initialUseCase?: '01' | '02' | '03' | '04' | '05';
  isModal?: boolean;
  onClose?: () => void;
}

export const ConversationalCommerce: React.FC<ConversationalCommerceProps> = ({
  onAddToCart,
  onNavigateView,
  isB2CPersona = true,
  initialUseCase = '01',
  isModal = false,
  onClose
}) => {
  const [b2cMode, setB2cMode] = useState<boolean>(isB2CPersona);
  const [activeUseCase, setActiveUseCase] = useState<'01' | '02' | '03' | '04' | '05'>(initialUseCase);

  useEffect(() => {
    setB2cMode(isB2CPersona);
  }, [isB2CPersona]);

  useEffect(() => {
    if (initialUseCase) {
      setActiveUseCase(initialUseCase);
    }
  }, [initialUseCase]);

  useEffect(() => {
    if (b2cMode && (activeUseCase === '04' || activeUseCase === '05')) {
      setActiveUseCase('01');
    }
  }, [b2cMode, activeUseCase]);

  // =========================================================================
  // USE CASE 01: GUIDED SELLING & AI SHOPPING CONCIERGE (GEMINI 3.8 & LIVE VOICE)
  // =========================================================================
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'ai' | 'user';
    text: string;
    thinking?: string;
    items?: Array<{ name: string; price: number; image: string; store?: string }>;
    timestamp: string;
  }>>([
    {
      sender: 'ai',
      text: "👋 Hi! I'm your AI Shopping Concierge running on Gemini 3.8 Flash with Live Voice. Ask me about technical fitment (e.g., 'Will this espresso machine fit under 15-inch cabinets?'), local store availability, or ask me to curate a personalized bundle for your budget.",
      thinking: "Gemini 3.8 Flash model active. Reasoning budget: 2048 tokens. Live Voice SpeechSynthesis enabled. Connected to Seattle Flagship (Store #402) inventory index.",
      timestamp: 'Just now'
    }
  ]);

  // Web Speech API references
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendChat(transcript);
        }
        setIsListeningMic(false);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
        setSpeechError('Microphone audio completed. You can also use simulated voice prompts below.');
        setTimeout(() => setSpeechError(null), 3500);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (!isVoiceActive || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown chars for clean voice output
      const clean = text.replace(/[*_#`]/g, '').slice(0, 220);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingAudio(true);
      utterance.onend = () => setIsSpeakingAudio(false);
      utterance.onerror = () => setIsSpeakingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeakingAudio(false);
    }
  };

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      // Fallback voice simulation
      handleSendChat("Will this espresso machine fit under 15-inch cabinets?");
      return;
    }

    if (isListeningMic) {
      recognitionRef.current.stop();
      setIsListeningMic(false);
    } else {
      try {
        setIsListeningMic(true);
        recognitionRef.current.start();
      } catch (e) {
        setIsListeningMic(false);
      }
    }
  };

  const handleSendChat = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Process with Gemini 3.8
    setTimeout(() => {
      let reply = '';
      let thinking = '';
      let items: any[] = [];

      const lower = query.toLowerCase();

      if (lower.includes('espresso') || lower.includes('cabinet') || lower.includes('15-inch') || lower.includes('fit')) {
        reply = "✅ **Specification Verified:** The Barista Pro Precision Espresso Machine has an exact vertical height of **13.8 inches (35.0 cm)**.\n\nUnder standard 15-inch upper kitchen cabinets, you will have **1.2 inches of overhead clearance**!\n\n📍 **Store Availability:** Verified **4 units in stock** at Seattle Downtown Flagship (Store #402, Aisle 3B - Coffee Bar). Would you like to reserve one for 2-hour courier delivery?";
        thinking = "Gemini 3.8 Flash parsed dimensional constraint: '15-inch cabinets'. Ingested Barista Pro OEM specification sheet (Height: 13.8 in, Width: 11.2 in, Depth: 12.5 in). Calculated tolerance: +1.2 in. Queried physical inventory API at Store #402: 4 on-shelf.";
        items = [
          {
            name: 'Barista Pro Precision Espresso Machine',
            price: 449.00,
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=300&q=80',
            store: 'Store #402 (Aisle 3B • 4 in stock)'
          }
        ];
      } else if (lower.includes('bundle') || lower.includes('cold') || lower.includes('ski') || lower.includes('winter') || lower.includes('500')) {
        reply = "🎯 **Curated Cold-Weather Bundle:** Based on your under-$500 budget and sub-zero weather requirements, I have assembled a synchronized dual-layer bundle:\n\n1. **Alpine Traverse 3-Layer GORE-TEX Shell** ($389.00)\n2. **100% Merino Wool 250g Thermal Crewneck** ($98.00)\n\n💰 **Dynamic Bundle Price: $448.00** (Includes 8% multi-item bundle discount applied automatically). Both items are available at Seattle Flagship.";
        thinking = "Gemini 3.8 Flash analyzed multi-item thermal compatibility. Applied basket elasticity affinity matrix. Injected 8% bundle incentive. Total within $500 target.";
        items = [
          {
            name: 'Alpine Traverse 3-Layer GORE-TEX Shell',
            price: 389.00,
            image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80'
          },
          {
            name: '100% Merino Wool 250g Thermal Base Layer',
            price: 98.00,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80'
          }
        ];
      } else if (lower.includes('chair') || lower.includes('office') || lower.includes('ergonomic')) {
        reply = "🛋️ **Ergonomic Workstation Recommendation:** The Nordic Oak Ergonomic Desk Chair is engineered with synchronized tilt, dynamic lumbar curve, and breathable linen mesh.\n\n📍 **Stock Status:** In stock at Seattle Flagship (Aisle 4B). Price: **$249.00**. Pairs perfectly with our Lumina Architect Task Lamp for balanced eye strain reduction.";
        thinking = "Gemini 3.8 Flash matched semantic intent: home office ergonomics. Cross-referenced customer RFM tier with premium Scandinavian aesthetic.";
        items = [
          {
            name: 'Nordic Oak Minimalist Ergonomic Desk Chair',
            price: 249.00,
            image: 'https://images.unsplash.com/photo-1580481077194-c75c87a53c15?auto=format&fit=crop&w=300&q=80',
            store: 'Store #402 (Aisle 4B • 6 in stock)'
          }
        ];
      } else {
        reply = `I analyzed your request with **Gemini 3.8 Flash**. I can cross-reference our verified catalog of 500+ items across Furniture, Electronics, Apparel, and Kitchen, check live store aisles, and answer exact technical fitment. What details can I assist you with?`;
        thinking = `Gemini 3.8 Flash intent parsing completed. General query fallback active.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          thinking,
          items,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
      speakText(reply);
    }, 700);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // =========================================================================
  // USE CASE 02: AUTOMATED ORDER MANAGEMENT, WISMO & RETURNS
  // =========================================================================
  const [wismoId, setWismoId] = useState('ORD-99482');
  const [wismoData, setWismoData] = useState<any>(null);
  const [isVisionTriageRunning, setIsVisionTriageRunning] = useState(false);
  const [visionTriageResult, setVisionTriageResult] = useState<any>(null);

  const handleQueryDOMS = () => {
    setWismoData({
      orderId: wismoId,
      status: 'OUT_FOR_DELIVERY_FINAL_MILE',
      carrier: 'FlamGo Clean Fleet (EV-Van #09)',
      driver: 'Marcus Vance (Rating: 4.98 ★)',
      liveEta: '14 minutes remaining (0.8 mi away)',
      wmsHub: 'Seattle SODO Distribution Center #402',
      binLocation: 'Aisle 3A • Bin R-44',
      items: ['Nordic Oak Ergonomic Desk Chair', 'Recycled All-Weather Backpack'],
      gpsCoords: '47.6085° N, 122.3392° W (Transit on 4th Ave toward Pike St)'
    });
  };

  const handleRunVisionReturn = () => {
    setIsVisionTriageRunning(true);
    setVisionTriageResult(null);
    setTimeout(() => {
      setIsVisionTriageRunning(false);
      setVisionTriageResult({
        inspectionSpeed: '16.4 seconds',
        conditionGrade: 'Grade A (Pristine Condition)',
        tagsDetected: true,
        fraudRisk: '0.4% (Ultra-Low)',
        action: 'Instant Store Credit ($249.00) issued to Alex Rivera',
        logisticsRoute: 'Re-routed directly to Seattle Flagship Aisle 4B for immediate shelf resale'
      });
    }, 1200);
  };

  // =========================================================================
  // USE CASE 03: HIGH-CONVERTING WHATSAPP CART RECOVERY
  // =========================================================================
  const [whatsappChat, setWhatsappChat] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hi Alex! 👋 We noticed you left the Nordic Oak Ergonomic Desk Chair ($249.00) in your FlamGo cart. Did you have any questions about delivery speed or assembly before we reserve your stock?',
      time: '10:14 AM'
    }
  ]);

  const handleResolveObjection = (objectionType: 'assembly' | 'delivery' | 'price') => {
    let userText = '';
    let botReply = '';

    if (objectionType === 'assembly') {
      userText = 'Is the chair difficult to assemble?';
      botReply = '🛠️ Great question! The Nordic Oak chair arrives 90% pre-assembled in the carton. All you do is slide the gas lift into the aluminum base and tighten 4 hex bolts (tool included in box, takes < 5 minutes).';
    } else if (objectionType === 'delivery') {
      userText = 'Delivery takes too long, I need it today.';
      botReply = '⚡ We have 2 units in stock right now at our Seattle Flagship store! If you check out now, our Express EV-Courier will deliver to your door in under 120 minutes with zero delivery fee.';
    } else {
      userText = 'A bit over my budget, any discount available?';
      botReply = '🎁 I understand budget is key! I can apply an instant $20 VIP cart voucher code "OAK20" valid for the next 60 minutes, bringing your total to $229.00 with free delivery.';
    }

    setWhatsappChat(prev => [
      ...prev,
      { sender: 'user', text: userText, time: '10:15 AM' },
      { sender: 'bot', text: botReply, time: '10:15 AM' }
    ]);
  };

  // =========================================================================
  // USE CASE 04: HANDS-FREE VOICE & MULTIMODAL SHOPPING
  // =========================================================================
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // =========================================================================
  // USE CASE 05: B2B PROCUREMENT & RFQ AUTOMATION (B2B PERSONA)
  // =========================================================================
  const [rfqProcessed, setRfqProcessed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* =================================      {/* ========================================================================= */}
      {/* 1. EXECUTIVE HEADER BANNER */}
      {/* ========================================================================= */}
      {!isModal && (
        b2cMode ? (
          /* Clean Consumer Header for Alex Rivera - Zero Technical Jargon */
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ea580c', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <span>👋 Welcome Alex Rivera</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ color: '#64748b' }}>Personal Shopping Assistant</span>
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0', lineHeight: 1.2 }}>
                Conversational Shopping Assistant
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                Ask product questions, explore curated bundles, check local Seattle store stock, or get help with your orders.
              </p>
            </div>
          </div>
        ) : (
          /* B2B Executive View for Elena Rostova */
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.25rem 2.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ maxWidth: '980px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#ecfeff',
                color: '#0891b2',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                <Building2 size={14} />
                <span>B2B Enterprise Portal • Elena Rostova</span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.65rem 0', lineHeight: 1.2 }}>
                Conversational Commerce Solutions
              </h1>

              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Enterprise multi-agent architectures delivering natural shopping dialogues, autonomous DOMS/WMS order tracking, 
                high-converting WhatsApp cart recovery, and B2B RFQ CPQ automation.
              </p>
            </div>
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* 2. FOCUSED INDIVIDUAL SOLUTION HEADER & SWITCHER (HIDES OTHER 2 SOLUTIONS) */}
      {/* ========================================================================= */}
      {!isModal && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.15rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
                Explore <sup style={{ color: '#2563eb', fontSize: '0.85em', fontWeight: 800 }}>Preview</sup>
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Active Solution</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {activeUseCase === '01' && 'Guided Selling & AI Shopping Concierges'}
              {activeUseCase === '02' && 'Automated Order Management, WISMO & Returns'}
              {activeUseCase === '03' && 'High-Converting Cart Recovery & Abandonment Nudges'}
              {activeUseCase === '04' && 'Hands-Free Voice & Multimodal Shopping'}
              {activeUseCase === '05' && 'B2B Procurement & RFQ Automation'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              {activeUseCase === '01' && 'Natural dialogue intent refinement into curated product bundles'}
              {activeUseCase === '02' && 'Autonomous post-purchase resolution with DOMS/WMS and Vision AI'}
              {activeUseCase === '03' && 'Proactive outbound messaging addressing exact purchase objections'}
              {activeUseCase === '04' && 'Voice assistants and vision models for friction-free discovery'}
              {activeUseCase === '05' && 'Conversational CPQ quote generation from unstructured buyer requests'}
            </p>
          </div>

          {b2cMode && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveUseCase('01')}
                style={{
                  background: activeUseCase === '01' ? '#2563eb' : '#f8fafc',
                  color: activeUseCase === '01' ? '#ffffff' : '#475569',
                  border: activeUseCase === '01' ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Guided Selling
              </button>
              <button
                onClick={() => setActiveUseCase('02')}
                style={{
                  background: activeUseCase === '02' ? '#16a34a' : '#f8fafc',
                  color: activeUseCase === '02' ? '#ffffff' : '#475569',
                  border: activeUseCase === '02' ? '1px solid #16a34a' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Order Tracking & Returns
              </button>
              <button
                onClick={() => setActiveUseCase('03')}
                style={{
                  background: activeUseCase === '03' ? '#ea580c' : '#f8fafc',
                  color: activeUseCase === '03' ? '#ffffff' : '#475569',
                  border: activeUseCase === '03' ? '1px solid #ea580c' : '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cart Recovery
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE WORKING PROTOTYPE WORKSPACE (HOW TO USE) */}
      {/* ========================================================================= */}
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
        
        {/* ========================================================================= */}
        {/* PROTOTYPE DEMO 01: GUIDED SELLING (CHAT & LIVE VOICE CONVERSATION) */}
        {/* ========================================================================= */}
        {activeUseCase === '01' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-blue">Gemini 3.8 Model</span>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>● Live Voice Conversation Ready</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0 0' }}>
                  AI Shopping Concierge & Guided Selling
                </h3>
              </div>

              {/* Voice Conversation Toggle Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: isVoiceActive ? '#ecfdf5' : '#f8fafc',
                    color: isVoiceActive ? '#15803d' : '#64748b',
                    border: isVoiceActive ? '1px solid #86efac' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Enable SpeechSynthesis to speak responses aloud"
                >
                  {isVoiceActive ? <Volume2 size={16} color="#16a34a" /> : <VolumeX size={16} />}
                  <span>{isVoiceActive ? 'Voice Audio: ON' : 'Voice Audio: OFF'}</span>
                </button>

                {isSpeakingAudio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f0fdf4', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                    <div style={{ width: '4px', height: '14px', background: '#16a34a', animation: 'pulse 0.8s infinite' }} />
                    <div style={{ width: '4px', height: '20px', background: '#16a34a', animation: 'pulse 0.6s infinite' }} />
                    <div style={{ width: '4px', height: '10px', background: '#16a34a', animation: 'pulse 0.9s infinite' }} />
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, marginLeft: '0.3rem' }}>Gemini Speaking...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Starters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Try Demo Questions:</span>
              <button
                onClick={() => handleSendChat('Will this espresso machine fit under 15-inch cabinets?')}
                style={{ background: '#ffffff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}
              >
                📐 "Will this espresso machine fit under 15-inch cabinets?"
              </button>
              <button
                onClick={() => handleSendChat('Curate cold-weather outfit bundle under $500 with merino wool base layer')}
                style={{ background: '#ffffff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}
              >
                🧥 "Curate cold-weather bundle under $500"
              </button>
              <button
                onClick={() => handleSendChat('Recommend a modern ergonomic desk chair for Seattle store')}
                style={{ background: '#ffffff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}
              >
                🛋️ "Recommend ergonomic chair in Seattle store"
              </button>
            </div>

            {/* Interactive Chat Console */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              minHeight: '320px',
              maxHeight: '440px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.9rem 1.15rem',
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

                  {!b2cMode && msg.thinking && (
                    <div style={{ maxWidth: '85%', fontSize: '0.725rem', color: '#64748b', background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>Gemini 3.8 Reasoning Trace: </span>
                      {msg.thinking}
                    </div>
                  )}

                  {msg.items && msg.items.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {msg.items.map((it, i) => (
                        <div
                          key={i}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                          }}
                        >
                          <img src={it.image} alt={it.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{it.name}</strong>
                            <span style={{ fontSize: '0.775rem', color: '#16a34a', fontWeight: 800 }}>${it.price.toFixed(2)}</span>
                            {it.store && <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>{it.store}</span>}
                          </div>
                          {onAddToCart && (
                            <button
                              onClick={() => onAddToCart({
                                id: `concierge-${i}`,
                                name: it.name,
                                price: it.price,
                                image: it.image,
                                category: 'Guided Bundle'
                              })}
                              className="btn btn-primary"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem' }}>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Gemini 3.8 Flash reading specifications & validating real-time inventory...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input & Voice Microphone Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={toggleMicListening}
                style={{
                  background: isListeningMic ? '#dc2626' : '#eff6ff',
                  color: isListeningMic ? '#ffffff' : '#2563eb',
                  border: isListeningMic ? '1px solid #dc2626' : '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isListeningMic ? '0 0 14px rgba(220, 38, 38, 0.4)' : 'none'
                }}
                title={isListeningMic ? 'Listening to your voice...' : 'Click to speak using your microphone (Gemini Live Voice)'}
              >
                {isListeningMic ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                placeholder={isListeningMic ? "Listening to your voice now..." : "Ask Gemini 3.8 (e.g., 'Will this fit under my cabinets?' or 'Bundle a desk setup')..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem'
                }}
              />

              <button
                onClick={() => handleSendChat()}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem' }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </div>

            {speechError && (
              <span style={{ fontSize: '0.75rem', color: '#ea580c' }}>{speechError}</span>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROTOTYPE DEMO 02: AUTOMATED ORDER MANAGEMENT, WISMO & RETURNS */}
        {/* ========================================================================= */}
        {activeUseCase === '02' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="badge badge-green">DOMS & WMS Direct API Integration</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem 0' }}>
                Autonomous WISMO Query & Vision AI Return Triage
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Test autonomous post-purchase resolution connecting live order fulfillment ledgers and computer vision verification.
              </p>
            </div>

            {/* WISMO Section */}
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
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>WMS ORIGIN & BIN ALLOCATION</span>
                    <strong style={{ color: '#0f172a' }}>{wismoData.wmsHub} ({wismoData.binLocation})</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>TELEMATICS ETA</span>
                    <strong style={{ color: '#2563eb' }}>{wismoData.liveEta}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Vision AI Return Triage Section */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={18} color="#16a34a" />
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Vision AI Sub-20s Return & Resale Routing</strong>
                </div>
                <button onClick={handleRunVisionReturn} className="btn btn-primary" style={{ background: '#16a34a', borderColor: '#16a34a', fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}>
                  {isVisionTriageRunning ? 'Running Vision Inspection...' : 'Simulate Live Item Inspection (<20s)'}
                </button>
              </div>

              {visionTriageResult && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 size={28} color="#16a34a" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534', margin: '0 0 0.25rem 0' }}>
                      Autonomous Verification Complete in {visionTriageResult.inspectionSpeed} ({visionTriageResult.conditionGrade})
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#15803d', margin: 0, lineHeight: 1.5 }}>
                      <strong>Immediate Resolution:</strong> {visionTriageResult.action} • {visionTriageResult.logisticsRoute}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROTOTYPE DEMO 03: HIGH-CONVERTING WHATSAPP CART RECOVERY */}
        {/* ========================================================================= */}
        {activeUseCase === '03' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
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
                  <strong style={{ fontSize: '0.925rem', color: '#e9edef', display: 'block' }}>FlamGo Concierge AI</strong>
                  <span style={{ fontSize: '0.7rem', color: '#25d366' }}>● Verified WhatsApp Business Agent</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '260px' }}>
                {whatsappChat.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? '#005c4b' : '#202c33',
                      color: '#e9edef',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '10px',
                      maxWidth: '90%',
                      fontSize: '0.825rem',
                      lineHeight: 1.45
                    }}
                  >
                    <div>{msg.text}</div>
                    <span style={{ fontSize: '0.65rem', color: '#8696a0', display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', background: '#202c33', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#8696a0', display: 'block', marginBottom: '0.35rem' }}>1-Tap Autonomous Checkout Token:</span>
                <button
                  onClick={() => alert('1-Tap Checkout Token Confirmed: $229.00 charged to saved Visa ending 4242. Stock reserved at Seattle Flagship!')}
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
                  Confirm Purchase in 1-Tap ($229.00)
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span className="badge badge-orange">Autonomous Cart Rescue</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem 0' }}>
                  Simulate Purchase Hesitations
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Click an objection to see the outbound agent solve the exact hesitation blocking the order:
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  onClick={() => handleResolveObjection('assembly')}
                  style={{ textAlign: 'left', padding: '0.85rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>🛠️ "Is the chair difficult to assemble?"</span>
                  <CornerDownRight size={15} color="#ea580c" />
                </button>

                <button
                  onClick={() => handleResolveObjection('delivery')}
                  style={{ textAlign: 'left', padding: '0.85rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>⚡ "Delivery takes too long, I need it today"</span>
                  <CornerDownRight size={15} color="#ea580c" />
                </button>

                <button
                  onClick={() => handleResolveObjection('price')}
                  style={{ textAlign: 'left', padding: '0.85rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>💰 "A bit over my budget, any discount available?"</span>
                  <CornerDownRight size={15} color="#ea580c" />
                </button>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '1rem', fontSize: '0.825rem', color: '#9a3412', lineHeight: 1.5 }}>
                <strong>Why This Beats Email:</strong> Traditional abandon cart emails convert at 3% to 5%. Personalized WhatsApp autonomous objection resolution recovers <strong>15% to 25% of carts</strong>.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROTOTYPE DEMO 04: HANDS-FREE VOICE & MULTIMODAL SHOPPING (B2B MOBILE) */}
        {/* ========================================================================= */}
        {!b2cMode && activeUseCase === '04' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="badge badge-purple">Gemini Multimodal Vision & Voice</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem 0' }}>
                Visual Similarity Match & Voice Reorder
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  title: 'Scandinavian Ergonomic Desk Chair',
                  img: 'https://images.unsplash.com/photo-1580481077194-c75c87a53c15?auto=format&fit=crop&w=400&q=80',
                  match: 'Nordic Oak Minimalist Ergonomic Desk Chair',
                  price: 249.00,
                  score: '99.4% Vector Similarity'
                },
                {
                  title: 'Waterproof Mountain Alpine Shell',
                  img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
                  match: 'Alpine Traverse 3-Layer GORE-TEX Shell',
                  price: 389.00,
                  score: '98.9% Vector Similarity'
                }
              ].map((sample, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPhoto(sample)}
                  style={{
                    background: selectedPhoto?.match === sample.match ? '#faf5ff' : '#f8fafc',
                    border: selectedPhoto?.match === sample.match ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <img src={sample.img} alt={sample.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block', marginTop: '0.5rem' }}>{sample.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700 }}>Click to Run Gemini Vision Search</span>
                </div>
              ))}
            </div>

            {selectedPhoto && (
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 800 }}>GEMINI VISION MATCH ({selectedPhoto.score})</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>{selectedPhoto.match}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 800 }}>${selectedPhoto.price.toFixed(2)} • Ready at Seattle Flagship</span>
                </div>
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart({
                      id: `photo-match-${selectedPhoto.match}`,
                      name: selectedPhoto.match,
                      price: selectedPhoto.price,
                      image: selectedPhoto.img,
                      category: 'Visual Match'
                    })}
                    className="btn btn-primary"
                    style={{ background: '#7c3aed', borderColor: '#7c3aed', fontSize: '0.825rem' }}
                  >
                    Add Matched Product to Cart
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROTOTYPE DEMO 05: B2B PROCUREMENT & RFQ AUTOMATION (B2B PERSONA) */}
        {/* ========================================================================= */}
        {!b2cMode && activeUseCase === '05' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge" style={{ background: '#cffafe', color: '#0891b2' }}>B2B Persona Solution • Elena Rostova</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.2rem 0' }}>
                  Unstructured RFQ Document Ingestion & CPQ Generation
                </h3>
              </div>
              <button
                onClick={() => setRfqProcessed(true)}
                className="btn btn-primary"
                style={{ background: '#0891b2', borderColor: '#0891b2', fontSize: '0.825rem' }}
              >
                Execute Autonomous CPQ Match
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem', color: '#334155' }}>
              <strong>From:</strong> procurement@nordic-enterprises.corp<br/>
              <strong>Subject:</strong> RFQ: Corporate Campus Refresh (MSA #WA-904)<br/>
              <strong>Body:</strong> "Need immediate quote for 25 units of Nordic Oak Ergonomic Desk Chairs and 10 units of 65W GaN Dual USB-C Fast Chargers delivered to Seattle District 4 facility. Apply our contracted tier volume discount."
            </div>

            {rfqProcessed && (
              <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} color="#0891b2" />
                    <strong style={{ fontSize: '0.95rem', color: '#155e75' }}>
                      CPQ Quotation Auto-Generated & Validated under MSA Contract
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#ffffff', color: '#0891b2', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    Quote #CPQ-904-2026
                  </span>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1rem', border: '1px solid #cffafe', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', fontWeight: 700, color: '#475569' }}>
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Contract Unit Price</span>
                    <span>Discount</span>
                    <span>Total</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', color: '#0f172a' }}>
                    <span>Nordic Oak Ergonomic Desk Chair</span>
                    <span>25</span>
                    <span>$211.65 (MSRP $249)</span>
                    <span style={{ color: '#0891b2', fontWeight: 700 }}>-15% Tier</span>
                    <strong>$5,291.25</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', color: '#0f172a' }}>
                    <span>65W GaN Dual USB-C Fast Charger</span>
                    <span>10</span>
                    <span>$41.65 (MSRP $49)</span>
                    <span style={{ color: '#0891b2', fontWeight: 700 }}>-15% Tier</span>
                    <strong>$416.50</strong>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <strong style={{ color: '#0f172a' }}>Total Contract Value:</strong>
                    <strong style={{ color: '#0891b2' }}>$5,707.75 (Net 30 Terms)</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: '#155e75' }}>
                  <span>Approval Routing: Routed automatically to Elena Rostova (Regional Director) for signature</span>
                  <button
                    onClick={() => alert('Procurement approval webhook dispatched to Elena Rostova under UCC Article 2 non-binding CPQ.')}
                    className="btn btn-primary"
                    style={{ background: '#0891b2', borderColor: '#0891b2', fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
                  >
                    Authorize Quote Dispatch
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
