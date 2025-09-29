// Typography scale favouring large serif titles for emotional tone.
export const typography = {
  titleSerif: {
    fontFamily: 'Georgia',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.5
  },
  headlineSerif: {
    fontFamily: 'Georgia',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.4
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22
  },
  caption: {
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 18
  }
} as const;
