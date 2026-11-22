export const colors = {
  background: '#0B0B0F',
  surface: '#16161E',
  surfaceElevated: '#22222E',
  surfaceHover: '#2B2B3A',
  primary: '#E50914',
  primaryDark: '#B81D24',
  accent: '#F5C518',
  badgeMovie: '#2563EB',
  badgeMovieBg: 'rgba(37, 99, 235, 0.22)',
  badgeSeries: '#9333EA',
  badgeSeriesBg: 'rgba(147, 51, 234, 0.22)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  border: '#27272A',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.16)',
  success: '#22C55E',
  overlay: 'rgba(11, 11, 15, 0.82)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textMuted,
  },
} as const;
