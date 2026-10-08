import React, { useState } from 'react';
import { ShoppingBag, MapPin, Search, RotateCcw, Package, Building2, SlidersHorizontal, BarChart3, ChevronDown, Navigation, Video, Sparkles, LogOut, Lock, User, Layers, Users, Menu, Zap, Truck, Bot } from 'lucide-react';
import { UserProfile } from '../types';
import { RetailStore } from '../data/mockStores';
import { FlamGoMenuDrawer } from './FlamGoMenuDrawer';

interface NavbarProps {
  currentPersona: UserProfile;
  onSwitchPersona: () => void;
  activeView: string;
  setActiveView: (view: any, useCase?: string) => void;
  cartCount: number;
  openCart: () => void;
  openSettings: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (q: string) => void;
  selectedStore?: RetailStore;
  openStoreLocator?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenSolutionModal?: (solutionId: '01' | '02' | '03') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSwitchPersona,
  activeView,
  setActiveView,
  cartCount,
  openCart,
  openSettings,
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedStore,
  openStoreLocator,
  selectedCategory,
  onSelectCategory,
  onOpenSolutionModal
}) => {
  const isB2C = currentPersona.persona === 'B2C';
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      
      {/* Top Utility Persona Bar */}
      <div style={{
        background: isB2C ? '#0f172a' : '#1e293b',
        color: '#cbd5e1',
        fontSize: '0.75rem',
        padding: '0.4rem 1.5rem',
        borderBottom: isB2C ? 'none' : '1px solid #334155'
      }}>
        <div className="container-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left Context Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {isB2C ? (
              <>
                {openStoreLocator && selectedStore ? (
                  <button
                    onClick={openStoreLocator}
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '6px',
                      padding: '0.2rem 0.65rem',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.725rem'
                    }}
                    title="Click to change your local store fulfillment origin"
                  >
                    <Building2 size={13} color="#38bdf8" />
                    <span>Fulfilling from: <strong style={{ color: '#fff' }}>{selectedStore.name} ({selectedStore.distanceMiles} mi)</strong></span>
                    <ChevronDown size={12} color="#94a3b8" />
                  </button>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={13} color="#38bdf8" /> Fulfilling from: <strong style={{ color: '#fff' }}>Seattle Flagship (0.8 mi)</strong>
                  </span>
                )}
                <span style={{ color: '#64748b' }}>|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={13} color="#38bdf8" /> Deliver to: <strong style={{ color: '#fff' }}>Seattle, WA 98101</strong>
                </span>
                <span style={{ color: '#64748b' }}>|</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>⚡ 2-Hour Delivery Active</span>
              </>
            ) : (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={13} color="#f59e0b" /> Store Assigned: <strong style={{ color: '#fff' }}>Store #402 (Seattle Flagship)</strong>
                </span>
                <span style={{ color: '#64748b' }}>|</span>
                <span style={{ color: '#94a3b8' }}>District: <strong>PNW Region (18 Stores)</strong></span>
                <span style={{ color: '#64748b' }}>|</span>
                <span style={{ color: '#34d399' }}>Real-Time Multi-Store Stock Sync Active</span>
              </>
            )}
          </div>

          {/* Right Persona Pill & Switch Portal Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{currentPersona.name}</span>
              <span style={{
                background: isB2C ? '#fef3c7' : '#eff6ff',
                color: isB2C ? '#92400e' : '#1d4ed8',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px'
              }}>
                {isB2C ? currentPersona.tier : 'Executive Director'}
              </span>
            </div>

            <span style={{ color: '#475569' }}>|</span>

            {/* Prominent Switch Portal Button */}
            <button
              onClick={onSwitchPersona}
              style={{
                background: isB2C ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                border: isB2C ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                color: isB2C ? '#38bdf8' : '#fbbf24',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Return to Portal Selection Gateway"
            >
              <LogOut size={12} />
              <span>Switch to {isB2C ? 'B2B Enterprise' : 'B2C Shopper'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Retail / Ops Header */}
      <div style={{ padding: '0.85rem 1.5rem' }}>
        <div className="container-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo */}
          <div
            onClick={() => {
              setActiveView(isB2C ? 'store' : 'merchant');
              setSearchQuery('');
              onSearch('');
              if (onSelectCategory) onSelectCategory('All');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isB2C
                ? 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #2563eb 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.25rem',
              boxShadow: isB2C ? '0 2px 8px rgba(234, 88, 12, 0.35)' : '0 2px 6px rgba(15, 23, 42, 0.3)'
            }}>
              {isB2C ? 'F' : 'E'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {isB2C ? (
                    <>Flam<span style={{ color: '#ea580c' }}>Go</span></>
                  ) : (
                    <>Flam<span style={{ color: '#0f172a' }}>Go Ops Enterprise</span></>
                  )}
                </span>
                <span className={`badge ${isB2C ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', fontWeight: 800 }}>
                  {isB2C ? 'B2C Shopper' : 'B2B Merchant'}
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                {isB2C ? 'Smart Digital & In-Store Shopping' : 'Unified Retail Operations & Supply Chain'}
              </p>
            </div>
          </div>

          {/* Central Section: Search for B2C, or Quick Links for B2B */}
          {isB2C ? (
            <div style={{ flex: '1 1 540px', maxWidth: '640px', position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                {/* Amazon.in Category Select Dropdown */}
                <select
                  value={selectedCategory || 'All'}
                  onChange={(e) => {
                    const cat = e.target.value;
                    if (onSelectCategory) onSelectCategory(cat);
                  }}
                  style={{
                    background: '#f8fafc',
                    border: 'none',
                    borderRight: '1px solid #cbd5e1',
                    padding: '0 0.65rem',
                    height: '42px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px 0 0 6px',
                    flexShrink: 0,
                    maxWidth: '135px'
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Home & Decor">Home & Decor</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Gourmet">Gourmet</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Toys & Hobbies">Toys & Hobbies</option>
                </select>
                <div style={{ padding: '0 0.65rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products or describe what you want (e.g. 'ergonomic chair under $300')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    padding: '0.7rem 0.5rem',
                    fontSize: '0.925rem',
                    width: '100%',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
                <button
                  onClick={() => onSearch(searchQuery)}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    padding: '0 1.25rem',
                    height: '42px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0
                  }}
                >
                  <span>Search</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveView('merchant')}
                className={`btn ${activeView === 'merchant' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
              >
                <Building2 size={15} />
                <span>Store Ops & Phantom Radar</span>
              </button>
              <button
                onClick={() => setActiveView('looker')}
                className={`btn ${activeView === 'looker' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
              >
                <BarChart3 size={15} />
                <span>Executive KPI Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView('tech')}
                className={`btn ${activeView === 'tech' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
              >
                <SlidersHorizontal size={15} />
                <span>Retail Solutions & Strategy</span>
              </button>
            </div>
          )}

          {/* Quick Actions (Right Hand) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {isB2C ? (
              <>

                {/* Live GPS Tracker */}
                <button
                  onClick={() => setActiveView('gps')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: activeView === 'gps' ? '#eff6ff' : 'transparent',
                    border: activeView === 'gps' ? '1px solid #bfdbfe' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    color: activeView === 'gps' ? '#1d4ed8' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Navigation size={17} color={activeView === 'gps' ? '#2563eb' : '#64748b'} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.65rem', color: '#16a34a', display: 'block', lineHeight: 1, fontWeight: 700 }}>Live GPS</span>
                    <span>Track Item</span>
                  </div>
                </button>

                {/* Live Video Return Call */}
                <button
                  onClick={() => setActiveView('live-return')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: activeView === 'live-return' ? '#eff6ff' : 'transparent',
                    border: activeView === 'live-return' ? '1px solid #bfdbfe' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    color: activeView === 'live-return' ? '#1d4ed8' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Video size={17} color={activeView === 'live-return' ? '#2563eb' : '#64748b'} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.65rem', color: '#2563eb', display: 'block', lineHeight: 1, fontWeight: 700 }}>Live Call</span>
                    <span>AI Return</span>
                  </div>
                </button>

                {/* Your Orders Tab */}
                <button
                  onClick={() => setActiveView('orders')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: activeView === 'orders' ? '#eff6ff' : 'transparent',
                    border: activeView === 'orders' ? '1px solid #bfdbfe' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    cursor: 'pointer',
                    color: activeView === 'orders' ? '#1d4ed8' : '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease'
                  }}
                  title="View your customer order history & tracking"
                >
                  <Package size={17} color={activeView === 'orders' ? '#2563eb' : '#64748b'} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', lineHeight: 1 }}>History</span>
                    <span>Your Orders</span>
                  </div>
                </button>

                {/* Cart Button */}
                <button
                  onClick={openCart}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.15rem', position: 'relative', borderRadius: '8px' }}
                >
                  <ShoppingBag size={18} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span style={{
                      background: '#ea580c',
                      color: '#fff',
                      borderRadius: '9999px',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginLeft: '0.25rem'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={openSettings}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
              >
                Settings
              </button>
            )}
          </div>

        </div>
      </div>

      {/* FlamGo Secondary Utility Subnav */}
      {isB2C && (
        <div style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '0.45rem 1.5rem', overflowX: 'auto' }}>
          <div className="container-full" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.825rem' }}>
            <button
              onClick={() => setIsMenuDrawerOpen(true)}
              style={{
                background: 'rgba(234, 88, 12, 0.2)',
                border: '1px solid rgba(234, 88, 12, 0.5)',
                color: '#ffffff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                transition: 'all 0.15s ease'
              }}
              title="Click to open FlamGo Menu"
            >
              <Menu size={16} color="#fbbf24" />
              <span>Menu</span>
            </button>
            <span style={{ color: '#334155' }}>|</span>

            <button
              onClick={() => {
                setActiveView('store');
                onSearch('deal');
              }}
              style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Zap size={14} color="#fbbf24" />
              <span>Lightning Deals</span>
            </button>

            <button
              onClick={() => {
                setActiveView('store');
                if (onSelectCategory) onSelectCategory('Electronics');
              }}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500 }}
            >
              Best Sellers
            </button>

            <button
              onClick={() => {
                setActiveView('store');
                onSearch('2-Hour');
              }}
              style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Truck size={14} color="#34d399" />
              <span>⚡ FlamGo 2-Hour Delivery</span>
            </button>

            <button
              onClick={() => setActiveView('live-return')}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RotateCcw size={14} color="#94a3b8" />
              <span>Instant AI Returns</span>
            </button>

            <button
              onClick={() => setActiveView('gps')}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Navigation size={14} color="#94a3b8" />
              <span>Live Order GPS</span>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              style={{
                background: activeView === 'orders' ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                border: activeView === 'orders' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeView === 'orders' ? '#93c5fd' : '#ffffff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              title="Click to view your customer order history"
            >
              <Package size={14} color="#60a5fa" />
              <span>Your Orders</span>
            </button>

            {openStoreLocator && (
              <button
                onClick={openStoreLocator}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem'
                }}
              >
                <Building2 size={13} color="#38bdf8" />
                <span>Store #402 Seattle (Aisle Navigator)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FlamGo All Departments Slide-Over Drawer */}
      <FlamGoMenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        currentPersona={currentPersona}
        onSelectCategory={(cat) => {
          if (onSelectCategory) onSelectCategory(cat);
          setActiveView('store');
        }}
        onNavigateView={(view, useCase) => setActiveView(view, useCase)}
        onSearch={(query) => {
          onSearch(query);
          setActiveView('store');
        }}
        onSwitchPersona={onSwitchPersona}
        onOpenSolutionModal={onOpenSolutionModal}
      />
    </header>
  );
};
