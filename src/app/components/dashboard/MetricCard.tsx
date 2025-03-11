import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../Card';
import { Text } from '../Text';
import { Ionicons } from '@expo/vector-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphs;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      opacity: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      marginBottom: theme.spacing.xs,
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    trendValue: {
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <Card>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            variant="small"
            color={theme.colors.text.secondary}
            style={styles.title}
          >
            {title}
          </Text>
          <Text variant="h2" weight="bold">
            {value}
          </Text>
          {trend && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={trend.isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={
                  trend.isPositive
                    ? theme.colors.status.success
                    : theme.colors.status.error
                }
              />
              <Text
                variant="small"
                color={
                  trend.isPositive
                    ? theme.colors.status.success
                    : theme.colors.status.error
                }
                style={styles.trendValue}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}; 