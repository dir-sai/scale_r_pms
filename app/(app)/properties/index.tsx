import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useProperty } from '../../../app/context/PropertyContext';
import { PropertyCard } from '../../../app/components/property/PropertyCard';
import { PropertyFilters } from '../../../app/components/property/PropertyFilters';
import { Container } from '../../../app/components/Container';
import { Button } from '../../../app/components/Button';
import { Text } from '../../../app/components/Text';
import { useTheme } from '../../../app/hooks/useTheme';
import { PropertyFilters as Filters } from '../../../types/property';
import { Ionicons } from '@expo/vector-icons';

export default function PropertiesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    properties,
    isLoading,
    error,
    total,
    page,
    pageSize,
    filters,
    loadProperties,
    setFilters,
  } = useProperty();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
    },
    title: {
      flex: 1,
    },
    filterButton: {
      marginLeft: theme.spacing.md,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    error: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.text.light,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
  });

  const handleRefresh = () => {
    loadProperties(1);
  };

  const handleLoadMore = () => {
    if (properties.length < total) {
      loadProperties(page + 1);
    }
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setShowFilters(false);
    loadProperties(1, newFilters);
  };

  const handleAddProperty = () => {
    router.push('/properties/new');
  };

  const renderHeader = () => (
    <>
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {showFilters && (
        <PropertyFilters
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
      )}
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text
        variant="h3"
        weight="bold"
        style={styles.emptyStateText}
      >
        No Properties Found
      </Text>
      <Text
        variant="body"
        color={theme.colors.text.secondary}
        style={styles.emptyStateText}
      >
        {Object.keys(filters).length > 0
          ? 'Try adjusting your filters'
          : 'Add your first property to get started'}
      </Text>
      {Object.keys(filters).length === 0 && (
        <Button
          title="Add Property"
          onPress={handleAddProperty}
          icon="add-circle-outline"
        />
      )}
    </View>
  );

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text variant="h2" weight="bold">Properties</Text>
          <Text variant="small" color={theme.colors.text.secondary}>
            {total} {total === 1 ? 'property' : 'properties'} found
          </Text>
        </View>
        <Button
          variant="outline"
          icon="filter"
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        />
        <Button
          icon="add-circle-outline"
          onPress={handleAddProperty}
        />
      </View>

      <View style={styles.content}>
        <FlatList
          data={properties}
          renderItem={({ item }) => <PropertyCard property={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      </View>
    </Container>
  );
} 