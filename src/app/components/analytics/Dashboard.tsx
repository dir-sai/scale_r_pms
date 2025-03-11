import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ViewStyle, TextStyle, ActivityIndicator, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { AnalyticsService, DashboardData } from '../../lib/services/AnalyticsService';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { formatDistanceToNow, format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface DashboardProps {
  tenantId: string;
}

export function Dashboard({ tenantId }: DashboardProps) {
  const theme = useTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await AnalyticsService.getDashboardData(tenantId);
      setData(dashboardData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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
    lastUpdated: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
    section: {
      marginBottom: theme.spacing.xl,
    } as ViewStyle,
    sectionHeader: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.semibold as TextStyle['fontWeight'],
      marginBottom: theme.spacing.md,
    } as TextStyle,
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    } as ViewStyle,
    card: {
      flex: 1,
      padding: theme.spacing.md,
    } as ViewStyle,
    cardTitle: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    } as TextStyle,
    cardValue: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold as TextStyle['fontWeight'],
    } as TextStyle,
    chart: {
      marginVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    } as ViewStyle,
    error: {
      color: theme.colors.status.error,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    } as TextStyle,
  });

  if (loading && !data) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: theme.spacing.md }}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.status.error} />
        <Text style={styles.error}>{error}</Text>
        <Button
          title="Try Again"
          onPress={loadDashboardData}
          variant="outline"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    );
  }

  if (!data) return null;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background.primary,
    backgroundGradientTo: theme.colors.background.primary,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.lastUpdated}>
          Updated {formatDistanceToNow(new Date(data.lastUpdated), { addSuffix: true })}
        </Text>
      </View>

      {/* Occupancy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Occupancy</Text>
        <View style={styles.row}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Occupancy Rate</Text>
            <Text style={styles.cardValue}>{data.occupancy.rate}%</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Vacant Units</Text>
            <Text style={styles.cardValue}>{data.occupancy.vacantUnits}</Text>
          </Card>
        </View>
        <Card style={styles.chart}>
          <LineChart
            data={{
              labels: data.occupancy.trend.map(t => format(new Date(t.date), 'MMM d')),
              datasets: [{ data: data.occupancy.trend.map(t => t.rate) }],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </Card>
      </View>

      {/* Revenue Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Revenue</Text>
        <View style={styles.row}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Total Revenue</Text>
            <Text style={styles.cardValue}>${data.revenue.total.toLocaleString()}</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Pending</Text>
            <Text style={styles.cardValue}>${data.revenue.pending.toLocaleString()}</Text>
          </Card>
        </View>
        <Card style={styles.chart}>
          <BarChart
            data={{
              labels: data.revenue.trend.map(t => format(new Date(t.date), 'MMM d')),
              datasets: [{ data: data.revenue.trend.map(t => t.amount) }],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </Card>
      </View>

      {/* Maintenance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Maintenance</Text>
        <View style={styles.row}>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Open Requests</Text>
            <Text style={styles.cardValue}>{data.maintenance.openRequests}</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Avg. Resolution Time</Text>
            <Text style={styles.cardValue}>
              {Math.round(data.maintenance.avgResolutionTime)}h
            </Text>
          </Card>
        </View>
        <Card style={styles.chart}>
          <PieChart
            data={data.maintenance.costByCategory.map(category => ({
              name: category.category,
              population: category.cost,
              color: getRandomColor(),
              legendFontColor: theme.colors.text.primary,
            }))}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const chartWidth = Dimensions.get('window').width - 48; // Accounting for padding

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
} 