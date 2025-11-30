import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import {Typography} from './Typography';
import SettingIcon from '../assets/icons/outlined/setting-2.svg';
import ArrowLeftIcon from '../assets/icons/outlined/arrow-left.svg';
import {Colors} from '../constants/Colors';

interface HeaderProps {
  title: string;
  subtitle?: string; // used as email when rendering profile row
  // profile props (optional)
  name?: string;
  email?: string;
  imageUri?: string;
  initials?: string; // fallback when imageUri unavailable
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  name,
  email,
  imageUri,
  initials,
  onSettingsPress,
  onProfilePress,
  rightComponent,
}) => {
  const renderAvatar = () => {
    if (imageUri) {
      return <Image source={{uri: imageUri}} style={styles.avatar} />;
    }

    const label =
      initials ||
      (name
        ? name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
        : 'U');
    return (
      <View style={styles.avatarPlaceholder}>
        <Typography
          variant="h5"
          text={label}
          color="turquoise"
          style={styles.avatarText}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        {/* Top row: title and settings icon */}
        <View style={styles.topRow}>
          <Typography
            variant="h4"
            text={title}
            color="textPrimary"
            style={styles.topTitle}
            numberOfLines={1}
          />

          <View style={styles.topRight}>
            {rightComponent ? (
              rightComponent
            ) : (
              <TouchableOpacity
                onPress={onSettingsPress}
                hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
                <SettingIcon width={28} height={28} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom row: avatar, name/email, back arrow */}
        <TouchableOpacity
          onPress={onProfilePress}
          hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
          <View style={styles.bottomRow}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.avatarCol}>{renderAvatar()}</View>

              <View style={styles.nameCol}>
                <Typography
                  variant="h5"
                  text={name || title}
                  color="textPrimary"
                  style={styles.nameText}
                  numberOfLines={1}
                />
                <Typography
                  variant="subtitle2"
                  text={email || subtitle || ''}
                  color="textSecondary"
                  style={styles.emailText}
                  numberOfLines={1}
                />
              </View>
            </View>

            <View style={styles.arrowCol}>
              <ArrowLeftIcon width={28} height={28} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  topLeft: {
    width: 36,
    alignItems: 'flex-start',
  },
  topTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
    color: Colors.black,
    fontWeight: '600',
  },
  topRight: {
    width: 36,
    alignItems: 'flex-end',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  avatarCol: {},
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6EDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#1C7BD3',
  },
  nameCol: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 20,
    color: '#1C1C1E',
  },
  emailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  arrowCol: {
    marginLeft: 12,
  },
});
