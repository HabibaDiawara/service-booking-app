import { StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface SafeScreenProps extends ViewProps {
  edges?: Edge[];
}

export function SafeScreen({
  children,
  style,
  edges = ['top', 'bottom'],
  ...props
}: SafeScreenProps) {
  return (
    <SafeAreaView style={[styles.screen, style]} edges={edges} {...props}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
