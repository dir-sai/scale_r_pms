import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { DocumentCompare } from './DocumentCompare';
import { Ionicons } from '@expo/vector-icons';
import { DocumentService } from '../../../lib/services/DocumentService';
import { DocumentMetadata, DocumentVersion } from '../../../types/documents';
import { formatDistanceToNow } from 'date-fns';

interface DocumentVersionHistoryProps {
  document: DocumentMetadata | null;
  isVisible: boolean;
  onClose: () => void;
  tenantId: string;
}

export function DocumentVersionHistory({
  document,
  isVisible,
  onClose,
  tenantId,
}: DocumentVersionHistoryProps) {
  const theme = useTheme();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareVersion, setCompareVersion] = useState<DocumentVersion | null>(null);
  const [isCompareVisible, setIsCompareVisible] = useState(false);

  useEffect(() => {
    if (document && isVisible) {
      loadVersions();
    }
  }, [document, isVisible]);

  const loadVersions = async () => {
    if (!document) return;

    try {
      setLoading(true);
      const data = await DocumentService.getVersionHistory(tenantId, document.id);
      setVersions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionSelect = (version: DocumentVersion) => {
    if (isComparing) {
      if (version.id !== selectedVersion?.id) {
        setCompareVersion(version);
        setIsCompareVisible(true);
      }
      setIsComparing(false);
    } else {
      setSelectedVersion(version);
    }
  };

  const handleCompare = () => {
    setIsComparing(true);
  };

  const handleRestore = async () => {
    if (!document || !selectedVersion) return;

    try {
      setLoading(true);
      await DocumentService.restoreVersion(tenantId, document.id, selectedVersion.id);
      await loadVersions();
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
    timeline: {
      paddingLeft: theme.spacing.lg,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.background.secondary,
    },
    versionCard: {
      marginBottom: theme.spacing.md,
      marginLeft: -theme.spacing.sm,
    },
    versionDot: {
      position: 'absolute',
      left: -11,
      top: theme.spacing.md,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.background.primary,
      borderWidth: 2,
      borderColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedVersionDot: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    versionContent: {
      padding: theme.spacing.md,
    },
    versionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    versionNumber: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
    },
    versionMeta: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    versionComment: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.sizes.small,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    footer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.secondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!isVisible) return null;

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Version History</Text>
            <Button
              title="Close"
              variant="outline"
              size="sm"
              leftIcon="close"
              onPress={onClose}
            />
          </View>

          <View style={styles.content}>
            {error && <Text style={styles.error}>{error}</Text>}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text>Loading versions...</Text>
              </View>
            ) : (
              <ScrollView>
                <View style={styles.timeline}>
                  {versions.map((version) => (
                    <Pressable
                      key={version.id}
                      onPress={() => handleVersionSelect(version)}
                    >
                      <Card style={styles.versionCard}>
                        <View
                          style={[
                            styles.versionDot,
                            selectedVersion?.id === version.id && styles.selectedVersionDot,
                          ]}
                        >
                          {selectedVersion?.id === version.id && (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color={theme.colors.text.light}
                            />
                          )}
                        </View>
                        <View style={styles.versionContent}>
                          <View style={styles.versionHeader}>
                            <Text style={styles.versionNumber}>
                              Version {version.version}
                            </Text>
                            <Text style={styles.versionMeta}>
                              {formatDistanceToNow(new Date(version.uploadedAt), {
                                addSuffix: true,
                              })}
                            </Text>
                          </View>
                          <Text style={styles.versionMeta}>
                            By {version.uploadedBy}
                          </Text>
                          <Text style={styles.versionMeta}>
                            Size: {(version.fileSize / 1024).toFixed(1)} KB
                          </Text>
                          {version.comment && (
                            <Text style={styles.versionComment}>{version.comment}</Text>
                          )}
                        </View>
                      </Card>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          <View style={styles.footer}>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Button
                title="Compare"
                variant="outline"
                disabled={!selectedVersion || isComparing}
                onPress={handleCompare}
              />
              <Button
                title="Restore"
                variant="outline"
                disabled={!selectedVersion || loading}
                onPress={handleRestore}
              />
            </View>
            {isComparing && (
              <Text style={styles.versionMeta}>
                Select a version to compare with {selectedVersion?.version}
              </Text>
            )}
          </View>
        </View>
      </Modal>

      <DocumentCompare
        document={document}
        version1={selectedVersion}
        version2={compareVersion}
        isVisible={isCompareVisible}
        onClose={() => {
          setIsCompareVisible(false);
          setCompareVersion(null);
        }}
        tenantId={tenantId}
      />
    </>
  );
} 