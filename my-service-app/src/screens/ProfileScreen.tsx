import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FormInput, PrimaryButton, SafeScreen, ScreenHeader } from '../components';
import { useAuth } from '../services/authContext';
import { getApiErrorMessage } from '../services/apiErrors';
import { fetchProfile, updateProfile } from '../services/userService';

export function ProfileScreen() {
  const { logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const user = await fetchProfile();
        if (isMounted) {
          setName(user.name);
          setEmail(user.email);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Could not load profile.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Name is required.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const user = await updateProfile(trimmedName);
      setName(user.name);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update profile.'));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <SafeScreen edges={['top']} style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top']}>
      <ScreenHeader title="Profile" subtitle="Manage your account details." />

      <View style={styles.form}>
        <FormInput label="Name" value={name} onChangeText={setName} autoComplete="name" />
        <FormInput
          label="Email"
          value={email}
          editable={false}
          style={styles.disabledInput}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <PrimaryButton title="Save changes" onPress={handleSave} loading={isSaving} />
        <PrimaryButton title="Sign out" onPress={logout} style={styles.signOutButton} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 20,
    gap: 16,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
  },
  signOutButton: {
    backgroundColor: '#DC2626',
  },
});
