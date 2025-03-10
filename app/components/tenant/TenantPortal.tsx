import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { NotificationsScreen } from '../payment/NotificationsScreen';
import { NotificationPreferences } from '../notification/NotificationPreferences';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { Ionicons } from '@expo/vector-icons';
import { LeaseAgreement, Payment, CommunicationLog, Document, Tenant } from '../../../types/tenant';
import { PaymentNotification } from '../../../types/payment';
import { DocumentUpload } from '../document/DocumentUpload';
import * as DocumentPicker from 'expo-document-picker';

interface TenantPortalProps {
  tenantId: string;
}

type TabType = 'profile' | 'documents' | 'messages' | 'payments' | 'notifications' | 'preferences';

export function TenantPortal({ tenantId }: TenantPortalProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { selectedTenant, getTenant, sendReminder, uploadDocument } = useTenant();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadTenantData();
  }, [tenantId]);

  const loadTenantData = async () => {
    try {
      setLoading(true);
      await getTenant(tenantId);
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
    },
    header: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    tabs: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    tab: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.light,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    column: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    value: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    messageItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    uploadButton: {
      marginTop: theme.spacing.md,
    },
  });

  const renderTabs = () => (
    <View style={styles.tabs}>
      <Button
        title="Profile"
        variant={activeTab === 'profile' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('profile')}
        leftIcon="person"
      />
      <Button
        title="Documents"
        variant={activeTab === 'documents' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('documents')}
        leftIcon="document"
      />
      <Button
        title="Messages"
        variant={activeTab === 'messages' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('messages')}
        leftIcon="mail"
      />
      <Button
        title="Payments"
        variant={activeTab === 'payments' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('payments')}
        leftIcon="card"
      />
      <Button
        title="Notifications"
        variant={activeTab === 'notifications' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('notifications')}
        leftIcon="notifications"
      />
      <Button
        title="Preferences"
        variant={activeTab === 'preferences' ? 'primary' : 'outline'}
        onPress={() => setActiveTab('preferences')}
        leftIcon="settings"
      />
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'documents':
        return renderDocuments();
      case 'messages':
        return renderMessages();
      case 'payments':
        return renderPayments();
      case 'notifications':
        return <NotificationsScreen onNotificationPress={handleNotificationPress} />;
      case 'preferences':
        return <NotificationPreferences />;
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <ScrollView>
      {/* Active Lease Information */}
      <Card style={styles.card}>
        <Text style={styles.label}>Active Lease</Text>
        {selectedTenant?.leases.find((lease: LeaseAgreement) => lease.status === 'active') ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.value}>
                {new Date(selectedTenant.leases[0].startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.value}>
                {selectedTenant.leases[0].endDate
                  ? new Date(selectedTenant.leases[0].endDate).toLocaleDateString()
                  : 'Month-to-month'}
              </Text>
            </View>
          </View>
        ) : (
          <Text>No active lease found</Text>
        )}
      </Card>

      {/* Recent Payments */}
      <Card style={styles.card}>
        <Text style={styles.label}>Recent Payments</Text>
        {selectedTenant?.payments.slice(0, 3).map((payment: Payment) => (
          <View key={payment.id} style={styles.row}>
            <Text>{new Date(payment.paidAt || payment.dueDate).toLocaleDateString()}</Text>
            <Text>{`${payment.currency} ${payment.amount}`}</Text>
            <Text style={{ color: getPaymentStatusColor(payment.status) }}>
              {payment.status}
            </Text>
          </View>
        ))}
      </Card>

      {/* Recent Communications */}
      <Card style={styles.card}>
        <Text style={styles.label}>Recent Communications</Text>
        {selectedTenant?.communicationLogs.slice(0, 3).map((log: CommunicationLog) => (
          <View key={log.id} style={styles.messageItem}>
            <Text style={styles.label}>{new Date(log.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.value}>{log.subject}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const renderDocuments = () => (
    <ScrollView>
      <Card style={styles.card}>
        <Text style={styles.label}>Documents</Text>
        {selectedTenant?.documents.map((doc: Document) => (
          <View key={doc.id} style={styles.documentItem}>
            <Ionicons
              name="document-outline"
              size={24}
              color={theme.colors.text.secondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.value}>{doc.name}</Text>
              <Text style={styles.label}>{doc.type}</Text>
            </View>
            <Button
              title="Download"
              variant="outline"
              leftIcon="download"
              onPress={() => handleDownload(doc)}
            />
          </View>
        ))}
      </Card>

      <DocumentUpload
        onUpload={handleFileUpload}
        allowedTypes={[
          'application/pdf',
          'image/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]}
        maxSize={20 * 1024 * 1024} // 20MB
        multiple
      />
    </ScrollView>
  );

  const renderMessages = () => (
    <ScrollView>
      <Card style={styles.card}>
        <Text style={styles.label}>Messages</Text>
        {selectedTenant?.communicationLogs.map((log: CommunicationLog) => (
          <View key={log.id} style={styles.messageItem}>
            <View style={styles.row}>
              <Text style={styles.label}>{new Date(log.timestamp).toLocaleDateString()}</Text>
              <Text style={{ color: log.direction === 'incoming' ? theme.colors.primary : theme.colors.text.secondary }}>
                {log.direction === 'incoming' ? 'Received' : 'Sent'}
              </Text>
            </View>
            <Text style={styles.value}>{log.subject}</Text>
            <Text>{log.content}</Text>
            {log.attachments?.map((attachment) => (
              <Button
                key={attachment.id}
                title={attachment.name}
                variant="outline"
                leftIcon="attach"
                onPress={() => {/* Implement download */}}
                style={{ marginTop: theme.spacing.sm }}
              />
            ))}
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const renderPayments = () => (
    <ScrollView>
      <Card style={styles.card}>
        <Text style={styles.label}>Payment History</Text>
        {selectedTenant?.payments.map((payment: Payment) => (
          <View key={payment.id} style={styles.row}>
            <View>
              <Text style={styles.value}>{`${payment.currency} ${payment.amount}`}</Text>
              <Text style={styles.label}>{payment.type}</Text>
            </View>
            <View>
              <Text style={styles.value}>{new Date(payment.paidAt || payment.dueDate).toLocaleDateString()}</Text>
              <Text style={{ color: getPaymentStatusColor(payment.status) }}>{payment.status}</Text>
            </View>
            {payment.receipt && (
              <Button
                title="Receipt"
                variant="outline"
                leftIcon="document"
                onPress={() => {/* Implement download */}}
              />
            )}
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const getPaymentStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: theme.colors.status.warning,
      completed: theme.colors.status.success,
      failed: theme.colors.status.error,
      refunded: theme.colors.status.info,
    };
    return colors[status] || theme.colors.text.secondary;
  };

  const handleFileUpload = async (file: DocumentPicker.DocumentPickerSuccessResult) => {
    if (!selectedTenant) return;
    try {
      await uploadDocument(selectedTenant.id, file);
      await loadTenantData(); // Refresh the documents list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Implement download logic here
      // This will depend on your backend implementation
      // You might want to use FileSystem.downloadAsync or window.open for web
      console.log('Downloading document:', doc.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleNotificationPress = (notification: PaymentNotification) => {
    // Handle notification press
    console.log('Notification pressed:', notification);
  };

  const renderProfile = () => (
    <ScrollView>
      <Card style={styles.card}>
        <Text style={styles.label}>Profile Information</Text>
        {selectedTenant && (
          <>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{`${selectedTenant.firstName} ${selectedTenant.lastName}`}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{selectedTenant.email}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{selectedTenant.phone || 'Not provided'}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{selectedTenant.status}</Text>
              </View>
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  );

  const activeLease = selectedTenant?.leases.find(lease => 
    lease.status === 'active' && lease.tenantIds.includes(selectedTenant.id)
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.status.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.bold }}>
          Tenant Portal
        </Text>
      </View>

      {renderTabs()}

      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
} 