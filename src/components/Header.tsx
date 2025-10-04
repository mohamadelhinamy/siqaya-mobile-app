import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  leftComponent,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>{leftComponent}</View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightSection}>{rightComponent}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F2F2F7',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});
