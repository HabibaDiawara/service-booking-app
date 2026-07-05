import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormInput, PrimaryButton, SafeScreen } from '../components';
import { useAuth } from '../services/authContext';
import { getAuthErrorMessage } from '../services/authService';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email: trimmedEmail, password });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to book and manage your services.
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />

          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <PrimaryButton
            title="Sign in"
            onPress={handleLogin}
            loading={isSubmitting}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    overflow: 'hidden',
  },
});
