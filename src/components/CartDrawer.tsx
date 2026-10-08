import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Building2, CheckCircle2, Package } from 'lucide-react';
import { CartItem } from '../types';
import { RetailStore } from '../data/mockStores';
import confetti from 'canvas-confetti';
import { submitCloudRunCheckout } from '../services/apiClient';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedStore?: RetailStore;
  onNavigateToOrders?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedStore,
  onNavigateToOrders
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    itemsCount: number;
    storeName: string;
    carrier: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const bundleDiscount = cartItems.length >= 2 ? subtotal * 0.08 : 0;
  const finalTotal = subtotal - bundleDiscount;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const storeLabel = selectedStore ? selectedStore.name : 'Seattle Downtown Flagship (Store #402)';
    const storeLocation = selectedStore ? `${selectedStore.address}, ${selectedStore.city}` : '450 Pike St, Seattle, WA 98101';

    const newOrder = {
      orderId: newOrderId,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: cartItems.map(i => `${i.product.name} (x${i.quantity})`),
      total: finalTotal,
      status: 'Out for Delivery (Express 2-Hour Courier)',
      carrier: `FlamGo Express Courier (${storeLabel})`,
      trackingNumber: `FLAM-${newOrderId}-EXPRESS`,
      deliveryLocation: storeLocation,
      timeline: [
        { step: 'Order Placed & Stock Reserved', time: 'Just now', done: true },
        { step: `Aisle Reserved at ${storeLabel}`, time: 'Just now', done: true },
        { step: 'In-Store Picking & Packing Complete', time: 'In Progress', done: true },
        { step: 'Courier Hand-off & Express 2-Hour Delivery', time: 'Estimated within 120 mins', done: false }
      ],
      orderedProducts: cartItems.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
        category: i.product.category
      }))
    };

    // Save to customer order history in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('flamgo_orders') || '[]');
      localStorage.setItem('flamgo_orders', JSON.stringify([newOrder, ...existing]));
      window.dispatchEvent(new Event('flamgo_order_placed'));
    } catch (e) {
      console.error('Error saving order history', e);
    }

    try {
      const checkoutItems = cartItems.map(i => ({
        sku: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      }));
      await submitCloudRunCheckout(checkoutItems, storeLocation);
    } catch (err) {
      console.log('Local checkout processed');
    }

    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#2563eb', '#16a34a', '#ea580c', '#fbbf24']
    });

    setIsCheckingOut(false);
    setOrderConfirmation({
      orderId: newOrderId,
      total: finalTotal,
      itemsCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      storeName: storeLabel,
      carrier: newOrder.carrier
    });
    onClearCart();
  };

  const handleCloseDrawer = () => {
    setOrderConfirmation(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'opacity 0.25s ease'
    }} onClick={handleCloseDrawer}>
      
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-6px 0 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem 1.75rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {orderConfirmation ? 'Order Placed!' : 'Your Shopping Cart'}
            </h2>
            {!orderConfirmation && (
              <span className="badge badge-blue">{cartItems.reduce((a, b) => a + b.quantity, 0)} items</span>
            )}
          </div>

          <button onClick={handleCloseDrawer} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Order Confirmation Screen */}
        {orderConfirmation ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0.5rem',
            textAlign: 'center',
            flexGrow: 1,
            gap: '1.25rem'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <div>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Payment Authorized • Stock Reserved
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0 0.35rem' }}>
                Thank You for Your Order!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Order Tracking ID: <strong style={{ color: '#2563eb' }}>#{orderConfirmation.orderId}</strong>
              </p>
            </div>

            {/* Receipt Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              width: '100%',
              textAlign: 'left',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Paid</span>
                <strong style={{ color: '#0f172a', fontSize: '1rem' }}>${orderConfirmation.total.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Items</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{orderConfirmation.itemsCount} products reserved</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Fulfillment</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>⚡ Express 2-Hour Delivery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Fulfilling Store</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{orderConfirmation.storeName}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.75rem' }}>
              <button
                onClick={() => {
                  if (onNavigateToOrders) {
                    onNavigateToOrders(orderConfirmation.orderId);
                  }
                  handleCloseDrawer();
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <Package size={18} />
                <span>View in Your Orders</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleCloseDrawer}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', borderRadius: '10px' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Local Store Inventory Origin Banner */}
            {selectedStore && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                marginTop: '1rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                color: '#166534'
              }}>
                <Building2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Fulfilling from {selectedStore.name} ({selectedStore.storeNumber})</strong>
                  <div style={{ color: '#15803d', marginTop: '0.1rem' }}>
                    {selectedStore.distanceMiles} mi away • Items reserved from physical store stock
                  </div>
                </div>
              </div>
            )}

            {/* Item list */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>Your cart is empty.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>Explore products and add items to your basket!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      padding: '0.85rem',
                      display: 'flex',
                      gap: '0.85rem',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px'
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, lineHeight: 1.3 }}>{item.product.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, marginTop: '0.2rem' }}>
                        ${item.product.price.toFixed(2)}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="btn btn-secondary"
                          style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem', height: '24px' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="btn btn-secondary"
                          style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem', height: '24px' }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bundle Discount Banner */}
            {cartItems.length >= 2 && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <Tag size={18} color="#16a34a" />
                <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                  <strong style={{ display: 'block' }}>Bundle Savings Applied!</strong>
                  8% automatic bundle discount saved on your order.
                </div>
              </div>
            )}

            {/* Summary & Checkout (Sticky unobstructed footer) */}
            {cartItems.length > 0 && (
              <div style={{
                paddingTop: '1.25rem',
                paddingBottom: '0.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                background: '#ffffff',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>

                {bundleDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#16a34a' }}>
                    <span>Bundle Discount</span>
                    <span>-${bundleDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  <span>Order Total</span>
                  <span style={{ color: '#2563eb' }}>${finalTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.25rem',
                    marginTop: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                    opacity: isCheckingOut ? 0.8 : 1
                  }}
                >
                  {isCheckingOut ? (
                    <span>Processing Secure Checkout...</span>
                  ) : (
                    <>
                      <span>Proceed to Checkout • ${finalTotal.toFixed(2)}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
