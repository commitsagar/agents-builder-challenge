import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, Check, MapPin, Search, Clock, ArrowRight, ShieldCheck, 
  Ban, AlertCircle, CheckCircle2, X, Eye, FileText, 
  Sparkles, Filter, ChevronRight, Copy, ShoppingBag, ArrowUpRight, RotateCcw,
  Receipt, ShoppingCart, Trash2
} from 'lucide-react';
import { OrderRecord, cancelCloudRunOrder } from '../../services/apiClient';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';

interface CustomerOrdersProps {
  onOpenLiveTracking?: (orderId: string) => void;
  initialOrderId?: string;
  onBrowseStore?: () => void;
  onAddToCart?: (product: any) => void;
}

// Get stored orders placed by the user
const getStoredOrders = (): OrderRecord[] => {
  try {
    const raw = localStorage.getItem('flamgo_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out legacy mock BigQuery order IDs if they were stored previously
        const legacyMockIds = new Set([
          'ORD-91614', 'ORD-85055', 'ORD-70659', 'ORD-63774', 
          'ORD-56624', 'ORD-34140', 'ORD-31978', 'ORD-62988', 'ORD-83072'
        ]);
        return parsed.filter(o => o && o.orderId && !legacyMockIds.has(o.orderId));
      }
    }
  } catch (e) {
    console.error('Failed to parse orders from localStorage', e);
  }
  return [];
};

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({ 
  onOpenLiveTracking, 
  initialOrderId,
  onBrowseStore,
  onAddToCart
}) => {
  const [orders, setOrders] = useState<OrderRecord[]>(() => getStoredOrders());
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(initialOrderId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  
  // Modals
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderRecord | null>(null);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake / Duplicate purchase');
  const [isCancelling, setIsCancelling] = useState(false);
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const reloadOrders = () => {
    const stored = getStoredOrders();
    setOrders(stored);
  };

  useEffect(() => {
    reloadOrders();

    const handleStorageChange = () => reloadOrders();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('flamgo_order_placed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('flamgo_order_placed', handleStorageChange);
    };
  }, [initialOrderId]);

  // Place a quick prototype sample order if the user wants to test with 1 click
  const handlePlaceSampleOrder = () => {
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const sampleProducts = [
      MOCK_PRODUCTS[0] || { id: 'prod-001', name: 'Waterproof Shell Jacket', price: 389, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80', category: 'Apparel' },
      MOCK_PRODUCTS[1] || { id: 'prod-002', name: 'Merino Wool Thermal Crewneck', price: 98, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80', category: 'Apparel' }
    ];

    const sampleOrder: OrderRecord = {
      orderId: newOrderId,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: sampleProducts.map(p => `${p.name} (x1)`),
      total: sampleProducts.reduce((sum, p) => sum + p.price, 0),
      status: 'Out for Delivery (Express 2-Hour Courier)',
      carrier: 'FlamGo Express Fleet (Seattle Downtown #402)',
      trackingNumber: `FLAM-${newOrderId}-EXPRESS`,
      deliveryLocation: '742 Evergreen Pike, Seattle, WA 98101',
      timeline: [
        { step: 'Order Placed & Stock Reserved', time: 'Just now', done: true },
        { step: 'Aisle Reserved at Seattle Flagship', time: 'Just now', done: true },
        { step: 'In-Store Picking & Packing Complete', time: 'In Progress', done: true },
        { step: 'Courier Hand-off & Express 2-Hour Delivery', time: 'Estimated within 120 mins', done: false }
      ],
      orderedProducts: sampleProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: 1,
        image: p.image,
        category: p.category
      }))
    };

    const updated = [sampleOrder, ...orders];
    localStorage.setItem('flamgo_orders', JSON.stringify(updated));
    setOrders(updated);
    setActiveTrackingOrderId(newOrderId);
    setNotification(`Sample test order #${newOrderId} created successfully!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClearAllOrders = () => {
    if (window.confirm('Clear all placed orders from this browser session?')) {
      localStorage.removeItem('flamgo_orders');
      setOrders([]);
      setActiveTrackingOrderId(null);
      setNotification('Order history cleared.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleExecuteCancellation = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);

    try {
      const orderId = cancelModalOrder.orderId;
      // Background sync to backend if available
      cancelCloudRunOrder(orderId, cancelReason).catch(() => {});

      const updatedOrders = orders.map(ord => {
        if (ord.orderId === orderId) {
          return {
            ...ord,
            status: 'Cancelled',
            cancellationReason: cancelReason,
            cancelledAt: new Date().toISOString(),
            timeline: [
              ...(ord.timeline || []),
              {
                step: `Order Cancelled (${cancelReason}) • Refund Issued`,
                time: 'Just now',
                done: true
              }
            ]
          };
        }
        return ord;
      });

      setOrders(updatedOrders);
      localStorage.setItem('flamgo_orders', JSON.stringify(updatedOrders));
      setCancelModalOrder(null);
      setNotification(`Order #${orderId} was cancelled. A full refund has been initiated.`);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCopyOrderId = (oid: string) => {
    navigator.clipboard.writeText(oid);
    setCopiedOrderId(oid);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase().trim();
    const itemsSummary = Array.isArray(order.items) 
      ? order.items.join(' ') 
      : (typeof order.items === 'string' ? order.items : '');
    
    const matchesSearch = !q || 
      order.orderId.toLowerCase().includes(q) ||
      itemsSummary.toLowerCase().includes(q) ||
      (order.carrier && order.carrier.toLowerCase().includes(q)) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') {
      return !order.status?.toLowerCase().includes('delivered') && !order.status?.toLowerCase().includes('cancel');
    }
    if (statusFilter === 'DELIVERED') {
      return order.status?.toLowerCase().includes('delivered');
    }
    if (statusFilter === 'CANCELLED') {
      return order.status?.toLowerCase().includes('cancel');
    }
    return true;
  });

  // Helper to find image for product
  const getProductImage = (itemText: string, orderedProduct?: any) => {
    if (orderedProduct?.image) return orderedProduct.image;
    const match = MOCK_PRODUCTS.find(p => itemText.toLowerCase().includes(p.name.toLowerCase()));
    if (match) return match.image;
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          background: '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          animation: 'fadeIn 0.2s ease',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Customer Web Portal Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Package size={17} />
              <span>Customer Account Portal</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Your Orders
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Track shipments in real time, view order receipts, or manage your recent purchases.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onBrowseStore && (
              <button
                onClick={onBrowseStore}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', padding: '0.6rem 1.1rem' }}
              >
                <ShoppingCart size={16} />
                <span>Shop More Items</span>
              </button>
            )}

            {orders.length > 0 && (
              <button
                onClick={handleClearAllOrders}
                title="Clear order history for testing"
                style={{
                  background: 'transparent',
                  border: '1px solid #e2e8f0',
                  color: '#94a3b8',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '440px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search all orders by product or order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.25rem',
                paddingTop: '0.6rem',
                paddingBottom: '0.6rem',
                fontSize: '0.875rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map(tab => {
              const label = tab === 'ALL' ? 'All Orders' : tab === 'ACTIVE' ? 'In Transit' : tab === 'DELIVERED' ? 'Delivered' : 'Cancelled';
              const isSelected = statusFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#1d4ed8' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredOrders.length === 0 ? (
        /* Empty State */
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}>
            <ShoppingBag size={38} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {searchQuery ? 'No matching orders found' : "You haven't placed any orders yet"}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.925rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
              {searchQuery 
                ? 'Try searching with a different product name or order number.' 
                : 'When you browse the store, add items to your cart, and place an order, your items and delivery tracking will appear here.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            {onBrowseStore && (
              <button
                onClick={onBrowseStore}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ShoppingCart size={17} />
                <span>Browse Store & Shop Products</span>
              </button>
            )}

            {!searchQuery && (
              <button
                onClick={handlePlaceSampleOrder}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Sparkles size={16} color="#2563eb" />
                <span>Place Quick Demo Order</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Orders List (Customer Web Portal Card Layout) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map(order => {
            const isCancelled = order.status?.toLowerCase().includes('cancel');
            const isDelivered = order.status?.toLowerCase().includes('delivered');
            const isExpanded = activeTrackingOrderId === order.orderId;
            const formattedTotal = typeof order.total === 'number' ? order.total.toFixed(2) : order.total;
            
            // Extract products
            const productsList = order.orderedProducts && order.orderedProducts.length > 0
              ? order.orderedProducts
              : (Array.isArray(order.items) ? order.items : [order.items || 'Ordered Item']).map((itemStr: any, idx: number) => {
                  const nameStr = typeof itemStr === 'string' ? itemStr : JSON.stringify(itemStr);
                  return {
                    id: `item-${idx}`,
                    name: nameStr,
                    price: order.total / (order.items?.length || 1),
                    quantity: 1,
                    image: getProductImage(nameStr)
                  };
                });

            return (
              <div
                key={order.orderId}
                style={{
                  background: '#ffffff',
                  border: isCancelled ? '1px solid #fee2e2' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                {/* Order Header Ribbon */}
                <div style={{
                  background: isCancelled ? '#fff5f5' : '#f8fafc',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  fontSize: '0.825rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Order Placed
                      </span>
                      <strong style={{ color: '#0f172a' }}>{order.date}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total
                      </span>
                      <strong style={{ color: '#0f172a' }}>${formattedTotal}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Ship To
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0f172a', fontWeight: 600 }}>
                        <MapPin size={13} color="#2563eb" />
                        <span>{order.deliveryLocation || 'Customer Address'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Number & Receipt Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Order #{order.orderId}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(order.orderId)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        {copiedOrderId === order.orderId ? (
                          <>
                            <Check size={12} color="#16a34a" />
                            <span style={{ color: '#16a34a' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setReceiptModalOrder(order)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Receipt size={13} color="#64748b" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>

                {/* Order Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Status Banner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.7rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: isCancelled ? '#fee2e2' : isDelivered ? '#dcfce7' : '#dbeafe',
                          color: isCancelled ? '#991b1b' : isDelivered ? '#15803d' : '#1e40af'
                        }}>
                          {isCancelled ? <X size={13} /> : isDelivered ? <CheckCircle2 size={13} /> : <Truck size={13} />}
                          <span>{isCancelled ? 'Cancelled' : isDelivered ? 'Delivered' : 'Out for Delivery'}</span>
                        </span>
                        
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          {isCancelled 
                            ? 'Order has been cancelled & refunded' 
                            : isDelivered 
                              ? 'Package was delivered to destination' 
                              : '⚡ Express 2-Hour Courier Dispatched'}
                        </span>
                      </div>
                      
                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Carrier: <strong>{order.carrier || 'FlamGo Express Courier'}</strong> • Tracking: <span style={{ fontFamily: 'monospace' }}>{order.trackingNumber || order.orderId}</span>
                      </p>
                    </div>

                    {/* Top Right Quick Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button
                        onClick={() => setActiveTrackingOrderId(isExpanded ? null : order.orderId)}
                        className="btn btn-secondary"
                        style={{
                          fontSize: '0.825rem',
                          padding: '0.5rem 0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: isExpanded ? '#eff6ff' : '#ffffff',
                          borderColor: isExpanded ? '#bfdbfe' : '#cbd5e1',
                          color: isExpanded ? '#1d4ed8' : '#334155'
                        }}
                      >
                        <Truck size={14} />
                        <span>{isExpanded ? 'Hide Tracking' : 'Track Package'}</span>
                      </button>

                      {!isCancelled && !isDelivered && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          style={{
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            borderRadius: '8px',
                            color: '#e11d48',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            padding: '0.5rem 0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Ban size={13} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cancelled Notice if applicable */}
                  {isCancelled && (
                    <div style={{
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      borderRadius: '10px',
                      padding: '0.9rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: '0.825rem' }}>
                        <span style={{ fontWeight: 700, color: '#991b1b' }}>Order Cancellation Details: </span>
                        <span style={{ color: '#b91c1c' }}>
                          Reason: "{order.cancellationReason || 'Customer requested'}". A refund of ${formattedTotal} was credited back to your payment method.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Items in this Order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.15rem' }}>
                    {productsList.map((prod: any, idx: number) => {
                      const itemPrice = typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            padding: '0.5rem 0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={prod.image || getProductImage(prod.name)}
                              alt={prod.name}
                              style={{
                                width: '64px',
                                height: '64px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc'
                              }}
                              onError={(e: any) => {
                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            <div>
                              <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                                {prod.name}
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Qty: <strong>{prod.quantity || 1}</strong> • Price: <strong style={{ color: '#0f172a' }}>${itemPrice}</strong>
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {onAddToCart && !isCancelled && (
                              <button
                                onClick={() => {
                                  onAddToCart({
                                    id: prod.id || `reorder-${idx}`,
                                    name: prod.name,
                                    price: typeof prod.price === 'number' ? prod.price : parseFloat(prod.price) || 49,
                                    image: prod.image,
                                    category: prod.category || 'General',
                                    rating: 4.8,
                                    reviewsCount: 120,
                                    stock: 50,
                                    description: prod.name,
                                    features: [],
                                    tags: [],
                                    elasticity: -1
                                  });
                                  setNotification(`Added "${prod.name}" back to your cart!`);
                                  setTimeout(() => setNotification(null), 3000);
                                }}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  padding: '0.4rem 0.75rem',
                                  fontSize: '0.775rem',
                                  fontWeight: 600,
                                  color: '#2563eb',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <RotateCcw size={12} />
                                <span>Buy It Again</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Collapsible Delivery Stepper & Live Map Tracking */}
                  {isExpanded && (
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                            Delivery Progress & Courier Status
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                            Estimated delivery: Within 120 minutes by FlamGo Express Fleet
                          </p>
                        </div>

                        {onOpenLiveTracking && (
                          <button
                            onClick={() => onOpenLiveTracking(order.orderId)}
                            className="btn btn-primary"
                            style={{
                              fontSize: '0.825rem',
                              padding: '0.5rem 1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                            }}
                          >
                            <MapPin size={14} />
                            <span>Track Live on Google Maps</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>

                      {/* Stepper Timeline */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem', position: 'relative' }}>
                        {(order.timeline || [
                          { step: 'Order Placed & Stock Reserved', time: 'Just now', done: true },
                          { step: 'Aisle Reserved & Picked at Flagship Store', time: 'In Progress', done: true },
                          { step: 'Courier Hand-off & Express 2-Hour Delivery', time: 'Estimated within 120 mins', done: false }
                        ]).map((step: any, idx: number) => {
                          const isCancelStep = step.step?.toLowerCase().includes('cancel');
                          return (
                            <div key={idx} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: isCancelStep ? '#dc2626' : step.done ? '#16a34a' : '#cbd5e1',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                flexShrink: 0
                              }}>
                                {isCancelStep ? <X size={14} /> : step.done ? <Check size={14} /> : idx + 1}
                              </div>

                              <div>
                                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: isCancelStep ? '#b91c1c' : step.done ? '#0f172a' : '#64748b' }}>
                                  {step.step}
                                </h5>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {step.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Receipt / Details Modal */}
      {receiptModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Order Receipt & Invoice
                </h3>
              </div>
              <button
                onClick={() => setReceiptModalOrder(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Order Number</span>
                  <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>#{receiptModalOrder.orderId}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Order Date</span>
                  <strong style={{ color: '#0f172a' }}>{receiptModalOrder.date}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Shipping Address</span>
                <strong style={{ color: '#0f172a' }}>{receiptModalOrder.deliveryLocation || '742 Evergreen Pike, Seattle, WA 98101'}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Payment Method</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 600 }}>
                  <ShieldCheck size={16} color="#16a34a" />
                  <span>Visa ending in 4242 (Authorized & Processed)</span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Items Ordered
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(receiptModalOrder.orderedProducts && receiptModalOrder.orderedProducts.length > 0 
                    ? receiptModalOrder.orderedProducts.map(p => `${p.name} (x${p.quantity || 1}) - $${(p.price * (p.quantity || 1)).toFixed(2)}`)
                    : (Array.isArray(receiptModalOrder.items) ? receiptModalOrder.items : [receiptModalOrder.items || 'Items'])
                  ).map((it: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                      <span>{typeof it === 'string' ? it : JSON.stringify(it)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <strong style={{ color: '#0f172a' }}>Total Paid:</strong>
                  <strong style={{ color: '#2563eb' }}>${typeof receiptModalOrder.total === 'number' ? receiptModalOrder.total.toFixed(2) : receiptModalOrder.total}</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReceiptModalOrder(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Cancel Order Modal */}
      {cancelModalOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff1f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ban size={18} color="#e11d48" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Cancel Order #{cancelModalOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setCancelModalOrder(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                Are you sure you want to cancel this order? Once confirmed, this order will not be delivered and an immediate full refund will be processed.
              </p>

              {/* Refund Notice */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={18} color="#16a34a" />
                <span style={{ fontSize: '0.825rem', color: '#166534', fontWeight: 600 }}>
                  Full refund of <strong>${typeof cancelModalOrder.total === 'number' ? cancelModalOrder.total.toFixed(2) : cancelModalOrder.total}</strong> will be returned to your original payment card.
                </span>
              </div>

              {/* Reason Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Please select a cancellation reason:
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a'
                  }}
                >
                  <option value="Ordered by mistake / Duplicate purchase">Ordered by mistake / Duplicate purchase</option>
                  <option value="Found better price / Alternative product">Found better price / Alternative product</option>
                  <option value="Delivery timeframe too long">Delivery timeframe too long</option>
                  <option value="Incorrect shipping address specified">Incorrect shipping address specified</option>
                  <option value="Change of mind / No longer needed">Change of mind / No longer needed</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setCancelModalOrder(null)}
                disabled={isCancelling}
                className="btn btn-secondary"
                style={{ fontSize: '0.825rem' }}
              >
                Keep Order
              </button>
              <button
                onClick={handleExecuteCancellation}
                disabled={isCancelling}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {isCancelling ? 'Processing Cancellation...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
