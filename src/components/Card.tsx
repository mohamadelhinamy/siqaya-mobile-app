import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({children, title, style}) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
});
