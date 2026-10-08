import React, { useState, useMemo } from 'react';
import { 
  Star, Truck, Check, Sparkles, ShoppingBag, Eye, ShieldCheck, Tag, Heart, 
  Clock, ArrowRight, Building2, ChevronRight, MapPin, Zap, Flame, 
  SlidersHorizontal, Grid, List, CheckCircle2, ChevronLeft, Percent,
  Send, MessageSquare, Bot, Award, CheckCheck, Database, Info, RefreshCw, X, RotateCcw, Search
} from 'lucide-react';
import { Product, IntentAnalysis, AuthenticityPersonaReview } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockCatalog';
import { RetailStore, MOCK_RETAIL_STORES } from '../../data/mockStores';
import { DoubleEdgeCloudTick, DoubleEdgeCloudBadge } from '../DoubleEdgeCloudTick';
import { geminiRetailService } from '../../services/geminiService';
import confetti from 'canvas-confetti';

interface StorefrontProps {
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  intentResult: IntentAnalysis | null;
  onSearch: (q: string) => void;
  selectedStore?: RetailStore;
  onOpenStoreLocator?: () => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenConversational?: (useCase?: '01' | '02' | '03' | '04' | '05') => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  onAddToCart,
  searchQuery,
  intentResult,
  onSearch,
  selectedStore = MOCK_RETAIL_STORES[0],
  onOpenStoreLocator,
  activeCategory: parentCategory = 'All',
  onSelectCategory,
  onOpenConversational
}) => {
  const [localCategory, setLocalCategory] = useState<string>('All');
  const activeCategory = onSelectCategory ? parentCategory : localCategory;
  const setActiveCategory = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setLocalCategory(cat);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [filterPrimeOnly, setFilterPrimeOnly] = useState(false);
  const [filterDealsOnly, setFilterDealsOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50-150' | '150-300' | '300plus'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // FlamIA: Flam Intelligence Assistant Product States
  const [activeModalTab, setActiveModalTab] = useState<'flamIA' | 'authenticity' | 'store'>('flamIA');
  const [flamIAQuery, setFlamIAQuery] = useState('');
  const [isAskingFlamIA, setIsAskingFlamIA] = useState(false);
  const [flamIAHistory, setFlamIAHistory] = useState<Record<string, Array<{ question: string; answer: string; groundedFact?: string; confidence: number }>>>({});
  const [productReviews, setProductReviews] = useState<Record<string, AuthenticityPersonaReview>>({});
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  const loadReviewForProduct = async (product: Product) => {
    if (productReviews[product.id]) return productReviews[product.id];
    setIsLoadingReview(true);
    try {
      const rev = await geminiRetailService.groundProductFactsWithRAG(product);
      setProductReviews(prev => ({ ...prev, [product.id]: rev }));
      return rev;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const handleAskFlamIA = async (product: Product, questionText: string) => {
    if (!questionText.trim()) return;
    setIsAskingFlamIA(true);
    try {
      const res = await geminiRetailService.askFlamIAAboutProduct(product, questionText);
      setFlamIAHistory(prev => ({
        ...prev,
        [product.id]: [
          ...(prev[product.id] || []),
          {
            question: questionText,
            answer: res.answer,
            groundedFact: res.groundedFact,
            confidence: res.confidence
          }
        ]
      }));
      setFlamIAQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAskingFlamIA(false);
    }
  };

  const getFlamIAQuickPrompts = (product: Product): string[] => {
    const c = product.category.toLowerCase();
    if (c.includes('furniture')) {
      return [
        'Is the lumbar support dynamic for 8+ hour workdays?',
        'What is the maximum static weight load capacity?',
        'How long does assembly take?'
      ];
    } else if (c.includes('electronics')) {
      return [
        'What is the measured active noise cancellation level?',
        'Does it support lossless LDAC 990kbps streaming?',
        'What is the real-world continuous battery runtime?'
      ];
    } else if (c.includes('apparel')) {
      return [
        'What is the hydrostatic waterproof rating?',
        'Are the seams taped against torrential rain?',
        'Is it machine washable without losing DWR?'
      ];
    } else if (c.includes('kitchen')) {
      return [
        'What is the temperature precision and thermal retention?',
        'Is it food-grade 304/316 stainless steel?',
        'Dishwasher safe and induction compatible?'
      ];
    }
    return [
      'What are the exact materials and dimensions?',
      'What is the return window and warranty policy?',
      'What did the Google Authenticity Reviewer conclude?'
    ];
  };

  // Dynamic counts per department from 500 items catalog
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MOCK_PRODUCTS.length };
    for (const p of MOCK_PRODUCTS) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  // The 10 Curated Departments with icons and representative photography
  const departments = [
    { name: 'All', icon: '🌟', count: departmentCounts['All'] || 500, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80' },
    { name: 'Furniture', icon: '🛋️', count: departmentCounts['Furniture'] || 50, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80' },
    { name: 'Electronics', icon: '🎧', count: departmentCounts['Electronics'] || 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Apparel', icon: '👕', count: departmentCounts['Apparel'] || 50, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kitchen', icon: '🍳', count: departmentCounts['Kitchen'] || 50, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80' },
    { name: 'Fitness', icon: '🏋️', count: departmentCounts['Fitness'] || 50, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Home & Decor', icon: '🪴', count: departmentCounts['Home & Decor'] || 50, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80' },
    { name: 'Beauty', icon: '✨', count: departmentCounts['Beauty'] || 50, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80' },
    { name: 'Gourmet', icon: '☕', count: departmentCounts['Gourmet'] || 50, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
    { name: 'Outdoor', icon: '⛺', count: departmentCounts['Outdoor'] || 50, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80' },
    { name: 'Toys & Hobbies', icon: '🎲', count: departmentCounts['Toys & Hobbies'] || 50, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80' }
  ];

  // Helper checking if user is viewing full catalog / Home
  const isViewingAll = !activeCategory || ['all', 'all categories', 'all departments'].includes(activeCategory.trim().toLowerCase());

  // Amazon-Style Filter & Sorting Logic
  const filteredProducts = useMemo(() => {
    const normalizedCat = (activeCategory || 'All').trim().toLowerCase();
    const isAll = normalizedCat === 'all' || normalizedCat === 'all categories' || normalizedCat === 'all departments' || normalizedCat === '';

    let prods = MOCK_PRODUCTS.filter((product) => {
      // Category filter - robust case & alias insensitive
      if (!isAll && product.category.toLowerCase() !== normalizedCat) {
        return false;
      }
      // AI Price constraint (only active during query search)
      if (searchQuery.trim() && intentResult?.priceConstraint?.max && product.price > intentResult.priceConstraint.max) {
        return false;
      }
      // Prime 2-Hour filter
      if (filterPrimeOnly && (!product.stock || product.stock <= 0)) {
        return false;
      }
      // Deals only filter
      if (filterDealsOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }
      // Price range chips
      if (priceRange === 'under50' && product.price >= 50) return false;
      if (priceRange === '50-150' && (product.price < 50 || product.price > 150)) return false;
      if (priceRange === '150-300' && (product.price < 150 || product.price > 300)) return false;
      if (priceRange === '300plus' && product.price < 300) return false;

      // Search query filter with smart keyword intent
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (q === '2-hour' || q === 'prime' || q === 'express') {
          return Boolean(product.stock && product.stock > 0);
        }
        if (q === 'deal' || q === 'deals' || q === 'discount' || q === 'discounts') {
          return Boolean(product.originalPrice && product.originalPrice > product.price);
        }
        if (q === 'bestseller' || q === 'best seller' || q === 'top rated') {
          return Boolean((product.rating || 0) >= 4.5);
        }
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        const matchTag = product.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCat && !matchTag) return false;
      }
      return true;
    });

    // Sort order
    if (sortBy === 'price-low') {
      prods = [...prods].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      prods = [...prods].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      prods = [...prods].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'discount') {
      prods = [...prods].sort((a, b) => {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    }

    return prods;
  }, [activeCategory, searchQuery, intentResult, sortBy, filterPrimeOnly, filterDealsOnly, priceRange]);

  // Pagination / Load More state for smooth 500 items scrolling
  const [visibleLimit, setVisibleLimit] = useState(48);

  // Reset pagination when filter criteria change
  React.useEffect(() => {
    setVisibleLimit(48);
  }, [activeCategory, searchQuery, priceRange, filterPrimeOnly, filterDealsOnly]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleLimit);
  }, [filteredProducts, visibleLimit]);

  // Featured Shelves for Amazon.in Homepage (When All is selected)
  const lightningDeals = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => (p.originalPrice || 0) > p.price).slice(0, 5);
  }, []);

  const electronicsBestSellers = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === 'Electronics').slice(0, 4);
  }, []);

  const furnitureTrending = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === 'Furniture').slice(0, 4);
  }, []);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#16a34a', '#ea580c']
    });
  };

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Amazon.in Style Hero Promotional Banner */}
      <div style={{
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
        color: '#ffffff',
        padding: '2.5rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Accent */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ color: '#fbbf24' }}>⚡ FlamGo Express Commerce</span>
            <span>•</span>
            <span style={{ color: '#38bdf8' }}>500 Live Items Across 10 Curated Departments</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Smart Retail Festival & Living Expo
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Discover verified products across 10 curated departments with real-time local shelf availability, 
            instant optical video returns, and FlamGo 2-hour courier fulfillment.
          </p>
        </div>

        {/* Hero Perks Guarantee Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.96)',
          color: '#0f172a',
          padding: '1.5rem',
          borderRadius: '16px',
          width: '310px',
          boxShadow: '0 20px 35px -10px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.4)',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              FlamGo Guarantee & Promise
            </h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                <Truck size={17} />
              </div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>2-Hour Local Delivery</strong>
                <span style={{ color: '#64748b' }}>From {selectedStore.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                <ShieldCheck size={17} />
              </div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Instant AI Video Return</strong>
                <span style={{ color: '#64748b' }}>Approval in under 20 seconds</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', flexShrink: 0 }}>
                <Building2 size={17} />
              </div>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Real-Time Aisle Sync</strong>
                <span style={{ color: '#64748b' }}>Accurate physical shelf inventory</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Amazon-Style Store Fulfillment Origin Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.9rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                {selectedStore.storeNumber}
              </span>
              <strong style={{ fontSize: '0.925rem', color: '#0f172a' }}>{selectedStore.name}</strong>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                • {selectedStore.distanceMiles} mi away
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.15rem 0 0' }}>
              Fulfilling from <strong>{selectedStore.address}, {selectedStore.city}</strong> • All 500 products linked to real physical store aisles
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Truck size={14} />
            <span>{selectedStore.deliveryTimeEstimate}</span>
          </span>

          {onOpenStoreLocator && (
            <button
              onClick={onOpenStoreLocator}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1d4ed8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <MapPin size={13} />
              <span>Change Store</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Amazon.in Trademark "Shop by Category" Quad Cards (When viewing All or Homepage) */}
      {isViewingAll && !searchQuery && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Explore Top Categories</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                10 Curated Departments (100 Items Each)
              </span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            width: '100%'
          }}>
            {/* Quad Card 1: Furniture & Workspaces */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Revamp your workspace & home
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem', width: '100%' }}>
                {MOCK_PRODUCTS.filter(p => p.category === 'Furniture').slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '88px', objectFit: 'cover', borderRadius: '8px', background: '#f8fafc', display: 'block' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', width: '100%' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                      ${p.price.toFixed(0)} • Aisle 4A
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveCategory('Furniture')}
                style={{
                  marginTop: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0
                }}
              >
                <span>See all 10 items in Furniture</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Quad Card 2: Electronics & Audio */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Up to 35% off | Studio tech & audio
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem', width: '100%' }}>
                {MOCK_PRODUCTS.filter(p => p.category === 'Electronics').slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '88px', objectFit: 'cover', borderRadius: '8px', background: '#f8fafc', display: 'block' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', width: '100%' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                      ${p.price.toFixed(0)} • Aisle 1B
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveCategory('Electronics')}
                style={{
                  marginTop: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0
                }}
              >
                <span>Explore all 10 in Electronics</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Quad Card 3: Kitchen & Gourmet */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Culinary & gourmet pantry picks
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem', width: '100%' }}>
                {MOCK_PRODUCTS.filter(p => p.category === 'Kitchen' || p.category === 'Gourmet').slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '88px', objectFit: 'cover', borderRadius: '8px', background: '#f8fafc', display: 'block' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', width: '100%' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                      ${p.price.toFixed(0)} • Aisle 6B
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveCategory('Kitchen')}
                style={{
                  marginTop: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0
                }}
              >
                <span>Shop Kitchen & Gourmet</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Quad Card 4: Outdoor & Fitness */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Active lifestyle, fitness & outdoor
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem', width: '100%' }}>
                {MOCK_PRODUCTS.filter(p => p.category === 'Fitness' || p.category === 'Outdoor').slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '88px', objectFit: 'cover', borderRadius: '8px', background: '#f8fafc', display: 'block' }}
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', width: '100%' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                      ${p.price.toFixed(0)} • Aisle 9B
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveCategory('Fitness')}
                style={{
                  marginTop: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0
                }}
              >
                <span>Explore Active & Outdoor</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Visual Department Rail (Circular Badges with Counts) */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Browse by Department
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
              Select a category to filter the 500 available items
            </span>
          </div>
          {!isViewingAll && (
            <button
              onClick={() => setActiveCategory('All')}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              Reset to All (500)
            </button>
          )}
        </div>

        {/* Horizontal Category Rail */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          paddingRight: '6.5rem',
          scrollbarWidth: 'thin'
        }}>
          {departments.map((dep) => {
            const isSelected = activeCategory === dep.name;
            return (
              <button
                key={dep.name}
                onClick={() => setActiveCategory(dep.name)}
                style={{
                  background: isSelected ? '#eff6ff' : 'transparent',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '92px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.15)' : 'none',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: '#f8fafc'
                }}>
                  <img
                    src={dep.image}
                    alt={dep.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{
                  fontSize: '0.775rem',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? '#1d4ed8' : '#334155',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {dep.name}
                </span>
                <span style={{
                  fontSize: '0.675rem',
                  color: isSelected ? '#2563eb' : '#94a3b8',
                  fontWeight: 600,
                  marginTop: '0.15rem'
                }}>
                  {dep.count} items
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Amazon-Style Lightning Deals Shelf (When All is active and no active search) */}
      {isViewingAll && !searchQuery && lightningDeals.length > 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #fed7aa',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 15px -3px rgba(234, 88, 12, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ background: '#ffedd5', color: '#ea580c', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Today's Lightning Deals</span>
                  <span style={{ fontSize: '0.7rem', color: '#ea580c', background: '#ffedd5', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    LIMITED TIME
                  </span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Ends in 04h 32m • Up to 35% off verified local store inventory
                </span>
              </div>
            </div>
            <button
              onClick={() => setFilterDealsOnly(!filterDealsOnly)}
              style={{
                background: filterDealsOnly ? '#ea580c' : '#fff7ed',
                border: '1px solid #fdba74',
                color: filterDealsOnly ? '#ffffff' : '#c2410c',
                fontSize: '0.775rem',
                fontWeight: 700,
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              {filterDealsOnly ? 'Showing All Deals' : 'View All Deals →'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {lightningDeals.map((prod) => {
              const discountPct = Math.round(((prod.originalPrice! - prod.price) / prod.originalPrice!) * 100);
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  style={{
                    border: '1px solid #f1f5f9',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    background: '#fdfdfe',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', marginBottom: '0.65rem' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px'
                    }}>
                      -{discountPct}% DEAL
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prod.name}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      ${prod.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${prod.originalPrice?.toFixed(2)}
                    </span>
                  </div>

                  {/* Amazon style % claimed bar */}
                  <div style={{ marginBottom: '0.65rem' }}>
                    <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: '74%', height: '100%', background: '#ea580c' }} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.15rem', display: 'block' }}>
                      74% Claimed • Prime 2-Hour Delivery
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAdd(prod, e)}
                    style={{
                      marginTop: 'auto',
                      background: '#fbbf24',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <ShoppingBag size={13} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Amazon-Style Results Header & Refinement Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Left: Department breadcrumb & item count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              DEPARTMENT BROWSER
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                {isViewingAll ? 'All Departments' : activeCategory}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                Showing {filteredProducts.length} items
              </span>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterPrimeOnly(!filterPrimeOnly)}
              style={{
                background: filterPrimeOnly ? '#ecfdf5' : '#ffffff',
                border: filterPrimeOnly ? '1px solid #10b981' : '1px solid #cbd5e1',
                color: filterPrimeOnly ? '#065f46' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '0.3rem 0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Truck size={13} color={filterPrimeOnly ? '#059669' : '#64748b'} />
              <span>⚡ Prime 2-Hour Only</span>
            </button>

            <button
              onClick={() => setFilterDealsOnly(!filterDealsOnly)}
              style={{
                background: filterDealsOnly ? '#fff7ed' : '#ffffff',
                border: filterDealsOnly ? '1px solid #f97316' : '1px solid #cbd5e1',
                color: filterDealsOnly ? '#9a3412' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '0.3rem 0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Tag size={13} color={filterDealsOnly ? '#ea580c' : '#64748b'} />
              <span>Deals Only</span>
            </button>

            {/* Price Filter Chips */}
            {(['all', 'under50', '50-150', '150-300', '300plus'] as const).map((r) => {
              const labels = {
                all: 'Any Price',
                under50: '< $50',
                '50-150': '$50-$150',
                '150-300': '$150-$300',
                '300plus': '$300+'
              };
              const isRSelected = priceRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setPriceRange(r)}
                  style={{
                    background: isRSelected ? '#eff6ff' : '#ffffff',
                    border: isRSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    color: isRSelected ? '#1d4ed8' : '#64748b',
                    fontSize: '0.725rem',
                    fontWeight: isRSelected ? 700 : 500,
                    borderRadius: '6px',
                    padding: '0.25rem 0.55rem',
                    cursor: 'pointer'
                  }}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sort By Dropdown & View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                color: '#0f172a',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured (Recommended)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="discount">Biggest Discount %</option>
            </select>
          </div>

          <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#eff6ff' : '#ffffff',
                color: viewMode === 'grid' ? '#2563eb' : '#64748b',
                border: 'none',
                padding: '0.35rem 0.55rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#eff6ff' : '#ffffff',
                color: viewMode === 'list' ? '#2563eb' : '#64748b',
                border: 'none',
                padding: '0.35rem 0.55rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Product Catalog Grid (Clean FlamGo Style with FlamGo Choice Badges & Ratings) */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        flexDirection: viewMode === 'list' ? 'column' : undefined,
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined,
        gap: '1.5rem'
      }}>
        {displayedProducts.map((product) => {
          const isLiked = likedProducts.includes(product.id);
          const discountPct = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
          const isFlamGoChoice = (product.rating || 0) >= 4.8;

          return (
            <div
              key={product.id}
              className="retail-card"
              style={{
                display: 'flex',
                flexDirection: viewMode === 'list' ? 'row' : 'column',
                cursor: 'pointer',
                position: 'relative',
                padding: '1.1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                gap: viewMode === 'list' ? '1.5rem' : '0'
              }}
              onClick={() => {
                setSelectedProduct(product);
                setActiveModalTab('flamIA');
                loadReviewForProduct(product);
              }}
            >
              {/* Image Container */}
              <div style={{
                position: 'relative',
                width: viewMode === 'list' ? '220px' : '100%',
                height: viewMode === 'list' ? '180px' : '220px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#f8fafc',
                marginBottom: viewMode === 'list' ? 0 : '1rem',
                flexShrink: 0
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                
                {/* Wishlist Heart button */}
                <button
                  onClick={(e) => toggleLike(product.id, e)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                  }}
                >
                  <Heart size={16} color={isLiked ? '#dc2626' : '#64748b'} fill={isLiked ? '#dc2626' : 'none'} />
                </button>

                {/* FlamGo Choice / Best Seller Badge */}
                {isFlamGoChoice && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ color: '#ea580c' }}>Flam</span>Go Choice
                  </span>
                )}

                {/* Category Tag (If not FlamGo Choice) */}
                {!isFlamGoChoice && (
                  <span className="badge badge-blue" style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.65rem' }}>
                    {product.category}
                  </span>
                )}

                {discountPct > 0 && (
                  <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {discountPct}% OFF
                  </span>
                )}
              </div>

              {/* Product Info Section */}
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Prime Delivery badge & Double Edge Cloud Tick */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    <Truck size={13} />
                    <span>⚡ Prime 2-Hour Delivery</span>
                  </div>
                  <DoubleEdgeCloudBadge size="sm" label="Verified User Review" sublabel="Grounded from Google" />
                </div>

                {/* Product Title */}
                <h3 style={{
                  fontSize: '0.975rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '0.35rem',
                  lineHeight: 1.35,
                  minHeight: '2.65rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </h3>

                {/* Star Rating with Review Count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{product.rating}</span>
                  <span style={{ color: '#64748b' }}>({product.reviewsCount})</span>
                </div>

                {/* Physical Store Fulfillment Origin */}
                <div style={{
                  fontSize: '0.725rem',
                  color: '#475569',
                  marginBottom: '0.85rem',
                  background: '#f8fafc',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={13} color="#2563eb" />
                    <span>Store #402 ({product.inStoreAisle || 'Aisle 3A'})</span>
                  </span>
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.7rem' }}>
                    ✓ {product.stock} In Stock
                  </span>
                </div>

                {/* Price & Add to Cart button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{ fontSize: '0.825rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {discountPct > 0 && (
                      <span style={{ fontSize: '0.725rem', color: '#16a34a', fontWeight: 700, marginTop: '0.1rem' }}>
                        Save ${(product.originalPrice! - product.price).toFixed(2)} ({discountPct}%)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAdd(product, e)}
                    style={{
                      background: '#fbbf24',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fbbf24')}
                    title="Add to shopping cart"
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination & Load More for 500 Products Catalog */}
      {filteredProducts.length > displayedProducts.length && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVisibleLimit(prev => Math.min(prev + 48, filteredProducts.length))}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem 1.75rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Load More Products (Showing {displayedProducts.length} of {filteredProducts.length})</span>
            <ChevronRight size={16} />
          </button>
          
          <button
            onClick={() => setVisibleLimit(filteredProducts.length)}
            style={{
              background: '#ffffff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '0.85rem 1.35rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            View All ({filteredProducts.length})
          </button>
        </div>
      )}

      {/* Empty State Fallback with 1-Click Reset */}
      {filteredProducts.length === 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          margin: '1rem 0'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Search size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
              No Products Matched Active Filters
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              We could not find products in "{isViewingAll ? 'All Departments' : activeCategory}" matching the current search query or price limits.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory('All');
              onSearch('');
              setFilterDealsOnly(false);
              setFilterPrimeOnly(false);
              setPriceRange('all');
            }}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem 1.75rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
            }}
          >
            <RotateCcw size={16} />
            <span>Reset All Filters & View All 500 Products</span>
          </button>
        </div>
      )}

      {/* 8. Product Details Modal with FlamIA (Flam Intelligence Assistant) */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} onClick={() => setSelectedProduct(null)}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontWeight: 700,
                zIndex: 2
              }}
            >
              ✕
            </button>

            {/* Top Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <DoubleEdgeCloudBadge 
                label="Verified User Review" 
                sublabel="Grounded from Google" 
                confidence={99.8}
                size="md"
              />
              <span style={{
                background: 'rgba(234, 88, 12, 0.12)',
                color: '#ea580c',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Sparkles size={13} color="#ea580c" />
                <span>Ask FlamIA</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Left Column: Product Visuals & Specs */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                />

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  {selectedProduct.tags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 600 }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.85rem 0 0.35rem' }}>
                  <span className="badge badge-blue">{selectedProduct.category}</span>
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>SKU: {selectedProduct.id}</span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                  {selectedProduct.name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${selectedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {selectedProduct.originalPrice && (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
                      Save {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  {selectedProduct.description}
                </p>

                <h4 style={{ fontSize: '0.75rem', color: '#0f172a', textTransform: 'uppercase', margin: '0 0 0.4rem', letterSpacing: '0.04em', fontWeight: 800 }}>
                  Catalog Features
                </h4>
                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>{f}</li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    handleAdd(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                  style={{
                    background: '#fbbf24',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
                    marginTop: 'auto'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart • ${selectedProduct.price.toFixed(2)}</span>
                </button>
              </div>

              {/* Right Column: FlamIA (Flam Intelligence Assistant) & Fact Grounding */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Tab Controls */}
                <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveModalTab('flamIA')}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'flamIA' ? '3px solid #ea580c' : '3px solid transparent',
                      color: activeModalTab === 'flamIA' ? '#ea580c' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '-2px'
                    }}
                  >
                    <Sparkles size={16} color={activeModalTab === 'flamIA' ? '#ea580c' : '#94a3b8'} />
                    <span>Ask FlamIA</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModalTab('authenticity');
                      loadReviewForProduct(selectedProduct);
                    }}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'authenticity' ? '3px solid #0284c7' : '3px solid transparent',
                      color: activeModalTab === 'authenticity' ? '#0284c7' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '-2px'
                    }}
                  >
                    <DoubleEdgeCloudTick size={16} />
                    <span>Verified User Reviews (Google Grounded)</span>
                  </button>

                  <button
                    onClick={() => setActiveModalTab('store')}
                    style={{
                      padding: '0.65rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeModalTab === 'store' ? '3px solid #16a34a' : '3px solid transparent',
                      color: activeModalTab === 'store' ? '#16a34a' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginBottom: '-2px'
                    }}
                  >
                    <Building2 size={16} />
                    <span>Store Aisle & Stock</span>
                  </button>
                </div>

                {/* Tab 1: FlamIA (Flam Intelligence Assistant) */}
                {activeModalTab === 'flamIA' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* FlamIA Profile Banner */}
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      borderRadius: '14px',
                      padding: '1rem 1.25rem',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 12px rgba(234, 88, 12, 0.4)'
                        }}>
                          <Sparkles size={22} color="#ffffff" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1rem', color: '#ffffff' }}>FlamIA</strong>
                            <span style={{
                              background: '#ea580c',
                              color: '#ffffff',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '0.1rem 0.45rem',
                              borderRadius: '4px'
                            }}>
                              Flam Intelligence Assistant
                            </span>
                          </div>
                          <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                            Addressing questions strictly regarding <strong>{selectedProduct.name}</strong>
                          </p>
                        </div>
                      </div>
                      <DoubleEdgeCloudTick size={22} />
                    </div>

                    {/* Quick Questions Chips for this product */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Suggested Questions for FlamIA:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {getFlamIAQuickPrompts(selectedProduct).map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFlamIAQuery(chip);
                              handleAskFlamIA(selectedProduct, chip);
                            }}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(234, 88, 12, 0.08)';
                              e.currentTarget.style.borderColor = '#ea580c';
                              e.currentTarget.style.color = '#ea580c';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f8fafc';
                              e.currentTarget.style.borderColor = '#cbd5e1';
                              e.currentTarget.style.color = '#334155';
                            }}
                          >
                            <Sparkles size={11} color="#ea580c" />
                            <span>"{chip}"</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Conversation Thread */}
                    <div style={{
                      maxHeight: '260px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {/* Default Welcome */}
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.825rem',
                        color: '#334155',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem'
                      }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                          <Sparkles size={13} />
                        </div>
                        <div>
                          <p style={{ margin: 0 }}>
                            👋 Hello! I am <strong>FlamIA</strong> (Flam Intelligence Assistant). I am your shopping concierge dedicated to <strong>{selectedProduct.name}</strong>. Ask me about specs, durability lab testing, dimensions, or verified review telemetry!
                          </p>
                        </div>
                      </div>

                      {/* Q&A History */}
                      {(flamIAHistory[selectedProduct.id] || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {/* User question */}
                          <div style={{
                            alignSelf: 'flex-end',
                            background: '#0f172a',
                            color: '#ffffff',
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px 10px 2px 10px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            maxWidth: '85%'
                          }}>
                            {item.question}
                          </div>

                          {/* FlamIA Answer */}
                          <div style={{
                            alignSelf: 'flex-start',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px 10px 10px 2px',
                            padding: '0.75rem 0.95rem',
                            fontSize: '0.825rem',
                            color: '#1e293b',
                            lineHeight: 1.5,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                            maxWidth: '95%',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                          }}>
                            <DoubleEdgeCloudTick size={20} style={{ marginTop: '2px' }} />
                            <div>
                              <p style={{ margin: 0, fontWeight: 500 }}>{item.answer}</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                                <span style={{ fontSize: '0.675rem', color: '#0f172a', fontWeight: 800 }}>
                                  Verified User Review • Grounded from Google
                                </span>
                                <span style={{ fontSize: '0.675rem', color: '#16a34a', fontWeight: 700 }}>
                                  • {item.confidence}% Grounded
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input Question Box */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder={`Ask FlamIA about ${selectedProduct.name}...`}
                        value={flamIAQuery}
                        onChange={(e) => setFlamIAQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskFlamIA(selectedProduct, flamIAQuery)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.95rem',
                          fontSize: '0.85rem',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleAskFlamIA(selectedProduct, flamIAQuery)}
                        disabled={isAskingFlamIA}
                        style={{
                          background: '#ea580c',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.65rem 1.25rem',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        {isAskingFlamIA ? (
                          <RefreshCw size={15} className="spin" />
                        ) : (
                          <>
                            <Send size={15} />
                            <span>Ask FlamIA</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}

                {/* Tab 2: Reviewer Fact Grounding (Google Authenticity Persona) */}
                {activeModalTab === 'authenticity' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Reviewer Profile */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Reviewer"
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Dr. Marcus Vance, Ph.D.</strong>
                            <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              548+ Verified Reviews
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                            Google Authenticity Persona • Hall of Fame Hardware Metrologist
                          </p>
                        </div>
                      </div>
                      <DoubleEdgeCloudBadge label="Verified User Review" sublabel="Grounded from Google" size="sm" />
                    </div>

                    {/* Claims Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Verified User Review Claims (Grounded from Google)
                      </span>

                      {(productReviews[selectedProduct.id]?.groundedFacts || [
                        {
                          claim: selectedProduct.category === 'Furniture'
                            ? 'Measured 18.6% reduction in L4-L5 lumbar disc pressure across 420 lab hours.'
                            : selectedProduct.category === 'Electronics'
                            ? '34.2 dB ambient attenuation measured in certified anechoic chamber.'
                            : 'Withstood 28,800 mm water column pressure before microporous saturation.',
                          confidenceScore: 99.7,
                          evidenceSource: `GCP BigQuery Review Embeddings #QC-${selectedProduct.id.toUpperCase()}`,
                          telemetryMetric: 'Standardized laboratory cycle test verified'
                        },
                        {
                          claim: 'Structural Integrity: Static load held for 72 hours with sub-0.14mm deflection.',
                          confidenceScore: 99.4,
                          evidenceSource: 'Google Cloud Spanner Inspection #QC-901',
                          telemetryMetric: 'Deflection < 0.14mm under heavy load'
                        }
                      ]).map((fact, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem'
                          }}
                        >
                          <DoubleEdgeCloudTick size={20} style={{ marginTop: '2px' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                              {fact.claim}
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                              {fact.evidenceSource} • {fact.telemetryMetric}
                            </p>
                          </div>
                          <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.675rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            {fact.confidenceScore.toFixed(1)}% Grounded
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Store Aisle & Physical Stock */}
                {activeModalTab === 'store' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                        <Building2 size={20} color="#2563eb" />
                        <div>
                          <strong style={{ fontSize: '1rem', color: '#1e3a8a' }}>{selectedStore.name}</strong>
                          <p style={{ margin: 0, fontSize: '0.775rem', color: '#3b82f6' }}>{selectedStore.address}</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', background: '#ffffff', padding: '0.85rem', borderRadius: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>In-Store Aisle</span>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                            {selectedProduct.inStoreAisle || 'Aisle 4B (Home Office)'}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Available Units</span>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}>
                            ✓ {selectedProduct.stock} Units Ready
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                        Fulfillment Options
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                        • <strong>1-Hour Express Store Pickup:</strong> Ready at Customer Service Desk with mobile bar code.<br />
                        • <strong>⚡ 2-Hour Courier Delivery:</strong> Dispatched from Store #402 fleet with live GPS telemetry.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
