import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, Dimensions, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { DocumentService } from '../../../lib/services/DocumentService';
import { DocumentMetadata } from '../../../types/documents';
import { Ionicons } from '@expo/vector-icons';

interface DocumentPreviewProps {
  document: DocumentMetadata | null;
  isVisible: boolean;
  onClose: () => void;
  tenantId: string;
}

export function DocumentPreview({ document, isVisible, onClose, tenantId }: DocumentPreviewProps) {
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (document && isVisible) {
      loadPreview();
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [document, isVisible]);

  const loadPreview = async () => {
    if (!document) return;

    try {
      setLoading(true);
      setError(null);
      const url = await DocumentService.previewDocument(tenantId, document.id);
      setPreviewUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to load preview');
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
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    errorText: {
      color: theme.colors.status.error,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    previewContainer: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    webView: {
      width: windowWidth,
      height: windowHeight - 100, // Adjust for header
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.secondary,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
  });

  const renderPreview = () => {
    if (!document || !previewUrl) return null;

    // For images
    if (document.type.startsWith('image/')) {
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUrl }} style={styles.image} />
        </View>
      );
    }

    // For PDFs and other documents
    return (
      <View style={styles.previewContainer}>
        <WebView
          source={{ uri: previewUrl }}
          style={styles.webView}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          startInLoadingState={true}
        />
      </View>
    );
  };

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
          <Text style={styles.title}>
            {document?.name || 'Document Preview'}
          </Text>
          <Button
            title="Close"
            variant="outline"
            size="sm"
            leftIcon="close"
            onPress={onClose}
          />
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text>Loading preview...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={theme.colors.status.error}
              />
              <Text style={styles.errorText}>{error}</Text>
              <Button
                title="Try Again"
                onPress={loadPreview}
                variant="outline"
                style={{ marginTop: theme.spacing.md }}
              />
            </View>
          ) : (
            renderPreview()
          )}
        </View>

        {!loading && !error && document && (
          <View style={styles.toolbar}>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Button
                title="Download"
                leftIcon="download"
                variant="outline"
                onPress={() => {
                  // Implement download functionality
                }}
              />
              <Button
                title="Share"
                leftIcon="share"
                variant="outline"
                onPress={() => {
                  // Implement share functionality
                }}
              />
            </View>
            <Text style={{ color: theme.colors.text.secondary }}>
              Version {document.versions.length > 0 ? document.versions[0].version : 1}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
} 