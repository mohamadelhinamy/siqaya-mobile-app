import React, {useState} from 'react';
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
import {PaymentWebView} from './PaymentWebView';
import {riyalIcon} from './Icons';
import {Colors} from '../constants';
import {useLanguage, useAuth} from '../context';
import {hp, wp} from '../utils/responsive';
import {paymentService} from '../services/payment';

// Import icons
import CloseCircleIcon from '../assets/icons/outlined/close-circle.svg';

interface ProductDonationModalProps {
  visible: boolean;
  onClose: () => void;
  productId: number;
  productGuid?: string;
  productName: string;
  onSuccess?: () => void;
}

export const ProductDonationModal: React.FC<ProductDonationModalProps> = ({
  visible,
  onClose,
  productId,
  productName,
  onSuccess,
}) => {
  const {t} = useLanguage();
  const {token} = useAuth();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [donateAsGift, setDonateAsGift] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  // Gift form fields
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');

  const quickAmounts = [100, 200, 300];

  React.useEffect(() => {
    if (!visible) {
      // Reset form when modal closes
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setCustomAmount('');
    setQuickAmount(null);
    setDonateAsGift(false);
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setPaymentUrl('');
  };

  const handleDonate = async () => {
    const amount = quickAmount || parseInt(customAmount, 10) || 0;
    if (amount <= 0) {
      return;
    }

    setSubmitting(true);

    try {
      const paymentData: any = {
        amount,
        order_type: 'product_donation',
        product_id: productId,
        payment_method: 'visa', // Default to visa for now
      };

      if (donateAsGift) {
        paymentData.gift_sender_name = senderName;
        paymentData.gift_sender_mobile = senderPhone;
        paymentData.gift_receiver_name = receiverName;
        paymentData.gift_receiver_mobile = receiverPhone;
      }

      const response = await paymentService.initiatePayment(
        paymentData,
        token || undefined,
      );

      if (response.success && response.webview_url) {
        // Open payment webview
        setPaymentUrl(response.webview_url);
      } else {
        Alert.alert(t('common.error'), response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      Alert.alert(t('common.error'), 'Failed to process donation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleQuickAmountPress = (amount: number) => {
    setQuickAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setCustomAmount(cleaned);
    setQuickAmount(null);
  };

  const isGiftFormValid = () => {
    if (!donateAsGift) {
      return true;
    }
    return (
      senderName.trim() !== '' &&
      senderPhone.trim() !== '' &&
      receiverName.trim() !== '' &&
      receiverPhone.trim() !== ''
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
                  text={t('products.donateNow')}
                  color="textPrimary"
                  style={styles.title}
                />
              </View>

              {/* Product Name */}
              <Typography
                variant="body2"
                text={productName}
                color="textSecondary"
                style={styles.subtitle}
              />

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

              {/* Donate as Gift Checkbox */}
              <TouchableOpacity
                onPress={() => setDonateAsGift(!donateAsGift)}
                style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    donateAsGift && styles.checkboxChecked,
                  ]}>
                  {donateAsGift && (
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

              {/* Gift Form */}
              {donateAsGift && (
                <View style={styles.giftFormContainer}>
                  {/* Sender Name */}
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
                      value={senderName}
                      onChangeText={setSenderName}
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>

                  {/* Sender Phone */}
                  <View style={styles.formField}>
                    <Typography
                      variant="body2"
                      text={t('donation.giftForm.senderPhone')}
                      color="textPrimary"
                      style={styles.formLabel}
                    />
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('donation.giftForm.enterPhone')}
                      value={senderPhone}
                      onChangeText={setSenderPhone}
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>

                  {/* Receiver Name */}
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
                      value={receiverName}
                      onChangeText={setReceiverName}
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>

                  {/* Receiver Phone */}
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
                      value={receiverPhone}
                      onChangeText={setReceiverPhone}
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.text.secondary}
                    />
                  </View>
                </View>
              )}

              {/* Donate Button */}
              <CustomButton
                title={
                  submitting
                    ? t('donation.submitting')
                    : t('products.donateNow')
                }
                onPress={handleDonate}
                disabled={!isValid || submitting}
                variant="primary"
                size="large"
                style={styles.donateButton}
                loading={submitting}
              />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Payment WebView */}
      <PaymentWebView
        visible={!!paymentUrl}
        url={paymentUrl}
        onClose={() => {
          setPaymentUrl('');
          resetForm();
          onClose();
        }}
        onSuccess={() => {
          setPaymentUrl('');
          onSuccess?.();
          resetForm();
          onClose();
        }}
      />
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
  donateButton: {
    marginBottom: hp(2),
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
});
