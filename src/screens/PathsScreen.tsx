import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage, useRTLStyles} from '../context';
import {Typography} from '../components';
import {DonationBottomSheet} from '../components/DonationBottomSheet';
import {apiService} from '../services/api';
import {Colors} from '../constants';
import {wp, hp} from '../utils/responsive';
import ShoppingCartIcon from '../assets/icons/outlined/shopping-cart.svg';
import SearchIcon from '../assets/icons/outlined/search.svg';
import {PathsStackParamList} from '../navigation/PathsNavigator';

const {width: screenWidth} = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 3; // 3 cards per row with padding

interface PathItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

type PathsScreenNavigationProp = StackNavigationProp<
  PathsStackParamList,
  'PathsList'
>;

export const PathsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const navigation = useNavigation<PathsScreenNavigationProp>();
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [donationModalVisible, setDonationModalVisible] =
    useState<boolean>(false);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [selectedPathName, setSelectedPathName] = useState<string>('');

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<any>('/paths');
      console.log('Paths response in PathsScreen:', response);

      if (
        response.success &&
        response.data?.pathsOfGoodness &&
        Array.isArray(response.data.pathsOfGoodness)
      ) {
        setPaths(response.data.pathsOfGoodness);
      }
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePathPress = (pathId: number, pathName: string) => {
    setSelectedPathId(pathId);
    setSelectedPathName(pathName);
    setDonationModalVisible(true);
  };

  const handleCloseDonation = () => {
    setDonationModalVisible(false);
    setSelectedPathId(null);
    setSelectedPathName('');
  };

  const handleSearchPress = () => {
    // Handle search action
    console.log('Search pressed');
  };

  const handleCartPress = () => {
    // Navigate to cart
    navigation.navigate('CartScreen');
  };

  const renderPathCard = ({item}: {item: PathItem}) => (
    <TouchableOpacity
      style={styles.pathCard}
      onPress={() => handlePathPress(item.id, item.name)}
      activeOpacity={0.8}>
      <Image
        source={
          item.image
            ? {uri: item.image}
            : require('../assets/images/small_card_image.png')
        }
        style={styles.pathImage}
      />
      <View style={styles.pathTitleContainer}>
        <Typography
          variant="body2"
          text={item.name}
          color="textPrimary"
          style={styles.pathTitle}
          numberOfLines={2}
        />
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
      backgroundColor: Colors.white,
    },
    headerTitle: {
      fontWeight: 'bold',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(3),
    },
    iconButton: {
      padding: wp(1),
    },
    gridContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    pathCard: {
      width: cardWidth,
      aspectRatio: 1, // Makes it square
      backgroundColor: Colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      padding: 8,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    pathImage: {
      width: '100%',
      height: '70%',
      borderRadius: 12,
      resizeMode: 'cover',
    },
    pathTitleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 4,
    },
    pathTitle: {
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(10),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(10),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography
          variant="h5"
          text={t('navigation.paths')}
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : paths.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography
            variant="h5"
            text={t('common.noData')}
            color="textSecondary"
          />
        </View>
      ) : (
        <FlatList
          data={paths}
          renderItem={renderPathCard}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DonationBottomSheet
        visible={donationModalVisible}
        onClose={handleCloseDonation}
        pathId={selectedPathId || undefined}
        serviceName={selectedPathName}
      />
    </SafeAreaView>
  );
};
