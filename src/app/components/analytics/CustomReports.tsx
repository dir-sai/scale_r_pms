import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { DatePicker } from '../DatePicker';
import { Select } from '../Select';
import { AnalyticsService, ReportData, ReportConfig } from '../../lib/services/AnalyticsService';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface CustomReportsProps {
  tenantId: string;
}

const METRICS = [
  { label: 'Occupancy Rate', value: 'occupancy_rate' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Maintenance Costs', value: 'maintenance_costs' },
  { label: 'Tenant Turnover', value: 'tenant_turnover' },
  { label: 'Outstanding Payments', value: 'outstanding_payments' },
  { label: 'Maintenance Requests', value: 'maintenance_requests' },
];

const GROUP_BY_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
];

const EXPORT_FORMATS = [
  { label: 'PDF', value: 'pdf' },
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'excel' },
];

export function CustomReports({ tenantId }: CustomReportsProps) {
  const theme = useTheme();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ReportConfig>>({
    metrics: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsService.getReportsList(tenantId);
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await AnalyticsService.generateReport(tenantId, formData as ReportConfig);
      setReports(prev => [report, ...prev]);
      setShowForm(false);
      setFormData({
        metrics: [],
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (report: ReportData) => {
    try {
      setExporting(true);
      setError(null);
      const { url } = await AnalyticsService.exportReport(tenantId, report.id, exportFormat);
      // Open URL in browser or download the file
      window.open(url, '_blank');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteReport = async (report: ReportData) => {
    try {
      setLoading(true);
      setError(null);
      await AnalyticsService.deleteReport(tenantId, report.id);
      setReports(prev => prev.filter(r => r.id !== report.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    content: {
      padding: theme.spacing.md,
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    } as ViewStyle,
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold as TextStyle['fontWeight'],
    } as TextStyle,
    form: {
      marginBottom: theme.spacing.xl,
    } as ViewStyle,
    formField: {
      marginBottom: theme.spacing.md,
    } as ViewStyle,
    label: {
      fontSize: theme.typography.sizes.small,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
      marginBottom: theme.spacing.xs,
    } as TextStyle,
    reportCard: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    } as ViewStyle,
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    } as ViewStyle,
    reportTitle: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
    } as TextStyle,
    reportDate: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
    reportActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    } as ViewStyle,
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    } as TextStyle,
  });

  if (loading && !reports.length) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: theme.spacing.md }}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom Reports</Text>
        <Button
          title={showForm ? 'Cancel' : 'New Report'}
          variant={showForm ? 'outline' : 'primary'}
          onPress={() => setShowForm(!showForm)}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {showForm && (
        <Card style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.label}>Report Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter report name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Metrics</Text>
            <Select
              multiple
              value={formData.metrics}
              options={METRICS}
              onChange={value => setFormData(prev => ({ ...prev, metrics: value }))}
              placeholder="Select metrics"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Date Range</Text>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <DatePicker
                value={new Date(formData.startDate || '')}
                onChange={date =>
                  setFormData(prev => ({ ...prev, startDate: date.toISOString() }))
                }
                placeholder="Start date"
              />
              <DatePicker
                value={new Date(formData.endDate || '')}
                onChange={date =>
                  setFormData(prev => ({ ...prev, endDate: date.toISOString() }))
                }
                placeholder="End date"
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Group By</Text>
            <Select
              value={formData.groupBy}
              options={GROUP_BY_OPTIONS}
              onChange={value => setFormData(prev => ({ ...prev, groupBy: value }))}
              placeholder="Select grouping"
            />
          </View>

          <Button
            title="Generate Report"
            onPress={handleGenerateReport}
            disabled={!formData.name || !formData.metrics?.length}
          />
        </Card>
      )}

      {reports.map(report => (
        <Card key={report.id} style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>{report.name}</Text>
            <Text style={styles.reportDate}>
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </Text>
          </View>

          <Text>
            Metrics: {report.config.metrics.map(m => METRICS.find(x => x.value === m)?.label).join(', ')}
          </Text>

          <View style={styles.reportActions}>
            <Select
              value={exportFormat}
              options={EXPORT_FORMATS}
              onChange={value => setExportFormat(value)}
              placeholder="Select format"
            />
            <Button
              title="Export"
              variant="outline"
              size="sm"
              leftIcon="download"
              onPress={() => handleExportReport(report)}
              loading={exporting}
            />
            <Button
              title="Delete"
              variant="outline"
              size="sm"
              leftIcon="trash"
              onPress={() => handleDeleteReport(report)}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
} 