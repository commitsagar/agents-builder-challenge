import React from 'react';
import { 
  Sparkles, CheckCircle2, TrendingUp, ShieldCheck, HeartHandshake, 
  ShoppingBag, Truck, Building2, BarChart3, ArrowRight
} from 'lucide-react';
import { ChallengesMatrix } from '../ChallengesMatrix';

export const ArchitectureGraph: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Executive Transformation Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.25rem 2.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '960px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Retail Innovation & Social Impact Matrix</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Omnichannel Retail Transformation & Strategic Solutions
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Comprehensive operational capabilities engineered to solve the 15 fundamental challenges across customer discovery, inventory accuracy, store operations, and commercial governance — delivering verified economic efficiency and positive social impact.
          </p>
        </div>

        {/* Strategic Impact Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{ background: '#eff6ff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Conversational Commerce</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.25rem' }}>5 / 5</div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: '0.25rem' }}>Solutions & Demonstrations</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>B2C vs B2B Dimensions</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>7 / 7</div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: '0.25rem' }}>Full Dual Resolution</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Strategic Pillars</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>15 / 15</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>Customer to Governance</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Returns Triage Speed</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563eb', marginTop: '0.25rem' }}>&lt; 20s</div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: '0.25rem' }}>From $14.00 down to $0.40</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Stockout Reduction</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#16a34a', marginTop: '0.25rem' }}>-92.4%</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>Real-time inventory sync</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Circular Economy</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.25rem' }}>94.2%</div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600, marginTop: '0.25rem' }}>Diverted from landfills</div>
          </div>
        </div>
      </div>

      {/* 15 Retail Challenges & Strategic Solutions Matrix */}
      <ChallengesMatrix />

    </div>
  );
};
