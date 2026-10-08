import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Sparkles, ArrowRight, CheckCircle2, DollarSign, Layers } from 'lucide-react';
import { MOCK_BASKET_AFFINITY_RULES } from '../../data/mockScenarios';

export const BasketAnalytics: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState(MOCK_BASKET_AFFINITY_RULES[0]);
  const [bundleDiscount, setBundleDiscount] = useState(15);

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
            <Layers size={14} />
            <span>BigQuery ML Market Basket Analysis & Association Rules</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Basket Affinity & Cross-Selling Intelligence
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Mine frequent co-purchase itemsets across 1.4M omnichannel transactions in BigQuery. Uncover cross-category lift to orchestrate dynamic bundle recommendations and in-store endcap merchandising.
          </p>
        </div>
      </div>

      {/* Main Grid: Rules Table + Bundle Simulation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Association Rules Table */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              High-Lift Association Rules
            </h3>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
              BigQuery Apriori / FP-Growth
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_BASKET_AFFINITY_RULES.map((rule, idx) => {
              const isSelected = selectedRule.consequent === rule.consequent;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedRule(rule)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      <span>{rule.antecedent.join(' + ')}</span>
                      <ArrowRight size={14} color="#64748b" />
                      <span style={{ color: '#2563eb' }}>{rule.consequent}</span>
                    </div>
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      Lift {rule.lift}x
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                    <div>Support: <strong>{(rule.support * 100).toFixed(0)}%</strong></div>
                    <div>Confidence: <strong>{(rule.confidence * 100).toFixed(0)}%</strong></div>
                    <div style={{ color: '#059669', fontWeight: 600 }}>{rule.revenueImpact}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Merchandising Bundle Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              Dynamic Bundle Merchandising
            </h3>

            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Configure automated cross-sell triggers for checkout drawers and in-store associate handheld recommendations.
            </p>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Active Bundle Rule
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                Buy [{selectedRule.antecedent.join(', ')}]
              </div>
              <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 600 }}>
                Get [{selectedRule.consequent}] at {bundleDiscount}% Off
              </div>
            </div>

            {/* Discount Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                <span>Incentive Discount:</span>
                <span>{bundleDiscount}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={bundleDiscount}
                onChange={(e) => setBundleDiscount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Projected Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Projected Attach Rate</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
                  +{(selectedRule.confidence * 100 * 0.42).toFixed(1)}%
                </div>
              </div>
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>Net Margin Expansion</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8' }}>
                  +14.2%
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Promotional bundle successfully activated for online and in-store checkout! Attached SKU: ${selectedRule.consequent}`)}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Deploy Dynamic Bundle to Storefront</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
