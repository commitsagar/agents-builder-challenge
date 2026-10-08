import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Camera, CheckCircle2, AlertOctagon, TrendingUp, RefreshCw, Sparkles, ArrowRight, DollarSign } from 'lucide-react';
import { ReturnInspection } from '../../types';
import { RETURN_INSPECTION_PRESETS } from '../../data/mockScenarios';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { geminiRetailService } from '../../services/geminiService';

export const ReturnLogistics: React.FC = () => {
  const [inspections, setInspections] = useState<ReturnInspection[]>(RETURN_INSPECTION_PRESETS);
  const [selectedInspection, setSelectedInspection] = useState<ReturnInspection>(RETURN_INSPECTION_PRESETS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Custom inspection form state
  const [customSku, setCustomSku] = useState(MOCK_PRODUCTS[0].id);
  const [customClaim, setCustomClaim] = useState('Item received with visible scratches on the side.');
  const [customImageUrl, setCustomImageUrl] = useState('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80');

  const handleRunCustomAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    const product = MOCK_PRODUCTS.find(p => p.id === customSku) || MOCK_PRODUCTS[0];

    try {
      const analysisResult = await geminiRetailService.inspectReturnItem(
        customSku,
        customClaim,
        `Image of returned ${product.name}`
      );

      const newInspection: ReturnInspection = {
        id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        sku: customSku,
        productName: product.name,
        purchasePrice: product.price,
        customerClaim: customClaim,
        uploadedImageUrl: customImageUrl,
        analysis: analysisResult,
        status: analysisResult.disposition.includes('Auto-Refund') ? 'approved' : analysisResult.disposition.includes('Quarantine') ? 'quarantined' : 'liquidate',
        timestamp: 'Just now'
      };

      setInspections([newInspection, ...inspections]);
      setSelectedInspection(newInspection);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentAnalysis = selectedInspection.analysis;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(239, 68, 68, 0.1) 0%, rgba(13, 18, 29, 0.95) 70%)'
      }}>
        <div style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-red">
              <ShieldAlert size={13} /> Challenge 6: Reverse Logistics & Return Fraud Prevention
            </span>
            <span className="badge badge-green">Gemini 3.7 Flash Vision Inspection</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', lineHeight: '1.2', marginBottom: '1rem', fontWeight: 800 }}>
            Autonomous Reverse Logistics & <span className="glow-gemini">Multimodal Vision</span> Disposition
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Returns consume up to 7% of gross retail revenues. OmniCommerce AI inspects returned merchandise
            using multimodal image reasoning, catches counterfeit wardrobing, and slashes disposition costs
            from <strong>$14.00 down to $0.40</strong> per item.
          </p>
        </div>
      </div>

      {/* KPI Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Avg. Processing Cost</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>$0.40</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>$14.00 manual</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>97.1% cost reduction via automated triage</p>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Fraud Interception Rate</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171' }}>98.4%</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Wardrobing / Swaps</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Verified via OEM serial & seam scans</p>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Auto-Disposition Velocity</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>&lt; 3.2s</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Instant Refund</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Instant store credit issuance</p>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>B-Stock Recovery Yield</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa' }}>62.0%</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Residual Value</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Automated secondary routing</p>
        </div>
      </div>

      {/* Main Inspection Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Preset Queue & Custom Test Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Recent Return Intake Queue</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Live Feed</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inspections.map((insp) => (
                <div
                  key={insp.id}
                  onClick={() => setSelectedInspection(insp)}
                  className="glass-card"
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    background: selectedInspection.id === insp.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                    borderColor: selectedInspection.id === insp.id ? '#6366f1' : 'var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={insp.uploadedImageUrl}
                      alt={insp.productName}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{insp.id} • ${insp.purchasePrice}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {insp.productName}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${insp.status === 'approved' ? 'badge-green' : insp.status === 'quarantined' ? 'badge-red' : 'badge-yellow'}`}>
                      {insp.status === 'approved' ? 'Auto-Refund' : insp.status === 'quarantined' ? 'Fraud Alert' : 'B-Stock'}
                    </span>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>{insp.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Vision Test Box */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={18} color="#818cf8" />
              <span>Simulate New Return Intake</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Test Gemini 3.7 Flash Vision on any customer claim and item photo.
            </p>

            <form onSubmit={handleRunCustomAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  TARGET SKU
                </label>
                <select
                  value={customSku}
                  onChange={(e) => setCustomSku(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {MOCK_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  CUSTOMER RETURN STATEMENT
                </label>
                <input
                  type="text"
                  value={customClaim}
                  onChange={(e) => setCustomClaim(e.target.value)}
                  placeholder="e.g. Broken zipper, wrong size, defective audio..."
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  IMAGE URL
                </label>
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Image URL to inspect..."
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn btn-primary"
                style={{ padding: '0.75rem', marginTop: '0.5rem' }}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>Executing Gemini Vision Inspection...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Trigger Multimodal Inspection</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Deep-Dive Multimodal Inspection Inspector Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
                Case {selectedInspection.id} • Order {selectedInspection.orderId}
              </span>
              <h2 style={{ fontSize: '1.35rem' }}>{selectedInspection.productName}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                ${selectedInspection.purchasePrice.toFixed(2)}
              </span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Invoice Value</p>
            </div>
          </div>

          {/* Visual comparison view */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 600 }}>CUSTOMER SUBMITTED PHOTO</p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid var(--border-strong)', position: 'relative' }}>
                <img
                  src={selectedInspection.uploadedImageUrl}
                  alt="Customer Return"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-blue" style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '0.65rem' }}>
                  Optical Telemetry Active
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Customer Claim</p>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.35rem', fontStyle: 'italic' }}>
                  "{selectedInspection.customerClaim}"
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Hangtag Verification:</span>
                  <span style={{ color: currentAnalysis.tagDetected ? '#34d399' : '#f87171', fontWeight: 600 }}>
                    {currentAnalysis.tagDetected ? '✓ Detected Intact' : '✗ Missing / Tampered'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cryptographic Serial Hash:</span>
                  <span style={{ color: currentAnalysis.serialMatch ? '#34d399' : '#f87171', fontWeight: 600 }}>
                    {currentAnalysis.serialMatch ? '✓ Verified Genuine' : '✗ Checksum Mismatch'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Wear & Tear Grade:</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>
                    {currentAnalysis.wearAndTearGrade}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Meters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>AUTHENTICITY CONFIDENCE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: currentAnalysis.visualAuthenticityScore > 75 ? '#34d399' : '#f87171' }}>
                  {currentAnalysis.visualAuthenticityScore}%
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${currentAnalysis.visualAuthenticityScore}%`,
                  height: '100%',
                  background: currentAnalysis.visualAuthenticityScore > 75 ? '#10b981' : '#ef4444'
                }}></div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>FRAUD PROBABILITY</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: currentAnalysis.fraudProbability > 50 ? '#f87171' : '#34d399' }}>
                  {currentAnalysis.fraudProbability}%
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${currentAnalysis.fraudProbability}%`,
                  height: '100%',
                  background: currentAnalysis.fraudProbability > 50 ? '#ef4444' : '#10b981'
                }}></div>
              </div>
            </div>
          </div>

          {/* Gemini Vision Technical Report */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.25rem',
            borderRadius: '12px',
            borderLeft: `4px solid ${currentAnalysis.fraudProbability > 50 ? '#ef4444' : '#10b981'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="#818cf8" />
              <h4 style={{ fontSize: '0.85rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Gemini 3.7 Flash Vision Report
              </h4>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {currentAnalysis.geminiVisionNotes}
            </p>
          </div>

          {/* Disposition Decision Banner */}
          <div style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: currentAnalysis.disposition.includes('Auto-Refund') ? 'rgba(16, 185, 129, 0.15)' : currentAnalysis.disposition.includes('Quarantine') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${currentAnalysis.disposition.includes('Auto-Refund') ? 'rgba(16, 185, 129, 0.4)' : currentAnalysis.disposition.includes('Quarantine') ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Automated Agent Disposition</p>
              <h3 style={{
                fontSize: '1.15rem',
                color: currentAnalysis.disposition.includes('Auto-Refund') ? '#34d399' : currentAnalysis.disposition.includes('Quarantine') ? '#f87171' : '#fbbf24',
                marginTop: '0.25rem'
              }}>
                {currentAnalysis.disposition}
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                Saved ${currentAnalysis.processingCostSavings.toFixed(2)} Processing Friction
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
