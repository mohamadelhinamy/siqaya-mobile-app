import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  Image,
} from 'react-native';
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

const defaultServices: ServiceItem[] = [
  {
    id: '1',
    title: 'أوقاف برؤى',
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
  {
    id: '2',
    title: 'أوقاف الأيتام',
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
  {
    id: '3',
    title: 'الصناديق الاستثمارية',
    subtitle: '',
    image: require('../../assets/images/small_card_image.png'),
    color: '#FFFFFF',
  },
];

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services = defaultServices,
}) => {
  const {isRTL} = useLanguage();

  const sectionTitleStyle: TextStyle = {
    ...styles.sectionTitle,
    textAlign: isRTL ? 'right' : 'left',
  };

  const renderServiceCard = (service: ServiceItem) => {
    return (
      <TouchableOpacity
        key={service.id}
        style={styles.serviceCard}
        onPress={service.onPress}
        activeOpacity={0.8}>
        <Image source={service.image} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>{service.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={sectionTitleStyle}>مسارات الخير</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}>
        {services.map(renderServiceCard)}
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
    fontWeight: 'bold',
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
    fontWeight: '500',
    color: Colors.black,
    textAlign: 'center',
  },
});
