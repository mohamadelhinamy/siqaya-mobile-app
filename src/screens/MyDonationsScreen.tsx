import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage, useAuth} from '../context';
import {Typography, BackHeader, DonationCard} from '../components';
import {riyalIcon} from '../components/Icons';
import {Colors} from '../constants';
import {wp, hp} from '../utils/responsive';
import {apiService} from '../services/api';
import {ProfileStackParamList} from '../navigation/ProfileNavigator';

interface DonationProduct {
  id: number;
  guid?: string;
  name: string | null;
  image: string | null;
}

interface DonationItem {
  id: number;
  item_type: string;
  item_name: string;
  item_description: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  product?: DonationProduct;
  gift_type_id: number | null;
  gift_recipient_name: string | null;
  gift_recipient_mobile: string | null;
}

interface DonationPath {
  id: number;
  name: string;
}

interface Donation {
  id: number;
  invoice_number: string;
  guid: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  paid_at: string;
  created_at: string;
  items: DonationItem[];
  donation_path: DonationPath | null;
}

interface DonationStats {
  totalDonations: number;
  totalAmount: number;
}

export const MyDonationsScreen: React.FC = () => {
  const {t} = useLanguage();
  const {token} = useAuth();
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalAmount: 0,
  });

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true);
      console.log(
        '🔐 Fetching donations with token:',
        token ? 'Token exists' : 'NO TOKEN',
      );

      if (!token) {
        console.warn(
          '⚠️ No authentication token available for fetching donations',
        );
        return;
      }

      const response = await apiService.get<any>('/user-donations', {
        Authorization: `Bearer ${token}`,
      });
      console.log('📦 User donations response:');
      console.log(response);

      // Handle different response structures
      // The API might return: { success: true, data: [...] } or { data: [...] } or just [...]
      let donationsData: any[] = [];

      if (response) {
        if (response.success && response.data) {
          // Standard success response: { success: true, data: { donations: [...] } }
          donationsData =
            response.data.donations || response.data.data || response.data;
        } else if (response.data) {
          // Response with data wrapper: { data: [...] }
          donationsData =
            response.data.donations || response.data.data || response.data;
        } else if (Array.isArray(response)) {
          // Direct array response
          donationsData = response;
        } else if ((response as any).donations) {
          // Direct donations property
          donationsData = (response as any).donations;
        }
      }

      console.log(
        '📋 Donations data extracted:',
        JSON.stringify(donationsData, null, 2),
      );
      console.log('📋 Is array:', Array.isArray(donationsData));
      console.log(
        '📋 Length:',
        Array.isArray(donationsData) ? donationsData.length : 'N/A',
      );

      const finalDonations = Array.isArray(donationsData) ? donationsData : [];
      setDonations(finalDonations);

      // Calculate or extract stats
      if (response?.data?.stats) {
        setStats(response.data.stats);
      } else if ((response as any)?.stats) {
        setStats((response as any).stats);
      } else {
        setStats({
          totalDonations: finalDonations.length,
          totalAmount: finalDonations.reduce(
            (sum: number, item: any) =>
              sum +
              (parseFloat(item.amount) || parseFloat(item.total_amount) || 0),
            0,
          ),
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Hide bottom tab navigator and fetch donations on focus
  useFocusEffect(
    useCallback(() => {
      const tabNav = navigation.getParent()?.getParent();
      tabNav?.setOptions({
        tabBarStyle: {display: 'none'},
      });

      // Fetch donations on every focus
      fetchDonations();

      return () => {
        tabNav?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation, fetchDonations]),
  );

  const handleProductDetailsPress = (productGuid: string) => {
    navigation.navigate('ProductDetails', {productGuid});
  };

  const renderDonationCard = ({item}: {item: Donation}) => {
    return (
      <DonationCard
        invoiceNumber={item.invoice_number}
        status={item.status}
        totalAmount={item.total_amount}
        paidAt={item.paid_at}
        createdAt={item.created_at}
        items={item.items}
        donationPath={item.donation_path}
        onProductDetailsPress={handleProductDetailsPress}
      />
    );
  };

  const renderHeader = () => (
    <View>
      {/* Analytics Boxes */}
      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsBox}>
          <Typography
            variant="h4"
            text={stats.totalDonations.toString()}
            color="primary"
            style={styles.analyticsValue}
          />
          <Typography
            variant="body2"
            text={t('donations.totalDonations')}
            color="textSecondary"
            style={styles.analyticsLabel}
          />
        </View>
        <View style={styles.analyticsBox}>
          <View style={styles.amountRow}>
            <Typography
              variant="h4"
              text={stats.totalAmount.toLocaleString('ar-SA')}
              color="primary"
              style={styles.analyticsValue}
            />
            {React.createElement(riyalIcon, {width: wp(5), height: wp(5)})}
          </View>
          <Typography
            variant="body2"
            text={t('donations.totalAmount')}
            color="textSecondary"
            style={styles.analyticsLabel}
          />
        </View>
      </View>

      {/* Section Title */}
      <Typography
        variant="h5"
        text={t('donations.myDonationsList')}
        style={styles.sectionTitle}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader
        title={t('profile.links.myDonations')}
        backgroundColor={Colors.white}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={donations}
          renderItem={renderDonationCard}
          keyExtractor={(item, index) => item.guid || index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography
                variant="h5"
                text={t('donations.noDonations')}
                color="textSecondary"
              />
            </View>
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  analyticsContainer: {
    flexDirection: 'row',
    gap: wp(3),
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  analyticsBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  analyticsValue: {
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  analyticsLabel: {
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
});
