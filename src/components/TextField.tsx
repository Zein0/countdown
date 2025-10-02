// Styled text input with consistent label treatment.
import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';

interface TextFieldProps extends TextInputProps {
  label: string;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(({ label, style, ...rest }, ref) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={ref}
      placeholderTextColor="#586171"
      style={[styles.input, style]}
      {...rest}
    />
  </View>
));

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8
  },
  label: {
    color: '#8F95A5',
    fontSize: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#11131A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#F0F4FA',
    fontSize: 16
  }
});

export default TextField;
