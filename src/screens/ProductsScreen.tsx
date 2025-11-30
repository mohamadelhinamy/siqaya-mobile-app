import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage} from '../context';
import {Typography, HorizontalProductCard} from '../components';
import {AddToCartModal} from '../components/AddToCartModal';
import {
  HorizontalProductCardSkeleton,
  FilterPillsSkeleton,
} from '../components/Skeletons';
import ShoppingCartIcon from '../assets/icons/outlined/shopping-cart.svg';
import SearchIcon from '../assets/icons/outlined/search.svg';
import TickIcon from '../assets/icons/outlined/tick-square.svg';
import FilterIcon from '../assets/icons/outlined/filter.svg';

import {Colors} from '../constants';
import {wp, hp} from '../utils/responsive';
import {apiService, Product} from '../services/api';
import {ProductsStackParamList} from '../navigation/ProductsNavigator';

interface Filter {
  id: number;
  name: string;
}

interface ApiResponseWithMeta<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination: {
      total: number;
      current_page: number;
      per_page: number;
      total_pages: number;
      count: number;
    };
  };
  message?: string;
}

type ProductsScreenNavigationProp = StackNavigationProp<
  ProductsStackParamList,
  'ProductsList'
>;

export const ProductsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const align = 'left';

  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [modalProductId, setModalProductId] = useState<number | null>(null);
  const [modalProductName, setModalProductName] = useState<string>('');

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<{productCategory: Filter[]}>(
        '/filters',
      );
      if (response.success && response.data) {
        setFilters(response.data?.productCategory);
      }
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = useCallback(
    async (page: number = 1, loadMore: boolean = false) => {
      try {
        if (loadMore) {
          setLoadingMore(true);
        } else {
          setProductsLoading(true);
        }

        // Build the API endpoint with optional category filter
        let endpoint = `/products?per_page=10&page=${page}`;
        if (selectedFilter !== null) {
          endpoint += `&category=${selectedFilter}`;
        }

        const response = (await apiService.get(
          endpoint,
        )) as ApiResponseWithMeta<Product[]>;

        if (response.success && response.data) {
          console.log('Fetched products:', response.data, response);
          // Products are directly in response.data (array)
          if (loadMore) {
            // Append new products to existing ones
            setProducts(prev => [...prev, ...response.data]);
          } else {
            // Replace products for initial load or filter change
            setProducts(response.data);
          }
          // Pagination info is in response.meta.pagination
          if (response.meta?.pagination) {
            setTotalProducts(response.meta.pagination.total);
            setCurrentPage(response.meta.pagination.current_page);
            setTotalPages(response.meta.pagination.total_pages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedFilter],
  );

  useEffect(() => {
    fetchFilters();
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [selectedFilter, fetchProducts]);

  const handleFilterPress = (filterId: number | null) => {
    setSelectedFilter(filterId);
    setCurrentPage(1); // Reset to first page when filter changes
    setProducts([]); // Clear products when filter changes
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !productsLoading && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchProducts(nextPage, true);
    }
  }, [loadingMore, productsLoading, currentPage, totalPages, fetchProducts]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1E' : Colors.white,
    },
    mainScrollView: {
      flex: 1,
    },
    header: {
      paddingHorizontal: wp(5),
      width: '100%',
      paddingVertical: hp(1),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      textAlign: 'left',
      flex: 1,
      fontWeight: '600',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
    },
    iconButton: {
      padding: wp(1),
    },
    content: {
      padding: wp(5),
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#8E8E93' : '#8E8E93',
      marginBottom: hp(3),
      textAlign: align,
    },
    cardTitle: {
      marginBottom: hp(1),
      textAlign: align,
    },
    cardSubtitle: {
      textAlign: align,
    },
    pill: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(1.5),
      borderRadius: wp(6),
      backgroundColor: Colors.background.light,
      minHeight: hp(5),
      height: hp(5),
      justifyContent: 'center',
    },
    pillActive: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(1.5),
      borderRadius: wp(6),
      backgroundColor: Colors.text.turquoise,
      minHeight: hp(5),
      height: hp(5),
      justifyContent: 'center',
    },
    filterScrollView: {
      flexGrow: 0,
      marginVertical: hp(2),
      width: '100%',
    },
    filterScrollContent: {
      paddingHorizontal: wp(5),
      gap: wp(2),
    },
    pillText: {
      lineHeight: undefined,
      includeFontPadding: false,
    },
    loadingContainer: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(0.1),
      height: hp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    productsLoadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(10),
    },
    loadingText: {
      marginTop: hp(2),
    },
    productItem: {
      marginBottom: hp(2),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(10),
      paddingHorizontal: wp(5),
    },
    flatListContent: {
      paddingHorizontal: wp(5),
      paddingBottom: hp(12),
    },
    loadMoreContainer: {
      paddingVertical: hp(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    productsContainer: {
      flex: 1,
    },
    skeletonContainer: {
      paddingHorizontal: wp(5),
    },
  });

  const handleSearchPress = () => {
    // Handle search action
    console.log('Search pressed');
  };

  const handleCartPress = () => {
    // Navigate to Cart screen
    navigation.navigate('CartScreen' as never);
  };

  const handleProductPress = (productGuid: string) => {
    navigation.navigate('ProductDetails', {productGuid});
  };

  const handleOpenAddToCart = (
    productId: number,
    productGuid: string,
    title?: string,
  ) => {
    setModalProductId(productId);
    setModalProductName(title || '');
    setCartModalVisible(true);
  };

  const handleCloseAddToCart = () => {
    setCartModalVisible(false);
    setModalProductId(null);
    setModalProductName('');
  };

  const handleAddToCartSuccess = () => {
    console.log('Added to cart from Products screen');
  };

  console.log('Selected Filter:', selectedFilter);
  console.log('Current Page:', currentPage);
  console.log('Total Products:', totalProducts);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography
          variant="h5"
          text={t('navigation.products')}
          style={styles.headerTitle}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={styles.iconButton}>
            <SearchIcon width={24} height={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCartPress} style={styles.iconButton}>
            <ShoppingCartIcon
              width={24}
              height={24}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Pills */}
      {loading ? (
        <FilterPillsSkeleton />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScrollContent}>
          {/* "All" filter */}
          <TouchableOpacity
            style={selectedFilter === null ? styles.pillActive : styles.pill}
            onPress={() => handleFilterPress(null)}>
            <Typography
              variant="body2"
              text={t('common.all')}
              color={selectedFilter === null ? 'white' : 'textSecondary'}
              style={styles.pillText}
            />
          </TouchableOpacity>

          {/* Dynamic filters from API */}
          {filters?.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={
                selectedFilter === filter.id ? styles.pillActive : styles.pill
              }
              onPress={() => handleFilterPress(filter.id)}>
              <Typography
                variant="body2"
                text={filter.name}
                color={selectedFilter === filter.id ? 'white' : 'textSecondary'}
                style={styles.pillText}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Products FlatList */}
      <View style={styles.productsContainer}>
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={
            <>
              {/* Second Header */}
              <View style={styles.header}>
                <Typography
                  variant="h5"
                  text={
                    productsLoading
                      ? t('common.loading')
                      : `${totalProducts} ${t('products.product')}`
                  }
                  style={styles.headerTitle}
                />
                <View style={styles.headerIcons}>
                  <TouchableOpacity
                    onPress={handleSearchPress}
                    style={styles.iconButton}>
                    <FilterIcon
                      width={24}
                      height={24}
                      color={Colors.text.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCartPress}
                    style={styles.iconButton}>
                    <TickIcon
                      width={24}
                      height={24}
                      color={Colors.text.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          renderItem={({item: product}) => (
            <HorizontalProductCard
              id={product.id.toString()}
              title={product.product_name}
              raisedAmount={`${product.stage.stage_collected} ر.س`}
              remainingAmount={`${
                product.stage.stage_remaining ||
                product.stage.stage_target - product.stage.stage_collected
              } ر.س`}
              progress={product.stage.stage_percentage / 100}
              category={product.category.name}
              location={product.association.name}
              dealersCount={0}
              image={product.image ? {uri: product.image} : undefined}
              style={styles.productItem}
              onPress={() => handleProductPress(product.guid)}
              onAddToCart={() =>
                handleOpenAddToCart(
                  product.id,
                  product.guid,
                  product.product_name,
                )
              }
            />
          )}
          ListEmptyComponent={
            productsLoading ? (
              <View style={styles.skeletonContainer}>
                <HorizontalProductCardSkeleton />
                <HorizontalProductCardSkeleton />
                <HorizontalProductCardSkeleton />
                <HorizontalProductCardSkeleton />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Typography
                  variant="h5"
                  text={t('products.noProducts')}
                  color="textSecondary"
                />
              </View>
            )
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color={Colors.text.turquoise} />
              </View>
            ) : null
          }
          contentContainerStyle={styles.flatListContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* Add to Cart Modal (opened from product cards) */}
      <AddToCartModal
        visible={cartModalVisible && modalProductId !== null}
        productId={modalProductId ?? 0}
        productName={modalProductName}
        onClose={handleCloseAddToCart}
        onSuccess={handleAddToCartSuccess}
      />
    </SafeAreaView>
  );
};
