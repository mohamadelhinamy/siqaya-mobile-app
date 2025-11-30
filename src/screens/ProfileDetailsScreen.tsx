import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {BackHeader} from '../components';
import {Typography} from '../components/Typography';
import {useAuth, useLanguage} from '../context';
import {apiService} from '../services/api';
import {Colors} from '../constants';
import {hp} from '../utils/responsive';

const ProfileDetailsScreen: React.FC = () => {
  const {user, updateUser, token} = useAuth();
  const {t} = useLanguage();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [gender, setGender] = useState<string | undefined>(
    // user object may use `gender` or not
    (user as any)?.gender ?? undefined,
  );
  const [saving, setSaving] = useState(false);
  // removed local loading state — we simply fetch and populate fields

  useEffect(() => {
    // Fetch profile from API on mount
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const resp = await apiService.getProfile(token ?? undefined);
        if (resp && resp.success && mounted) {
          setName(resp.data?.name ?? '');
          // some APIs return `mobile` while others use `phone`
          setPhone(resp.data?.mobile ?? resp.data?.phone ?? '');
          setEmail(resp.data?.email ?? '');
          setGender(resp.data?.gender ?? undefined);
        }
      } catch (err) {
        console.log(err);
        console.warn('Failed to fetch profile', err);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSave = async () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.userInfo.name'));
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        // include mobile and gender to match backend expectations
        mobile: phone?.trim(),
        gender: gender ?? (user as any)?.gender ?? 'male',
      };

      const resp = await apiService.updateProfile(payload, token ?? undefined);
      if (resp && resp.success) {
        // Try to fetch authoritative profile from server (some APIs return different shapes)
        try {
          const fresh = await apiService.getProfile(token ?? undefined);
          if (fresh && fresh.success && fresh.data) {
            await updateUser(fresh.data as any);
          } else if (resp.data) {
            // Fallback to whatever the update returned if getProfile didn't return a usable object
            await updateUser(resp.data as any);
          }
        } catch (e) {
          console.warn('Failed to refresh profile after update', e);
          if (resp.data) {
            await updateUser(resp.data as any);
          }
        }
        Alert.alert('', t('common.success'));
      } else {
        Alert.alert(t('common.error'), t('common.retry'));
      }
    } catch (err) {
      console.warn('Failed to update profile', err);
      Alert.alert(t('common.error'), t('common.retry'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 80})}>
        <BackHeader
          title={t('profile.details.title')}
          backgroundColor={Colors.white}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.field}>
            <Typography
              variant="subtitle2"
              text={t('profile.userInfo.name')}
              color="textSecondary"
              style={styles.label}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('profile.sampleData.name')}
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Typography
              variant="subtitle2"
              text={t('auth.phoneEntry.phoneNumber')}
              color="textSecondary"
              style={styles.label}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder={t('auth.phoneEntry.phonePlaceholder')}
              keyboardType="phone-pad"
              editable={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Typography
              variant="subtitle2"
              text={t('profile.userInfo.email')}
              color="textSecondary"
              style={styles.label}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('profile.sampleData.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* Gender radio group row */}
          <View style={styles.field}>
            <Typography
              variant="subtitle2"
              text={t('profile.userInfo.gender') || 'Gender'}
              color="textSecondary"
              style={styles.label}
            />
            <View style={styles.genderOptionsContainer}>
              {['male', 'female'].map(opt => {
                const selected = gender === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={styles.genderOption}
                    onPress={() => setGender(opt)}
                    activeOpacity={0.7}>
                    <View
                      style={[
                        styles.genderCircle,
                        selected && styles.genderCircleSelected,
                      ]}
                    />
                    <Typography
                      variant="body2"
                      text={t(`profile.genderOptions.${opt}`) || opt}
                      style={styles.genderLabel}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}>
            <Typography
              variant="button"
              text={t('profile.actions.editProfile') || 'Edit profile details'}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.white},
  container: {flex: 1},
  content: {padding: 16},
  field: {marginBottom: hp(4)},
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    textAlign: 'right',
  },
  label: {
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  spacer: {
    height: hp(18),
  },
  genderOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  genderCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  genderCircleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderLabel: {
    textTransform: 'capitalize',
  },
});

export default ProfileDetailsScreen;
