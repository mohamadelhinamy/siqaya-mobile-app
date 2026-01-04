import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {Typography} from './Typography';
import {Colors} from '../constants';
import {useLanguage} from '../context';
import {hp, wp} from '../utils/responsive';
import CloseCircleIcon from '../assets/icons/outlined/close-circle.svg';

interface PaymentWebViewProps {
  visible: boolean;
  url: string;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const PaymentWebView: React.FC<PaymentWebViewProps> = ({
  visible,
  url,
  onClose,
  onSuccess,
  onError,
}) => {
  const {t} = useLanguage();
  const [loading, setLoading] = useState(true);
  const isClosingRef = useRef(false);

  // Reset closing state when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onClose();
  }, [onClose]);

  const handleSuccess = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onSuccess?.();
  }, [onSuccess]);

  // Append agent=mobile-app to the URL
  const webviewUrl = url
    ? url.includes('?')
      ? `${url}&agent=mobile-app`
      : `${url}?agent=mobile-app`
    : '';

  const handleNavigationStateChange = (navState: any) => {
    const {url: currentUrl} = navState;

    // Check for success/failure URLs
    if (
      currentUrl.includes('/payment/success') ||
      currentUrl.includes('status=success')
    ) {
      handleSuccess();
    } else if (
      currentUrl.includes('/payment/failed') ||
      currentUrl.includes('status=failed')
    ) {
      onError?.('Payment failed');
      handleClose();
    } else if (
      currentUrl.includes('/payment/cancelled') ||
      currentUrl.includes('status=cancelled')
    ) {
      handleClose();
    }
  };

  const handleError = (syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError?.('Failed to load payment page');
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.event === 'CLOSE_WEBVIEW' || data.type === 'CLOSE_WEBVIEW') {
        handleClose();
      }
    } catch (e) {
      // If not JSON, check if it's a plain string
      if (event.nativeEvent.data === 'CLOSE_WEBVIEW') {
        handleClose();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Typography
            variant="h6"
            text={t('payment.title') || 'Payment'}
            color="textPrimary"
            style={styles.title}
          />
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <CloseCircleIcon
              width={24}
              height={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        {url && (
          <WebView
            source={{uri: webviewUrl}}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
            onError={handleError}
            userAgent="mobile-app"
            onMessage={handleMessage}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
          />
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Typography
              variant="body2"
              text={t('common.loading')}
              color="textSecondary"
              style={styles.loadingText}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  title: {
    fontWeight: '600',
  },
  closeButton: {
    padding: wp(2),
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
  },
});
