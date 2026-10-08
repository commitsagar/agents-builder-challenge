import React, { useState } from 'react';
import { 
  X, MapPin, Building2, Truck, ShoppingBag, Clock, Phone, 
  CheckCircle2, Search, ArrowRight, ShieldCheck, Navigation, ChevronRight 
} from 'lucide-react';
import { RetailStore, MOCK_RETAIL_STORES } from '../../data/mockStores';

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: RetailStore;
  onSelectStore: (store: RetailStore) => void;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({
  isOpen,
  onClose,
  selectedStore,
  onSelectStore
}) => {
  const [searchZip, setSearchZip] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'express' | 'pickup'>('all');

  if (!isOpen) return null;

  const filteredStores = MOCK_RETAIL_STORES.filter(store => {
    if (searchZip.trim()) {
      const q = searchZip.toLowerCase();
      const matchZip = store.zip.includes(q);
      const matchCity = store.city.toLowerCase().includes(q);
      const matchName = store.name.toLowerCase().includes(q);
      if (!matchZip && !matchCity && !matchName) return false;
    }
    if (activeTab === 'express') return store.hasExpressDelivery;
    if (activeTab === 'pickup') return store.hasPickup;
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '1.5rem'
    }} onClick={onClose}>
      <div
        style={{
          maxWidth: '820px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Building2 size={15} />
              <span>Omnichannel Store & Inventory Network</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Find Your Store & Fulfillment Origin
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0' }}>
              Products in your cart will be fulfilled and reserved directly from this store's real-time inventory.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff' }}>
          <div style={{ flexGrow: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by ZIP, city, or neighborhood (e.g. 98101, Bellevue)..."
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeTab === 'all' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: activeTab === 'all' ? '#eff6ff' : '#ffffff',
                color: activeTab === 'all' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              All Stores ({MOCK_RETAIL_STORES.length})
            </button>
            <button
              onClick={() => setActiveTab('express')}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeTab === 'express' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: activeTab === 'express' ? '#eff6ff' : '#ffffff',
                color: activeTab === 'express' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              ⚡ 2-Hr Express Only
            </button>
            <button
              onClick={() => setActiveTab('pickup')}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: activeTab === 'pickup' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: activeTab === 'pickup' ? '#eff6ff' : '#ffffff',
                color: activeTab === 'pickup' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              In-Store Pickup Ready
            </button>
          </div>
        </div>

        {/* Store List */}
        <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredStores.map((store) => {
            const isCurrent = store.id === selectedStore.id;

            return (
              <div
                key={store.id}
                style={{
                  border: isCurrent ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  background: isCurrent ? '#f8fafc' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  boxShadow: isCurrent ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ maxWidth: '480px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {store.storeNumber}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{store.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                      • {store.distanceMiles} mi away
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem' }}>
                    {store.address}, {store.city}, {store.state} {store.zip}
                  </p>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.785rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} color="#0f172a" /> {store.hours}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={13} color="#0f172a" /> {store.phone}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a', fontWeight: 600 }}>
                      <CheckCircle2 size={13} color="#16a34a" /> {store.inStockCount} of {store.totalCatalogCount} items in stock
                    </span>
                  </div>

                  {/* Fulfillment services badges */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Truck size={12} /> {store.deliveryTimeEstimate}
                    </span>
                    <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShoppingBag size={12} /> {store.pickupTimeEstimate}
                    </span>
                  </div>
                </div>

                {/* Right Action */}
                <div>
                  {isCurrent ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '0.45rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <CheckCircle2 size={15} />
                        <span>Fulfilling from this store</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active customer store</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectStore(store);
                        onClose();
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.15rem', fontSize: '0.825rem' }}
                    >
                      <span>Select this Store</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredStores.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Building2 size={36} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>No stores match "{searchZip}"</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try searching for "Seattle" or "98101".</p>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Multi-store inventory synchronized in real time. Never oversold.</span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
