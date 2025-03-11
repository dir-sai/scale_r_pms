import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { Button } from '../Button';
import { financeService } from '../../../lib/services/FinanceService';
import { FinancialReport, ReportType, DateRange } from '../../../types/finance';

interface SelectItem {
  label: string;
  value: string;
}

interface FinancialReportViewerProps {
  propertyId?: string;
  onExport?: (report: FinancialReport) => void;
}

export function FinancialReportViewer({
  propertyId,
  onExport,
}: FinancialReportViewerProps) {
  const theme = useTheme();
  const [reportType, setReportType] = useState<ReportType>('profit_loss');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const reportTypes: SelectItem[] = [
    { label: 'Profit & Loss', value: 'profit_loss' },
    { label: 'Balance Sheet', value: 'balance_sheet' },
    { label: 'Cash Flow', value: 'cash_flow' },
    { label: 'Accounts Receivable', value: 'accounts_receivable' },
    { label: 'Accounts Payable', value: 'accounts_payable' },
  ];

  const dateRanges: SelectItem[] = [
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  const handleReportTypeChange = (value: string) => {
    setReportType(value as ReportType);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value as DateRange);
    
    const now = new Date();
    let start = new Date();
    let end = now;

    switch (value) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        // Keep current dates for custom range
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const loadReport = async () => {
    try {
      setError('');
      setIsLoading(true);

      const report = await financeService.getFinancialReport({
        type: reportType,
        startDate,
        endDate,
        propertyId,
      });

      setReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, startDate, endDate, propertyId]);

  const handleExport = () => {
    if (report && onExport) {
      onExport(report);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(amount);
  };

  const renderReportContent = () => {
    if (!report) return null;

    switch (reportType) {
      case 'profit_loss':
        return (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Income</Text>
              {report.income.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.category}</Text>
                  <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Income</Text>
                <Text style={styles.totalAmount}>{formatCurrency(report.totalIncome)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expenses</Text>
              {report.expenses.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{item.category}</Text>
                  <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Expenses</Text>
                <Text style={styles.totalAmount}>{formatCurrency(report.totalExpenses)}</Text>
              </View>
            </View>

            <View style={styles.netProfit}>
              <Text style={styles.netProfitLabel}>Net Profit/Loss</Text>
              <Text style={[
                styles.netProfitAmount,
                { color: report.netProfit >= 0 ? theme.colors.status.success : theme.colors.status.error }
              ]}>
                {formatCurrency(report.netProfit)}
              </Text>
            </View>
          </View>
        );

      // Add other report type renderers as needed
      default:
        return (
          <Text style={styles.error}>
            Report type not implemented: {reportType}
          </Text>
        );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    filters: {
      marginBottom: theme.spacing.lg,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    section: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    label: {
      flex: 1,
    },
    amount: {
      fontFamily: 'monospace',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.dark,
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    totalLabel: {
      fontWeight: theme.typography.weights.bold,
    },
    totalAmount: {
      fontWeight: theme.typography.weights.bold,
      fontFamily: 'monospace',
    },
    netProfit: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.lg,
    },
    netProfitLabel: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
    },
    netProfitAmount: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      fontFamily: 'monospace',
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.filters}>
          <View style={styles.row}>
            <Select
              label="Report Type"
              value={reportType}
              onValueChange={handleReportTypeChange}
              items={reportTypes}
              style={{ flex: 1 }}
            />
            <Select
              label="Date Range"
              value={dateRange}
              onValueChange={handleDateRangeChange}
              items={dateRanges}
              style={{ flex: 1 }}
            />
          </View>

          {dateRange === 'custom' && (
            <View style={styles.row}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                style={{ flex: 1 }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>

        {isLoading ? (
          <Text>Loading report...</Text>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            {renderReportContent()}
            {report && onExport && (
              <Button
                title="Export Report"
                onPress={handleExport}
                variant="outline"
                leftIcon="download"
                style={{ marginTop: theme.spacing.lg }}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
} 