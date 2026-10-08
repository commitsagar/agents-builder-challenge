import React from 'react';
import { ShoppingBag, Building2, User, ShieldCheck, ArrowRight, Sparkles, MapPin, CheckCircle2, Lock } from 'lucide-react';
import { B2C_PROFILE, B2B_PROFILE } from '../../data/mockScenarios';
import { UserProfile } from '../../types';

interface AuthGatewayProps {
  onSelectPersona: (profile: UserProfile) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onSelectPersona }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          color: '#1d4ed8',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} />
          <span>Unified Enterprise Omnichannel Retail Platform</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
          Select Your Experience Portal
        </h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Choose your role to access the dedicated, persona-specific portal. Each experience provides tailored tools, data pipelines, and AI reasoning.
        </p>
      </div>

      {/* Dual Persona Selection Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        maxWidth: '960px',
        width: '100%'
      }}>
        
        {/* CARD 1: B2C CONSUMER PORTAL */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid #e2e8f0',
          padding: '2.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2563eb, #38bdf8)'
          }} />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <span style={{
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                letterSpacing: '0.05em'
              }}>
                B2C CONSUMER
              </span>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Consumer Shopping Portal
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Designed for individual shoppers looking for frictionless omnichannel discovery, smart checkout, and rapid support.
            </p>

            {/* Persona Identity Badge */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img
                src={B2C_PROFILE.avatar}
                alt={B2C_PROFILE.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{B2C_PROFILE.name}</strong>
                  <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    {B2C_PROFILE.tier}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>{B2C_PROFILE.email}</span>
                <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                  <MapPin size={12} /> {B2C_PROFILE.address}
                </span>
              </div>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span><strong>Intelligent Product Discovery:</strong> Conversational semantic search</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span><strong>Live Google Maps Item Tracker:</strong> Real-time courier telematics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#16a34a' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span><strong>OmniCare Live Video Return:</strong> Instant visual verification on call</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span><strong>Smart Cart:</strong> One-click secure tokenized checkout</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPersona(B2C_PROFILE)}
            style={{
              width: '100%',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            <span>Log in as Alex Rivera (B2C)</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 2: B2B ENTERPRISE MERCHANT PORTAL */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid #e2e8f0',
          padding: '2.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #0f172a, #64748b)'
          }} />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: '#f1f5f9',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              }}>
                <Building2 size={28} />
              </div>
              <span style={{
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                letterSpacing: '0.05em'
              }}>
                B2B ENTERPRISE
              </span>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Merchant & Ops Portal
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Designed for retail operations directors, store managers, demand planners, and supply chain analysts.
            </p>

            {/* Persona Identity Badge */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img
                src={B2B_PROFILE.avatar}
                alt={B2B_PROFILE.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{B2B_PROFILE.name}</strong>
                  <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    Executive Store Director
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.775rem', display: 'block' }}>{B2B_PROFILE.email}</span>
                <span style={{ color: '#0f172a', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                  <Lock size={12} color="#0f172a" /> {B2B_PROFILE.storeId}
                </span>
              </div>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#0f172a" />
                <span><strong>Phantom Inventory Radar:</strong> Real-time POS & inventory sync</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#0f172a" />
                <span><strong>14-Day Demand Forecasting:</strong> Weather & seasonal predictive modeling</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0f172a' }}>
                <CheckCircle2 size={16} color="#0f172a" />
                <span><strong>Basket Affinity & Cross-Selling:</strong> Promotional bundle optimization</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#0f172a" />
                <span><strong>Customer Segmentation:</strong> High-value VIP cohorts & retention</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPersona(B2B_PROFILE)}
            style={{
              width: '100%',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            <span>Log in as Elena Rostova (B2B)</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Security Footnote */}
      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.825rem' }}>
        <ShieldCheck size={16} color="#16a34a" />
        <span>Enterprise Role-Based Access Control (RBAC) & End-to-End Encrypted Session Security</span>
      </div>
    </div>
  );
};
