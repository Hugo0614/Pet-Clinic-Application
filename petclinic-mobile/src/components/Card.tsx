import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../utils/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
    marginBottom: spacing.md,
  },
});

export default Card;
