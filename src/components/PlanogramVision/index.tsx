import React, { useState } from 'react';
import { Camera, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { MOCK_PLANOGRAM_AUDIT } from '../../data/mockScenarios';
import confetti from 'canvas-confetti';

export const PlanogramVision: React.FC = () => {
  const audit = MOCK_PLANOGRAM_AUDIT;
  const [isScanning, setIsScanning] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(0);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 500);
  };

  const handleSendTicket = () => {
    setTicketSent(true);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#2563eb', '#16a34a']
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Main Inspection Grid in Clean Light Theme */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Visual Scanner with Optical Annotations */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-blue">{audit.aisle}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{audit.bayNumber}</h3>
            </div>
            <button
              onClick={handleRescan}
              disabled={isScanning}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} className={isScanning ? 'spin' : ''} />
              <span>Rescan Camera Feed</span>
            </button>
          </div>

          {/* Annotated Photo Feed */}
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            height: '380px',
            background: '#f8fafc'
          }}>
            <img
              src={audit.imageUrl}
              alt="Aisle Planogram Scan"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isScanning ? 0.4 : 1, transition: 'opacity 0.3s' }}
            />

            {/* Bounding Boxes */}
            {!isScanning && (
              <>
                {/* Stock Gap */}
                <div
                  onClick={() => setSelectedIssue(0)}
                  style={{
                    position: 'absolute',
                    top: '25%',
                    left: '20%',
                    width: '32%',
                    height: '28%',
                    border: '2px solid #dc2626',
                    background: 'rgba(220, 38, 38, 0.2)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '4px'
                  }}
                >
                  <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>
                    Stock Gap #1 (Prime)
                  </span>
                </div>

                {/* Misplaced SKU */}
                <div
                  onClick={() => setSelectedIssue(1)}
                  style={{
                    position: 'absolute',
                    top: '60%',
                    left: '55%',
                    width: '28%',
                    height: '25%',
                    border: '2px solid #d97706',
                    background: 'rgba(217, 119, 6, 0.2)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '4px'
                  }}
                >
                  <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>
                    Misplaced SKU
                  </span>
                </div>

                {/* Missing ESL */}
                <div
                  onClick={() => setSelectedIssue(2)}
                  style={{
                    position: 'absolute',
                    top: '8%',
                    left: '60%',
                    width: '22%',
                    height: '14%',
                    border: '2px solid #2563eb',
                    background: 'rgba(37, 99, 235, 0.2)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '4px'
                  }}
                >
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                    ESL Tag Offline
                  </span>
                </div>
              </>
            )}

            {isScanning && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.7)' }}>
                <RefreshCw size={28} color="#2563eb" className="spin" />
                <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Analyzing Aisle Visual Features...</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Sensor: <strong>IoT Overhead Camera 4B-East</strong> (1080p stream)</span>
            <span>Latency: <strong>46ms</strong></span>
          </div>
        </div>

        {/* Right Column: Audit Metrics & Task Dispatch */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Planogram Compliance Score</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: audit.compliancePercentage > 85 ? '#16a34a' : '#d97706' }}>
                {audit.compliancePercentage}%
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '1rem', textAlign: 'center' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Total Facings</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{audit.totalFacings}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Gaps</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626' }}>{audit.outOfStockGaps}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Misplaced</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#d97706' }}>{audit.misplacedItems}</p>
              </div>
            </div>
          </div>

          {/* Detected Discrepancies list */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 700 }}>
              Flagged Visual Discrepancies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {audit.detectedIssues.map((issue, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedIssue(idx)}
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: selectedIssue === idx ? '#eff6ff' : '#f8fafc',
                    border: selectedIssue === idx ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${issue.severity === 'High' ? 'badge-red' : issue.severity === 'Medium' ? 'badge-orange' : 'badge-blue'}`}>
                        {issue.type} • {issue.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{issue.shelfLevel}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#0f172a', marginTop: '0.35rem', fontWeight: 500 }}>
                      {issue.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Ticket Dispatch */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={handleSendTicket}
              disabled={ticketSent}
              className={ticketSent ? 'btn btn-secondary' : 'btn btn-primary'}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {ticketSent ? (
                <>
                  <CheckCircle size={18} color="#16a34a" />
                  <span>Facing Ticket Dispatched to Store Associate Handheld</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Push Facing Remediation Ticket to Floor Team</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
