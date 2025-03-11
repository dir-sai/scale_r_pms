import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';
import { DocumentService } from '../../../lib/services/DocumentService';
import { DocumentMetadata, DocumentVersion } from '../../../types/documents';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCompareProps {
  document: DocumentMetadata | null;
  version1: DocumentVersion | null;
  version2: DocumentVersion | null;
  isVisible: boolean;
  onClose: () => void;
  tenantId: string;
}

interface ComparisonResult {
  additions: number;
  deletions: number;
  changes: Array<{
    type: 'addition' | 'deletion' | 'modification';
    lineNumber: number;
    content: string;
  }>;
}

export function DocumentCompare({
  document,
  version1,
  version2,
  isVisible,
  onClose,
  tenantId,
}: DocumentCompareProps) {
  const theme = useTheme();
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document && version1 && version2 && isVisible) {
      loadComparison();
    }
  }, [document, version1, version2, isVisible]);

  const loadComparison = async () => {
    if (!document || !version1 || !version2) return;

    try {
      setLoading(true);
      setError(null);
      const data = await DocumentService.compareVersions(
        tenantId,
        document.id,
        version1.id,
        version2.id
      );
      setComparison(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    title: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      flex: 1,
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.lg,
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryNumber: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    versionsInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    versionInfo: {
      flex: 1,
      padding: theme.spacing.md,
    },
    versionTitle: {
      fontSize: theme.typography.sizes.small,
      fontWeight: theme.typography.weights.medium,
      marginBottom: theme.spacing.xs,
    },
    versionMeta: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    changes: {
      flex: 1,
    },
    changeLine: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    lineNumber: {
      width: 40,
      marginRight: theme.spacing.sm,
      color: theme.colors.text.secondary,
    },
    addition: {
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
    },
    deletion: {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    modification: {
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Compare Versions</Text>
          <Button
            title="Close"
            variant="outline"
            size="sm"
            leftIcon="close"
            onPress={onClose}
          />
        </View>

        <View style={styles.content}>
          {error ? (
            <View style={styles.loadingContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={theme.colors.status.error}
              />
              <Text style={styles.error}>{error}</Text>
              <Button
                title="Try Again"
                onPress={loadComparison}
                variant="outline"
                style={{ marginTop: theme.spacing.md }}
              />
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text>Comparing versions...</Text>
            </View>
          ) : comparison ? (
            <ScrollView>
              <View style={styles.summary}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryNumber,
                      { color: theme.colors.status.success },
                    ]}
                  >
                    +{comparison.additions}
                  </Text>
                  <Text style={styles.summaryLabel}>Additions</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text
                    style={[
                      styles.summaryNumber,
                      { color: theme.colors.status.error },
                    ]}
                  >
                    -{comparison.deletions}
                  </Text>
                  <Text style={styles.summaryLabel}>Deletions</Text>
                </View>
              </View>

              <View style={styles.versionsInfo}>
                <Card style={styles.versionInfo}>
                  <Text style={styles.versionTitle}>Version {version1?.version}</Text>
                  <Text style={styles.versionMeta}>
                    {formatDistanceToNow(new Date(version1?.uploadedAt || ''), {
                      addSuffix: true,
                    })}
                  </Text>
                  <Text style={styles.versionMeta}>By {version1?.uploadedBy}</Text>
                </Card>
                <Card style={styles.versionInfo}>
                  <Text style={styles.versionTitle}>Version {version2?.version}</Text>
                  <Text style={styles.versionMeta}>
                    {formatDistanceToNow(new Date(version2?.uploadedAt || ''), {
                      addSuffix: true,
                    })}
                  </Text>
                  <Text style={styles.versionMeta}>By {version2?.uploadedBy}</Text>
                </Card>
              </View>

              <View style={styles.changes}>
                {comparison.changes.map((change, index) => (
                  <View
                    key={index}
                    style={[
                      styles.changeLine,
                      change.type === 'addition' && styles.addition,
                      change.type === 'deletion' && styles.deletion,
                      change.type === 'modification' && styles.modification,
                    ]}
                  >
                    <Text style={styles.lineNumber}>{change.lineNumber}</Text>
                    <Text>
                      {change.type === 'addition' && '+ '}
                      {change.type === 'deletion' && '- '}
                      {change.content}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
} 