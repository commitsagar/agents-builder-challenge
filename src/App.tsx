import React, { useState } from 'react';
import { AuthGateway } from './components/AuthGateway';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { GpsLiveTracker } from './components/GpsLiveTracker';
import { LiveVideoReturn } from './components/LiveVideoReturn';
import { CustomerReturns } from './components/CustomerReturns';
import { CustomerOrders } from './components/CustomerOrders';
import { MerchantHub } from './components/MerchantHub';
import { LookerAnalytics } from './components/LookerAnalytics';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { ConversationalCommerce } from './components/ConversationalCommerce';
import { CartDrawer } from './components/CartDrawer';
import { SettingsModal } from './components/SettingsModal';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { Product, CartItem, IntentAnalysis, UserProfile } from './types';
import { B2C_PROFILE, B2B_PROFILE } from './data/mockScenarios';
import { RetailStore, MOCK_RETAIL_STORES } from './data/mockStores';
import { geminiRetailService } from './services/geminiService';
import { ShieldCheck, Truck, RotateCcw, CreditCard, ChevronRight, X } from 'lucide-react';

export function App() {
  // Authentication State: null means at Auth Gateway, otherwise holds current UserProfile
  const [currentPersona, setCurrentPersona] = useState<UserProfile | null>(null);
  
  // Portal navigation
  const [activeView, setActiveView] = useState<string>('store');
  const [trackedOrderId, setTrackedOrderId] = useState<string>('ORD-99482');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<RetailStore>(MOCK_RETAIL_STORES[0]);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [intentResult, setIntentResult] = useState<IntentAnalysis | null>(null);
  const [conversationalUseCase, setConversationalUseCase] = useState<'01' | '02' | '03' | '04' | '05'>('01');
  const [activeSolutionModal, setActiveSolutionModal] = useState<'01' | '02' | '03' | null>(null);
  const [, setKeyVersion] = useState(0);

  const handleSelectPersona = (profile: UserProfile) => {
    setCurrentPersona(profile);
    setActiveView(profile.persona === 'B2C' ? 'store' : 'merchant');
  };

  const handleSwitchPersona = () => {
    setCurrentPersona(null);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setIntentResult(null);
    setActiveView('store');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIntentResult(null);
      return;
    }
    setActiveView('store');
    try {
      const intent = await geminiRetailService.parseShopperIntent(query, cartItems.map(c => c.product));
      setIntentResult(intent);
    } catch (e) {
      console.error(e);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If no persona selected, render the dedicated Dual-Portal Login Gateway
  if (!currentPersona) {
    return <AuthGateway onSelectPersona={handleSelectPersona} />;
  }

  const isB2C = currentPersona.persona === 'B2C';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      
      {/* Persona-Aware Navigation Bar */}
      <Navbar
        currentPersona={currentPersona}
        onSwitchPersona={handleSwitchPersona}
        activeView={activeView}
        setActiveView={(view: any, useCase?: string) => {
          if (useCase) setConversationalUseCase(useCase as any);
          setActiveView(view);
        }}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        selectedStore={selectedStore}
        openStoreLocator={() => setIsStoreLocatorOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSolutionModal={(id) => setActiveSolutionModal(id)}
      />

      {/* Main Persona Portal Body */}
      <main className="container-full" style={{ padding: '2rem 1.5rem', flexGrow: 1 }}>
        {/* B2C Consumer Storefront */}
        {isB2C && activeView === 'store' && (
          <Storefront
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            intentResult={intentResult}
            onSearch={handleSearch}
            selectedStore={selectedStore}
            onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
            activeCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onOpenConversational={() => {
              setConversationalUseCase('01');
              setActiveView('conversational');
            }}
          />
        )}

        {/* Dedicated Order History View */}
        {activeView === 'orders' && (
          <CustomerOrders
            initialOrderId={trackedOrderId}
            onOpenLiveTracking={(oid) => {
              setTrackedOrderId(oid);
              setActiveView('gps');
            }}
            onBrowseStore={() => setActiveView('store')}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Live Tracking & Return Views */}
        {activeView === 'gps' && <GpsLiveTracker initialOrderId={trackedOrderId} />}
        {activeView === 'live-return' && <LiveVideoReturn />}
        {activeView === 'returns' && <CustomerReturns />}
        {activeView === 'conversational' && (
          <ConversationalCommerce
            onAddToCart={handleAddToCart}
            onNavigateView={(v) => setActiveView(v)}
            isB2CPersona={isB2C}
            initialUseCase={conversationalUseCase}
          />
        )}

        {/* B2B Enterprise Operations Views */}
        {!isB2C && (
          <>
            {activeView === 'merchant' && <MerchantHub />}
            {activeView === 'looker' && <LookerAnalytics />}
            {activeView === 'tech' && <ArchitectureGraph />}
          </>
        )}
      </main>

      {/* Clean Modern Retail Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        padding: '2.5rem 1.5rem 1.75rem'
      }}>
        <div className="container-full" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Trust badges bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Truck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block' }}>Live GPS Fleet Tracking</strong>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Near Real-Time Telematics</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <RotateCcw size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block' }}>Instant Video Return</strong>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Fast Approval Under 20s</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block' }}>Real-Time Stock Sync</strong>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Verified Multi-Store Inventory</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                <CreditCard size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', display: 'block' }}>Enterprise Security</strong>
                <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Bank-Grade Data Protection</span>
              </div>
            </div>
          </div>

          {/* Links & Brand info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.825rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Flam<span style={{ color: '#ea580c' }}>Go</span>
              </span>
              <span>© 2026 FlamGo Retail Technologies Inc. • All Rights Reserved</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: 500 }}>
              <button
                onClick={handleSwitchPersona}
                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
              >
                ⇄ Switch Persona Portal ({isB2C ? 'B2C' : 'B2B'})
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedStore={selectedStore}
        onNavigateToOrders={(oid) => {
          if (oid) setTrackedOrderId(oid);
          setActiveView('orders');
          setIsCartOpen(false);
        }}
      />

      {/* Store Locator & Fulfillment Hub Modal */}
      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
        selectedStore={selectedStore}
        onSelectStore={(store) => setSelectedStore(store)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateKey={() => setKeyVersion((k) => k + 1)}
      />

      {/* Dedicated Individual Conversational Solution Popup Modal */}
      {activeSolutionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setActiveSolutionModal(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '1040px',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #e2e8f0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>
                    Explore <sup style={{ color: '#2563eb', fontSize: '0.85em', fontWeight: 800 }}>Preview</sup>
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Interactive Solution</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                  {activeSolutionModal === '01' && 'Guided Selling & AI Shopping Concierges'}
                  {activeSolutionModal === '02' && 'Automated Order Management, WISMO & Returns'}
                  {activeSolutionModal === '03' && 'High-Converting Cart Recovery & Abandonment Nudges'}
                </h3>
              </div>
              <button
                onClick={() => setActiveSolutionModal(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - ONLY this individual solution is shown, other 2 hidden */}
            <div style={{ padding: '1.5rem 1.75rem' }}>
              <ConversationalCommerce
                onAddToCart={handleAddToCart}
                onNavigateView={(v) => {
                  setActiveSolutionModal(null);
                  setActiveView(v);
                }}
                isB2CPersona={true}
                initialUseCase={activeSolutionModal}
                isModal={true}
                onClose={() => setActiveSolutionModal(null)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
