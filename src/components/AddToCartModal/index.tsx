import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Typography} from '../Typography';
import {CustomButton} from '../CustomButton';
import {riyalIcon} from '../Icons';
import ShoppingCartIcon from '../../assets/icons/outlined/shopping-cart.svg';
import {Colors} from '../../constants';
import {wp, hp} from '../../utils/responsive';
import {useLanguage, useAuth} from '../../context';
import {apiService} from '../../services/api';

interface AddToCartModalProps {
  visible: boolean;
  productId: number;
  productName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  productId,
  productName,
  onClose,
  onSuccess,
}) => {
  const {t} = useLanguage();
  const [cartAmount, setCartAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setCartAmount('');
    setError('');
    onClose();
  };

  const {token, isAuthenticated} = useAuth();

  const handleConfirm = async () => {
    // Validation
    if (!cartAmount || cartAmount.trim() === '') {
      setError(t('products.amountRequired'));
      return;
    }

    const amount = parseFloat(cartAmount);
    if (isNaN(amount) || amount <= 0) {
      setError(t('products.invalidAmount'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!isAuthenticated || !token) {
        // User must be authenticated
        Alert.alert(
          t('common.error'),
          t('auth.loginRequired') || t('common.error'),
        );
        setLoading(false);
        return;
      }

      const response = await apiService.post(
        '/cart/add',
        {
          product_id: productId,
          amount: amount,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (response.success) {
        Alert.alert(t('common.success'), t('products.addedToCart'), [
          {
            text: t('common.ok'),
            onPress: () => {
              setCartAmount('');
              onClose();
              onSuccess?.();
            },
          },
        ]);
      } else {
        setError(response.message || t('common.error'));
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      setError(err.message || t('common.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Typography
                variant="h4"
                text="✕"
                color="textSecondary"
                style={styles.closeIcon}
              />
            </TouchableOpacity>

            {/* Product Name Title */}
            <Typography
              variant="h6"
              text={productName}
              color="textPrimary"
              style={styles.modalTitle}
            />

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.amountInput}
                value={cartAmount}
                onChangeText={text => {
                  setCartAmount(text);
                  setError('');
                }}
                placeholder={t('products.enterAmount')}
                placeholderTextColor={Colors.text.secondary}
                keyboardType="numeric"
              />
              <View style={styles.riyalIconContainer}>
                {React.createElement(riyalIcon, {
                  width: wp(5),
                  height: wp(5),
                })}
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <Typography
                variant="caption"
                text={error}
                color="error"
                style={styles.errorText}
              />
            ) : null}

            {/* Confirm Button */}
            <CustomButton
              title={t('products.addToCart')}
              variant="primary"
              icon={<ShoppingCartIcon color={Colors.white} />}
              onPress={handleConfirm}
              loading={loading}
              disabled={loading}
              style={styles.confirmButton}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    padding: wp(6),
    paddingTop: hp(6),
    paddingBottom: hp(4),
  },
  closeButton: {
    position: 'absolute',
    top: wp(4),
    left: wp(4),
    zIndex: 1,
    padding: wp(2),
  },
  closeIcon: {
    fontSize: wp(6),
  },
  modalTitle: {
    marginBottom: hp(3),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    marginBottom: hp(3),
    backgroundColor: Colors.white,
  },
  amountInput: {
    flex: 1,
    height: hp(6),
    fontSize: wp(4),
    color: Colors.text.primary,
    textAlign: 'right',
  },
  riyalIconContainer: {
    marginLeft: wp(2),
  },
  errorText: {
    color: Colors.error,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  confirmButton: {
    margin: 0,
    marginBottom: 0,
  },
});
