import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Card, Header, Typography} from '../../components';
import {useLanguage, useRTLStyles} from '../../context';
import {useAuth} from '../../context/AuthProvider';
import {AuthStackParamList} from '../../navigation/AuthStackNavigator';
import {apiService} from '../../services/api';

interface VerificationCodeScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'VerificationCode'>;
  route: RouteProp<AuthStackParamList, 'VerificationCode'>;
}

export const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const {login} = useAuth();

  const {phoneNumber, userId, otpExpiresIn} = route.params;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (i + index < 6) {
          newCode[i + index] = digit;
        }
      });
      setCode(newCode);

      // Focus on the next empty input or the last one
      const nextEmptyIndex = newCode.findIndex(c => c === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      Alert.alert(t('common.error'), t('auth.verification.incompleteCode'));
      return;
    }

    setLoading(true);
    try {
      // Use the real Sokya API to verify OTP
      const response = await apiService.verifyOtp(userId, verificationCode);

      if (response.success && response.data) {
        // Login successful, use the returned user data and token
        const userData = {
          id: response.data.user.id.toString(),
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.mobile,
          avatar: '',
          createdAt: response.data.user.created_at,
          updatedAt: response.data.user.updated_at,
        };

        await login(response.data.token, userData);
      } else {
        Alert.alert(
          t('common.error'),
          response.message || t('auth.verification.verificationError'),
        );
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.verification.verificationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      return;
    }

    setLoading(true);
    try {
      // Use the real Sokya API to resend OTP
      const response = await apiService.resendOtp(userId);

      if (response.success) {
        setCanResend(false);
        setResendCountdown(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        Alert.alert(
          t('auth.verification.codeSent'),
          t('auth.verification.newCodeSent'),
        );
      } else {
        Alert.alert(
          t('common.error'),
          response.message || t('auth.verification.resendError'),
        );
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.verification.resendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7'},
      ]}>
      <Header
        title={t('auth.verification.title')}
        subtitle={t('auth.verification.subtitle')}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card title={t('auth.verification.enterCode')}>
            <View style={styles.form}>
              <Typography
                variant="body2"
                color="textSecondary"
                style={[styles.description, {textAlign: rtlStyles.textAlign}]}
                text={t('auth.verification.description', {phoneNumber})}
              />

              <View style={styles.codeInputContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      {
                        color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                        backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                        borderColor: digit ? '#007AFF' : '#E5E5EA',
                      },
                    ]}
                    value={digit}
                    onChangeText={value => handleCodeChange(value, index)}
                    onKeyPress={({nativeEvent}) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                  />
                ))}
              </View>

              <Button
                title={
                  loading ? t('common.loading') : t('auth.verification.verify')
                }
                onPress={handleVerifyCode}
                variant="primary"
                disabled={loading || code.join('').length !== 6}
                style={styles.verifyButton}
              />

              <View style={styles.resendContainer}>
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={!canResend || loading}
                  style={styles.resendButton}>
                  <Typography
                    variant="body1"
                    color={canResend && !loading ? 'primary' : 'textSecondary'}
                    style={[
                      styles.resendText,
                      {textAlign: rtlStyles.textAlign},
                    ]}
                    text={
                      canResend
                        ? t('auth.verification.resendCode')
                        : t('auth.verification.resendIn', {
                            seconds: resendCountdown,
                          })
                    }
                  />
                </TouchableOpacity>
              </View>

              <Button
                title={t('auth.verification.changePhone')}
                onPress={handleBackToPhone}
                variant="outline"
                style={styles.changePhoneButton}
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
    gap: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 20,
  },
  codeInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: 10,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
  },
  changePhoneButton: {
    marginTop: 10,
  },
});
