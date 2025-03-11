import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: () => void;
  rightIcon?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  rightAction,
  rightIcon,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
      ...theme.shadows.small,
    },
    title: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    button: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      width: 40,
    },
  });

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightAction && rightIcon ? (
        <TouchableOpacity style={styles.button} onPress={rightAction}>
          <Ionicons
            name={rightIcon as any}
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}; 