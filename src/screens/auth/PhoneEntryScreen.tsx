import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage, useAuth} from '../../context';
import {AuthStackParamList} from '../../navigation/AuthStackNavigator';
import {apiService} from '../../services/api';
import {Colors, Fonts} from '../../constants';
import {
  Typography,
  CustomInput,
  CustomButton,
  CloseHeader,
} from '../../components';
import {hp, wp} from '../../utils/responsive';
import {WaveIcon} from '../../components/Icons';

interface PhoneEntryScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'PhoneEntry'>;
}

export const PhoneEntryScreen: React.FC<PhoneEntryScreenProps> = ({
  navigation,
}) => {
  const {t} = useLanguage();
  const {setSkipLogin} = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');

    // Limit to 10 digits (Saudi phone number format)
    const limited = cleaned.slice(0, 10);

    // Format as XXX XXX XXXX without introducing trailing spaces
    const part1 = limited.slice(0, 3);
    const part2 = limited.slice(3, 6);
    const part3 = limited.slice(6);
    return [part1, part2, part3].filter(Boolean).join(' ');
  };

  const validatePhone = (cleanPhone: string): string | null => {
    // Must be exactly 10 digits and start with '05'
    // Also the digit after '05' must NOT be '2' (i.e., disallow '052...')
    const phoneRegex = /^05(?!2)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      if (cleanPhone.length !== 10) {
        return t('auth.phoneEntry.invalidPhone');
      }
      if (!cleanPhone.startsWith('05')) {
        return t('auth.phoneEntry.invalidStart');
      }
      if (cleanPhone.startsWith('052')) {
        return t('auth.phoneEntry.invalidPrefix');
      }
      return t('auth.phoneEntry.invalidPhone');
    }
    return null;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    const clean = formatted.replace(/\D/g, '');
    // Only clear the error when the input is emptied. Do not validate on change.
    if (clean.length === 0) {
      setPhoneError(null);
    }
  };

  const validateForm = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const err = validatePhone(cleanPhone);
    setPhoneError(err);
    if (err) {
      return false;
    }
    if (!termsAccepted) {
      return false; // button already disabled when terms not accepted
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const response = await apiService.loginWithMobile(cleanPhone);
      console.log('Login response:', response);

      if (response.success && response.data) {
        navigation.navigate('VerificationCode', {
          phoneNumber: cleanPhone,
          userId: response.data.user_id,
          otpExpiresIn: response.data.otp_expires_in,
        });
      } else {
        Alert.alert(t('common.error'), t('auth.phoneEntry.sendError'));
      }
    } catch (error) {
      console.log(error, 'error');
      console.error('Login error:', error);
      Alert.alert(t('common.error'), t('auth.phoneEntry.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  const handleSkipLogin = async () => {
    try {
      await setSkipLogin(true);
    } catch (error) {
      console.error('Error setting skip login:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Login Button */}
      <CloseHeader onPress={handleSkipLogin} />

      {/* Header with Logo */}
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
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/login-header.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            {/* Phone Number Input */}
            <CustomInput
              label={t('auth.phoneEntry.mobileNumber')}
              placeholder={t('auth.phoneEntry.enterMobileNumber')}
              value={phoneNumber}
              onChangeText={(text: string) => handlePhoneChange(text)}
              keyboardType="phone-pad"
              returnKeyType="done"
              containerStyle={styles.inputContainer}
            />
            {phoneError ? (
              <Typography
                variant="caption"
                text={phoneError}
                color="error"
                style={styles.phoneError}
              />
            ) : null}

            {/* Terms and Conditions Checkbox */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => setTermsAccepted(!termsAccepted)}>
                <View
                  style={[
                    styles.checkbox,
                    termsAccepted && styles.checkboxChecked,
                  ]}>
                  {termsAccepted && (
                    <Typography variant="caption" color="white" text="✓" />
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.termsTextContainer}>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  text={t('auth.phoneEntry.agreeToTerms')}
                />
                <TouchableOpacity
                  onPress={() => {
                    // Handle terms and conditions link press
                    Alert.alert(
                      'Terms and Conditions',
                      'عرض سياسات التبرع و الشروط الأحكام',
                    );
                  }}>
                  <Typography
                    variant="h6"
                    color="turquoise"
                    text={t('auth.phoneEntry.termsAndPolicies')}
                    style={styles.termsLink}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <CustomButton
              title={
                loading ? t('common.loading') : t('auth.phoneEntry.registerNow')
              }
              onPress={handleSendCode}
              disabled={loading || !termsAccepted}
              loading={loading}
              variant="primary"
              size="large"
            />

            {/* Sign In Link */}
            <TouchableOpacity
              style={styles.signInContainer}
              onPress={handleCreateAccount}>
              <View style={styles.signInTextContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  text={t('auth.phoneEntry.alreadyHaveAccount')}
                />
                <Typography
                  variant="body2"
                  color="turquoise"
                  text={t('auth.phoneEntry.newAccount')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Bottom Wave Icon - mirrored */}
      <View style={styles.bottomWaveIconContainer}>
        <WaveIcon />
      </View>
    </SafeAreaView>
  );
};

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
    alignItems: 'center',
  },
  logo: {
    width: wp(70),
    height: hp(20),
    zIndex: 1,
  },
  formContainer: {
    justifyContent: 'center',
  },
  inputContainer: {},
  phoneError: {
    marginTop: hp(0.8),
    textAlign: 'left',
  },
  label: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: Colors.text.primary,
    marginBottom: hp(1.5),
  },
  input: {
    borderRadius: wp(10),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: 16,
    fontFamily: Fonts.regular,
    backgroundColor: Colors.white,
    color: Colors.text.primary,
    minHeight: hp(7),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: hp(3),
    marginBottom: hp(3),
    gap: wp(1),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  termsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsLink: {
    fontFamily: Fonts.bold,
    textDecorationLine: 'underline',
  },

  signInContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  signInTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text.secondary,
  },
  signInLink: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  bottomWaveIconContainer: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    height: hp(30),
    zIndex: -1,
    transform: [{rotate: '180deg'}], // Rotate 180 degrees to flip both axes
  },
});
