import React, { useState } from 'react';
import { Users, PieChart, ShieldAlert, Award, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { MOCK_CUSTOMER_SEGMENTS } from '../../data/mockScenarios';

export const CustomerSegmentation: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState(MOCK_CUSTOMER_SEGMENTS[0]);
  const [activePlaybookAlert, setActivePlaybookAlert] = useState<string | null>(null);

  const handleTriggerPlaybook = (segName: string) => {
    setActivePlaybookAlert(`Targeted customer loyalty campaign dispatched for ${segName}!`);
    setTimeout(() => setActivePlaybookAlert(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Alert Notification */}
      {activePlaybookAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{activePlaybookAlert}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', color: '#0f172a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Users size={14} />
            <span>BigQuery ML k-means RFM Cohort Clustering</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Customer Segmentation & Churn Defense
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Group 142,050 omnichannel shoppers across Recency, Frequency, and Monetary value. Trigger automated re-engagement workflows and VIP retention playbooks powered by BigQuery customer 360 tables.
          </p>
        </div>
      </div>

      {/* Segments Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {MOCK_CUSTOMER_SEGMENTS.map((seg) => {
          const isSelected = selectedSegment.id === seg.id;
          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(seg)}
              style={{
                background: isSelected ? '#f8fafc' : '#ffffff',
                border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{seg.id}</span>
                <span className={`badge ${seg.churnRisk === 'Low' ? 'badge-green' : seg.churnRisk === 'Medium' ? 'badge-blue' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                  {seg.churnRisk} Churn
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {seg.name}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem', color: '#64748b' }}>
                <div>Audience Size: <strong>{seg.size.toLocaleString()} shoppers</strong></div>
                <div>Share of Revenue: <strong>{seg.percentOfRevenue}%</strong></div>
                <div>Avg Order Value: <strong>${seg.avgOrderValue.toFixed(2)}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Deep Dive */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Segment Profile Deep Dive
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedSegment.name}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {selectedSegment.tags.map((tag, i) => (
              <span key={i} style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '6px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Playbook Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Recommended Operational Playbook
            </span>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
              {selectedSegment.recommendedPlaybook}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleTriggerPlaybook(selectedSegment.name)}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Zap size={16} />
              <span>Trigger Campaign & Personalized Rules</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
