import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Typography} from './Typography';
import {CustomButton} from './CustomButton';
import {riyalIcon} from './Icons';
import {Colors} from '../constants';
import {useLanguage} from '../context';
import {hp, wp} from '../utils/responsive';
import {apiService} from '../services/api';

// Import icons
import CloseCircleIcon from '../assets/icons/outlined/close-circle.svg';
import InfoIcon from '../assets/icons/outlined/info-circle.svg';
import ArrowDownIcon from '../assets/icons/outlined/arrow-down.svg';

interface DonationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDonate?: (amount: number, category: string) => void;
}

export const DonationBottomSheet: React.FC<DonationBottomSheetProps> = ({
  visible,
  onClose,
  onDonate,
}) => {
  const {t} = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [donateToFamilies, setDonateToFamilies] = useState<boolean>(false);
  const [categories, setCategories] = useState<
    Array<{value: string; label: string}>
  >([{value: 'all', label: t('donation.categories.all')}]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Gift form fields
  const [giftTo, setGiftTo] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [yourName, setYourName] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [rememberName, setRememberName] = useState<boolean>(false);
  const [giftToModalVisible, setGiftToModalVisible] = useState<boolean>(false);

  const giftToOptions = [
    {value: 'friend', label: t('donation.giftForm.options.friend')},
    {value: 'family', label: t('donation.giftForm.options.family')},
    {value: 'other', label: t('donation.giftForm.options.other')},
  ];

  const fetchPaymentTypes = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiService.get<any>('/payment-types');
      console.log('Payment types response:', response?.data?.payment_types);

      if (
        response.success &&
        response.data?.payment_types &&
        Array.isArray(response.data.payment_types)
      ) {
        const mappedCategories = response.data.payment_types.map(
          (type: any) => ({
            value: type.id.toString(),
            label: type.name,
          }),
        );

        setCategories([
          {value: 'all', label: t('donation.categories.all')},
          ...mappedCategories,
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch payment types:', error);
      // Keep default categories on error
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSelectGiftTo = (value: string) => {
    setGiftTo(value);
    setGiftToModalVisible(false);
  };

  const getGiftToLabel = () => {
    const selected = giftToOptions.find(opt => opt.value === giftTo);
    return selected ? selected.label : t('donation.giftForm.selectGiftTo');
  };

  useEffect(() => {
    if (visible) {
      fetchPaymentTypes();
    } else {
      // Reset form when modal closes
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const quickAmounts = [100, 200, 300];

  const resetForm = () => {
    setSelectedCategory('all');
    setCustomAmount('');
    setQuickAmount(null);
    setDonateToFamilies(false);
    setGiftTo('');
    setRecipientName('');
    setRecipientPhone('');
    setYourName('');
    setGiftMessage('');
    setRememberName(false);
  };

  const handleDonate = async () => {
    const amount = quickAmount || parseInt(customAmount, 10) || 0;
    if (amount > 0) {
      setSubmitting(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitting(false);

      // Show success alert
      Alert.alert(t('donation.successTitle'), t('donation.successMessage'), [
        {
          text: t('common.ok'),
          onPress: () => {
            onDonate?.(amount, selectedCategory);
            onClose();
          },
        },
      ]);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleQuickAmountPress = (amount: number) => {
    setQuickAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    setCustomAmount(cleaned);
    setQuickAmount(null);
  };

  const isGiftFormValid = () => {
    if (!donateToFamilies) {
      return true; // Gift form not shown, so it's valid
    }
    // When gift form is shown, validate required fields
    return (
      recipientPhone.trim() !== '' &&
      recipientName.trim() !== '' &&
      yourName.trim() !== ''
    );
  };

  const isValid =
    ((quickAmount !== null && quickAmount > 0) ||
      (customAmount !== '' && parseInt(customAmount, 10) > 0)) &&
    isGiftFormValid();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={handleClose}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
            style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}>
                  <CloseCircleIcon
                    width={20}
                    height={20}
                    color={Colors.text.primary}
                  />
                </TouchableOpacity>
                <Typography
                  variant="h5"
                  text={t('donation.title')}
                  color="textPrimary"
                  style={styles.title}
                />
              </View>

              {/* Subtitle */}
              <Typography
                variant="body2"
                text={t('donation.subtitle')}
                color="textSecondary"
                style={styles.subtitle}
              />

              {/* Category Chips */}
              <View style={styles.categoryContainer}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    onPress={() => setSelectedCategory(category.value)}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.value &&
                        styles.categoryChipSelected,
                    ]}>
                    <Typography
                      variant="body2"
                      text={category.label}
                      color={
                        selectedCategory === category.value
                          ? 'white'
                          : 'textSecondary'
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountContainer}>
                {quickAmounts.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => handleQuickAmountPress(amount)}
                    style={[
                      styles.quickAmountButton,
                      quickAmount === amount &&
                        styles.quickAmountButtonSelected,
                    ]}>
                    <Typography
                      variant="h6"
                      text={`${amount}`}
                      color={quickAmount === amount ? 'black' : 'textSecondary'}
                      style={styles.currencyText}
                    />
                    {React.createElement(riyalIcon, {
                      width: wp(4),
                      height: wp(4),
                      color: 'black',
                    })}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Amount Input */}
              <View style={styles.customAmountContainer}>
                <TextInput
                  style={styles.customAmountInput}
                  placeholder={t('donation.customAmountPlaceholder')}
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.text.secondary}
                />
                <View style={styles.inputCurrency}>
                  {React.createElement(riyalIcon, {
                    width: wp(5),
                    height: wp(5),
                    color: Colors.black,
                  })}
                </View>
              </View>

              {/* Donate to Families Checkbox */}
              <TouchableOpacity
                onPress={() => setDonateToFamilies(!donateToFamilies)}
                style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    donateToFamilies && styles.checkboxChecked,
                  ]}>
                  {donateToFamilies && (
                    <Typography variant="caption" color="white" text="✓" />
                  )}
                </View>
                <Typography
                  variant="body2"
                  text={t('donation.donateToFamilies')}
                  color="textPrimary"
                  style={styles.checkboxLabel}
                />
              </TouchableOpacity>

              {/* Gift Form - Show when donateToFamilies is checked */}
              {donateToFamilies && (
                <View style={styles.giftFormContainer}>
                  {/* Gift To Dropdown */}
                  {/* <View style={styles.formField}>
                  <Typography
                    variant="body2"
                    text={t('donation.giftForm.giftTo')}
                    color="textPrimary"
                    style={styles.formLabel}
                  />
                  <TouchableOpacity
                    style={styles.dropdownContainer}
                    onPress={() => setGiftToModalVisible(true)}>
                    <Typography
                      variant="body2"
                      text={getGiftToLabel()}
                      color={giftTo ? 'textPrimary' : 'textSecondary'}
                      style={styles.dropdownText}
                    />
                    <ArrowDownIcon
                      width={16}
                      height={16}
                      color={Colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View> */}

                  {/* Recipient Phone */}
                  <View style={styles.formField}>
                    <Typography
                      variant="body2"
                      text={t('donation.giftForm.recipientPhone')}
                      color="textPrimary"
                      style={styles.formLabel}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('donation.giftForm.enterPhone')}
                      value={recipientPhone}
                      onChangeText={setRecipientPhone}
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>

                  {/* Recipient Name */}
                  <View style={styles.formField}>
                    <Typography
                      variant="body2"
                      text={t('donation.giftForm.recipientName')}
                      color="textPrimary"
                      style={styles.formLabel}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('donation.giftForm.enterRecipientName')}
                      value={recipientName}
                      onChangeText={setRecipientName}
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>

                  {/* Gift Message */}
                  {/* <View style={styles.formField}>
                  <Typography
                    variant="body2"
                    text={t('donation.giftForm.message')}
                    color="textPrimary"
                    style={styles.formLabel}
                  />
                  <TextInput
                    style={[styles.formInput, styles.messageInput]}
                    placeholder={t('donation.giftForm.messagePlaceholder')}
                    value={giftMessage}
                    onChangeText={setGiftMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor={Colors.text.secondary}
                  />
                </View> */}

                  {/* Remember Name Checkbox */}
                  {/* <TouchableOpacity
                  onPress={() => setRememberName(!rememberName)}
                  style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberName && styles.checkboxChecked,
                    ]}>
                    {rememberName && (
                      <Typography variant="caption" color="white" text="✓" />
                    )}
                  </View>
                  <Typography
                    variant="body2"
                    text={t('donation.giftForm.rememberName')}
                    color="textPrimary"
                    style={styles.checkboxLabel}
                  />
                </TouchableOpacity> */}

                  {/* Your Name */}
                  <View style={styles.formField}>
                    <Typography
                      variant="body2"
                      text={t('donation.giftForm.yourName')}
                      color="textPrimary"
                      style={styles.formLabel}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('donation.giftForm.enterYourName')}
                      value={yourName}
                      onChangeText={setYourName}
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>
                </View>
              )}

              {/* Info Message */}
              <View style={styles.infoContainer}>
                <InfoIcon
                  width={20}
                  height={20}
                  color={Colors.primary}
                  style={styles.infoIcon}
                />
                <Typography
                  variant="caption"
                  text={t('donation.infoMessage')}
                  color="textSecondary"
                  style={styles.infoText}
                />
              </View>

              {/* Donate Button */}
              <CustomButton
                title={
                  submitting
                    ? t('donation.submitting')
                    : t('donation.donateButton')
                }
                onPress={handleDonate}
                disabled={!isValid || submitting}
                variant="primary"
                size="large"
                style={styles.donateButton}
                loading={submitting}
              />

              {/* Terms Link */}
              <TouchableOpacity style={styles.termsContainer}>
                <Typography
                  variant="caption"
                  text={t('donation.termsLink')}
                  color="turquoise"
                  style={styles.termsLink}
                />
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Gift To Selection Modal */}
      {giftToModalVisible && (
        <View style={styles.selectionModalOverlay}>
          <TouchableOpacity
            style={styles.selectionModalBackdrop}
            activeOpacity={1}
            onPress={() => setGiftToModalVisible(false)}
          />
          <View style={styles.selectionModalContent}>
            <Typography
              variant="h5"
              text={t('donation.giftForm.giftTo')}
              color="textPrimary"
              style={styles.selectionModalTitle}
            />
            {giftToOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.selectionOption}
                onPress={() => handleSelectGiftTo(option.value)}>
                <Typography
                  variant="body1"
                  text={option.label}
                  color="textPrimary"
                />
                {giftTo === option.value && (
                  <Typography variant="body1" text="✓" color="primary" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: wp(6),
    paddingBottom: hp(4),
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: hp(3),
    textAlign: 'left',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginBottom: hp(3),
  },
  categoryChip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: Colors.background.light,
  },
  categoryChipSelected: {
    backgroundColor: Colors.text.turquoise,
    borderColor: Colors.primary,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginBottom: hp(2.5),
  },
  quickAmountButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(0.5),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light,
    backgroundColor: Colors.white,
    gap: wp(2),
  },
  quickAmountButtonSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.background.light,
  },
  currencyText: {
    marginLeft: wp(1),
    marginBottom: 0,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    backgroundColor: Colors.white,
    marginBottom: hp(2.5),
  },
  customAmountInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: hp(1),
    textAlign: 'right',
  },
  inputCurrency: {
    marginLeft: wp(2),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(1),
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
  checkboxLabel: {
    marginLeft: wp(2),
    flex: 1,
    textAlign: 'left',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    marginBottom: hp(1),
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: wp(2),
    lineHeight: 18,
    textAlign: 'left',
  },
  donateButton: {
    marginBottom: hp(2),
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  giftFormContainer: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  formField: {
    marginBottom: hp(2),
  },
  formLabel: {
    marginBottom: hp(1),
    textAlign: 'left',
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.white,
    textAlign: 'right',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.white,
  },
  dropdownInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'left',
  },
  dropdownText: {
    flex: 1,
    textAlign: 'left',
  },
  messageInput: {
    minHeight: hp(12),
    paddingTop: hp(1.5),
  },
  selectionModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  selectionModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectionModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(6),
    width: '80%',
    maxWidth: 400,
  },
  selectionModalTitle: {
    marginBottom: hp(2),
    textAlign: 'center',
  },
  selectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
});
