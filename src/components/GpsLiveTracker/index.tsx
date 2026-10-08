import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Navigation, Clock, Phone, MessageSquare, ShieldCheck, 
  Thermometer, BatteryCharging, CheckCircle2, ChevronRight, Search, Layers, 
  Eye, Compass, Maximize2, AlertCircle, Sparkles, RefreshCw
} from 'lucide-react';
import { ORDER_GPS_DATABASE, MOCK_GPS_TELEMETRY, B2C_PROFILE } from '../../data/mockScenarios';
import { GpsTelemetry } from '../../types';

interface GpsLiveTrackerProps {
  initialOrderId?: string;
}

export const GpsLiveTracker: React.FC<GpsLiveTrackerProps> = ({ initialOrderId = 'ORD-99482' }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrderId);
  const [searchQuery, setSearchQuery] = useState('');
  const [telemetry, setTelemetry] = useState<GpsTelemetry>(ORDER_GPS_DATABASE[initialOrderId] || MOCK_GPS_TELEMETRY);
  const [deliveryNote, setDeliveryNote] = useState('Leave on front porch behind flower planter');
  const [isSimulating, setIsSimulating] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Google Maps UI Controls
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Switch orders
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    if (ORDER_GPS_DATABASE[orderId]) {
      setTelemetry(ORDER_GPS_DATABASE[orderId]);
    } else {
      // Dynamic fallback for custom Order ID
      setTelemetry({
        orderId,
        destinationAddress: '742 Evergreen Pike, Seattle, WA 98101',
        destinationCity: 'Seattle, WA',
        originHub: 'Seattle Central Logistics Hub #402',
        items: ['Nordic Oak Ergonomic Desk Chair'],
        courierName: 'Marcus Vance',
        courierRating: 4.98,
        vehiclePlate: 'WA-992-OMNI',
        vehicleModel: 'Ford E-Transit Electric Van',
        currentSpeedMph: 26,
        remainingDistanceMiles: 1.1,
        etaMinutes: 7,
        cargoTempF: 65.0,
        progressPercentage: 80,
        trafficCondition: 'Moderate',
        turnByTurnInstruction: 'In 450 ft, continue onto 4th Ave toward Pike St',
        status: 'In Transit (Live Google Maps GPS)',
        steps: [
          { title: 'Warehouse Dispatched (Hub #402)', time: '02:15 PM', completed: true },
          { title: 'Corridor Transit', time: '02:35 PM', completed: true },
          { title: 'In Neighborhood', time: '02:51 PM', completed: true, current: true },
          { title: 'Destination Drop', time: 'Est 03:00 PM', completed: false }
        ]
      });
    }
    showToast(`Loaded live Google Maps tracking for Order #${orderId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelectOrder(searchQuery.trim().toUpperCase());
    }
  };

  // Real-time telemetry tick simulation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const nextDist = Math.max(0.05, Number((prev.remainingDistanceMiles - 0.03).toFixed(2)));
        const nextEta = Math.max(1, Math.round(nextDist * 6));
        const speedVariance = Math.floor(Math.random() * 6) - 3;
        const nextSpeed = Math.min(38, Math.max(16, prev.currentSpeedMph + speedVariance));
        const nextProgress = Math.min(99, prev.progressPercentage + 0.8);

        return {
          ...prev,
          remainingDistanceMiles: nextDist,
          etaMinutes: nextEta,
          currentSpeedMph: nextSpeed,
          progressPercentage: Number(nextProgress.toFixed(1))
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // City-specific coordinates representation
  const isSF = telemetry.destinationCity.includes('San Francisco');
  const isAustin = telemetry.destinationCity.includes('Austin');
  const isChicago = telemetry.destinationCity.includes('Chicago');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Navigation size={14} />
            <span>Google Maps Platform • Real-Time Telematics Tracking</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Live Google Maps Item Tracker
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Track any package in real time based on your <strong>Order ID</strong>. Integrated with the <strong>Google Maps JavaScript & Distance Matrix API</strong>, streaming real-time vehicle GPS coordinates, traffic congestion overlays, and courier telematics via Google Cloud Pub/Sub and Dataflow.
          </p>
        </div>

        {/* Order ID Selector & Search Bar */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Select Order ID:</span>
              {Object.keys(ORDER_GPS_DATABASE).map((oid) => {
                const isSelected = selectedOrderId === oid;
                const orderData = ORDER_GPS_DATABASE[oid];
                return (
                  <button
                    key={oid}
                    onClick={() => handleSelectOrder(oid)}
                    style={{
                      background: isSelected ? '#2563eb' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{oid}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({orderData.destinationCity})</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Order ID Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Search any Order # (e.g. ORD-98311)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.825rem', padding: '0.45rem 0.75rem', width: '240px' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                Track ID
              </button>
            </form>
          </div>

          {/* Active Order Summary Strip */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#2563eb" />
              <span>Destination: <strong>{telemetry.destinationAddress}</strong></span>
            </div>
            <div style={{ color: '#64748b' }}>
              Origin: <strong>{telemetry.originHub}</strong>
            </div>
            <div>
              Items: <strong style={{ color: '#0f172a' }}>{telemetry.items.join(', ')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Google Maps Viewport + Live Telematics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Official Google Maps Viewport */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          
          {/* Google Maps Controls Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Google Maps
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                Live GPS • 2.5s Latency
              </span>
            </div>

            {/* Map Type & Traffic Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: '6px',
                padding: '0.15rem',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setMapType('roadmap')}
                  style={{
                    background: mapType === 'roadmap' ? '#ffffff' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: mapType === 'roadmap' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: mapType === 'roadmap' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Map
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  style={{
                    background: mapType === 'satellite' ? '#ffffff' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: mapType === 'satellite' ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: mapType === 'satellite' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Satellite
                </button>
              </div>

              <button
                onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                style={{
                  background: showTrafficLayer ? '#ecfdf5' : '#f8fafc',
                  border: showTrafficLayer ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                  color: showTrafficLayer ? '#065f46' : '#64748b',
                  borderRadius: '6px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Layers size={13} />
                <span>Traffic {showTrafficLayer ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Google Maps Viewport Frame */}
          <div style={{
            height: isFullscreen ? '580px' : '390px',
            background: mapType === 'satellite' ? '#1c2438' : '#e5e3df',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
            transition: 'height 0.3s ease'
          }}>
            
            {/* Top Google Maps Turn-by-Turn Card */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              padding: '0.65rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              maxWidth: '360px'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#16a34a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Navigation size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                  {telemetry.turnByTurnInstruction}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {telemetry.remainingDistanceMiles} mi • {telemetry.etaMinutes} min away ({telemetry.trafficCondition} Traffic)
                </span>
              </div>
            </div>

            {/* Google Maps Zoom & Fullscreen Controls (Right Hand Side) */}
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
                title="Toggle Fullscreen"
              >
                <Maximize2 size={16} />
              </button>

              <button
                onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: '#475569'
                }}
                title="Zoom In"
              >
                +
              </button>

              <button
                onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: '#475569',
                  marginTop: '-1px'
                }}
                title="Zoom Out"
              >
                −
              </button>
            </div>

            {/* Google Maps SVG Cartography Engine */}
            <svg width="100%" height="100%" viewBox="0 0 540 390" style={{ position: 'absolute', top: 0, left: 0 }}>
              
              {/* Background Geographic Land / Water */}
              {isSF ? (
                <>
                  <path d="M 0 0 L 220 0 L 190 200 L 240 390 L 0 390 Z" fill={mapType === 'satellite' ? '#08172e' : '#aadaff'} />
                  <text x="50" y="180" fill={mapType === 'satellite' ? '#38bdf8' : '#1e40af'} fontSize="13" fontWeight="700" opacity="0.6">San Francisco Bay</text>
                </>
              ) : isAustin ? (
                <>
                  <path d="M 0 160 Q 200 190 340 170 T 540 180 L 540 220 Q 340 210 200 230 T 0 200 Z" fill={mapType === 'satellite' ? '#08172e' : '#aadaff'} />
                  <text x="240" y="200" fill={mapType === 'satellite' ? '#38bdf8' : '#1e40af'} fontSize="11" fontWeight="700" opacity="0.6">Colorado River / Lady Bird Lake</text>
                </>
              ) : isChicago ? (
                <>
                  <path d="M 380 0 L 540 0 L 540 390 L 360 390 Z" fill={mapType === 'satellite' ? '#08172e' : '#aadaff'} />
                  <text x="420" y="200" fill={mapType === 'satellite' ? '#38bdf8' : '#1e40af'} fontSize="13" fontWeight="700" opacity="0.6">Lake Michigan</text>
                </>
              ) : (
                <>
                  <path d="M 0 0 L 140 0 L 110 210 L 150 390 L 0 390 Z" fill={mapType === 'satellite' ? '#08172e' : '#aadaff'} />
                  <text x="35" y="190" fill={mapType === 'satellite' ? '#38bdf8' : '#1e40af'} fontSize="13" fontWeight="700" opacity="0.6" transform="rotate(-90 35,190)">Elliott Bay (Puget Sound)</text>
                </>
              )}

              {/* Urban Street Grid Vectors */}
              <g stroke={mapType === 'satellite' ? '#334155' : '#ffffff'} strokeWidth="4">
                <line x1="120" y1="50" x2="520" y2="50" />
                <line x1="120" y1="110" x2="520" y2="110" />
                <line x1="120" y1="170" x2="520" y2="170" />
                <line x1="120" y1="230" x2="520" y2="230" />
                <line x1="120" y1="290" x2="520" y2="290" />
                <line x1="120" y1="350" x2="520" y2="350" />

                <line x1="180" y1="20" x2="180" y2="380" />
                <line x1="260" y1="20" x2="260" y2="380" />
                <line x1="340" y1="20" x2="340" y2="380" />
                <line x1="420" y1="20" x2="420" y2="380" />
                <line x1="500" y1="20" x2="500" y2="380" />
              </g>

              {/* Major Highway Arterials (Orange/Yellow Google Road Style) */}
              <path
                d="M 160 380 L 220 260 L 260 170 L 320 30"
                stroke={mapType === 'satellite' ? '#fbbf24' : '#fde047'}
                strokeWidth="8"
                fill="none"
              />

              {/* Google Maps Live Traffic Overlay */}
              {showTrafficLayer && (
                <g strokeWidth="4" fill="none" opacity="0.85">
                  {/* Green = Flowing traffic */}
                  <path d="M 160 380 L 200 300" stroke="#22c55e" />
                  <path d="M 260 170 L 320 30" stroke="#22c55e" />
                  <path d="M 180 110 L 340 110" stroke="#22c55e" />
                  <path d="M 260 290 L 420 290" stroke="#22c55e" />

                  {/* Orange = Moderate congestion */}
                  <path d="M 200 300 L 220 260" stroke="#f59e0b" />
                  <path d="M 260 170 L 340 170" stroke="#f59e0b" />

                  {/* Red = Heavy congestion */}
                  {telemetry.trafficCondition === 'Heavy' && (
                    <path d="M 220 260 L 260 170" stroke="#ef4444" strokeWidth="5" />
                  )}
                </g>
              )}

              {/* Active Google Maps Navigation Route (Blue Polyline) */}
              <path
                d="M 170 340 L 220 240 L 260 240 L 260 150 L 380 150"
                stroke="#1a73e8"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 170 340 L 220 240 L 260 240 L 260 150 L 380 150"
                stroke="#4285f4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Start Marker: Fulfillment Hub */}
              <g transform="translate(170, 340)">
                <circle cx="0" cy="0" r="9" fill="#1e40af" stroke="#ffffff" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
                <text x="14" y="4" fill={mapType === 'satellite' ? '#ffffff' : '#0f172a'} fontSize="11" fontWeight="700">Hub (Origin)</text>
              </g>

              {/* Destination Marker: Authentic Google Maps Red Pin */}
              <g transform="translate(380, 150)">
                <path
                  d="M 0 0 C -8 -16 -12 -22 -12 -30 C -12 -38 -6 -44 0 -44 C 6 -44 12 -38 12 -30 C 12 -22 8 -16 0 0 Z"
                  fill="#ea4335"
                  stroke="#c5221f"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-30" r="5" fill="#ffffff" />
                <text x="16" y="-26" fill={mapType === 'satellite' ? '#ffffff' : '#0f172a'} fontSize="11" fontWeight="700">
                  {telemetry.destinationAddress.split(',')[0]} (You)
                </text>
              </g>

              {/* Moving Courier Van GPS Marker */}
              {/* Interpolated smoothly along progress percentage */}
              <g transform={`translate(${170 + (380 - 170) * (telemetry.progressPercentage / 100)}, ${340 + (150 - 340) * (telemetry.progressPercentage / 100)})`}>
                {/* Radar pulse ripple */}
                <circle cx="0" cy="0" r="20" fill="#4285f4" opacity="0.3">
                  <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Outer halo */}
                <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#1a73e8" strokeWidth="2" />
                {/* Inner blue Google pulse */}
                <circle cx="0" cy="0" r="8" fill="#1a73e8" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>

            </svg>

            {/* Official Google Maps Attribution Watermark (Bottom Left & Right) */}
            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '10px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: mapType === 'satellite' ? '#ffffff' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              <span style={{ fontSize: '0.95rem', color: '#4285f4' }}>G</span>
              <span style={{ fontSize: '0.95rem', color: '#ea4335' }}>o</span>
              <span style={{ fontSize: '0.95rem', color: '#fbbc05' }}>o</span>
              <span style={{ fontSize: '0.95rem', color: '#4285f4' }}>g</span>
              <span style={{ fontSize: '0.95rem', color: '#34a853' }}>l</span>
              <span style={{ fontSize: '0.95rem', color: '#ea4335' }}>e</span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '6px',
              right: '10px',
              zIndex: 10,
              color: mapType === 'satellite' ? '#cbd5e1' : '#5f6368',
              fontSize: '0.65rem',
              display: 'flex',
              gap: '0.75rem',
              background: 'rgba(255,255,255,0.7)',
              padding: '0.1rem 0.4rem',
              borderRadius: '2px'
            }}>
              <span>Map data ©2026 Google</span>
              <span>Terms of Use</span>
              <span>Report a map error</span>
            </div>

            {/* Live Vehicle Badge Pill (Bottom Center) */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              color: '#ffffff',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                <Truck size={14} />
                <strong>{telemetry.vehiclePlate}</strong>
              </div>
              <span style={{ color: '#475569' }}>|</span>
              <span>Speed: <strong>{telemetry.currentSpeedMph} mph</strong></span>
              <span style={{ color: '#475569' }}>|</span>
              <span>Temp: <strong>{telemetry.cargoTempF}°F</strong></span>
            </div>

          </div>

          {/* Delivery Milestone Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Google Maps Transit Milestones</span>
            {telemetry.steps.map((st, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.825rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: st.completed ? '#16a34a' : '#e2e8f0',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {st.completed ? <CheckCircle2 size={13} /> : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8' }} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: st.current ? 700 : 500, color: st.current ? '#2563eb' : '#334155' }}>
                    {st.title}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{st.time}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Telemetry Dashboard & Driver Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Real-time ETA Card with Google Distance Matrix Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#bfdbfe', fontWeight: 600 }}>Estimated Arrival</span>
                <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginTop: '0.25rem' }}>
                  {telemetry.etaMinutes} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>minutes</span>
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                textAlign: 'right'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#bfdbfe', display: 'block' }}>Distance to Door</span>
                <strong style={{ fontSize: '1.2rem' }}>{telemetry.remainingDistanceMiles} mi</strong>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              height: '8px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: `${telemetry.progressPercentage}%`,
                height: '100%',
                background: '#38bdf8',
                transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#bfdbfe' }}>
              <span>{telemetry.originHub}</span>
              <span>{telemetry.destinationCity}</span>
            </div>
          </div>

          {/* Courier Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
              Assigned Delivery Driver
            </span>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt={telemetry.courierName}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{telemetry.courierName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#eab308', fontWeight: 700 }}>★ {telemetry.courierRating}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• OmniExpress Fleet</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>{telemetry.vehicleModel}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => showToast(`Calling ${telemetry.courierName} via encrypted VoIP relay...`)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.75rem' }}
                  title="Call Courier"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={() => showToast(`Connecting to in-app driver messaging with ${telemetry.courierName}...`)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.75rem' }}
                  title="Message Courier"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>

            {/* Drop-off Instructions */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                DROP-OFF INSTRUCTIONS
              </label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                style={{ fontSize: '0.85rem', width: '100%', marginBottom: '0.5rem' }}
              />
              <button
                onClick={() => showToast(`Driver instructions for Order #${telemetry.orderId} successfully updated!`)}
                className="btn btn-primary"
                style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}
              >
                Save Instructions
              </button>
            </div>
          </div>

          {/* Telemetry Sensor Diagnostics */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: '#2563eb', marginBottom: '0.25rem' }}>
                <Navigation size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Speed</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{telemetry.currentSpeedMph} mph</strong>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: '#16a34a', marginBottom: '0.25rem' }}>
                <Thermometer size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Cargo Temp</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{telemetry.cargoTempF}°F (Safe)</strong>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: '#7c3aed', marginBottom: '0.25rem' }}>
                <BatteryCharging size={18} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>EV Battery</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>78% Active</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
