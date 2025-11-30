import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage} from '../../context';
import {AuthStackParamList} from '../../navigation/AuthStackNavigator';
import {apiService} from '../../services/api';
import {Colors} from '../../constants';
import {
  Typography,
  CustomInput,
  BackHeader,
  RadioGroup,
  CustomButton,
} from '../../components';
import {hp, wp} from '../../utils/responsive';
import {WaveIcon} from '../../components/Icons';

interface RegisterScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {t} = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    {value: 'male', label: t('auth.register.male')},
    {value: 'female', label: t('auth.register.female')},
  ];

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');

    // Limit to 10 digits (Saudi phone number format)
    const limited = cleaned.slice(0, 10);
    // Format as XXX XXX XXXX without trailing spaces
    const part1 = limited.slice(0, 3);
    const part2 = limited.slice(3, 6);
    const part3 = limited.slice(6);
    return [part1, part2, part3].filter(Boolean).join(' ');
  };

  const validatePhone = (cleanPhone: string): string | null => {
    const phoneRegex = /^05(?!2)\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      if (cleanPhone.length !== 10) {
        return t('auth.register.validMobileRequired');
      }
      if (!cleanPhone.startsWith('05')) {
        return t('auth.phoneEntry.invalidStart');
      }
      if (cleanPhone.startsWith('052')) {
        return t('auth.phoneEntry.invalidPrefix');
      }
      return t('auth.register.validMobileRequired');
    }
    return null;
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert(t('common.error'), t('auth.register.fullNameRequired'));
      return false;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const phoneErr = validatePhone(cleanPhone);
    if (phoneErr) {
      // Show inline error on submit
      setPhoneError(phoneErr);
      return false;
    }

    if (!email.trim()) {
      Alert.alert(t('common.error'), t('auth.register.emailRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('auth.register.validEmailRequired'));
      return false;
    }

    if (!gender) {
      Alert.alert(t('common.error'), t('auth.register.genderRequired'));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      // Use the proper registration API call
      const response = await apiService.register({
        name: fullName,
        email: email,
        mobile: cleanPhone,
        password: 'password', // You might want to add a password field to the form
        password_confirmation: 'password',
        login_type: 'mobile',
      });
      console.log('Register response:', response);

      if (response.success && response.data) {
        navigation.navigate('VerificationCode', {
          phoneNumber: cleanPhone,
          userId: response.data.user_id,
          otpExpiresIn: response.data.otp_expires_in,
        });
      } else {
        Alert.alert(t('common.error'), t('auth.register.registrationError'));
      }
    } catch (error) {
      console.log(error, 'error');
      console.error('Register error:', error);
      Alert.alert(t('common.error'), t('auth.register.registrationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('PhoneEntry');
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveIconContainer}>
        <WaveIcon />
      </View>
      <BackHeader />
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
              text={t('auth.register.title')}
              align="left"
            />
            <Typography
              variant="body2"
              color="textSecondary"
              text={t('auth.register.subtitle')}
              style={styles.subtitle}
            />
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <CustomInput
              label={t('auth.register.fullName')}
              placeholder={t('auth.register.enterFullName')}
              value={fullName}
              onChangeText={setFullName}
              returnKeyType="next"
              containerStyle={styles.inputContainer}
            />

            {/* Phone Number Input */}
            <CustomInput
              label={t('auth.register.mobileNumber')}
              placeholder={t('auth.register.enterMobileNumber')}
              value={phoneNumber}
              onChangeText={(text: string) => {
                const formatted = formatPhoneNumber(text);
                setPhoneNumber(formatted);
                const clean = formatted.replace(/\D/g, '');
                if (clean.length === 0) {
                  setPhoneError(null);
                }
              }}
              keyboardType="phone-pad"
              returnKeyType="next"
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

            {/* Email Input */}
            <CustomInput
              label={t('auth.register.email')}
              placeholder={t('auth.register.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              containerStyle={styles.inputContainer}
            />

            {/* Gender Selection */}
            <RadioGroup
              label={t('auth.register.gender')}
              options={genderOptions}
              value={gender}
              onValueChange={value => setGender(value as 'male' | 'female')}
              horizontal={true}
              required={true}
            />

            {/* Register Button */}
            <CustomButton
              title={
                loading ? t('common.loading') : t('auth.register.registerNow')
              }
              onPress={handleRegister}
              loading={loading}
              variant="primary"
              size="large"
            />

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginContainer}
              onPress={handleLogin}>
              <View style={styles.loginTextContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  text={t('auth.register.alreadyHaveAccount')}
                />
                <Typography
                  variant="body2"
                  color="turquoise"
                  text={t('auth.register.signIn')}
                />
              </View>
            </TouchableOpacity>
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
    zIndex: 2,
  },
  bottomWaveIconContainer: {
    position: 'absolute',
    bottom: -100,
    left: 0,
    height: hp(30),
    zIndex: -1,
    transform: [{rotate: '180deg'}], // Rotate 180 degrees to flip both axes
  },
  closeButton: {
    position: 'absolute',
    top: hp(6),
    right: wp(6),
    zIndex: 10,
    width: wp(10),
    height: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(8),
    paddingBottom: hp(5),
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: hp(4),
  },
  subtitle: {
    textAlign: 'left',
    lineHeight: hp(3),
  },
  formContainer: {
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: hp(3),
  },
  phoneError: {
    marginTop: hp(0.8),
  },

  loginContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  loginTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
