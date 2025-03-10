import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Select } from '../Select';
import { vendorService } from '../../../lib/services/VendorService';
import { Vendor, VendorSpecialty } from '../../../types/vendor';
import { WorkOrder } from '../../../types/maintenance';
import { DatePicker } from '../DatePicker';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../../utils/formatters';

interface VendorDetailsProps {
  vendor: Vendor;
  onEdit?: () => void;
  onClose: () => void;
}

interface ServiceHistoryFilters {
  startDate: string;
  endDate: string;
  status?: string;
}

export function VendorDetails({ vendor, onEdit, onClose }: VendorDetailsProps) {
  const theme = useTheme();
  const [serviceHistory, setServiceHistory] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ServiceHistoryFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const history = await vendorService.getVendorServiceHistory(vendor.id, filters);
      setServiceHistory(history);
    } catch (err: any) {
      setError(err.message || 'Failed to load service history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceHistory();
  }, [filters]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    companyName: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    infoItem: {
      flex: 1,
      minWidth: 200,
    },
    infoLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    infoValue: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
    },
    specialtiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    specialty: {
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    metricCard: {
      flex: 1,
      minWidth: 150,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    metricValue: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    metricLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    contactCard: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    rateCard: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    historyFilters: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    filterItem: {
      flex: 1,
    },
    workOrderCard: {
      marginBottom: theme.spacing.md,
    },
    workOrderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    workOrderTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
    },
    workOrderStatus: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.status.success;
      case 'in_progress':
        return theme.colors.status.info;
      case 'pending':
        return theme.colors.status.warning;
      case 'cancelled':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{vendor.companyName}</Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {onEdit && (
              <Button
                title="Edit"
                onPress={onEdit}
                variant="outline"
                leftIcon="edit"
              />
            )}
            <Button
              title="Close"
              onPress={onClose}
              variant="outline"
              leftIcon="close"
            />
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {vendor.performanceMetrics.averageRating.toFixed(1)}
              </Text>
              <Text style={styles.metricLabel}>Average Rating</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {vendor.performanceMetrics.totalWorkOrders}
              </Text>
              <Text style={styles.metricLabel}>Total Jobs</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {((vendor.performanceMetrics.completedOnTime / vendor.performanceMetrics.totalWorkOrders) * 100).toFixed(0)}%
              </Text>
              <Text style={styles.metricLabel}>On-Time Completion</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {vendor.performanceMetrics.averageResponseTime.toFixed(1)}h
              </Text>
              <Text style={styles.metricLabel}>Avg. Response Time</Text>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Business Type</Text>
              <Text style={styles.infoValue}>
                {vendor.businessType.charAt(0).toUpperCase() + vendor.businessType.slice(1)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </Text>
            </View>
            {vendor.taxId && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tax ID</Text>
                <Text style={styles.infoValue}>{vendor.taxId}</Text>
              </View>
            )}
            {vendor.registrationNumber && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Registration Number</Text>
                <Text style={styles.infoValue}>{vendor.registrationNumber}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {vendor.specialties.map((specialty) => (
              <View key={specialty} style={styles.specialty}>
                <Text>{specialty.charAt(0).toUpperCase() + specialty.slice(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts</Text>
          {vendor.contacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{contact.name}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>{contact.role}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{contact.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formatPhoneNumber(contact.phone)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Service Rates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Rates</Text>
          {vendor.serviceRates.map((rate, index) => (
            <View key={index} style={styles.rateCard}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Specialty</Text>
                  <Text style={styles.infoValue}>
                    {rate.specialty.charAt(0).toUpperCase() + rate.specialty.slice(1)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rate</Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(rate.rate, rate.currency)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rate Type</Text>
                  <Text style={styles.infoValue}>
                    {rate.rateType.charAt(0).toUpperCase() + rate.rateType.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Service History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service History</Text>
          <View style={styles.historyFilters}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
              style={styles.filterItem}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              style={styles.filterItem}
            />
            <Select
              label="Status"
              value={filters.status || ''}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
              items={[
                { label: 'All Statuses', value: '' },
                { label: 'Completed', value: 'completed' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Pending', value: 'pending' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
              style={styles.filterItem}
            />
          </View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : loading ? (
            <Text>Loading service history...</Text>
          ) : serviceHistory.length === 0 ? (
            <Text>No service history found for the selected period.</Text>
          ) : (
            serviceHistory.map((workOrder) => (
              <Card key={workOrder.id} style={styles.workOrderCard}>
                <View style={styles.workOrderHeader}>
                  <Text style={styles.workOrderTitle}>
                    Work Order #{workOrder.id}
                  </Text>
                  <View
                    style={[
                      styles.workOrderStatus,
                      { backgroundColor: getStatusColor(workOrder.status) },
                    ]}
                  >
                    <Text style={{ color: theme.colors.text.light }}>
                      {workOrder.status.charAt(0).toUpperCase() + workOrder.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Start Date</Text>
                    <Text style={styles.infoValue}>
                      {workOrder.startDate ? formatDate(workOrder.startDate) : 'Not scheduled'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Due Date</Text>
                    <Text style={styles.infoValue}>
                      {workOrder.dueDate ? formatDate(workOrder.dueDate) : 'Not set'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Property ID</Text>
                    <Text style={styles.infoValue}>{workOrder.propertyId}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Unit ID</Text>
                    <Text style={styles.infoValue}>{workOrder.unitId}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Estimated Cost</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(workOrder.estimatedCost || 0, 'GHS')}
                    </Text>
                  </View>
                  {workOrder.actualCost && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Actual Cost</Text>
                      <Text style={styles.infoValue}>
                        {formatCurrency(workOrder.actualCost, 'GHS')}
                      </Text>
                    </View>
                  )}
                  {workOrder.laborHours && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Labor Hours</Text>
                      <Text style={styles.infoValue}>{workOrder.laborHours}</Text>
                    </View>
                  )}
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Insurance Information */}
        {vendor.insuranceInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Provider</Text>
                <Text style={styles.infoValue}>{vendor.insuranceInfo.provider}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Policy Number</Text>
                <Text style={styles.infoValue}>{vendor.insuranceInfo.policyNumber}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Expiry Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(vendor.insuranceInfo.expiryDate)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Coverage Amount</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(vendor.insuranceInfo.coverageAmount, 'GHS')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Information */}
        {vendor.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text>{vendor.notes}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 