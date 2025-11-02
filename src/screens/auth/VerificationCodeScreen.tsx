import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  CodeField,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Typography, CustomButton, BackHeader} from '../../components';
import {useLanguage} from '../../context';
import {useAuth} from '../../context/AuthProvider';
import {AuthStackParamList} from '../../navigation/AuthStackNavigator';
// TODO: Uncomment when API is enabled
// import {apiService} from '../../services/api';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';
import {WaveIcon} from '../../components/Icons';

interface VerificationCodeScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'VerificationCode'>;
  route: RouteProp<AuthStackParamList, 'VerificationCode'>;
}

const CELL_COUNT = 6;

export const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({
  route,
}) => {
  const {t, isRTL} = useLanguage();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background.light,
    },
    waveIconContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: hp(30),
    },
    bottomWaveIconContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: hp(30),
      transform: [{rotate: '180deg'}], // Rotate 180 degrees to flip both axes
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: wp(6),
      paddingTop: hp(5),
      paddingBottom: hp(5),
    },
    headerContainer: {
      alignItems: 'flex-start',
      marginBottom: hp(4),
    },
    title: {
      textAlign: 'left',
    },
    subtitle: {
      textAlign: 'left',
      lineHeight: hp(3),
    },
    formContainer: {
      justifyContent: 'center',
    },
    codeContainer: {
      marginBottom: hp(4),
    },
    codeRootStyle: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    cell: {
      width: wp(12),
      height: wp(12),
      borderWidth: 0.5,
      borderColor: Colors.light,
      borderRadius: wp(3),
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: wp(1),
    },
    focusCell: {
      borderColor: Colors.primaryLight,
      borderWidth: 0.5,
    },
    filledCell: {
      borderColor: Colors.primaryLight,
      borderWidth: 0.5,
      backgroundColor: Colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellText: {
      textAlign: 'center',
      fontSize: wp(6),
      fontWeight: '600',
    },
    verifyButton: {
      marginBottom: hp(4),
    },
    resendContainer: {
      alignItems: 'center',
      paddingVertical: hp(2),
    },
    resendQuestion: {
      textAlign: 'center',
      marginBottom: hp(1),
    },
    resendButton: {
      paddingVertical: hp(1),
      paddingHorizontal: wp(4),
    },
    resendText: {
      textAlign: 'center',
    },
  });
  const {login} = useAuth();

  const {phoneNumber, userId} = route.params;

  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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

  const handleVerifyCode = async () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert(t('common.error'), 'يرجى إدخال الكود كاملاً');
      return;
    }

    setLoading(true);
    try {
      // TODO: Uncomment API call when ready for production
      /*
      // Use the real Sokya API to verify OTP
      const response = await apiService.verifyOtp(userId, value);

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
          response.message || 'حدث خطأ في التحقق من الكود',
        );
      }
      */

      // Temporary: Mock successful verification for testing
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data for testing
      const userData = {
        id: userId.toString(),
        name: 'Test User',
        email: 'test@example.com',
        phone: phoneNumber,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock token for testing
      const mockToken = 'mock_jwt_token_for_testing_' + Date.now();

      await login(mockToken, userData);
    } catch (error) {
      Alert.alert(t('common.error'), 'حدث خطأ في التحقق من الكود');
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
      // TODO: Uncomment API call when ready for production
      /*
      // Use the real Sokya API to resend OTP
      const response = await apiService.resendOtp(userId);

      if (response.success) {
        setCanResend(false);
        setResendCountdown(30);
        setValue('');

        Alert.alert('تم الإرسال', 'تم إرسال كود جديد إلى رقمك');
      } else {
        Alert.alert(
          t('common.error'),
          response.message || 'فشل في إعادة إرسال الكود',
        );
      }
      */

      // Temporary: Mock successful resend for testing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCanResend(false);
      setResendCountdown(30);
      setValue('');

      Alert.alert('تم الإرسال', 'تم إرسال كود جديد إلى رقمك');
    } catch (error) {
      Alert.alert(t('common.error'), 'فشل في إعادة إرسال الكود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader />
      <View style={styles.waveIconContainer}>
        <WaveIcon />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header with Logo */}

          <View style={styles.headerContainer}>
            <Typography
              variant="h4"
              color="textPrimary"
              text="تأكيد رقم الجوال"
              style={styles.title}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              text={`ادخل الكود المرسل إلى +${phoneNumber} لتأكيد رقم الجوال`}
              style={styles.subtitle}
            />
          </View>

          {/* Verification Form */}
          <View style={styles.formContainer}>
            {/* Code Input */}
            <View style={styles.codeContainer}>
              <CodeField
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeRootStyle}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <View
                    key={index}
                    style={[
                      styles.cell,
                      isFocused && styles.focusCell,
                      symbol && styles.filledCell,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    <Typography
                      variant="h2"
                      color="textPrimary"
                      text={symbol || (isFocused ? '|' : '')}
                      style={styles.cellText}
                    />
                  </View>
                )}
              />
            </View>

            {/* Verify Button */}
            <CustomButton
              title={loading ? t('common.loading') : 'تأكيد'}
              onPress={handleVerifyCode}
              loading={loading}
              disabled={value.length !== CELL_COUNT}
              variant="primary"
              size="large"
              style={styles.verifyButton}
            />

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Typography
                variant="body1"
                color="textSecondary"
                text="لم تستلم الكود بعد؟"
                style={styles.resendQuestion}
              />
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend || loading}
                style={styles.resendButton}>
                <Typography
                  variant="body1"
                  color={'turquoise'}
                  text={
                    canResend
                      ? 'إعادة الإرسال'
                      : `إعادة الإرسال بعد (00:${resendCountdown
                          .toString()
                          .padStart(2, '0')} ث)`
                  }
                  style={styles.resendText}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Wave Icon - mirrored */}
          <View style={styles.bottomWaveIconContainer}>
            <WaveIcon />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
