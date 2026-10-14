import React, { useState } from 'react';
import { ShoppingBag, MapPin, Search, RotateCcw, Package, Building2, ChevronDown, Navigation, Video, Menu, Zap, Truck } from 'lucide-react';
import { UserProfile } from '../types';
import { RetailStore } from '../data/mockStores';
import { FlamGoMenuDrawer } from './FlamGoMenuDrawer';
import { B2C_PROFILE, STORE_MANAGER_PROFILE } from '../data/mockScenarios';

interface NavbarProps {
  currentPersona: UserProfile;
  onSwitchPersona: () => void;
  onSelectPersona?: (persona: UserProfile) => void;
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
  onSelectPersona,
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
        background: '#0f172a',
        color: '#cbd5e1',
        fontSize: '0.75rem',
        padding: '0.4rem 1.5rem'
      }}>
        <div className="container-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left Context Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
          </div>

          {/* Right Persona Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {currentPersona.persona === 'B2C' && onSelectPersona && (
              <button
                onClick={() => {
                  onSelectPersona(STORE_MANAGER_PROFILE);
                  setActiveView('manager-dashboard');
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Switch to Store Manager Console (Inventory Intelligence & Customer Segmentation)"
              >
                <Building2 size={12} />
                <span>👔 Store Manager Console</span>
              </button>
            )}

            {currentPersona.persona === 'MANAGER' && onSelectPersona && (
              <button
                onClick={() => {
                  onSelectPersona(B2C_PROFILE);
                  setActiveView('store');
                }}
                style={{
                  background: 'rgba(234, 88, 12, 0.2)',
                  border: '1px solid rgba(234, 88, 12, 0.5)',
                  color: '#fed7aa',
                  borderRadius: '6px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Switch to B2C Consumer Shopper Portal"
              >
                <ShoppingBag size={12} />
                <span>Switch to Shopper View</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{currentPersona.name}</span>
              <span style={{
                background: currentPersona.persona === 'MANAGER' ? '#e0f2fe' : '#fef3c7',
                color: currentPersona.persona === 'MANAGER' ? '#0369a1' : '#92400e',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px'
              }}>
                {currentPersona.tier || (currentPersona.persona === 'MANAGER' ? 'Admin' : 'VIP Member')}
              </span>
            </div>

            <button
              onClick={onSwitchPersona}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.725rem',
                textDecoration: 'underline'
              }}
              title="Sign out to role selector"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Retail / Admin Header */}
      {currentPersona.persona === 'MANAGER' ? (
        <div style={{ padding: '0.85rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Manager Logo */}
            <div
              onClick={() => setActiveView('manager-dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.25rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
              }}>
                M
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Flam<span style={{ color: '#0284c7' }}>Go</span> Admin
                  </span>
                  <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                    STORE MANAGER
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#64748b', margin: 0 }}>
                  Seattle Flagship (STORE-104) • Inventory Intelligence & Customer Segmentation
                </p>
              </div>
            </div>

            {/* Quick Navigation Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveView('manager-dashboard')}
                style={{
                  background: activeView === 'manager-dashboard' ? '#eff6ff' : 'transparent',
                  border: activeView === 'manager-dashboard' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  color: activeView === 'manager-dashboard' ? '#1d4ed8' : '#334155',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Package size={16} color="#2563eb" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => setActiveView('store')}
                style={{
                  background: activeView === 'store' ? '#eff6ff' : 'transparent',
                  border: activeView === 'store' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                  color: activeView === 'store' ? '#1d4ed8' : '#64748b',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <ShoppingBag size={16} />
                <span>Preview Storefront</span>
              </button>
            </div>

            {/* Right Action Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {onSelectPersona && (
                <button
                  onClick={() => {
                    onSelectPersona(B2C_PROFILE);
                    setActiveView('store');
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>Switch to Shopper (Alex)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '0.85rem 1.5rem' }}>
            <div className="container-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Logo */}
          <div
            onClick={() => {
              setActiveView('store');
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)'
            }}>
              F
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Flam<span style={{ color: '#ea580c' }}>Go</span>
                </span>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', fontWeight: 800 }}>
                  VIP Shopper
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                Smart Digital & In-Store Shopping
              </p>
            </div>
          </div>

          {/* Central Section: Product Search */}
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

          {/* Quick Actions (Right Hand) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
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
          </div>

        </div>
      </div>

      {/* FlamGo Secondary Utility Subnav */}
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
                <span>Store #402 Seattle</span>
              </button>
            )}
          </div>
        </div>
      </>
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
