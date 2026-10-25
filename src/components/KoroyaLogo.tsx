import React from 'react';

export interface KoroyaLogoProps {
  variant?: 'full' | 'horizontal' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  subtitle?: string;
  className?: string;
  showImageBadge?: boolean;
}

export const KoroyaLogo: React.FC<KoroyaLogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'dark',
  subtitle,
  className = '',
  showImageBadge = false
}) => {
  // Dimensions mapping
  const sizeMap = {
    xs: { icon: 28, text: 'text-base', sub: 'text-[9px]', tracking: 'tracking-wider' },
    sm: { icon: 34, text: 'text-lg', sub: 'text-[10px]', tracking: 'tracking-widest' },
    md: { icon: 42, text: 'text-xl', sub: 'text-[11px]', tracking: 'tracking-widest' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs', tracking: 'tracking-widest' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm', tracking: 'tracking-widest' }
  };

  const currentSize = sizeMap[size];
  const isDark = theme === 'dark';

  // SVG Geometric Emblem: Contemporary African Sunburst & Royal Monogram 'K'
  const Emblem = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="KOROYA Insignia"
    >
      <defs>
        {/* Gradients for high-end metallic gold and lush emerald */}
        <linearGradient id="koroyaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="koroyaEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="koroyaNavyBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F2444" />
          <stop offset="100%" stopColor="#061224" />
        </linearGradient>
        <filter id="koroyaGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#047857" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background Rounded Diamond Shield */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="url(#koroyaNavyBase)"
        stroke="url(#koroyaGoldGrad)"
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />

      {/* African Sunburst / Royal Chevron Crown (Top) */}
      <g stroke="url(#koroyaGoldGrad)" strokeWidth="2.2" strokeLinecap="round">
        {/* Central apex ray */}
        <line x1="50" y1="14" x2="50" y2="22" />
        {/* Diagonal rays */}
        <line x1="36" y1="17" x2="41" y2="24" />
        <line x1="64" y1="17" x2="59" y2="24" />
        <line x1="26" y1="24" x2="33" y2="29" />
        <line x1="74" y1="24" x2="67" y2="29" />
      </g>

      {/* Arc of Dawn */}
      <path
        d="M 32 30 Q 50 22 68 30"
        stroke="url(#koroyaGoldGrad)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Monogram 'K' - Sculptural Contemporary African Lines */}
      {/* Left Vertical Pillar (Solid Foundation) */}
      <rect
        x="30"
        y="35"
        width="11"
        height="48"
        rx="2.5"
        fill="url(#koroyaEmeraldGrad)"
        stroke="url(#koroyaGoldGrad)"
        strokeWidth="1.5"
      />

      {/* Upper Ascending Diagonal Beam (Forward growth & scholarship) */}
      <path
        d="M 43 56 L 66 36 L 73 42 L 50 62 Z"
        fill="url(#koroyaEmeraldGrad)"
        stroke="url(#koroyaGoldGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Lower Anchored Diagonal / Arrow of Opportunity */}
      <path
        d="M 48 57 L 70 79 L 62 84 L 42 63 Z"
        fill="url(#koroyaEmeraldGrad)"
        stroke="url(#koroyaGoldGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Upward Apex Indicator / African Star Diamond at Core */}
      <polygon
        points="50,47 54,53 50,59 46,53"
        fill="url(#koroyaGoldGrad)"
      />
    </svg>
  );

  // Compact icon-only variant
  if (variant === 'compact') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  // Full Brand Logo with Wordmark & Slogan
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Emblem}

      <div className="flex flex-col justify-center leading-tight">
        {/* Main Wordmark */}
        <div className="flex items-center gap-1.5">
          <span
            className={`${currentSize.text} font-black tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            KOROYA
          </span>
          {/* Golden Sun Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50" />
        </div>

        {/* Institutional Subtitle */}
        <span
          className={`${currentSize.sub} uppercase ${currentSize.tracking} font-semibold ${
            isDark ? 'text-emerald-400' : 'text-emerald-700'
          }`}
        >
          {subtitle || 'Talent Meets Opportunity'}
        </span>
      </div>
    </div>
  );
};
