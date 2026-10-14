import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Plus, Check, Info, ArrowRight, TrendingUp, Layers } from 'lucide-react';
import { Product } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { LAPTOP_MISSION_SEED, MissionItemSeed } from '../../services/basketAnalysis';
import { featureFlagService } from '../../services/featureFlags';
import { eventLogger } from '../../services/eventLogger';
import confetti from 'canvas-confetti';

interface FrequentlyBoughtTogetherProps {
  anchorProduct: Product;
  onAddToCart: (product: Product) => void;
  surface?: 'pdp_bundle' | 'cart_bundle';
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  anchorProduct,
  onAddToCart,
  surface = 'pdp_bundle'
}) => {
  const flags = featureFlagService.getFlags();
  if (!flags.enableFrequentlyBoughtTogether) return null;

  // Derive bundle candidates matching anchor category or fallback to curated seed
  const candidateProducts = React.useMemo(() => {
    // If anchor is electronic/computer, use worked example seed items mapped to catalog
    const related = MOCK_PRODUCTS.filter(
      p => p.id !== anchorProduct.id && (p.category === anchorProduct.category || p.category === 'Electronics')
    ).slice(0, 3);

    // Map candidate items with uplift and confidence metrics
    return related.map((p, idx) => {
      const seed = LAPTOP_MISSION_SEED[idx % LAPTOP_MISSION_SEED.length];
      return {
        product: p,
        confidence: seed.boughtWithPct / 100,
        lift: Number((1.5 + (seed.upliftPoints / 4)).toFixed(1)),
        upliftPoints: seed.upliftPoints,
        boughtWithPct: seed.boughtWithPct,
        reason: `${seed.boughtWithPct}% of buyers add this item`,
        isExploration: idx === 2 && flags.explorationShare > 0
      };
    });
  }, [anchorProduct, flags.explorationShare]);

  // Selected items in bundle (default anchor + first 2 items checked)
  const [selectedSkus, setSelectedSkus] = useState<string[]>(() => {
    return [anchorProduct.id, ...candidateProducts.slice(0, 2).map(c => c.product.id)];
  });

  const [addedSuccess, setAddedSuccess] = useState(false);

  // Telemetry: Log impression
  useEffect(() => {
    const exp = eventLogger.getExperimentAssignment('USER_ANON');
    candidateProducts.forEach(c => {
      eventLogger.logEvent({
        eventType: 'impression',
        sku: c.product.id,
        anchorSku: anchorProduct.id,
        surface,
        experimentId: exp.experimentId,
        variant: exp.variant,
        rankingMode: flags.rankingAlgorithm
      });
    });
  }, [anchorProduct.id, candidateProducts, flags.rankingAlgorithm, surface]);

  const toggleItem = (sku: string) => {
    if (sku === anchorProduct.id) return; // Keep anchor selected
    setSelectedSkus(prev => 
      prev.includes(sku) ? prev.filter(id => id !== sku) : [...prev, sku]
    );
  };

  // Selected items calculation
  const allBundleProducts = [anchorProduct, ...candidateProducts.map(c => c.product)];
  const activeProducts = allBundleProducts.filter(p => selectedSkus.includes(p.id));
  const bundleSubtotal = activeProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = activeProducts.length >= 2 ? bundleSubtotal * 0.08 : 0;
  const bundleTotal = bundleSubtotal - bundleDiscount;

  const handleAddBundle = () => {
    activeProducts.forEach(p => onAddToCart(p));
    setAddedSuccess(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });

    const exp = eventLogger.getExperimentAssignment('USER_ANON');
    activeProducts.forEach(p => {
      eventLogger.logEvent({
        eventType: 'add_to_cart',
        sku: p.id,
        anchorSku: anchorProduct.id,
        surface,
        experimentId: exp.experimentId,
        variant: exp.variant,
        rankingMode: flags.rankingAlgorithm
      });
    });

    setTimeout(() => setAddedSuccess(false), 2200);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      marginTop: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} color="#2563eb" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Frequently Bought Together
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Data-driven co-purchase bundle • Multi-item discount applied
            </span>
          </div>
        </div>

        <span className="badge badge-purple" style={{ fontSize: '0.725rem' }}>
          {flags.rankingAlgorithm === 'incremental_uplift' ? 'Causal Uplift Ranked' : 'Popularity Ranked'}
        </span>
      </div>

      {/* Visual Product Thumbnails Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {/* Anchor item */}
        <div style={{ position: 'relative' }}>
          <img
            src={anchorProduct.image}
            alt={anchorProduct.name}
            style={{ width: '84px', height: '84px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #2563eb' }}
          />
          <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: '#2563eb', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>
            This item
          </span>
        </div>

        {candidateProducts.map((cand, idx) => (
          <React.Fragment key={cand.product.id}>
            <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '1.2rem' }}>+</div>
            <div style={{
              position: 'relative',
              opacity: selectedSkus.includes(cand.product.id) ? 1 : 0.45,
              transition: 'opacity 0.2s ease',
              cursor: 'pointer'
            }} onClick={() => toggleItem(cand.product.id)}>
              <img
                src={cand.product.image}
                alt={cand.product.name}
                style={{ width: '84px', height: '84px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
              {cand.isExploration && (
                <span style={{ position: 'absolute', top: '4px', left: '4px', background: '#f59e0b', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 800 }}>
                  Discovery
                </span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Checkbox item list with Reasons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
        {/* Anchor row */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem', color: '#0f172a', cursor: 'default' }}>
          <input type="checkbox" checked disabled style={{ marginTop: '0.2rem', accentColor: '#2563eb' }} />
          <div>
            <strong>This item:</strong> {anchorProduct.name} - <span style={{ color: '#2563eb', fontWeight: 700 }}>${anchorProduct.price.toFixed(2)}</span>
            <span style={{ display: 'block', fontSize: '0.725rem', color: '#16a34a' }}>✓ In Stock ({anchorProduct.stock} units) • {anchorProduct.inStoreAisle || 'Aisle 1A'}</span>
          </div>
        </label>

        {candidateProducts.map((cand) => {
          const isChecked = selectedSkus.includes(cand.product.id);
          return (
            <label key={cand.product.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem', color: '#0f172a', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(cand.product.id)}
                style={{ marginTop: '0.2rem', accentColor: '#2563eb' }}
              />
              <div>
                <span>{cand.product.name}</span> - <span style={{ color: '#2563eb', fontWeight: 700 }}>${cand.product.price.toFixed(2)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.15rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                    💡 <em>{cand.reason}</em> (Lift {cand.lift}x)
                  </span>
                  {cand.upliftPoints > 10 && (
                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      +{cand.upliftPoints}pts uplift
                    </span>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Pricing & Add Bundle Action */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Bundle Total ({activeProducts.length} items):
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              ${bundleTotal.toFixed(2)}
            </span>
            {bundleDiscount > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                ${bundleSubtotal.toFixed(2)}
              </span>
            )}
            {bundleDiscount > 0 && (
              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }}>
                Save ${bundleDiscount.toFixed(2)} (8% bundle discount)
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddBundle}
          disabled={addedSuccess}
          className="btn btn-primary"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
            cursor: 'pointer'
          }}
        >
          {addedSuccess ? (
            <>
              <Check size={18} />
              <span>Bundle Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>Add Bundle to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
