import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  Image,
} from 'react-native';
import {AppText} from '../core/AppText';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';

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
    title: t('services.orphanEndowments'),
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
  {
    id: '2',
    title: t('services.orphanEndowments'),
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
  {
    id: '3',
    title: t('services.investmentFunds'),
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
];

export const ServicesGrid: React.FC<ServicesGridProps> = ({services}) => {
  const {t} = useLanguage();
  const displayServices = services || getDefaultServices(t);

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

  return (
    <View style={styles.container}>
      <AppText bold style={sectionTitleStyle}>
        {t('services.title')}
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}>
        {displayServices.map(renderServiceCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.black,
    marginBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
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
});
