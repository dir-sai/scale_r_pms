import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { Card } from '../Card';
import { vendorService } from '../../../lib/services/VendorService';
import { Vendor, VendorSpecialty, VendorStatus } from '../../../types/vendor';
import { Ionicons } from '@expo/vector-icons';

interface VendorDirectoryProps {
  onSelectVendor?: (vendor: Vendor) => void;
  onAddVendor?: () => void;
}

interface VendorCardProps {
  vendor: Vendor;
  onPress: (vendor: Vendor) => void;
}

const VendorCard = ({ vendor, onPress }: VendorCardProps) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    companyName: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
    },
    status: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      fontSize: theme.typography.sizes.small,
      fontWeight: theme.typography.weights.medium,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    infoLabel: {
      color: theme.colors.text.secondary,
      marginRight: theme.spacing.sm,
      fontSize: theme.typography.sizes.small,
    },
    infoValue: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.sizes.body,
    },
    specialties: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    specialty: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    metrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.text.secondary,
    },
    metric: {
      alignItems: 'center',
    },
    metricValue: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
    },
    metricLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
  });

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'inactive':
        return theme.colors.status.warning;
      case 'blacklisted':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(vendor)}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{vendor.companyName}</Text>
          <View style={[styles.status, { backgroundColor: getStatusColor(vendor.status) }]}>
            <Text style={styles.statusText}>
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact:</Text>
          <Text style={styles.infoValue}>
            {vendor.contacts[0]?.name} • {vendor.contacts[0]?.phone}
          </Text>
        </View>

        <View style={styles.specialties}>
          {vendor.specialties.map((specialty) => (
            <View key={specialty} style={styles.specialty}>
              <Text>{specialty.charAt(0).toUpperCase() + specialty.slice(1)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{vendor.performanceMetrics.averageRating.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>Rating</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{vendor.performanceMetrics.totalWorkOrders}</Text>
            <Text style={styles.metricLabel}>Jobs</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {((vendor.performanceMetrics.completedOnTime / vendor.performanceMetrics.totalWorkOrders) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.metricLabel}>On Time</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export function VendorDirectory({ onSelectVendor, onAddVendor }: VendorDirectoryProps) {
  const theme = useTheme();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const specialtyOptions = [
    { label: 'All Specialties', value: '' },
    { label: 'Plumbing', value: 'plumbing' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'HVAC', value: 'hvac' },
    { label: 'Carpentry', value: 'carpentry' },
    { label: 'Painting', value: 'painting' },
    { label: 'Landscaping', value: 'landscaping' },
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Security', value: 'security' },
    { label: 'General', value: 'general' },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Blacklisted', value: 'blacklisted' },
  ];

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError('');
      const filters: {
        search?: string;
        specialty?: VendorSpecialty;
        status?: VendorStatus;
      } = {};

      if (searchQuery) filters.search = searchQuery;
      if (selectedSpecialty) filters.specialty = selectedSpecialty as VendorSpecialty;
      if (selectedStatus) filters.status = selectedStatus as VendorStatus;

      const data = await vendorService.getVendors(filters);
      setVendors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [searchQuery, selectedSpecialty, selectedStatus]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
    },
    filters: {
      marginBottom: theme.spacing.lg,
    },
    filterRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendor Directory</Text>
        {onAddVendor && (
          <Button
            title="Add Vendor"
            onPress={onAddVendor}
            variant="primary"
            leftIcon="add"
          />
        )}
      </View>

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            style={styles.searchInput}
          />
        </View>
        <View style={styles.filterRow}>
          <Select
            label="Specialty"
            value={selectedSpecialty}
            onValueChange={setSelectedSpecialty}
            items={specialtyOptions}
            style={{ flex: 1 }}
          />
          <Select
            label="Status"
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            items={statusOptions}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : loading ? (
        <Text>Loading vendors...</Text>
      ) : vendors.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="business" size={48} color={theme.colors.text.secondary} />
          <Text style={styles.emptyStateText}>
            No vendors found. Try adjusting your filters or add a new vendor.
          </Text>
        </View>
      ) : (
        <ScrollView>
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onPress={onSelectVendor || (() => {})}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
} 