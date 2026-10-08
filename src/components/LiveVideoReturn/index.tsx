import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Scan, Camera, RotateCcw, Volume2 } from 'lucide-react';
import { MOCK_LIVE_CALL_SCENARIOS } from '../../data/mockScenarios';
import confetti from 'canvas-confetti';

export const LiveVideoReturn: React.FC = () => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const scenario = MOCK_LIVE_CALL_SCENARIOS[activeScenarioIndex];
  
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [scanStep, setScanStep] = useState<'analyzing' | 'verified' | 'resolved'>('verified');
  const [callDuration, setCallDuration] = useState(24);
  const [transcriptStep, setTranscriptStep] = useState(scenario.transcript.length);
  const [isRefundApproved, setIsRefundApproved] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const handleSwitchScenario = (index: number) => {
    setActiveScenarioIndex(index);
    setIsRefundApproved(false);
    setScanStep('analyzing');
    setTimeout(() => {
      setScanStep('verified');
    }, 1200);
  };

  const handleApproveResolution = () => {
    setIsRefundApproved(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16a34a', '#2563eb', '#38bdf8']
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Innovation: Live Video & Multimodal Computer Vision Return</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            OmniCare Live Video Inspection Call
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Eliminate traditional return friction. Connect on a live video stream where <strong>Gemini Multimodal Live Vision</strong> inspects product barcodes, verifies cryptographic holographic seals, grades physical wear in real-time, and issues instant refunds on the call.
          </p>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Simulate Inspection:</span>
        {MOCK_LIVE_CALL_SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => handleSwitchScenario(idx)}
            className={`btn ${activeScenarioIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem', padding: '0.45rem 1rem' }}
          >
            {sc.productName} ({idx === 0 ? '✅ Pristine Mint' : '⚠️ Counterfeit Risk'})
          </button>
        ))}
      </div>

      {/* Video Call Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Live Video Feed with Computer Vision HUD */}
        <div style={{
          background: '#090d16',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #1e293b',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Top Video Call Bar */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
              <strong>LIVE • {formatTime(callDuration)}</strong>
              <span style={{ color: '#94a3b8' }}>|</span>
              <span style={{ color: '#38bdf8' }}>Gemini Multimodal Live</span>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              color: '#4ade80',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <ShieldCheck size={14} />
              <span>TLS 1.3 WebRTC Encrypted</span>
            </div>
          </div>

          {/* Main Camera Viewport */}
          <div style={{
            height: '420px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#020617'
          }}>
            <img
              src={scenario.liveVideoFeedUrl}
              alt="Live video return inspection feed"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isVideoMuted ? 'blur(20px)' : 'none',
                opacity: isVideoMuted ? 0.3 : 1,
                transition: 'filter 0.3s'
              }}
            />

            {/* Simulated Augmented Reality Vision Overlays */}
            {!isVideoMuted && (
              <>
                {/* Overlay 1: Barcode / Product Identification */}
                <div style={{
                  position: 'absolute',
                  top: '25%',
                  left: '20%',
                  width: '180px',
                  height: '110px',
                  border: activeScenarioIndex === 0 ? '2px solid #22c55e' : '2px solid #ef4444',
                  borderRadius: '8px',
                  background: activeScenarioIndex === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  boxShadow: activeScenarioIndex === 0 ? '0 0 15px rgba(34, 197, 94, 0.3)' : '0 0 15px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: 0,
                    background: activeScenarioIndex === 0 ? '#16a34a' : '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    letterSpacing: '0.04em'
                  }}>
                    {activeScenarioIndex === 0 ? 'BARCODE: AUTHENTIC' : 'SERIAL: ANOMALY'}
                  </div>
                  <div style={{ padding: '0.4rem', fontSize: '0.65rem', color: '#ffffff', fontFamily: 'monospace' }}>
                    {scenario.barcodeDetected}
                  </div>
                </div>

                {/* Overlay 2: Surface Integrity / Tamper Seal */}
                <div style={{
                  position: 'absolute',
                  bottom: '22%',
                  right: '18%',
                  width: '160px',
                  height: '90px',
                  border: activeScenarioIndex === 0 ? '2px solid #38bdf8' : '2px solid #eab308',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.1)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-24px',
                    left: 0,
                    background: activeScenarioIndex === 0 ? '#0284c7' : '#ca8a04',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    SEAL INTEGRITY: {scenario.tamperSeal}
                  </div>
                  <div style={{ padding: '0.4rem', fontSize: '0.65rem', color: '#ffffff' }}>
                    Surface: {scenario.surfaceCondition}
                  </div>
                </div>

                {/* Reticle / Center Scanner */}
                <div style={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  border: '1px dashed rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }} />
              </>
            )}

            {/* Customer PiP Preview (Bottom Right) */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '100px',
              height: '80px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              background: '#1e293b'
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Alex Rivera customer webcam"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '0.65rem', color: '#fff', fontWeight: 600 }}>
                You
              </span>
            </div>
          </div>

          {/* Bottom Call Action Toolbar */}
          <div style={{
            background: '#0f172a',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isMicMuted ? '#ef4444' : '#334155',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isVideoMuted ? '#ef4444' : '#334155',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isVideoMuted ? 'Enable Camera' : 'Turn Off Camera'}
            >
              {isVideoMuted ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            <button
              onClick={() => setIsCallActive(!isCallActive)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="End Inspection Call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Right Column: Live Multimodal AI Transcript & Disposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Inspection Status Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ORDER #{scenario.orderId}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {scenario.productName}
                </h3>
              </div>
              <span className={`badge ${activeScenarioIndex === 0 ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.8rem' }}>
                {activeScenarioIndex === 0 ? 'Verified Authentic' : 'Flagged Anomaly'}
              </span>
            </div>

            {/* Telemetry Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Tamper Seal</span>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{scenario.tamperSeal}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Surface Condition</span>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{scenario.surfaceCondition}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Hardware Serial</span>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{scenario.serialNumber}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Fraud Risk Probability</span>
                <strong style={{ fontSize: '0.85rem', color: activeScenarioIndex === 0 ? '#16a34a' : '#dc2626' }}>
                  {scenario.fraudScore}%
                </strong>
              </div>
            </div>

            {/* Suggested Resolution Box */}
            <div style={{
              background: activeScenarioIndex === 0 ? '#f0fdf4' : '#fef2f2',
              border: activeScenarioIndex === 0 ? '1px solid #bbf7d0' : '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: activeScenarioIndex === 0 ? '#166534' : '#991b1b',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem'
              }}>
                Gemini Live Resolution Decision
              </span>
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: activeScenarioIndex === 0 ? '#15803d' : '#b91c1c',
                margin: 0
              }}>
                {scenario.recommendedDisposition}
              </p>
            </div>

            {/* Accept / Action Button */}
            {activeScenarioIndex === 0 && (
              <button
                onClick={handleApproveResolution}
                disabled={isRefundApproved}
                style={{
                  width: '100%',
                  background: isRefundApproved ? '#16a34a' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: isRefundApproved ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                {isRefundApproved ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Refund of $249.99 Credited to Visa!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    <span>Confirm Live Call Resolution & Refund</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Real-time Streaming Transcript */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            flexGrow: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Volume2 size={16} color="#2563eb" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Live Speech & Multimodal Transcript
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {scenario.transcript.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: line.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.65rem 0.95rem',
                    borderRadius: '12px',
                    background: line.sender === 'user' ? '#2563eb' : '#f1f5f9',
                    color: line.sender === 'user' ? '#ffffff' : '#0f172a',
                    fontSize: '0.825rem',
                    lineHeight: 1.4
                  }}>
                    {line.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', padding: '0 0.4rem' }}>
                    {line.sender === 'user' ? 'Alex Rivera' : 'OmniCare AI'} • {line.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
