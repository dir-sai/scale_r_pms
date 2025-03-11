import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Dashboard } from './Dashboard';
import { CustomReports } from './CustomReports';

interface AnalyticsNavigationProps {
  tenantId: string;
}

type Tab = 'dashboard' | 'reports';

export function AnalyticsNavigation({ tenantId }: AnalyticsNavigationProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    tabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    } as ViewStyle,
    content: {
      flex: 1,
    } as ViewStyle,
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Button
          title="Dashboard"
          variant={activeTab === 'dashboard' ? 'primary' : 'outline'}
          onPress={() => setActiveTab('dashboard')}
        />
        <Button
          title="Custom Reports"
          variant={activeTab === 'reports' ? 'primary' : 'outline'}
          onPress={() => setActiveTab('reports')}
        />
      </View>

      <View style={styles.content}>
        {activeTab === 'dashboard' ? (
          <Dashboard tenantId={tenantId} />
        ) : (
          <CustomReports tenantId={tenantId} />
        )}
      </View>
    </View>
  );
} 