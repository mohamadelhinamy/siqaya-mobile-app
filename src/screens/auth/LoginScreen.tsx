import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import {Button, Card, Header} from '../../components';
import {useLanguage, useRTLStyles} from '../../context';
import {useAuth} from '../../context/AuthProvider';

export const LoginScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.login.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password
      const mockToken = 'mock-jwt-token-12345';
      const mockUser = {
        id: '1',
        name: t('profile.sampleData.name'),
        email: email,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await login(mockToken, mockUser);
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.login.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7'},
      ]}>
      <Header
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card title={t('auth.login.welcomeBack')}>
            <View style={styles.form}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('auth.login.email')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}
                placeholder={t('auth.login.emailPlaceholder')}
                placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text
                style={[
                  styles.label,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('auth.login.password')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}
                placeholder={t('auth.login.passwordPlaceholder')}
                placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                title={loading ? t('common.loading') : t('auth.login.signIn')}
                onPress={handleLogin}
                variant="primary"
                disabled={loading}
                style={styles.loginButton}
              />

              <Button
                title={t('auth.login.demoLogin')}
                onPress={() => {
                  setEmail('demo@example.com');
                  setPassword('password123');
                }}
                variant="outline"
                style={styles.demoButton}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 16,
  },
  demoButton: {
    marginTop: 8,
  },
});
