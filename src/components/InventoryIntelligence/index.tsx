import React, { useState } from 'react';
import { Activity, AlertTriangle, TrendingUp, CheckCircle2, CloudRain, Bell, RefreshCw, Send, ArrowUpRight } from 'lucide-react';
import { MOCK_DEMAND_FORECAST, MOCK_PHANTOM_ANOMALIES } from '../../data/mockScenarios';
import { PhantomAnomaly } from '../../types';
import confetti from 'canvas-confetti';

import { dispatchCloudRunCycleCount } from '../../services/apiClient';

export const InventoryIntelligence: React.FC = () => {
  const [anomalies, setAnomalies] = useState<PhantomAnomaly[]>(MOCK_PHANTOM_ANOMALIES);
  const [dispatchedList, setDispatchedList] = useState<string[]>([]);

  const handleDispatchCycleCount = async (anomalyId: string) => {
    setDispatchedList(prev => [...prev, anomalyId]);
    setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status: 'investigating' } : a));

    const anomaly = anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      // Dispatches real cycle-count task to Google Cloud Run API & Firestore
      dispatchCloudRunCycleCount(anomaly.sku, 'STORE-104', undefined, `Phantom discrepancy audit: ${anomaly.recommendedAction}`).catch(() => {});
    }

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#16a34a', '#2563eb', '#f59e0b']
    });
  };

  // SVG Chart Dimensions & Helpers
  const chartHeight = 220;
  const chartWidth = 740;
  const maxVal = 160;
  const minVal = 20;

  const getCoordinates = (index: number, val: number) => {
    const x = 30 + (index / (MOCK_DEMAND_FORECAST.length - 1)) * (chartWidth - 60);
    const y = chartHeight - 25 - ((val - minVal) / (maxVal - minVal)) * (chartHeight - 50);
    return { x, y };
  };

  const forecastPoints = MOCK_DEMAND_FORECAST.map((d, i) => getCoordinates(i, d.forecastedDemand));
  const forecastPath = forecastPoints.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');

  const upperPoints = MOCK_DEMAND_FORECAST.map((d, i) => getCoordinates(i, d.upperConfidence));
  const lowerPoints = MOCK_DEMAND_FORECAST.map((d, i) => getCoordinates(i, d.lowerConfidence)).reverse();
  const confidenceAreaPath = `${upperPoints.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')} ${lowerPoints.reduce((acc, curr) => `${acc} L ${curr.x} ${curr.y}`, '')} Z`;

  const historicalPoints = MOCK_DEMAND_FORECAST.filter(d => d.historicalSales !== undefined).map((d, i) => getCoordinates(i, d.historicalSales!));
  const historicalPath = historicalPoints.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Demand Forecasting Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-blue">Demand Prediction</span>
              <span className="badge badge-green">96.4% Model R² Accuracy</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>14-Day Sales Velocity & Weather Impact Forecast</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb' }}>
              <span style={{ width: '12px', height: '3px', background: '#2563eb', borderRadius: '2px' }}></span> Historical Sales
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7c3aed' }}>
              <span style={{ width: '12px', height: '3px', background: '#7c3aed', borderRadius: '2px' }}></span> Predicted Demand
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
              <span style={{ width: '12px', height: '8px', background: '#e9d5ff', borderRadius: '2px' }}></span> 95% Confidence Band
            </span>
          </div>
        </div>

        {/* Interactive SVG Chart in Clean Light Mode */}
        <div style={{ width: '100%', overflowX: 'auto', background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', minWidth: '680px', height: 'auto', overflow: 'visible' }}>
            <defs>
              <linearGradient id="confidenceGradLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            {[40, 80, 120, 160].map((v, i) => {
              const y = chartHeight - 25 - ((v - minVal) / (maxVal - minVal)) * (chartHeight - 50);
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2={chartWidth - 30} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                  <text x="12" y={y + 3} fill="#94a3b8" fontSize="9" fontFamily="monospace">{v}</text>
                </g>
              );
            })}

            {/* Confidence Area */}
            <path d={confidenceAreaPath} fill="url(#confidenceGradLight)" />

            {/* Historical Sales Line */}
            <path d={historicalPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

            {/* Forecast Line */}
            <path d={forecastPath} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />

            {/* Data points & Event annotations */}
            {MOCK_DEMAND_FORECAST.map((d, i) => {
              const pt = getCoordinates(i, d.forecastedDemand);
              return (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#7c3aed" />
                  <text x={pt.x} y={chartHeight - 6} fill="#64748b" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                    {d.date}
                  </text>
                  {d.eventFactor && (
                    <g>
                      <line x1={pt.x} y1={pt.y - 6} x2={pt.x} y2={pt.y - 24} stroke="#f59e0b" strokeWidth="1" />
                      <rect x={pt.x - 45} y={pt.y - 38} width="90" height="15" rx="3" fill="#ea580c" />
                      <text x={pt.x} y={pt.y - 27} fill="#ffffff" fontSize="7.5" fontWeight="700" textAnchor="middle">
                        {d.eventFactor}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloudRain size={16} color="#2563eb" />
            <span>Weather Telemetry Ingestion: <strong>Local Weather Radar + Promotional Calendar</strong></span>
          </div>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>+28% Sales Uplift anticipated for Autumn VIP Campaign</span>
        </div>
      </div>

      {/* Phantom Inventory Discrepancy Radar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-red">Store Discrepancy Radar</span>
              <span className="badge badge-orange">Physical vs Ledger Mismatch</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Real-Time Phantom Inventory Alerts</h2>
          </div>

          <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
            3 Active Discrepancies Flagged
          </span>
        </div>

        {/* Anomalies List in Clean Light Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {anomalies.map((anomaly) => {
            const isDispatched = dispatchedList.includes(anomaly.id) || anomaly.status === 'investigating';
            return (
              <div
                key={anomaly.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  borderLeft: `4px solid ${anomaly.phantomRiskScore > 90 ? '#dc2626' : '#f59e0b'}`
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-blue">{anomaly.id}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{anomaly.storeLocation}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{anomaly.productName}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                    {anomaly.recommendedAction}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>System Ledger</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{anomaly.erpLedgerStock} units</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>7d Sales Velocity</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626' }}>{anomaly.posSalesVelocity7d}/wk</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Predicted Shelf</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>{anomaly.predictedPhysicalStock} units</p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Phantom Risk</p>
                    <span className="badge badge-red" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                      {anomaly.phantomRiskScore}%
                    </span>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>At-Risk Revenue</p>
                    <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                      ${anomaly.potentialLostRevenue.toFixed(0)}
                    </p>
                  </div>

                  {/* Dispatch Action Button */}
                  <button
                    onClick={() => handleDispatchCycleCount(anomaly.id)}
                    disabled={isDispatched}
                    className={isDispatched ? 'btn btn-secondary' : 'btn btn-accent'}
                    style={{ minWidth: '170px' }}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 size={16} color="#16a34a" />
                        <span>Task Dispatched</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Dispatch Count</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
