// Allows the user to choose a background color or image for an event.
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { EventBackground } from '../types';
import { palette } from '../theme/colors';

interface Props {
  value?: EventBackground;
  onSelectColor: (color: string) => void;
  onSelectImage?: () => void;
  canUseImages: boolean;
}

const swatches = ['#1f242b', '#2c1c29', '#1d2b2a', '#2a233b', '#40302e'];

export const BackgroundSelector: React.FC<Props> = ({ value, onSelectColor, onSelectImage, canUseImages }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Background</Text>
    <View style={styles.swatchRow}>
      {swatches.map(color => {
        const isActive = value?.type === 'color' && value.value === color;
        return (
          <Pressable
            key={color}
            style={[styles.swatch, { backgroundColor: color, borderColor: isActive ? palette.accentMist : 'transparent' }]}
            onPress={() => onSelectColor(color)}
          />
        );
      })}
      {canUseImages && onSelectImage ? (
        <Pressable style={[styles.swatch, styles.imageSwatch]} onPress={onSelectImage}>
          {value?.type === 'image' ? (
            <ImageBackground source={{ uri: value.value }} style={StyleSheet.absoluteFill} imageStyle={{ borderRadius: 16 }} />
          ) : (
            <Text style={styles.imageText}>Image</Text>
          )}
        </Pressable>
      ) : (
        <View style={[styles.swatch, styles.lockedSwatch]}>
          <Text style={styles.lockedText}>Premium</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 12
  },
  label: {
    color: palette.textSecondaryDark,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
  },
  swatch: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageSwatch: {
    backgroundColor: palette.surfaceDark
  },
  imageText: {
    color: palette.textSecondaryDark,
    fontSize: 12
  },
  lockedSwatch: {
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)'
  },
  lockedText: {
    color: palette.textSecondaryDark,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 6
  }
});
