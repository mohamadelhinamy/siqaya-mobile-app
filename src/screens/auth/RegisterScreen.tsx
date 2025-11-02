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
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    {value: 'male', label: 'ذكر'},
    {value: 'female', label: 'أنثى'},
  ];

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
    if (!fullName.trim()) {
      Alert.alert(t('common.error'), 'يرجى إدخال الاسم كاملاً');
      return false;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert(t('common.error'), 'يرجى إدخال رقم الجوال صحيحاً');
      return false;
    }

    if (!email.trim()) {
      Alert.alert(t('common.error'), 'يرجى إدخال البريد الإلكتروني');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), 'يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }

    if (!gender) {
      Alert.alert(t('common.error'), 'يرجى اختيار الجنس');
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

      // TODO: Replace with actual register API call
      const response = await apiService.loginWithMobile(cleanPhone);
      console.log('Register response:', response);

      if (response.success && response.data) {
        navigation.navigate('VerificationCode', {
          phoneNumber: cleanPhone,
          userId: response.data.user_id,
          otpExpiresIn: response.data.otp_expires_in,
        });
      } else {
        Alert.alert(t('common.error'), 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      console.log(error, 'error');
      console.error('Register error:', error);
      Alert.alert(t('common.error'), 'حدث خطأ أثناء التسجيل');
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
              text="حساب جديد"
              align="left"
            />
            <Typography
              variant="body2"
              color="textSecondary"
              text="نشكرك على انضمامك معنا في مؤسسة سقاية، من فضلك أدخل بياناتك للاستمرار"
              style={styles.subtitle}
            />
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <CustomInput
              label="الاسم"
              placeholder="ادخل الاسم كاملا"
              value={fullName}
              onChangeText={setFullName}
              returnKeyType="next"
              containerStyle={styles.inputContainer}
            />

            {/* Phone Number Input */}
            <CustomInput
              label="رقم الجوال"
              placeholder="ادخل رقم الجوال"
              value={phoneNumber}
              onChangeText={(text: string) =>
                setPhoneNumber(formatPhoneNumber(text))
              }
              keyboardType="phone-pad"
              returnKeyType="next"
              containerStyle={styles.inputContainer}
            />

            {/* Email Input */}
            <CustomInput
              label="البريد الالكتروني"
              placeholder="البريد الالكتروني"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              containerStyle={styles.inputContainer}
            />

            {/* Gender Selection */}
            <RadioGroup
              label="الجنس"
              options={genderOptions}
              value={gender}
              onValueChange={value => setGender(value as 'male' | 'female')}
              horizontal={true}
              required={true}
            />

            {/* Register Button */}
            <CustomButton
              title={loading ? t('common.loading') : 'التسجيل الآن'}
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
                  text="لديك حساب من قبل؟ "
                />
                <Typography
                  variant="body2"
                  color="turquoise"
                  text="تسجيل الدخول"
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
