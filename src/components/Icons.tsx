/* Inline SVG icon set — no external icon library needed. */

export function Icon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'chart':
      return (
        <svg {...common}>
          <path d="M3 20h18" />
          <rect x="5" y="10" width="3" height="7" rx="0.8" />
          <rect x="10" y="6" width="3" height="11" rx="0.8" />
          <rect x="15" y="12" width="3" height="5" rx="0.8" />
          <path d="M6.5 10V6.5M11.5 6V3.5M16.5 12V9" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5V5.5Z" />
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        </svg>
      );
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 4.6 2.9 8.4 7 10 4.1-1.6 7-5.4 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4.5" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.7 4 5.8 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.8-4-9s1.4-6.3 4-9Z" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 4h8v5a4 4 0 1 1-8 0V4Z" />
          <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" />
          <path d="M12 13v3M9 20h6M10 20c0-1.7.9-3 2-4 1.1 1 2 2.3 2 4" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.2 2" />
        </svg>
      );
    case 'calc':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 18h2M12 18h4" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m5 13 4.5 4.5L19 7" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M20 12H4M10 6l-6 6 6 6" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common}>
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      );
    case 'candle':
      return (
        <svg {...common}>
          <path d="M8 4v3M8 17v3M16 6v3M16 15v3" />
          <rect x="5.5" y="7" width="5" height="10" rx="1" />
          <rect x="13.5" y="9" width="5" height="6" rx="1" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3s1 3-1.5 6.5C8 13 7 14.5 7 17a5 5 0 0 0 10 0c0-2.5-1.5-4.5-2.5-6-.7 1-1.5 1.7-2.5 2.5C12 9 12 5 12 3Z" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="m12 3 2.6 5.6L20 9.6l-4 4.2.9 6.2L12 17.3 7.1 20l.9-6.2-4-4.2 5.4-1L12 3Z" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 20c1.4-3.3 4-5 7-5s5.6 1.7 7 5" />
        </svg>
      );
    case 'graduation':
      return (
        <svg {...common}>
          <path d="m12 4 10 5-10 5L2 9l10-5Z" />
          <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.5M20 4v4.5h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.6 5.7L4 15.5M4 20v-4.5h4.5" />
        </svg>
      );
    case 'info':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...common}>
          <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          <path d="m14.5 7 3 3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function Logo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD37A" />
          <stop offset="100%" stopColor="#E8A020" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="#0B1220" stroke="url(#lg-gold)" strokeWidth="2" />
      <path d="M12 33 20 25l6 5 10-13" stroke="url(#lg-gold)" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="20" width="3.6" height="6" rx="1" fill="#22C98B" />
      <rect x="24" y="14" width="3.6" height="6" rx="1" fill="#22C98B" />
      <rect x="33" y="18" width="3.6" height="6" rx="1" fill="#FF5C7A" />
      <circle cx="35" cy="12" r="3" fill="url(#lg-gold)" />
    </svg>
  );
}
