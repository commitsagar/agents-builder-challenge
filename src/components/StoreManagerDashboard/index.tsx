import React, { useState, useEffect } from 'react';
import { 
  Building2, Package, Users, AlertTriangle, TrendingUp, 
  CheckCircle2, ArrowRight, ShieldAlert, 
  Search, Smartphone, MapPin, Zap, BarChart3, 
  ShoppingBag, DollarSign, BellRing
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MOCK_PHANTOM_ANOMALIES, 
  MOCK_CUSTOMER_SEGMENTS, 
  MOCK_BASKET_AFFINITIES, 
  STORE_MANAGER_PROFILE 
} from '../../data/mockScenarios';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { PhantomAnomaly, CustomerSegment } from '../../types';
import { 
  fetchCloudRunDemand, 
  dispatchCloudRunCycleCount, 
  fetchCloudRunInventory,
  InventoryItem 
} from '../../services/apiClient';

interface StoreManagerDashboardProps {
  onSwitchToShopper?: () => void;
}

export const StoreManagerDashboard: React.FC<StoreManagerDashboardProps> = ({
  onSwitchToShopper
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'inventory' | 'segmentation' | 'stock'>('inventory');

  // --- Inventory Intelligence State ---
  const [anomalies, setAnomalies] = useState<PhantomAnomaly[]>(MOCK_PHANTOM_ANOMALIES);
  const [selectedAnomaly, setSelectedAnomaly] = useState<PhantomAnomaly>(MOCK_PHANTOM_ANOMALIES[0]);
  const [dispatchedTasks, setDispatchedTasks] = useState<Record<string, string>>({});
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demand Forecast State
  const [selectedForecastSku, setSelectedForecastSku] = useState<string>('prod-001');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(false);

  // Live Inventory State
  const [catalogItems, setCatalogItems] = useState<InventoryItem[]>([]);
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [inventoryFilter, setInventoryFilter] = useState<string>('All');

  // --- Customer Segmentation State ---
  const segments = MOCK_CUSTOMER_SEGMENTS;
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>(MOCK_CUSTOMER_SEGMENTS[0]);
  const [activatedPlaybooks, setActivatedPlaybooks] = useState<Record<string, boolean>>({});
  const basketRules = MOCK_BASKET_AFFINITIES;

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load forecast data
  useEffect(() => {
    loadForecast(selectedForecastSku);
  }, [selectedForecastSku]);

  // Load inventory on mount
  useEffect(() => {
    loadLiveInventory();
  }, []);

  const loadForecast = async (sku: string) => {
    setIsLoadingForecast(true);
    try {
      const res = await fetchCloudRunDemand(sku);
      if (res && res.forecastPoints && res.forecastPoints.length > 0) {
        setForecastData(res.forecastPoints);
      } else {
        setForecastData(getDefaultForecast(sku));
      }
    } catch (e) {
      setForecastData(getDefaultForecast(sku));
    } finally {
      setIsLoadingForecast(false);
    }
  };

  const loadLiveInventory = async () => {
    try {
      const items = await fetchCloudRunInventory();
      if (items && items.length > 0) {
        setCatalogItems(items);
      } else {
        setCatalogItems(MOCK_PRODUCTS.slice(0, 16).map(p => ({
          sku: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          quantity_on_hand: p.stock,
          reorder_point: 8,
          store_id: 'STORE-104',
          aisle_location: p.inStoreAisle || 'Aisle 2B',
          image_url: p.image,
          description: p.description
        })));
      }
    } catch (e) {
      setCatalogItems(MOCK_PRODUCTS.slice(0, 16).map(p => ({
        sku: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        quantity_on_hand: p.stock,
        reorder_point: 8,
        store_id: 'STORE-104',
        aisle_location: p.inStoreAisle || 'Aisle 2B',
        image_url: p.image,
        description: p.description
      })));
    }
  };

  const getDefaultForecast = (sku: string) => {
    const isCold = sku === 'prod-003' || sku === 'prod-005';
    return [
      { date: 'Oct 14', forecastedDemand: isCold ? 118 : 88, upperConfidence: 135, lowerConfidence: 74, weatherFactor: 'Cold Front 42°F', eventFactor: 'Surge' },
      { date: 'Oct 15', forecastedDemand: isCold ? 124 : 92, upperConfidence: 142, lowerConfidence: 78, weatherFactor: 'Rain & Wind 40°F', eventFactor: 'Rain Surge' },
      { date: 'Oct 16', forecastedDemand: isCold ? 95 : 80, upperConfidence: 110, lowerConfidence: 68, weatherFactor: 'Chilly 46°F' },
      { date: 'Oct 17', forecastedDemand: isCold ? 89 : 84, upperConfidence: 104, lowerConfidence: 70, weatherFactor: 'Clear 48°F' },
      { date: 'Oct 18', forecastedDemand: isCold ? 96 : 90, upperConfidence: 112, lowerConfidence: 76, weatherFactor: 'Partly Cloudy' },
      { date: 'Oct 19', forecastedDemand: isCold ? 132 : 115, upperConfidence: 152, lowerConfidence: 96, weatherFactor: 'Rain Showers', eventFactor: 'Weekend Flash' },
      { date: 'Oct 20', forecastedDemand: isCold ? 140 : 122, upperConfidence: 160, lowerConfidence: 102, weatherFactor: 'Cold Wind', eventFactor: 'Weekend Surge' }
    ];
  };

  // Dispatch Cycle Count to Handheld Terminal
  const handleDispatchCycleCount = async (anomaly: PhantomAnomaly) => {
    setIsDispatching(true);
    const generatedTaskId = `TASK-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      await dispatchCloudRunCycleCount(anomaly.sku, 'STORE-104', undefined, `Phantom Alert: ${anomaly.recommendedAction}`);
    } catch (e) {
      console.log('Using simulated handheld cycle count dispatch fallback');
    }

    setDispatchedTasks(prev => ({ ...prev, [anomaly.id]: generatedTaskId }));
    setAnomalies(prev => prev.map(a => a.id === anomaly.id ? { ...a, status: 'investigating' } : a));
    setIsDispatching(false);
    
    setToastMessage(`Dispatched Cycle Count ${generatedTaskId} to Associate Handheld at ${anomaly.storeLocation.split('•')[1] || 'Aisle 1A'}`);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#2563eb', '#38bdf8', '#16a34a']
    });
  };

  // Resolve / Mark Anomaly Verified
  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status: 'resolved', phantomRiskScore: 2.1 } : a));
    setToastMessage(`Cycle Count Completed: Inventory Ledger synchronized with physical count.`);
  };

  // Trigger Segment Playbook
  const handleTriggerPlaybook = (seg: CustomerSegment) => {
    setActivatedPlaybooks(prev => ({ ...prev, [seg.id]: true }));
    setToastMessage(`Campaign Active: "${seg.name}" playbook deployed to targeted omnichannel audience.`);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f59e0b', '#2563eb']
    });
  };

  // Filtered inventory list
  const filteredInventory = catalogItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                          item.sku.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = inventoryFilter === 'All' || item.category === inventoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 99999,
          border: '1px solid #334155',
          fontSize: '0.875rem',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease'
        }}>
          <BellRing size={18} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Store Manager Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
        border: '1px solid #334155',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={STORE_MANAGER_PROFILE.avatar}
            alt={STORE_MANAGER_PROFILE.name}
            style={{ width: '60px', height: '60px', borderRadius: '16px', border: '2px solid #38bdf8', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {STORE_MANAGER_PROFILE.name}
              </span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '6px'
              }}>
                Store Admin
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                System Status: Online
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.825rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={14} color="#38bdf8" />
                <strong>Seattle Flagship (STORE-104)</strong> • 500 Pine St, Seattle
              </span>
              <span>•</span>
              <span>Store Inventory: Synced</span>
              <span>•</span>
              <span>Predictive Analytics: Active</span>
            </div>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onSwitchToShopper && (
            <button
              onClick={onSwitchToShopper}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
              title="Switch back to Alex Rivera (B2C Shopper portal)"
            >
              <ShoppingBag size={15} color="#cbd5e1" />
              <span>Switch to Shopper View</span>
            </button>
          )}

          <div style={{
            background: 'rgba(234, 88, 12, 0.15)',
            border: '1px solid rgba(234, 88, 12, 0.4)',
            color: '#fb923c',
            padding: '0.55rem 0.95rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <ShieldAlert size={16} />
            <span>Role: Merchant Back-Office (Hidden from Shoppers)</span>
          </div>
        </div>
      </div>

      {/* Real-time KPI Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>LIVE STORE REVENUE (TODAY)</span>
            <DollarSign size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>$18,450.00</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} /> +14.2% vs yesterday (142 orders)
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>PHANTOM INVENTORY ANOMALIES</span>
            <AlertTriangle size={16} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ea580c' }}>
            {anomalies.filter(a => a.status === 'flagged').length} Flagged SKUs
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            Discrepancy risk: <strong>$8,323.86</strong> at risk
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>VIP SPEND SHARE (TOP COHORT)</span>
            <Users size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563eb' }}>48.2%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            From top 8% VIP Gold cohort (Avg Order: $286.40)
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>2-HOUR FULFILLMENT HEALTH</span>
            <Zap size={16} color="#0891b2" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>98.4%</div>
          <div style={{ fontSize: '0.75rem', color: '#0891b2', fontWeight: 600, marginTop: '0.25rem' }}>
            Average courier pick-to-drop: <strong>48 minutes</strong>
          </div>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e2e8f0',
        gap: '0.5rem',
        overflowX: 'auto',
        background: '#ffffff',
        padding: '0.5rem 1rem 0',
        borderRadius: '12px 12px 0 0'
      }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'inventory' ? '3px solid #2563eb' : '3px solid transparent',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'inventory' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Package size={18} />
          <span>1. Inventory Intelligence Hub</span>
          <span style={{
            background: '#fee2e2',
            color: '#b91c1c',
            fontSize: '0.7rem',
            padding: '0.1rem 0.45rem',
            borderRadius: '9999px',
            fontWeight: 800
          }}>
            {anomalies.filter(a => a.status === 'flagged').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('segmentation')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'segmentation' ? '3px solid #2563eb' : '3px solid transparent',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'segmentation' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Users size={18} />
          <span>2. Customer Segmentation & Cohorts</span>
          <span style={{
            background: '#e0f2fe',
            color: '#0369a1',
            fontSize: '0.7rem',
            padding: '0.1rem 0.45rem',
            borderRadius: '9999px',
            fontWeight: 800
          }}>
            4 Cohorts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'stock' ? '3px solid #2563eb' : '3px solid transparent',
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            color: activeTab === 'stock' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <BarChart3 size={18} />
          <span>3. Store Catalog & Shelf Stock</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INVENTORY INTELLIGENCE HUB */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Section 1A: Phantom Inventory Radar Banner */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    AUTOMATED RADAR: Discrepancy Detection
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>POS Velocity vs ERP Divergence</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  🚨 Phantom Inventory Anomaly Radar
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                  AI automatically identifies products showing positive balance in the system but zero sales velocity—indicating shrink, misplacement, or stockouts.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#334155',
                  fontWeight: 600
                }}>
                  Store 104 • Cycle Count Cycle: Active
                </span>
              </div>
            </div>

            {/* Anomalies Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {anomalies.map((item) => {
                const isDispatched = !!dispatchedTasks[item.id] || item.status === 'investigating';
                const isResolved = item.status === 'resolved';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnomaly(item)}
                    style={{
                      border: selectedAnomaly.id === item.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      background: isResolved ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <span style={{
                          background: isResolved ? '#dcfce7' : item.phantomRiskScore > 85 ? '#fee2e2' : '#fef3c7',
                          color: isResolved ? '#15803d' : item.phantomRiskScore > 85 ? '#b91c1c' : '#b45309',
                          fontWeight: 800,
                          fontSize: '0.725rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {isResolved ? '✓ Resolved' : `Phantom Risk: ${item.phantomRiskScore}%`}
                        </span>

                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          SKU: {item.sku}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        {item.productName}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.775rem', marginBottom: '0.75rem' }}>
                        <MapPin size={13} color="#2563eb" />
                        <span>{item.storeLocation}</span>
                      </div>

                      {/* Stock stats */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '0.6rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        marginBottom: '0.85rem',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div>
                          <div style={{ color: '#64748b' }}>Ledger</div>
                          <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{item.erpLedgerStock}</strong>
                        </div>
                        <div>
                          <div style={{ color: '#64748b' }}>7d Sold</div>
                          <strong style={{ color: item.posSalesVelocity7d === 0 ? '#dc2626' : '#0f172a', fontSize: '0.95rem' }}>
                            {item.posSalesVelocity7d}
                          </strong>
                        </div>
                        <div>
                          <div style={{ color: '#64748b' }}>Variance</div>
                          <strong style={{ color: '#dc2626', fontSize: '0.95rem' }}>{item.discrepancyDelta}</strong>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
                        <strong>Action:</strong> {item.recommendedAction}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      {isResolved ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>
                          <CheckCircle2 size={16} />
                          <span>Cycle count completed & verified</span>
                        </div>
                      ) : isDispatched ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Smartphone size={14} />
                            Task: {dispatchedTasks[item.id] || 'TASK-ACTIVE'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveAnomaly(item.id);
                            }}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Verified
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDispatchCycleCount(item);
                          }}
                          disabled={isDispatching}
                          style={{
                            width: '100%',
                            background: '#ea580c',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)'
                          }}
                        >
                          <Smartphone size={14} />
                          <span>Dispatch Handheld Cycle Count</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1B: BigQuery ML 14-Day Demand Forecasting Curve */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    DEMAND INTELLIGENCE: 14-Day Velocity Projection
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>14-Day Multi-Horizon Demand Prediction</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  📈 Automated Predictive Reordering & Demand Curves
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                  Incorporates local Seattle weather telemetry, promotional calendars, and elasticities to prevent out-of-stocks.
                </p>
              </div>

              {/* SKU Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Forecast SKU:</span>
                <select
                  value={selectedForecastSku}
                  onChange={(e) => setSelectedForecastSku(e.target.value)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  <option value="prod-001">Nordic Oak Chair (prod-001)</option>
                  <option value="prod-002">Aura Pro ANC Headphones (prod-002)</option>
                  <option value="prod-003">Alpine GORE-TEX Shell Jacket (prod-003)</option>
                  <option value="prod-004">Gooseneck Precision Kettle (prod-004)</option>
                </select>
              </div>
            </div>

            {/* Forecast Chart Visualization */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Daily Forecasted Unit Velocity (Confidence Band: 95%)</span>
                  {isLoadingForecast && (
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>
                      (Refreshing forecast data...)
                    </span>
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: '10px', height: '10px', background: '#2563eb', borderRadius: '2px' }} />
                    Forecast Mean
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: '10px', height: '10px', background: '#93c5fd', borderRadius: '2px' }} />
                    Upper Ceiling (+1σ)
                  </span>
                </span>
              </div>

              {/* Horizontal Bar Visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {forecastData.map((pt, idx) => {
                  const maxUnits = 160;
                  const meanWidth = Math.min(100, (pt.forecastedDemand / maxUnits) * 100);
                  const upperWidth = Math.min(100, (pt.upperConfidence / maxUnits) * 100);

                  return (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{pt.date}</span>
                      
                      <div style={{ position: 'relative', height: '26px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                        {/* Upper confidence layer */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: `${upperWidth}%`,
                          background: '#bfdbfe',
                          borderRadius: '6px'
                        }} />
                        {/* Mean Forecast layer */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: `${meanWidth}%`,
                          background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '0.65rem',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {pt.forecastedDemand} units
                        </div>
                      </div>

                      <div style={{ fontSize: '0.725rem', color: '#64748b', textAlign: 'right' }}>
                        {pt.weatherFactor && (
                          <span style={{ color: '#0369a1', fontWeight: 600 }}>{pt.weatherFactor}</span>
                        )}
                        {pt.eventFactor && (
                          <span style={{ color: '#b45309', fontWeight: 700, marginLeft: '0.35rem' }}>• {pt.eventFactor}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Automated Decision Output */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="#16a34a" />
                <div>
                  <strong style={{ color: '#166534', fontSize: '0.875rem', display: 'block' }}>
                    AI Inventory Recommendation: Reorder Point Optimized
                  </strong>
                  <span style={{ color: '#15803d', fontSize: '0.8rem' }}>
                    Current store balance (24 units) will cover through Friday. Recommended PO: <strong>+35 units</strong> before Oct 19 rain front to avoid stockout.
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setToastMessage('Triggered automated warehouse replenishment PO for +35 units.');
                  confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
                }}
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Approve Reorder (+35 units)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CUSTOMER SEGMENTATION & COHORTS */}
      {/* ========================================================================= */}
      {activeTab === 'segmentation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Header Banner */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ background: '#fdf2f8', color: '#be185d', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    CUSTOMER COHORT INTELLIGENCE
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Behavioral RFM & Cluster Segmentation</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  👥 Customer Cohorts & Behavioral Clusters
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                  Personalizes marketing, conversational AI tone, and shipping guarantees without exposing margin data to end consumers.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.825rem', color: '#64748b' }}>
                <span>Total Active Shoppers: <strong>142,050</strong></span>
                <span>•</span>
                <span>Avg CLV: <strong>$1,840.00</strong></span>
              </div>
            </div>

            {/* Segment Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {segments.map((seg) => {
                const isSelected = selectedSegment.id === seg.id;
                const isActivated = !!activatedPlaybooks[seg.id];

                return (
                  <div
                    key={seg.id}
                    onClick={() => setSelectedSegment(seg)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      background: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <span style={{
                          background: seg.churnRisk === 'Low' ? '#dcfce7' : seg.churnRisk === 'Medium' ? '#fef3c7' : '#fee2e2',
                          color: seg.churnRisk === 'Low' ? '#15803d' : seg.churnRisk === 'Medium' ? '#b45309' : '#b91c1c',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          Churn Risk: {seg.churnRisk}
                        </span>

                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                          {seg.percentOfRevenue}% of Store Revenue
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                        {seg.name}
                      </h4>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '0.6rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.75rem'
                      }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Cohort Size</span>
                          <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                            {seg.size.toLocaleString()} users
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Avg Order</span>
                          <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                            ${seg.avgOrderValue.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* Behavioral tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                        {seg.tags.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              fontSize: '0.675rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.4, margin: '0 0 0.85rem' }}>
                        <strong>AI Playbook:</strong> {seg.recommendedPlaybook}
                      </p>
                    </div>

                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerPlaybook(seg);
                        }}
                        style={{
                          width: '100%',
                          background: isActivated ? '#16a34a' : '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        {isActivated ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                        <span>{isActivated ? 'Playbook Active & Pushed' : 'Activate Playbook Campaign'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2B: Cross-Sell Basket Affinities (Market Basket Intelligence) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                  ASSOCIATION RULE MINING: Apriori / Lift &gt; 2.5
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Market Basket Cross-Sell Affinities</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🛒 Correlated Product Bundles & Lift Analysis
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Used by the Conversational AI concierge and checkout drawer to recommend the exact items shoppers naturally buy together.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {basketRules.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
                        <span>{rule.antecedent.join(', ')}</span>
                        <ArrowRight size={14} color="#64748b" />
                        <span style={{ color: '#2563eb' }}>{rule.consequent}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                        <span>Confidence: <strong>{(rule.confidence * 100).toFixed(0)}%</strong></span>
                        <span>•</span>
                        <span>Lift: <strong style={{ color: '#16a34a' }}>{rule.lift}x</strong></span>
                        <span>•</span>
                        <span>Impact: <strong style={{ color: '#16a34a' }}>{rule.revenueImpact}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setToastMessage(`Auto-Configured AI Recommendation Rule for "${rule.consequent}"`);
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Bundle in Storefront
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STORE CATALOG & SHELF STOCK */}
      {/* ========================================================================= */}
      {activeTab === 'stock' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🏪 Live Store Catalog & In-Aisle Locations
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Real-time multi-echelon stock levels for Seattle Downtown Flagship (STORE-104) synced in real-time across retail channels.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem'
              }}>
                <Search size={14} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.825rem', color: '#0f172a' }}
                />
              </div>

              <select
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Categories</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Kitchen">Kitchen</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>SKU / PRODUCT</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem' }}>RETAIL PRICE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>ON HAND</th>
                  <th style={{ padding: '0.75rem 1rem' }}>REORDER POINT</th>
                  <th style={{ padding: '0.75rem 1rem' }}>AISLE / LOCATION</th>
                  <th style={{ padding: '0.75rem 1rem' }}>STOCK STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, idx) => {
                  const isLow = (item.quantity_on_hand || 0) <= (item.reorder_point || 8);
                  const isOut = (item.quantity_on_hand || 0) === 0;

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.875rem' }}>{item.name}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.725rem' }}>{item.sku}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{item.category}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <strong style={{ color: isOut ? '#dc2626' : isLow ? '#ea580c' : '#16a34a', fontSize: '0.95rem' }}>
                          {item.quantity_on_hand}
                        </strong>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                        {item.reorder_point || 8} units
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} color="#2563eb" />
                          {item.aisle_location || 'Aisle 2B'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                          color: isOut ? '#b91c1c' : isLow ? '#b45309' : '#15803d',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 700
                        }}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock Warning' : 'Healthy Inventory'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
