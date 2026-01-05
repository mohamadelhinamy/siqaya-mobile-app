import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {Typography} from './Typography';
import {CustomButton} from './CustomButton';
import {PaymentWebView} from './PaymentWebView';
import {riyalIcon} from './Icons';
import {Colors} from '../constants';
import {useLanguage, useAuth} from '../context';
import {hp, wp} from '../utils/responsive';
import {paymentService} from '../services/payment';
import {apiService} from '../services/api';

// Import icons
import CloseCircleIcon from '../assets/icons/outlined/close-circle.svg';
import ArrowDownIcon from '../assets/icons/outlined/arrow-down.svg';

interface ProductDonationModalProps {
  visible: boolean;
  onClose: () => void;
  productId: number;
  productGuid?: string;
  productName: string;
  isUserProduct?: boolean;
  onSuccess?: () => void;
}

export const ProductDonationModal: React.FC<ProductDonationModalProps> = ({
  visible,
  onClose,
  productId,
  productGuid,
  productName,
  isUserProduct = false,
  onSuccess,
}) => {
  const {t} = useLanguage();
  const {token} = useAuth();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [donateAsGift, setDonateAsGift] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  // Ref to prevent duplicate close/success calls
  const isClosingRef = useRef(false);

  // Gift form fields
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');

  // Gift types from API
  const [giftTypes, setGiftTypes] = useState<
    Array<{id: number; title: string; gift_card_url: string}>
  >([]);
  const [selectedGiftType, setSelectedGiftType] = useState<number | null>(null);
  const [giftTypeModalVisible, setGiftTypeModalVisible] =
    useState<boolean>(false);
  const [loadingGiftTypes, setLoadingGiftTypes] = useState<boolean>(false);

  const quickAmounts = [100, 200, 300];

  const fetchGiftTypes = async () => {
    try {
      setLoadingGiftTypes(true);
      const response = await apiService.get<any>('/gift-types');
      console.log('Gift types response:', response);

      if (
        response.success &&
        response.data?.gift_types &&
        Array.isArray(response.data.gift_types)
      ) {
        setGiftTypes(response.data.gift_types);
      }
    } catch (error) {
      console.error('Failed to fetch gift types:', error);
    } finally {
      setLoadingGiftTypes(false);
    }
  };

  useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
      fetchGiftTypes();
    } else {
      // Reset form when modal closes
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Handler for when PaymentWebView is closed (cancelled/failed)
  // Close webview first, then close donation modal after a short delay
  const handlePaymentWebViewClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    // First close the payment webview
    setPaymentUrl('');
    // Then close the donation modal after a short delay for sequential animation
    setTimeout(() => {
      resetForm();
      onClose();
    }, 300);
  }, [onClose]);

  // Guarded success handler - close sequentially on success
  const handlePaymentSuccess = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    // First close the payment webview
    setPaymentUrl('');
    // Then close the donation modal after a short delay
    setTimeout(() => {
      onSuccess?.();
      resetForm();
      onClose();
    }, 300);
  }, [onSuccess, onClose]);

  const resetForm = () => {
    setCustomAmount('');
    setQuickAmount(null);
    setDonateAsGift(false);
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setPaymentUrl('');
    setSelectedGiftType(null);
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
        order_type: isUserProduct
          ? 'user_product_donation'
          : 'product_donation',
        product_id: productId,
        product_guid: productGuid,
        payment_method: 'visa', // Default to visa for now
      };

      if (donateAsGift) {
        paymentData.gift_sender_name = senderName;
        paymentData.gift_sender_mobile = senderPhone;
        paymentData.gift_receiver_name = receiverName;
        paymentData.gift_receiver_mobile = receiverPhone;
        paymentData.is_gift = true;
        paymentData.gift_type_id = selectedGiftType;
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
      isVisible={visible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe={true}
      avoidKeyboard={true}
      useNativeDriverForBackdrop>
      <View style={styles.modalContent}>
        <View style={styles.swipeIndicator} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
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
                  quickAmount === amount && styles.quickAmountButtonSelected,
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
              style={[styles.checkbox, donateAsGift && styles.checkboxChecked]}>
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
              {/* Gift Type Dropdown */}
              <View style={styles.formField}>
                <Typography
                  variant="body2"
                  text={t('donation.giftForm.giftType')}
                  color="textPrimary"
                  style={styles.formLabel}
                />
                <TouchableOpacity
                  style={styles.giftTypeDropdown}
                  onPress={() => setGiftTypeModalVisible(true)}>
                  {selectedGiftType ? (
                    <View style={styles.giftTypeSelected}>
                      <Image
                        source={{
                          uri: giftTypes.find(g => g.id === selectedGiftType)
                            ?.gift_card_url,
                        }}
                        style={styles.giftCardThumbnail}
                        resizeMode="cover"
                      />
                      <Typography
                        variant="body2"
                        text={
                          giftTypes.find(g => g.id === selectedGiftType)
                            ?.title || ''
                        }
                        color="textPrimary"
                        style={styles.giftTypeSelectedText}
                      />
                    </View>
                  ) : (
                    <Typography
                      variant="body2"
                      text={t('donation.giftForm.selectGiftType')}
                      color="textSecondary"
                      style={styles.dropdownText}
                    />
                  )}
                  <ArrowDownIcon
                    width={16}
                    height={16}
                    color={Colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

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
              submitting ? t('donation.submitting') : t('products.donateNow')
            }
            onPress={handleDonate}
            disabled={!isValid || submitting}
            variant="primary"
            size="large"
            style={styles.donateButton}
            loading={submitting}
          />
        </ScrollView>
      </View>

      {/* Gift Type Selection Modal */}
      {giftTypeModalVisible && (
        <View style={styles.selectionModalOverlay}>
          <TouchableOpacity
            style={styles.selectionModalBackdrop}
            activeOpacity={1}
            onPress={() => setGiftTypeModalVisible(false)}
          />
          <View style={styles.giftTypeModalContent}>
            <Typography
              variant="h5"
              text={t('donation.giftForm.giftType')}
              color="textPrimary"
              style={styles.selectionModalTitle}
            />
            {loadingGiftTypes ? (
              <Typography
                variant="body1"
                text={t('common.loading')}
                color="textSecondary"
                style={{textAlign: 'center', padding: hp(2)}}
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.giftTypeScrollContent}>
                {giftTypes.map(giftType => (
                  <TouchableOpacity
                    key={giftType.id}
                    style={[
                      styles.giftTypeOption,
                      selectedGiftType === giftType.id &&
                        styles.giftTypeOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedGiftType(giftType.id);
                      setGiftTypeModalVisible(false);
                    }}>
                    <Image
                      source={{uri: giftType.gift_card_url}}
                      style={styles.giftCardImage}
                      resizeMode="cover"
                    />
                    <Typography
                      variant="caption"
                      text={giftType.title}
                      color="textPrimary"
                      style={styles.giftTypeTitle}
                    />
                    {selectedGiftType === giftType.id && (
                      <View style={styles.giftTypeCheckmark}>
                        <Typography variant="caption" text="✓" color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      {/* Payment WebView */}
      <PaymentWebView
        visible={!!paymentUrl}
        url={paymentUrl}
        onClose={handlePaymentWebViewClose}
        onSuccess={handlePaymentSuccess}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
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
  dropdownText: {
    flex: 1,
    textAlign: 'left',
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
  selectionModalTitle: {
    marginBottom: hp(2),
    textAlign: 'center',
  },
  // Gift Type specific styles
  giftTypeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.white,
    minHeight: hp(8),
  },
  giftTypeSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  giftCardThumbnail: {
    width: wp(12),
    height: hp(5),
    borderRadius: 8,
    marginRight: wp(3),
  },
  giftTypeSelectedText: {
    flex: 1,
    textAlign: 'left',
  },
  giftTypeModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(6),
    width: '90%',
    maxWidth: 500,
  },
  giftTypeScrollContent: {
    paddingVertical: hp(1),
    gap: wp(3),
  },
  giftTypeOption: {
    width: wp(40),
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.white,
  },
  giftTypeOptionSelected: {
    borderColor: Colors.primary,
  },
  giftCardImage: {
    width: '100%',
    height: hp(15),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  giftTypeTitle: {
    textAlign: 'center',
    padding: hp(1),
    backgroundColor: Colors.background.light,
  },
  giftTypeCheckmark: {
    position: 'absolute',
    top: hp(1),
    right: wp(2),
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
