import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  Image,
  ActivityIndicator,
} from 'react-native';
import {AppText} from '../core/AppText';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';
import {Typography} from '../Typography';
import {apiService} from '../../services/api';
import {DonationBottomSheet} from '../DonationBottomSheet';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  image?: any;
  color: string;
  onPress?: () => void;
}

interface ServicesGridProps {
  services?: ServiceItem[];
}

const getDefaultServices = (t: any): ServiceItem[] => [
  {
    id: '1',
    title: t('services.investmentFunds'),
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
  {
    id: '2',
    title: t('services.orphanEndowments'),
    subtitle: '',
    image: require('../../assets/images/small-card-image-1.png'),
    color: '#FFFFFF',
  },
  {
    id: '3',
    title: t('services.houseOfGodEndowments'),
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
];

export const ServicesGrid: React.FC<ServicesGridProps> = ({services}) => {
  const {t} = useLanguage();
  const [apiServices, setApiServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [donationModalVisible, setDonationModalVisible] =
    useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');

  const displayServices = services || apiServices;

  useEffect(() => {
    // Only fetch from API if services prop is not provided
    if (!services) {
      fetchServices();
    }
  }, [services]);

  const handleServicePress = (serviceId: number, serviceName: string) => {
    setSelectedServiceId(serviceId);
    setSelectedServiceName(serviceName);
    setDonationModalVisible(true);
  };

  const handleCloseDonation = () => {
    setDonationModalVisible(false);
    setSelectedServiceId(null);
    setSelectedServiceName('');
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<any>('/paths');
      console.log('Paths response:', response);

      if (
        response.success &&
        response.data?.pathsOfGoodness &&
        Array.isArray(response.data.pathsOfGoodness)
      ) {
        const mappedServices: ServiceItem[] = response.data.pathsOfGoodness.map(
          (path: any) => ({
            id: path.id?.toString() || '',
            title: path.name || path.title || '',
            subtitle: path.description || '',
            image: path.image
              ? {uri: path.image}
              : require('../../assets/images/small_card_image.png'),
            color: path.color || '#FFFFFF',
            onPress: () =>
              handleServicePress(path.id, path.name || path.title || ''),
          }),
        );
        setApiServices(mappedServices);
      }
    } catch (error) {
      console.error('Failed to fetch paths:', error);
      // Fall back to default services on error
      setApiServices(getDefaultServices(t));
    } finally {
      setLoading(false);
    }
  };

  const sectionTitleStyle: TextStyle = {
    ...styles.sectionTitle,
    textAlign: 'left',
  };

  const renderServiceCard = (service: ServiceItem) => {
    return (
      <TouchableOpacity
        key={service.id}
        style={styles.serviceCard}
        onPress={service.onPress}
        activeOpacity={0.8}>
        <Image source={service.image} style={styles.serviceImage} />
        <AppText style={styles.serviceTitle}>{service.title}</AppText>
      </TouchableOpacity>
    );
  };

  if (loading && displayServices.length === 0) {
    return (
      <View style={styles.container}>
        <Typography
          variant="subtitle1"
          color="textPrimary"
          text={t('services.title')}
          style={styles.sectionTitle}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Typography
        variant="subtitle1"
        color="textPrimary"
        text={t('services.title')}
        style={styles.sectionTitle}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        removeClippedSubviews={false}>
        {displayServices.map(renderServiceCard)}
      </ScrollView>

      <DonationBottomSheet
        visible={donationModalVisible}
        onClose={handleCloseDonation}
        pathId={selectedServiceId || undefined}
        serviceName={selectedServiceName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'flex-start',
    gap: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Colors.text.primary,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingLeft: 16,
  },
  scrollContainer: {
    paddingRight: 16,
    gap: 12,
    paddingLeft: 16,
  },
  serviceCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
