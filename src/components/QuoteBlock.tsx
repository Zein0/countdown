// Soft container for optional quotes beneath countdowns.
import { StyleSheet, Text, View } from 'react-native';

interface QuoteBlockProps {
  text?: string;
}

export const QuoteBlock = ({ text }: QuoteBlockProps) => {
  if (!text?.trim()) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.mark}>“</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 4
  },
  mark: {
    color: '#7D8B9C',
    fontSize: 32,
    marginBottom: -10
  },
  text: {
    color: '#C9D2DE',
    fontSize: 16,
    fontStyle: 'italic'
  }
});

export default QuoteBlock;
