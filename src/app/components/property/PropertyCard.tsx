import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Property } from '../../../types/property';
import { Text } from '../Text';
import { Card } from '../Card';
import { useTheme } from '../../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const primaryPhoto = property.photos.find(photo => photo.isPrimary)?.url || 
    property.photos[0]?.url;

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    image: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: theme.borderRadius.md,
      borderTopRightRadius: theme.borderRadius.md,
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    type: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    address: {
      marginBottom: theme.spacing.sm,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.secondary,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIcon: {
      marginRight: theme.spacing.xs,
    },
    statusBadge: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
  });

  const handlePress = () => {
    router.push(`/properties/${property.id}`);
  };

  const getVacancyText = () => {
    const vacant = property.totalUnits - property.units?.filter(u => u.status === 'occupied').length;
    return `${vacant}/${property.totalUnits} Available`;
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.container}>
        <View>
          <Image
            source={{ uri: primaryPhoto }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.statusBadge}>
            <Text variant="small" color={theme.colors.text.light}>
              {getVacancyText()}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.title}>
              <Text variant="h3" weight="bold" numberOfLines={1}>
                {property.name}
              </Text>
            </View>
            <View style={styles.type}>
              <Text variant="small" color={theme.colors.text.light}>
                {property.type}
              </Text>
            </View>
          </View>

          <View style={styles.address}>
            <Text variant="body" color={theme.colors.text.secondary} numberOfLines={2}>
              {`${property.address.street}, ${property.address.city}, ${property.address.state}`}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons
                name="business"
                size={16}
                color={theme.colors.text.secondary}
                style={styles.statIcon}
              />
              <Text variant="small" color={theme.colors.text.secondary}>
                {property.totalUnits} Units
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons
                name="calendar"
                size={16}
                color={theme.colors.text.secondary}
                style={styles.statIcon}
              />
              <Text variant="small" color={theme.colors.text.secondary}>
                Added {new Date(property.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
} 