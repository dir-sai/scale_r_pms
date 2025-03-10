import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useTenant } from '../../../app/context/TenantContext';
import { TenantCard } from '../../../app/components/tenant/TenantCard';
import { Container } from '../../../app/components/Container';
import { Button } from '../../../app/components/Button';
import { Text } from '../../../app/components/Text';
import { Input } from '../../../app/components/Input';
import { useTheme } from '../../../app/hooks/useTheme';
import { TenantStatus } from '../../../types/tenant';

const STATUS_OPTIONS: TenantStatus[] = ['active', 'inactive', 'pending', 'blacklisted'];

export default function TenantsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    tenants,
    isLoading,
    error,
    total,
    page,
    pageSize,
    filters,
    loadTenants,
    setFilters,
  } = useTenant();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.md,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      flex: 1,
    },
    filterButton: {
      marginLeft: theme.spacing.md,
    },
    searchBar: {
      marginBottom: showFilters ? theme.spacing.md : 0,
    },
    filters: {
      marginTop: theme.spacing.md,
    },
    filterTitle: {
      marginBottom: theme.spacing.sm,
    },
    statusFilters: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
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
    selectedFilterButton: {
      backgroundColor: theme.colors.primary,
    } as ViewStyle,
    selectedFilterText: {
      color: theme.colors.text.light,
    },
  });

  const handleRefresh = () => {
    loadTenants(1);
  };

  const handleLoadMore = () => {
    if (tenants.length < total) {
      loadTenants(page + 1);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery });
    loadTenants(1, { ...filters, search: searchQuery });
  };

  const handleStatusFilter = (status: TenantStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    const newFilters = {
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    };
    
    setFilters(newFilters);
    loadTenants(1, newFilters);
  };

  const handleAddTenant = () => {
    router.push('/tenants/new');
  };

  const renderHeader = () => (
    <>
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {showFilters && (
        <View style={styles.filters}>
          <Text variant="h3" weight="bold" style={styles.filterTitle}>
            Filter by Status
          </Text>
          <View style={styles.statusFilters}>
            {STATUS_OPTIONS.map(status => (
              <Button
                key={status}
                variant="outline"
                title={status.charAt(0).toUpperCase() + status.slice(1)}
                onPress={() => handleStatusFilter(status)}
                style={
                  filters.status?.includes(status)
                    ? styles.selectedFilterButton
                    : undefined
                }
                textStyle={
                  filters.status?.includes(status)
                    ? styles.selectedFilterText
                    : undefined
                }
              />
            ))}
          </View>
        </View>
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
        No Tenants Found
      </Text>
      <Text
        variant="body"
        color={theme.colors.text.secondary}
        style={styles.emptyStateText}
      >
        {Object.keys(filters).length > 0
          ? 'Try adjusting your filters'
          : 'Add your first tenant to get started'}
      </Text>
      {Object.keys(filters).length === 0 && (
        <Button
          title="Add Tenant"
          onPress={handleAddTenant}
          icon="add-circle-outline"
        />
      )}
    </View>
  );

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.title}>
            <Text variant="h2" weight="bold">Tenants</Text>
            <Text variant="small" color={theme.colors.text.secondary}>
              {total} {total === 1 ? 'tenant' : 'tenants'} found
            </Text>
          </View>
          <Button
            title=""
            variant="outline"
            icon="filter"
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
          />
          <Button
            title=""
            icon="add-circle-outline"
            onPress={handleAddTenant}
          />
        </View>

        <Input
          placeholder="Search tenants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          leftIcon="search"
          style={styles.searchBar}
        />

        {renderHeader()}
      </View>

      <View style={styles.content}>
        <FlatList
          data={tenants}
          renderItem={({ item }) => <TenantCard tenant={item} />}
          keyExtractor={(item) => item.id}
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