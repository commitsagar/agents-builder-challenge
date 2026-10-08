import React, { useState } from 'react';
import { Building2, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, Camera, DollarSign, Send, ArrowUpRight, Layers, Users, FileCheck } from 'lucide-react';
import { InventoryIntelligence } from '../InventoryIntelligence';
import { PlanogramVision } from '../PlanogramVision';
import { BackOffice } from '../BackOffice';
import { BasketAnalytics } from '../BasketAnalytics';
import { CustomerSegmentation } from '../CustomerSegmentation';
import { ConversationalCommerce } from '../ConversationalCommerce';

export const MerchantHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'basket' | 'segmentation' | 'planogram' | 'pricing' | 'b2b_rfq'>('inventory');

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
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', color: '#0f172a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Building2 size={14} />
            <span>Merchant Business Suite & Store Operations</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Store Operations & Inventory Intelligence
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Unified enterprise controls for retail operators: eliminate phantom stockouts across physical stores, forecast multi-week demand, optimize promotional basket bundles, segment high-value customer cohorts, and audit shelf compliance.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { id: 'inventory', label: 'Phantom Radar & Demand Forecast', icon: BarChart3 },
            { id: 'basket', label: 'Basket Affinity & Cross-Selling', icon: Layers },
            { id: 'segmentation', label: 'Customer Segmentation (RFM)', icon: Users },
            { id: 'planogram', label: 'Planogram Computer Vision', icon: Camera },
            { id: 'pricing', label: 'Dynamic Pricing & Margin Guard', icon: DollarSign },
            { id: 'b2b_rfq', label: 'B2B RFQ Automation', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  background: isSelected ? '#0f172a' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === 'inventory' && <InventoryIntelligence />}
      {activeSubTab === 'basket' && <BasketAnalytics />}
      {activeSubTab === 'segmentation' && <CustomerSegmentation />}
      {activeSubTab === 'planogram' && <PlanogramVision />}
      {activeSubTab === 'pricing' && <BackOffice />}
      {activeSubTab === 'b2b_rfq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: '#ffffff',
            border: '2px solid #0891b2',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            boxShadow: '0 4px 14px rgba(8, 145, 178, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0891b2', background: '#ecfeff', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                CPQ Quote Engine
              </span>
              <span style={{ fontSize: '0.7rem', background: '#cffafe', color: '#0e7490', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 800 }}>
                B2B Persona 🏢
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
              B2B Procurement & RFQ Automation
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Conversational CPQ quote generation from unstructured buyer requests
            </p>
          </div>

          <ConversationalCommerce isB2CPersona={false} initialUseCase="05" />
        </div>
      )}

    </div>
  );
};
