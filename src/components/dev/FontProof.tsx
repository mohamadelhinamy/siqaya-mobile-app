import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {AppText} from '../core/AppText';

export const FontProof: React.FC = () => {
  if (!__DEV__) {
    return null;
  }
  return (
    <View style={styles.container} pointerEvents="none">
      <AppText style={styles.label}>سسسسسس</AppText>
      <AppText bold style={[styles.label, styles.bold]}>
        بببببب
      </AppText>
      <View style={styles.row}>
        <Text allowFontFamily style={[styles.raw, styles.jumanRegular]}>
          للللل
        </Text>
        <Text allowFontFamily style={[styles.raw, styles.jumanBold]}>
          قثصبصثبصث
        </Text>
      </View>
      <View style={styles.row}>
        <Text allowFontFamily style={[styles.raw, styles.jumanFamily]}>
          هعصقابمسريب
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  label: {
    color: 'white',
    fontSize: 12,
  },
  raw: {
    color: 'white',
    fontSize: 12,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  jumanRegular: {fontFamily: 'Juman-Regular'},
  jumanBold: {fontFamily: 'Juman-Bold'},
  jumanFamily: {fontFamily: 'Juman'},
  jumanBold700: {fontFamily: 'Juman-Bold', fontWeight: '700'},
  bold: {
    marginTop: 2,
  },
});

export default FontProof;
