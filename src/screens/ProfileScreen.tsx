import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Header} from '../components';
import IconLabelButton from '../components/IconLabelButton';
import ShoppingCartIcon from '../assets/icons/outlined/shopping-cart.svg';
import HeartIcon from '../assets/icons/outlined/heart.svg';
import ProfileIcon from '../assets/icons/outlined/profile.svg';
import VideoPlayIcon from '../assets/icons/outlined/video-play.svg';
import InfoCircleIcon from '../assets/icons/outlined/info-circle.svg';
import HeadphoneIcon from '../assets/icons/outlined/headphone.svg';
import {useNavigation} from '@react-navigation/native';
import {useLanguage, useAuth} from '../context';
import {apiService} from '../services/api';
import {Colors} from '../constants/Colors';

export const ProfileScreen: React.FC = () => {
  const {t} = useLanguage();
  const {user, token, updateUser} = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const goToCart = () => {
    navigation.navigate('CartScreen' as never);
  };

  const goToDonations = () => {
    navigation.navigate('DonationsScreen' as never);
  };

  const goToProjects = () => {
    navigation.navigate('MyProductsScreen' as never);
  };

  // personal data route currently unused — keep commented for future
  // const goToPersonalData = () => {
  //   navigation.navigate('PersonalDataScreen' as never);
  // };

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      if (!token) {
        return;
      }
      try {
        setLoading(true);
        const resp = await apiService.getProfile(token);
        if (mounted && resp && resp.success && resp.data) {
          // Only update auth context if the response contains expected fields
          const candidate = resp.data as any;
          if (
            candidate &&
            (candidate.name || candidate.email || candidate.mobile)
          ) {
            await updateUser(candidate);
          } else {
            console.warn(
              'Profile fetch returned unexpected payload, skipping update',
              resp,
            );
          }
        }
      } catch (err) {
        console.warn('Failed to refresh profile in ProfileScreen', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [token, updateUser]);

  const goToMediaCenter = () => {
    navigation.navigate('MediaCenterScreen' as never);
  };

  const goToAboutApp = () => {
    navigation.navigate('AboutAppScreen' as never);
  };

  const goToSupport = () => {
    navigation.navigate('SupportScreen' as never);
  };

  return (
    <View style={[styles.container, styles.lightContainer]}>
      <Header
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        name={user?.name}
        email={user?.email}
        imageUri={user?.avatar}
        onSettingsPress={() => navigation.navigate('SettingsScreen' as never)}
        onProfilePress={() =>
          navigation.navigate('ProfileDetailsScreen' as never)
        }
      />

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      <View style={styles.content}>
        <IconLabelButton
          icon={<HeartIcon width={24} height={24} />}
          label={t('profile.links.myDonations')}
          onPress={goToDonations}
        />
        <View style={styles.separator} />
        <IconLabelButton
          icon={<HeartIcon width={24} height={24} />}
          label={t('profile.links.myProjects')}
          onPress={goToProjects}
        />
        <View style={styles.separator} />
        <IconLabelButton
          icon={<ShoppingCartIcon width={24} height={24} />}
          label={t('navigation.cart')}
          onPress={goToCart}
        />
        <View style={styles.separator} />
        {/* <IconLabelButton
          icon={<ProfileIcon width={24} height={24} />}
          label={t('profile.links.personalData')}
          onPress={goToPersonalData}
        />
        <View style={styles.separator} /> */}
        <IconLabelButton
          icon={<VideoPlayIcon width={24} height={24} />}
          label={t('profile.links.mediaCenter')}
          onPress={goToMediaCenter}
        />
        <View style={styles.separator} />
        <IconLabelButton
          icon={<InfoCircleIcon width={24} height={24} />}
          label={t('profile.links.aboutApp')}
          onPress={goToAboutApp}
        />
        <View style={styles.separator} />
        <IconLabelButton
          icon={<HeadphoneIcon width={24} height={24} />}
          label={t('profile.links.support')}
          onPress={goToSupport}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 140, // Add extra padding at bottom to ensure buttons are visible above floating tab bar (70px height + 20px bottom + 50px extra)
  },
  userInfo: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16, // Add margin bottom to separate from language selector
  },
  button: {
    marginVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 8,
  },
  loaderContainer: {
    padding: 12,
  },
});
