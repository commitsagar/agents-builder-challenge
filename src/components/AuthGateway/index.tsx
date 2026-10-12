import React from 'react';
import { ShoppingBag, ShieldCheck, ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { B2C_PROFILE } from '../../data/mockScenarios';
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
          <span>FlamGo Omnichannel Retail Platform</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
          Welcome to FlamGo
        </h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Sign in to access your personalized smart storefront, 2-hour Seattle local delivery, live GPS courier tracking, and instant AI video returns.
        </p>
      </div>

      {/* Single Consumer Portal Card */}
      <div style={{
        maxWidth: '480px',
        width: '100%'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid #e2e8f0',
          padding: '2.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #ea580c, #2563eb)'
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
                VIP SHOPPER
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
            <span>Sign in as Alex Rivera</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Security Footnote */}
      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.825rem' }}>
        <ShieldCheck size={16} color="#16a34a" />
        <span>End-to-End Encrypted Customer Session Security</span>
      </div>
    </div>
  );
};
