// Defines the shared color palette for the app's sorrowful dark theme.
export const palette = {
  background: '#07090C',
  surface: '#0F1319',
  surfaceAlt: '#131921',
  textPrimary: '#F5F6F7',
  textSecondary: '#AAB0B8',
  accentEmerald: '#3AAFA9',
  accentGold: '#C4A66A',
  accentMist: '#6C7A89',
  border: '#1D242D',
  danger: '#D86C70'
} as const;

export const moodPalette: Record<string, string> = {
  Hopeful: palette.accentEmerald,
  Melancholy: '#7C5B77',
  Peaceful: palette.accentMist,
  Silent: '#4A4F55'
};
