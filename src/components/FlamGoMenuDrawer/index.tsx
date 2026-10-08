import React, { useEffect } from 'react';
import { 
  X, User, ChevronRight, HelpCircle, LogOut 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface FlamGoMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: UserProfile;
  onSelectCategory?: (category: string) => void;
  onNavigateView: (view: string, useCase?: string) => void;
  onSearch?: (query: string) => void;
  onSwitchPersona: () => void;
  onOpenSolutionModal?: (solutionId: '01' | '02' | '03') => void;
}

export const FlamGoMenuDrawer: React.FC<FlamGoMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentPersona,
  onNavigateView,
  onSwitchPersona,
  onOpenSolutionModal
}) => {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleViewAction = (view: string) => {
    onNavigateView(view);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          transition: 'opacity 0.25s ease'
        }}
      />

      {/* Slide-in Menu Panel */}
      <div
        style={{
          position: 'relative',
          width: '360px',
          maxWidth: '85vw',
          height: '100%',
          background: '#ffffff',
          boxShadow: '8px 0 30px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Header with User Info */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #ea580c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={currentPersona.avatar}
              alt={currentPersona.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #f97316'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hello,</span>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>{currentPersona.name}</strong>
              </div>
              <span style={{
                background: '#ea580c',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.1rem 0.45rem',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '0.15rem'
              }}>
                FlamGo {currentPersona.tier}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* B2C Conversational Commerce Features Section */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Conversational Solutions
            </span>
            <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
              B2C Persona
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Guided Selling */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.9rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}
            >
              <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                Guided Selling & AI Shopping Concierges
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Natural dialogue intent refinement into curated product bundles
              </p>
              <button
                onClick={() => {
                  if (onOpenSolutionModal) {
                    onOpenSolutionModal('01');
                  } else {
                    onNavigateView('conversational', '01');
                  }
                  onClose();
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginTop: '0.35rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <span>Explore</span>
                <sup style={{ color: '#2563eb', fontSize: '0.68em', fontWeight: 800, marginLeft: '2px' }}>Preview</sup>
                <ChevronRight size={13} color="#2563eb" />
              </button>
            </div>

            {/* Order Management & Returns */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.9rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}
            >
              <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                Automated Order Management, WISMO & Returns
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Autonomous post-purchase resolution with DOMS/WMS and Vision AI
              </p>
              <button
                onClick={() => {
                  if (onOpenSolutionModal) {
                    onOpenSolutionModal('02');
                  } else {
                    onNavigateView('conversational', '02');
                  }
                  onClose();
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginTop: '0.35rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <span>Explore</span>
                <sup style={{ color: '#2563eb', fontSize: '0.68em', fontWeight: 800, marginLeft: '2px' }}>Preview</sup>
                <ChevronRight size={13} color="#16a34a" />
              </button>
            </div>

            {/* Cart Recovery */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.9rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}
            >
              <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                High-Converting Cart Recovery & Abandonment Nudges
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Proactive outbound messaging addressing exact purchase objections
              </p>
              <button
                onClick={() => {
                  if (onOpenSolutionModal) {
                    onOpenSolutionModal('03');
                  } else {
                    onNavigateView('conversational', '03');
                  }
                  onClose();
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #fed7aa',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginTop: '0.35rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <span>Explore</span>
                <sup style={{ color: '#2563eb', fontSize: '0.68em', fontWeight: 800, marginLeft: '2px' }}>Preview</sup>
                <ChevronRight size={13} color="#ea580c" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Body - Help & Settings */}
        <div style={{ padding: '1rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.5rem 1.5rem 0.5rem' }}>
            <h4 style={{ 
              fontSize: '0.825rem', 
              fontWeight: 800, 
              color: '#0f172a', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              margin: 0 
            }}>
              Help & Settings
            </h4>
          </div>

          <button
            onClick={() => handleViewAction('orders')}
            className="drawer-item"
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.8rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#334155',
              fontWeight: 500,
              transition: 'background 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <User size={18} color="#475569" />
              <span>Your Account & Orders</span>
            </span>
            <ChevronRight size={15} color="#94a3b8" />
          </button>

          <button
            onClick={() => handleViewAction('live-return')}
            className="drawer-item"
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.8rem 1.5rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#334155',
              fontWeight: 500,
              transition: 'background 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <HelpCircle size={18} color="#475569" />
              <span>Customer Support & Instant Returns</span>
            </span>
            <ChevronRight size={15} color="#94a3b8" />
          </button>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }} />

          <button
            onClick={() => {
              onSwitchPersona();
              onClose();
            }}
            className="drawer-item"
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '0.8rem 1.5rem 1.25rem',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#ea580c',
              fontWeight: 700,
              transition: 'background 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <LogOut size={18} color="#ea580c" />
              <span>Sign in / Switch Persona</span>
            </span>
            <ChevronRight size={15} color="#ea580c" />
          </button>
        </div>
      </div>
    </div>
  );
};
