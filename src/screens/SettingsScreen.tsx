import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {BackHeader} from '../components';
import IconLabelButton from '../components/IconLabelButton';
import FlagIcon from '../assets/icons/outlined/flag.svg';
import StickyNoteIcon from '../assets/icons/outlined/stickynote.svg';
import NoteIcon from '../assets/icons/outlined/note.svg';
import TaskSquareIcon from '../assets/icons/outlined/task-square.svg';
import LogoutIcon from '../assets/icons/outlined/logout.svg';
import {useLanguage, useAuth} from '../context';
import {LanguageSelector} from '../components/LanguageSelector';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../constants';

export const SettingsScreen: React.FC = () => {
  const {t, currentLanguage} = useLanguage();
  const navigation = useNavigation();
  const {logout} = useAuth();

  const goToLanguage = () => {
    setLanguageModalVisible(true);
  };

  const [languageModalVisible, setLanguageModalVisible] = React.useState(false);

  const selectedLanguageLabel =
    currentLanguage === 'ar' ? t('language.arabic') : t('language.english');

  const goToPrivacy = () => {
    navigation.navigate('PrivacyPolicyScreen' as never);
  };

  const goToTerms = () => {
    navigation.navigate('TermsScreen' as never);
  };

  const goToFaqs = () => {
    navigation.navigate('FaqsScreen' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout.title'),
      t('auth.logout.message'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('auth.logout.confirm'),
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.warn('Logout failed', err);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t('settings.title')} backgroundColor={Colors.white} />

      <Modal
        isVisible={languageModalVisible}
        onBackdropPress={() => setLanguageModalVisible(false)}
        onBackButtonPress={() => setLanguageModalVisible(false)}
        onSwipeComplete={() => setLanguageModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        useNativeDriverForBackdrop>
        <View style={styles.modalContent}>
          <View style={styles.swipeIndicator} />
          <LanguageSelector />
        </View>
      </Modal>

      <View style={styles.content}>
        <IconLabelButton
          icon={<FlagIcon width={24} height={24} />}
          label={t('settings.language')}
          secondaryLabel={selectedLanguageLabel}
          onPress={goToLanguage}
        />
        <View style={styles.separator} />

        <IconLabelButton
          icon={<StickyNoteIcon width={24} height={24} />}
          label={t('settings.privacyPolicy')}
          onPress={goToPrivacy}
        />
        <View style={styles.separator} />

        <IconLabelButton
          icon={<NoteIcon width={24} height={24} />}
          label={t('settings.terms')}
          onPress={goToTerms}
        />
        <View style={styles.separator} />

        <IconLabelButton
          icon={<TaskSquareIcon width={24} height={24} />}
          label={t('settings.faqs')}
          onPress={goToFaqs}
        />
        <View style={styles.separator} />

        <IconLabelButton
          icon={<LogoutIcon width={24} height={24} />}
          label={t('settings.logout')}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 140,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 8,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
});

export default SettingsScreen;
