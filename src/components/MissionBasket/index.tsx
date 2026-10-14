import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShoppingBag, Plus, Check, ArrowRight, 
  HelpCircle, SlidersHorizontal, Info, Laptop, CheckSquare
} from 'lucide-react';
import { Product } from '../../types';
import { LAPTOP_MISSION_SEED, MissionItemSeed, rankRecommendations } from '../../services/basketAnalysis';
import { featureFlagService } from '../../services/featureFlags';
import { eventLogger } from '../../services/eventLogger';
import confetti from 'canvas-confetti';

interface MissionBasketProps {
  anchorProduct?: Product | null;
  onAddToCart: (product: Product) => void;
  cartProductIds?: string[];
  initialExpanded?: boolean;
}

export const MissionBasket: React.FC<MissionBasketProps> = ({
  anchorProduct,
  onAddToCart,
  cartProductIds = [],
  initialExpanded = false
}) => {
  const flags = featureFlagService.getFlags();
  if (!flags.enableMissionBaskets) return null;

  // Question Prompt State: "Do you want to set up a workstation?"
  const [isWorkstationAccepted, setIsWorkstationAccepted] = useState<boolean>(initialExpanded);
  const [hasAnswered, setHasAnswered] = useState<boolean>(initialExpanded);

  // Local ranking algorithm toggle for demo / dev inspection (Section 4B criteria)
  const [rankingMode, setRankingMode] = useState<'incremental_uplift' | 'popularity'>(flags.rankingAlgorithm);

  // Selected additional items from the workstation recommendation list
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [addedSkus, setAddedSkus] = useState<string[]>([]);

  // Rank the seed items based on the active ranking mode
  const rankedItems = React.useMemo(() => {
    return rankRecommendations(LAPTOP_MISSION_SEED, rankingMode, flags.explorationShare);
  }, [rankingMode, flags.explorationShare]);

  // Workstation items (laptop, mouse, sleeve, hub, stand, keyboard) - charger is excluded
  const missionItemsCount = 6; // Anchor Laptop + 5 accessories
  // How many mission items are covered (Anchor is in cart or mission items selected/added)
  const coveredMissionCount = React.useMemo(() => {
    let count = 1; // Anchor Laptop is active
    LAPTOP_MISSION_SEED.filter(s => s.isMissionItem).forEach(item => {
      if (selectedSkus.includes(item.sku) || addedSkus.includes(item.sku)) {
        count += 1;
      }
    });
    return Math.min(missionItemsCount, count);
  }, [selectedSkus, addedSkus]);

  const completenessPercentage = Math.round((coveredMissionCount / missionItemsCount) * 100);

  const handleAcceptWorkstation = () => {
    setIsWorkstationAccepted(true);
    setHasAnswered(true);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleDeclineWorkstation = () => {
    setIsWorkstationAccepted(false);
    setHasAnswered(true);
  };

  const handleAddSelectedToCart = (item: MissionItemSeed) => {
    const pseudoProduct: Product = {
      id: item.sku,
      name: item.name,
      category: 'Electronics',
      price: item.price,
      stock: item.stock,
      rating: 4.8,
      reviewsCount: 140,
      image: item.image,
      description: `High-performance accessory for your workstation setup.`,
      features: ['Compact design', 'Universal compatibility'],
      tags: ['office', 'accessory', 'workstation'],
      elasticity: -1.2,
      inStoreAisle: 'Aisle 1C'
    };

    onAddToCart(pseudoProduct);
    setAddedSkus(prev => [...prev, item.sku]);

    // Telemetry log
    const exp = eventLogger.getExperimentAssignment('USER_ANON');
    eventLogger.logEvent({
      eventType: 'add_to_cart',
      sku: item.sku,
      anchorSku: anchorProduct?.id || 'LAPTOP_Y',
      surface: 'mission_builder',
      experimentId: exp.experimentId,
      variant: exp.variant,
      rankingMode
    });

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  // 1. Initial Prompt Card: "Do you want to set up a workstation?"
  if (!isWorkstationAccepted) {
    if (hasAnswered) return null; // If user clicked 'No, thanks'

    return (
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        border: '1.5px solid #86efac',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        marginTop: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 15px rgba(22, 163, 74, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '640px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a',
            flexShrink: 0
          }}>
            <Laptop size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
              Do you want to set up a workstation?
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.4 }}>
              Pair your laptop with essential accessories (protective sleeve, USB hub, stand, keyboard &amp; wireless mouse) with live bundle completeness tracking.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleAcceptWorkstation}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.9rem',
              background: '#16a34a',
              borderColor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Check size={16} />
            <span>Yes, set up workstation</span>
          </button>

          <button
            onClick={handleDeclineWorkstation}
            className="btn btn-secondary"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            No, thanks
          </button>
        </div>
      </div>
    );
  }

  // 2. Expanded Workstation Setup with Basket Completeness Bar & Ranked Items
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.75rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      marginTop: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            <Laptop size={14} />
            <span>Workstation Setup in Progress</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Complete Your Workstation Setup
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Anchored to <strong>{anchorProduct ? anchorProduct.name : 'Laptop Y'}</strong>. Track completeness and discover accessories with proven incremental attach rates.
          </p>
        </div>

        {/* Dev / Admin Ranking Mode Toggle */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <SlidersHorizontal size={15} color="#64748b" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Ranking:</span>
          <button
            onClick={() => setRankingMode('incremental_uplift')}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: 'none',
              background: rankingMode === 'incremental_uplift' ? '#2563eb' : 'transparent',
              color: rankingMode === 'incremental_uplift' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Incremental Uplift
          </button>
          <button
            onClick={() => setRankingMode('popularity')}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: 'none',
              background: rankingMode === 'popularity' ? '#0f172a' : 'transparent',
              color: rankingMode === 'popularity' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Popularity
          </button>
        </div>
      </div>

      {/* Basket Completeness Meter */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
              Basket Completeness:
            </span>
            <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 800 }}>
              {coveredMissionCount} of {missionItemsCount} items
            </span>
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: completenessPercentage === 100 ? '#16a34a' : '#0f172a' }}>
            {completenessPercentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            width: `${completenessPercentage}%`,
            height: '100%',
            background: completenessPercentage === 100 ? '#16a34a' : 'linear-gradient(90deg, #16a34a, #22c55e)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {['Laptop (Anchor)', 'Laptop Sleeve', 'USB Hub', 'Laptop Stand', 'Keyboard', 'Wireless Mouse'].map((req, i) => {
            const isDone = i < coveredMissionCount;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: isDone ? '#dcfce7' : '#f1f5f9',
                  color: isDone ? '#15803d' : '#64748b'
                }}
              >
                {isDone ? <Check size={12} /> : <span style={{ width: '8px' }}>•</span>}
                {req}
              </span>
            );
          })}
        </div>
      </div>

      {/* Ranked Candidate Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {rankedItems.map((item, index) => {
          const isAdded = addedSkus.includes(item.sku);
          return (
            <div
              key={item.sku}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
            >
              {/* Ranking Rank Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: index === 0 ? '#eff6ff' : '#f1f5f9',
                  color: index === 0 ? '#1d4ed8' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px'
                }}>
                  Rank #{index + 1}
                </span>

                {item.isMissionItem ? (
                  <span style={{ fontSize: '0.675rem', color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    ★ Core Workstation Item
                  </span>
                ) : (
                  <span style={{ fontSize: '0.675rem', color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    Peripheral Item
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Metric stats card */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '0.5rem 0.65rem',
                fontSize: '0.725rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.35rem',
                color: '#64748b'
              }}>
                <div>
                  Bought-with: <strong style={{ color: '#0f172a' }}>{item.boughtWithPct}%</strong>
                </div>
                <div>
                  Uplift: <strong style={{ color: item.upliftPoints >= 10 ? '#16a34a' : '#2563eb' }}>
                    +{item.upliftPoints} pts
                  </strong>
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={() => handleAddSelectedToCart(item)}
                disabled={isAdded}
                className={isAdded ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  marginTop: 'auto',
                  cursor: isAdded ? 'default' : 'pointer'
                }}
              >
                {isAdded ? (
                  <>
                    <Check size={14} color="#16a34a" />
                    <span style={{ color: '#16a34a' }}>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Add to Workstation</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
