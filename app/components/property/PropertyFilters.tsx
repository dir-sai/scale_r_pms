import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Input } from '../Input';
import { Button } from '../Button';
import { Text } from '../Text';
import { PropertyFilters as Filters, PropertyType } from '../../../types/property';
import { Card } from '../Card';

interface PropertyFiltersProps {
  onApplyFilters: (filters: Filters) => void;
  initialFilters?: Filters;
}

const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'condo',
  'commercial',
  'office',
];

export function PropertyFilters({ onApplyFilters, initialFilters }: PropertyFiltersProps) {
  const theme = useTheme();
  const [filters, setFilters] = useState<Filters>(initialFilters || {});

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    card: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    typeButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    typeButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    typeButtonText: {
      color: theme.colors.text.secondary,
    },
    typeButtonTextSelected: {
      color: theme.colors.text.light,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  });

  const handleTypePress = (type: PropertyType) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type?.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...(prev.type || []), type],
    }));
  };

  const handleClear = () => {
    setFilters({});
    onApplyFilters({});
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <Card style={[styles.container, styles.card]}>
      <ScrollView>
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.typeContainer}>
            {PROPERTY_TYPES.map(type => (
              <Button
                key={type}
                variant="outline"
                style={[
                  styles.typeButton,
                  filters.type?.includes(type) && styles.typeButtonSelected,
                ]}
                onPress={() => handleTypePress(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filters.type?.includes(type) && styles.typeButtonTextSelected,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Min Price"
                value={filters.minPrice?.toString()}
                onChangeText={(value) =>
                  setFilters(prev => ({
                    ...prev,
                    minPrice: value ? parseInt(value) : undefined,
                  }))
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Max Price"
                value={filters.maxPrice?.toString()}
                onChangeText={(value) =>
                  setFilters(prev => ({
                    ...prev,
                    maxPrice: value ? parseInt(value) : undefined,
                  }))
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Location</Text>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="City"
                value={filters.city}
                onChangeText={(value) =>
                  setFilters(prev => ({ ...prev, city: value }))
                }
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="State"
                value={filters.state}
                onChangeText={(value) =>
                  setFilters(prev => ({ ...prev, state: value }))
                }
              />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={handleClear}
          >
            Clear
          </Button>
          <Button
            onPress={handleApply}
          >
            Apply Filters
          </Button>
        </View>
      </ScrollView>
    </Card>
  );
} 