import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, Camera, Upload, ShieldCheck, DollarSign, ArrowRight, RefreshCw } from 'lucide-react';
import { RETURN_INSPECTION_PRESETS } from '../../data/mockScenarios';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { geminiRetailService } from '../../services/geminiService';
import confetti from 'canvas-confetti';

import { verifyCloudRunReturn } from '../../services/apiClient';

export const CustomerReturns: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState(RETURN_INSPECTION_PRESETS[0]);
  const [returnReason, setReturnReason] = useState('Size slightly loose across shoulders. Never worn, tags attached.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalResult, setApprovalResult] = useState<any | null>(selectedOrder.analysis);

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Sync return event directly with Google Cloud Run & Firestore
      verifyCloudRunReturn(
        selectedOrder.orderId,
        selectedOrder.sku,
        returnReason,
        selectedOrder.uploadedImageUrl
      ).catch(() => {});

      const result = await geminiRetailService.inspectReturnItem(
        selectedOrder.sku,
        returnReason,
        'Customer return photo upload'
      );
      setApprovalResult(result);
      if (result.disposition.includes('Auto-Refund')) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#16a34a', '#2563eb', '#f59e0b']
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <RotateCcw size={14} />
            <span>Customer Self-Service • 30-Day Hassle-Free Returns</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Instant Return & Refund Center
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Select your item, tell us what happened, and upload a quick photo. Our automated verification
            approves refunds in seconds without waiting for package drop-offs.
          </p>
        </div>
      </div>

      {/* Main Two-Column Return Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Return Request Form */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
            Select Item to Return
          </h2>

          <form onSubmit={handleProcessReturn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Order Items Selector */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                RECENT ORDERS
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {RETURN_INSPECTION_PRESETS.map((order) => {
                  const isSelected = selectedOrder.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setReturnReason(order.customerClaim);
                        setApprovalResult(order.analysis);
                      }}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img
                        src={order.uploadedImageUrl}
                        alt={order.productName}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{order.productName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Order {order.orderId} • ${order.purchasePrice.toFixed(2)}</p>
                      </div>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Select</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Return Reason Input */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                REASON FOR RETURN
              </label>
              <textarea
                rows={3}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Explain the reason for return (e.g. wrong size, cosmetic scratch, changed mind)..."
                style={{ width: '100%' }}
              />
            </div>

            {/* Photo Preview */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                UPLOADED PRODUCT PHOTO
              </label>
              <div style={{ borderRadius: '10px', overflow: 'hidden', height: '180px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <img
                  src={selectedOrder.uploadedImageUrl}
                  alt="Return Inspection"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(255,255,255,0.9)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, color: '#0f172a' }}>
                  Photo Attached • Ready for Verification
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Verifying Return Item...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Submit for Instant Return Approval</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Instant Approval & Refund Result */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>RETURN STATUS</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              Verification Decision
            </h2>
          </div>

          {approvalResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Disposition Banner */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: approvalResult.disposition.includes('Auto-Refund') ? '#f0fdf4' : approvalResult.disposition.includes('Quarantine') ? '#fef2f2' : '#fffbeb',
                border: `1px solid ${approvalResult.disposition.includes('Auto-Refund') ? '#bbf7d0' : approvalResult.disposition.includes('Quarantine') ? '#fecaca' : '#fde68a'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {approvalResult.disposition.includes('Auto-Refund') ? (
                    <CheckCircle2 size={22} color="#16a34a" />
                  ) : (
                    <AlertTriangle size={22} color={approvalResult.disposition.includes('Quarantine') ? '#dc2626' : '#d97706'} />
                  )}
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: approvalResult.disposition.includes('Auto-Refund') ? '#15803d' : approvalResult.disposition.includes('Quarantine') ? '#b91c1c' : '#b45309'
                  }}>
                    {approvalResult.disposition}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {approvalResult.disposition.includes('Auto-Refund')
                    ? `Your return request for $${selectedOrder.purchasePrice.toFixed(2)} has been instantly approved! Store credit has been added to your FlamGo balance.`
                    : approvalResult.disposition.includes('Quarantine')
                    ? `Serial hash checksum requires physical verification. Please drop item off at any local FlamGo customer desk.`
                    : `Your return has been routed for refurbishment. A replacement or credit has been initiated.`}
                </p>
              </div>

              {/* Breakdown cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Refund Credit</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>
                    ${selectedOrder.purchasePrice.toFixed(2)}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Zero restocking fee</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Verification Time</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                    3.2s
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Instant automated approval</span>
                </div>
              </div>

              {/* Inspection Summary */}
              <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Verification Details
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {approvalResult.geminiVisionNotes}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
