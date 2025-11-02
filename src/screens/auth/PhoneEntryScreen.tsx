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
import {useLanguage} from '../../context';
import {AuthStackParamList} from '../../navigation/AuthStackNavigator';
import {apiService} from '../../services/api';
import {Colors, Fonts} from '../../constants';
import {Typography, CustomInput} from '../../components';
import {hp, wp} from '../../utils/responsive';
import {WaveIcon} from '../../components/Icons';

interface PhoneEntryScreenProps {
  navigation: StackNavigationProp<AuthStackParamList, 'PhoneEntry'>;
}

export const PhoneEntryScreen: React.FC<PhoneEntryScreenProps> = ({
  navigation,
}) => {
  const {t} = useLanguage();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');

    // Limit to 10 digits (Saudi phone number format)
    const limited = cleaned.slice(0, 10);

    // Format as XXX XXX XXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(
        6,
      )}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const validateForm = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert(t('common.error'), t('auth.phoneEntry.invalidPhone'));
      return false;
    }
    if (!termsAccepted) {
      Alert.alert(t('common.error'), 'يرجى الموافقة على الشروط والأحكام');
      return false;
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

  return (
    <SafeAreaView style={styles.container}>
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
              label="رقم الجوال"
              placeholder="أدخل رقم الجوال"
              value={phoneNumber}
              onChangeText={(text: string) =>
                setPhoneNumber(formatPhoneNumber(text))
              }
              keyboardType="phone-pad"
              returnKeyType="done"
              containerStyle={styles.inputContainer}
            />

            {/* Terms and Conditions Checkbox */}
            <TouchableOpacity
              style={styles.termsContainer}
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
              <View style={styles.termsTextContainer}>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  text="أوافق على"
                />
                <Typography
                  variant="h6"
                  color="turquoise"
                  text=" سياسات التبرع والأحكام"
                />
              </View>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (loading || !termsAccepted) && styles.registerButtonDisabled,
              ]}
              onPress={handleSendCode}
              disabled={loading || !termsAccepted}>
              <Typography
                variant="button"
                color="white"
                text={loading ? t('common.loading') : 'التسجيل الآن'}
              />
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity
              style={styles.signInContainer}
              onPress={handleCreateAccount}>
              <View style={styles.signInTextContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  text="ليس لديك حساب؟ "
                />
                <Typography
                  variant="body2"
                  color="turquoise"
                  text="حساب جديد"
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: hp(4),
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
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: Colors.light,
    marginRight: wp(3),
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
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(4),
    paddingVertical: hp(2.2),
    alignItems: 'center',
    marginBottom: hp(3),
    minHeight: hp(7),
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: Colors.light,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.bold,
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
});
