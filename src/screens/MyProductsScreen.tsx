import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';
import {BackHeader, ProductCard, ProductDonationModal} from '../components';
import {Typography} from '../components/Typography';
import {useAuth, useLanguage} from '../context';
import {apiService} from '../services/api';
import {Colors} from '../constants';
import {wp, hp} from '../utils/responsive';
import axios from 'axios';
import {Config} from '../constants';

// Icons
import EmptyBoxIcon from '../assets/icons/filled/icons8-empty-box 1.svg';
import SuccessTickIcon from '../assets/icons/filled/Group (1).svg';
import ArrowDownIcon from '../assets/icons/outlined/arrow-down.svg';
import ImagePlaceholderIcon from '../assets/icons/outlined/image-placeholder.svg';

// Image types
interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}

interface ProductType {
  id: number;
  name: string;
}

type ScreenState = 'empty' | 'list' | 'form' | 'success';

export const MyProductsScreen: React.FC = () => {
  const {token} = useAuth();
  const {t} = useLanguage();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Screen state
  const [screenState, setScreenState] = useState<ScreenState>('empty');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProducts, setUserProducts] = useState<any[]>([]);

  // Donation modal state
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form state
  const [productName, setProductName] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [productValue, setProductValue] = useState('');
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Fetch user products to check if empty
  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) {
        setScreenState('empty');
        return;
      }

      const response = await apiService.get<any>('/user-products/my', {
        Authorization: `Bearer ${token}`,
      });

      console.log('User products response:', response);

      let products: any[] = [];
      if (response?.success && response?.data) {
        products = Array.isArray(response.data)
          ? response.data
          : response.data.products || response.data.data || [];
      } else if (Array.isArray(response)) {
        products = response;
      }

      setUserProducts(products);
      setScreenState(products.length > 0 ? 'list' : 'empty');
    } catch (error) {
      console.error('Failed to fetch user products:', error);
      setScreenState('empty');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch product types
  const fetchProductTypes = useCallback(async () => {
    try {
      setLoadingTypes(true);
      const response = await apiService.get<any>('/user-products/types', {
        Authorization: `Bearer ${token}`,
      });

      let types: ProductType[] = [];
      if (response?.success && response?.data) {
        types = Array.isArray(response.data)
          ? response.data
          : response.data.types || response.data.data || [];
      } else if (Array.isArray(response)) {
        types = response;
      }

      setProductTypes(types);
    } catch (error) {
      console.error('Failed to fetch product types:', error);
    } finally {
      setLoadingTypes(false);
    }
  }, [token]);

  // Hide bottom tab navigator and fetch products on focus
  useFocusEffect(
    useCallback(() => {
      const tabNav = navigation.getParent()?.getParent();

      tabNav?.setOptions({
        tabBarStyle: {display: 'none'},
      });

      // Fetch products on every focus
      fetchUserProducts();

      return () => {
        tabNav?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation, fetchUserProducts]),
  );

  const handleAddProduct = () => {
    fetchProductTypes();
    setScreenState('form');
  };

  const handleSelectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        console.error('Image picker error:', result.errorMessage);
        Alert.alert(t('common.error'), t('myProducts.errors.imageFailed'));
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri || '',
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || 'image.jpg',
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert(t('common.error'), t('myProducts.errors.imageFailed'));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!productName.trim()) {
      Alert.alert(t('common.error'), t('myProducts.errors.nameRequired'));
      return;
    }
    if (!selectedType) {
      Alert.alert(t('common.error'), t('myProducts.errors.typeRequired'));
      return;
    }
    if (!productValue.trim()) {
      Alert.alert(t('common.error'), t('myProducts.errors.valueRequired'));
      return;
    }
    if (!productDetails.trim()) {
      Alert.alert(t('common.error'), t('myProducts.errors.detailsRequired'));
      return;
    }

    if (!token) {
      Alert.alert(t('common.error'), t('myProducts.errors.notAuthenticated'));
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData
      const formData = new FormData();
      formData.append('product_name', productName.trim());
      formData.append('description', productDetails.trim());
      formData.append('user_product_type_id', selectedType.id.toString());
      formData.append('target_amount', productValue.trim());

      if (selectedImage?.uri) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || 'image.jpg',
        } as any);
      }

      // Get app token first
      const appToken = await apiService.getAppToken();

      // Make the request with FormData
      const response = await axios.post(
        `${Config.API.BASE_URL}/user-products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-Token': appToken || '',
            'X-App-Locale': 'ar',
          },
        },
      );

      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        setScreenState('success');
        // Reset form
        setProductName('');
        setProductDetails('');
        setProductValue('');
        setSelectedType(null);
        setSelectedImage(null);
      } else {
        Alert.alert(
          t('common.error'),
          response.data?.message || t('myProducts.errors.submitFailed'),
        );
      }
    } catch (error: any) {
      console.log(error?.response?.data, 'error');
      console.error('Failed to create product:', error);
      Alert.alert(
        t('common.error'),
        error.response?.data?.message ||
          error.message ||
          t('myProducts.errors.submitFailed'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToMyProducts = () => {
    fetchUserProducts();
  };

  const handleGoToHome = () => {
    navigation.goBack();
  };

  const handleDonate = (product: any) => {
    // Check if product is active before allowing donation
    if (product.status !== 'active') {
      Alert.alert(
        t('common.error'),
        t('myProducts.errors.productInReview') ||
          'This product is still under review and cannot receive donations yet.',
      );
      return;
    }
    setSelectedProduct(product);
    setDonationModalVisible(true);
  };

  // Products List View
  const renderProductsList = () => (
    <View style={styles.listContainer}>
      <FlatList
        data={userProducts}
        keyExtractor={item => item.guid || item.id.toString()}
        renderItem={({item}) => (
          <ProductCard
            id={item.id.toString()}
            guid={item.guid}
            title={item.product_name}
            raisedAmount={item.collected_amount || '0'}
            remainingAmount={
              item.remaining_amount?.toString() || item.target_amount
            }
            progress={(parseFloat(item.completion_percentage) || 0) / 100}
            image={item.image}
            category={item.product_type?.name || ''}
            location=""
            dealersCount={0}
            status={item.status}
            statusText={item.status_text}
            hideCartButton={true}
            onDonate={() => handleDonate(item)}
            style={styles.productCard}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/* Sticky Add Button */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}>
          <Typography
            variant="h5"
            text={t('myProducts.addNew')}
            style={styles.addButtonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty State View
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <EmptyBoxIcon width={wp(20)} height={wp(20)} />
      <Typography
        variant="h5"
        text={t('myProducts.emptyTitle')}
        color="textPrimary"
        style={styles.emptyText}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddProduct}
        activeOpacity={0.8}>
        <Typography
          variant="h5"
          text={t('myProducts.addNew')}
          style={styles.addButtonText}
        />
      </TouchableOpacity>
    </View>
  );

  // Form View
  const renderForm = () => (
    <ScrollView
      style={styles.formScrollView}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Typography
        variant="h4"
        text={t('myProducts.form.title')}
        color="textPrimary"
        style={styles.formTitle}
      />
      <Typography
        variant="body2"
        text={t('myProducts.form.subtitle')}
        color="textSecondary"
        style={styles.formSubtitle}
      />

      {/* Product Name */}
      <Typography
        variant="body2"
        text={t('myProducts.form.productName')}
        color="textSecondary"
        style={styles.fieldLabel}
      />
      <TextInput
        style={styles.input}
        placeholder={t('myProducts.form.productNamePlaceholder')}
        placeholderTextColor={Colors.text.secondary}
        value={productName}
        onChangeText={setProductName}
        textAlign="right"
      />

      {/* Product Type Dropdown */}
      <Typography
        variant="body2"
        text={t('myProducts.form.productType')}
        color="textSecondary"
        style={styles.fieldLabel}
      />
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowTypeDropdown(!showTypeDropdown)}
        activeOpacity={0.7}>
        <Typography
          variant="body1"
          text={selectedType?.name || t('myProducts.form.selectType')}
          color={selectedType ? 'textPrimary' : 'textSecondary'}
          style={styles.dropdownText}
        />
        <ArrowDownIcon
          width={wp(5)}
          height={wp(5)}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Dropdown Options */}
      {showTypeDropdown && (
        <View style={styles.dropdownOptions}>
          {loadingTypes ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            productTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.dropdownOption,
                  selectedType?.id === type.id && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedType(type);
                  setShowTypeDropdown(false);
                }}>
                <Typography
                  variant="body1"
                  text={type.name}
                  align="left"
                  color={
                    selectedType?.id === type.id ? 'primary' : 'textPrimary'
                  }
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Product Value */}
      <Typography
        variant="body2"
        text={t('myProducts.form.productValue')}
        color="textSecondary"
        style={styles.fieldLabel}
      />
      <TextInput
        style={styles.input}
        placeholder={t('myProducts.form.productValuePlaceholder')}
        placeholderTextColor={Colors.text.secondary}
        value={productValue}
        onChangeText={setProductValue}
        keyboardType="numeric"
        textAlign="right"
      />

      {/* Product Details */}
      <Typography
        variant="body2"
        text={t('myProducts.form.productDetails')}
        color="textSecondary"
        style={styles.fieldLabel}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={t('myProducts.form.productDetailsPlaceholder')}
        placeholderTextColor={Colors.text.secondary}
        value={productDetails}
        onChangeText={setProductDetails}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        textAlign="right"
      />

      {/* Image Upload */}
      <TouchableOpacity
        style={styles.imageUploadContainer}
        onPress={handleSelectImage}
        activeOpacity={0.7}>
        {selectedImage?.uri ? (
          <Image
            source={{uri: selectedImage.uri}}
            style={styles.selectedImage}
          />
        ) : (
          <>
            <View style={styles.imageIconContainer}>
              <ImagePlaceholderIcon width={wp(12)} height={wp(12)} />
            </View>
            <View style={styles.imageUploadTextRow}>
              <Typography
                variant="body2"
                text={t('myProducts.form.uploadImage')}
                color="textSecondary"
              />
              <Typography
                variant="body2"
                text={t('myProducts.form.uploadImageLink')}
                color="primary"
                style={styles.imageUploadLink}
              />
            </View>
          </>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}>
        {submitting ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Typography
            variant="h5"
            text={t('myProducts.form.submit')}
            style={styles.submitButtonText}
          />
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  // Success View
  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <SuccessTickIcon width={wp(25)} height={wp(25)} />
      <Typography
        variant="h4"
        text={t('myProducts.success.title')}
        color="textPrimary"
        style={styles.successTitle}
      />
      <Typography
        variant="body2"
        text={t('myProducts.success.subtitle')}
        color="textSecondary"
        style={styles.successSubtitle}
      />

      {/* Go to My Products Button */}
      <TouchableOpacity
        style={styles.successPrimaryButton}
        onPress={handleGoToMyProducts}
        activeOpacity={0.8}>
        <Typography
          variant="h5"
          text={t('myProducts.success.goToProducts')}
          style={styles.successPrimaryButtonText}
        />
      </TouchableOpacity>

      {/* Go to Home Button */}
      <TouchableOpacity
        style={styles.successSecondaryButton}
        onPress={handleGoToHome}
        activeOpacity={0.8}>
        <Typography
          variant="h5"
          text={t('myProducts.success.goToHome')}
          color="textPrimary"
          style={styles.successSecondaryButtonText}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackHeader
          title={t('myProducts.title')}
          backgroundColor={Colors.white}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {screenState !== 'success' && (
        <BackHeader
          title={t('myProducts.title')}
          backgroundColor={Colors.white}
        />
      )}
      {screenState === 'empty' && renderEmptyState()}
      {screenState === 'list' && renderProductsList()}
      {screenState === 'form' && renderForm()}
      {screenState === 'success' && (
        <>
          <BackHeader title="" backgroundColor={Colors.white} />
          {renderSuccess()}
        </>
      )}

      {/* Donation Modal */}
      {selectedProduct && (
        <ProductDonationModal
          visible={donationModalVisible}
          onClose={() => {
            setDonationModalVisible(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.id}
          productGuid={selectedProduct.guid}
          productName={selectedProduct.product_name}
          isUserProduct={true}
          onSuccess={() => {
            setDonationModalVisible(false);
            setSelectedProduct(null);
            fetchUserProducts();
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // List Styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(12),
  },
  productCard: {
    marginBottom: hp(2),
    width: '100%',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addNewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: wp(4),
    alignItems: 'center',
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  emptyText: {
    marginTop: hp(2),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(20),
    borderRadius: wp(8),
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  // Form Styles
  formScrollView: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(4),
  },
  formTitle: {
    textAlign: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  formSubtitle: {
    textAlign: 'center',
    marginBottom: hp(3),
  },
  fieldLabel: {
    textAlign: 'left',
    marginBottom: hp(1),
    marginTop: hp(1.5),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    fontSize: wp(4),
    backgroundColor: Colors.white,
    color: Colors.text.primary,
    textAlign: 'left',
  },
  textArea: {
    minHeight: hp(12),
    paddingTop: hp(1.5),
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    backgroundColor: Colors.white,
  },
  dropdownText: {
    flex: 1,
    textAlign: 'left',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    marginTop: hp(0.5),
    maxHeight: hp(25),
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F8FF',
  },
  imageUploadContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp(4),
    backgroundColor: '#F8F9FA',
    paddingVertical: hp(4),
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  imageIconContainer: {
    marginBottom: hp(1.5),
  },
  imageUploadTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadLink: {
    fontWeight: '600',
  },
  selectedImage: {
    width: '100%',
    height: hp(20),
    borderRadius: wp(3),
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: wp(4),
    alignItems: 'center',
    marginTop: hp(3),
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  // Success Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  successTitle: {
    marginTop: hp(3),
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
    marginTop: hp(1),
    marginBottom: hp(4),
    lineHeight: hp(3),
  },
  successPrimaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: wp(8),
    width: '100%',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  successPrimaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  successSecondaryButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: wp(8),
    width: '100%',
    alignItems: 'center',
  },
  successSecondaryButtonText: {
    fontWeight: '600',
  },
});

export default MyProductsScreen;
