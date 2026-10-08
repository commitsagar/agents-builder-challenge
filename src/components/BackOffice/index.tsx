import React, { useState } from 'react';
import { Sparkles, DollarSign, RefreshCw, Copy, Check, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { geminiRetailService } from '../../services/geminiService';
import confetti from 'canvas-confetti';

export const BackOffice: React.FC = () => {
  // Catalog Generator State
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]);
  const [rawSpecs, setRawSpecs] = useState('Solid White Oak, Steam-bent curve, 4-inch pneumatic lift, high-resilience memory foam, 330 lb capacity.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedListing, setGeneratedListing] = useState<{
    seoTitle: string;
    bulletPoints: string[];
    marketingDescription: string;
    seoKeywords: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Dynamic Elasticity Simulator State
  const [targetProduct, setTargetProduct] = useState(MOCK_PRODUCTS[1]);
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  const handleGenerateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const result = await geminiRetailService.generateCatalogCopy({
        name: selectedProduct.name,
        category: selectedProduct.category,
        rawSpecs
      });
      setGeneratedListing(result);
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#16a34a']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedListing) return;
    const text = `${generatedListing.seoTitle}\n\n${generatedListing.bulletPoints.join('\n')}\n\n${generatedListing.marketingDescription}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priceMultiplier = 1 - (discountPercent / 100);
  const newPrice = targetProduct.price * priceMultiplier;
  const demandMultiplier = 1 + (targetProduct.elasticity * (-discountPercent / 100));
  const baseVolume = 100;
  const projectedVolume = Math.round(baseVolume * demandMultiplier);
  const baseRevenue = baseVolume * targetProduct.price;
  const projectedRevenue = projectedVolume * newPrice;
  const revenueDelta = projectedRevenue - baseRevenue;
  const unitCost = targetProduct.price * 0.45;
  const baseProfit = baseVolume * (targetProduct.price - unitCost);
  const projectedProfit = projectedVolume * (newPrice - unitCost);
  const profitDelta = projectedProfit - baseProfit;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
      
      {/* Left Column: Automated SKU Content Generator */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div>
          <span className="badge badge-blue">Catalog Production</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Automated Product Listing Generator</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
            Transform raw vendor spec sheets into high-converting consumer titles and bullet points.
          </p>
        </div>

        <form onSubmit={handleGenerateListing} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              SELECT PRODUCT
            </label>
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const p = MOCK_PRODUCTS.find(item => item.id === e.target.value) || MOCK_PRODUCTS[0];
                setSelectedProduct(p);
                setRawSpecs(p.features.join(', '));
              }}
            >
              {MOCK_PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              RAW SUPPLIER SPECIFICATIONS
            </label>
            <textarea
              rows={3}
              value={rawSpecs}
              onChange={(e) => setRawSpecs(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ padding: '0.75rem' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Generating Listing Copy...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate SEO Title & Feature Bullets</span>
              </>
            )}
          </button>
        </form>

        {generatedListing && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-green">Ready for Store Catalog</span>
              <button onClick={copyToClipboard} className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Optimized Title</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{generatedListing.seoTitle}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>Key Bullets</p>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#475569' }}>
                  {generatedListing.bulletPoints.map((bp, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{bp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Marketing Copy</p>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  {generatedListing.marketingDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Dynamic Price Elasticity Guard */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div>
          <span className="badge badge-blue">Margin Optimization</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>Promotional Price vs Gross Margin Simulator</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
            Simulate promotional discounts against price elasticity to avoid margin erosion.
          </p>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
            TARGET SKU
          </label>
          <select
            value={targetProduct.id}
            onChange={(e) => {
              const p = MOCK_PRODUCTS.find(item => item.id === e.target.value) || MOCK_PRODUCTS[1];
              setTargetProduct(p);
            }}
          >
            {MOCK_PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Elasticity: {p.elasticity})</option>
            ))}
          </select>
        </div>

        {/* Slider */}
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Simulated Discount</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{discountPercent}% OFF</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#2563eb' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
            <span>0% (Full Price)</span>
            <span>15% (Optimal Lift)</span>
            <span>40% (Severe Dilution)</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Discounted Price</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>${newPrice.toFixed(2)}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>${targetProduct.price.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Projected Sales Volume</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>{projectedVolume} units</span>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>+{(projectedVolume - baseVolume)}%</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Revenue Delta</p>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: revenueDelta >= 0 ? '#16a34a' : '#dc2626' }}>
              {revenueDelta >= 0 ? `+$${revenueDelta.toFixed(0)}` : `-$${Math.abs(revenueDelta).toFixed(0)}`}
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Net Gross Profit</p>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: profitDelta >= 0 ? '#16a34a' : '#dc2626' }}>
              {profitDelta >= 0 ? `+$${profitDelta.toFixed(0)}` : `-$${Math.abs(profitDelta).toFixed(0)}`}
            </span>
          </div>
        </div>

        {/* Warning banner */}
        <div style={{
          padding: '1rem',
          borderRadius: '10px',
          background: discountPercent > 20 ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${discountPercent > 20 ? '#fecaca' : '#bbf7d0'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {discountPercent > 20 ? <AlertTriangle size={20} color="#dc2626" /> : <TrendingUp size={20} color="#16a34a" />}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: discountPercent > 20 ? '#991b1b' : '#166534' }}>
              {discountPercent > 20 ? 'Margin Dilution Warning' : 'Healthy Promotional Corridor'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {discountPercent > 20
                ? 'Discounting exceeds 20% on this SKU. Price elasticity will not offset unit margin erosion.'
                : 'Current price tier yields positive incremental profit with volume growth.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
