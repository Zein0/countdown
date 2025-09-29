// Palette aligned with the app's emotional, calm aesthetic.
export const palette = {
  backgroundDark: '#0f1115',
  backgroundLight: '#f5f5f2',
  surfaceDark: '#171a20',
  surfaceLight: '#ffffff',
  textPrimaryDark: '#f0f3f5',
  textSecondaryDark: '#8a93a6',
  accentEmerald: '#34c9a3',
  accentGold: '#c9a034',
  accentMist: '#9db4c0',
  divider: 'rgba(255,255,255,0.06)'
} as const;

export type PaletteKey = keyof typeof palette;
