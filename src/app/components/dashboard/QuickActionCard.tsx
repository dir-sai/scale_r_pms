import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../Card';
import { Text } from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  route: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  route,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      opacity: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      marginBottom: theme.spacing.xs,
    },
  });

  return (
    <Card
      onPress={() => router.push(route)}
      style={{ flex: 1 }}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={theme.colors.primary}
        style={styles.iconContainer}
      />
      <Text
        variant="h3"
        weight="semibold"
        style={styles.title}
      >
        {title}
      </Text>
      <Text
        variant="small"
        color={theme.colors.text.secondary}
      >
        {description}
      </Text>
    </Card>
  );
}; 