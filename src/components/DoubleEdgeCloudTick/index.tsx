import React from 'react';

interface VerifiedBlackTickProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Authentic Verified User Review Black Tick
 * Ensures authentic credibility, grounded from Google on Review
 */
export const VerifiedBlackTick: React.FC<VerifiedBlackTickProps> = ({
  size = 18,
  className = '',
  style = {}
}) => {
  return (
    <span
      className={className}
      title="Verified User Review: Grounded from Google on review"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        ...style
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Solid Black Authentic Verified Disc */}
        <circle cx="12" cy="12" r="10.5" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
        {/* Crisp Pure White Checkmark */}
        <path
          d="M7.5 12.2L10.5 15.2L16.5 8.8"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

// Also export as DoubleEdgeCloudTick for complete backward compatibility
export const DoubleEdgeCloudTick = VerifiedBlackTick;

export const VerifiedReviewBadge: React.FC<{
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  confidence?: number;
}> = ({
  label,
  sublabel,
  size = 'md',
  confidence
}) => {
  // Normalize labels to guarantee authentic "Verified User Review • Grounded from Google"
  const displayLabel = !label || label.includes('Double Edge') 
    ? 'Verified User Review' 
    : label;
  
  const displaySublabel = !sublabel || sublabel.includes('Grounded in Reviews') || sublabel.includes('RAG Fact') || sublabel.includes('Ground Truth')
    ? 'Grounded from Google'
    : sublabel;

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const fontSize = size === 'sm' ? '0.75rem' : size === 'lg' ? '0.9rem' : '0.825rem';
  const padding = size === 'sm' ? '0.25rem 0.6rem' : size === 'lg' ? '0.5rem 1rem' : '0.35rem 0.8rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: '#ffffff',
        border: '1.5px solid #0f172a',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
        borderRadius: '9999px',
        padding,
        color: '#0f172a', // High-contrast, 100% readable solid black font
        fontSize,
        fontWeight: 800,
        letterSpacing: '0.01em',
        userSelect: 'none',
        lineHeight: 1.2
      }}
      title="Verified User Review: Grounded from Google on review to ensure authenticity"
    >
      <VerifiedBlackTick size={iconSize} />
      <span style={{ color: '#0f172a', fontWeight: 800 }}>{displayLabel}</span>
      {displaySublabel && (
        <>
          <span style={{ color: '#64748b', fontWeight: 700 }}>•</span>
          <span style={{ color: '#0f172a', fontWeight: 800 }}>{displaySublabel}</span>
        </>
      )}
      {confidence !== undefined && (
        <span style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.12rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 800,
          marginLeft: '0.2rem',
          letterSpacing: '0.02em'
        }}>
          {confidence.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

// Also export as DoubleEdgeCloudBadge for backward compatibility
export const DoubleEdgeCloudBadge = VerifiedReviewBadge;
