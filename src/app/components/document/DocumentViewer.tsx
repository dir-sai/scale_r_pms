import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { DocumentMetadata } from '../../types/documents';
import { DocumentComments } from './DocumentComments';
import { DocumentService } from '../../lib/services/DocumentService';
import WebView from 'react-native-webview';

interface DocumentViewerProps {
  document: DocumentMetadata | null;
  isVisible: boolean;
  onClose: () => void;
  tenantId: string;
}

export function DocumentViewer({
  document,
  isVisible,
  onClose,
  tenantId,
}: DocumentViewerProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    } as ViewStyle,
    title: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
      flex: 1,
      marginRight: theme.spacing.md,
    } as TextStyle,
    content: {
      flex: 1,
    } as ViewStyle,
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.secondary,
      gap: theme.spacing.sm,
    } as ViewStyle,
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    } as TextStyle,
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
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
          <Text style={styles.title}>
            {document?.name || 'Document Viewer'}
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
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text>Loading document...</Text>
            </View>
          ) : (
            <WebView
              source={{ uri: document?.uri || '' }}
              style={styles.content}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load document');
                setLoading(false);
              }}
            />
          )}
        </View>

        <View style={styles.toolbar}>
          <Button
            title="Share"
            variant="outline"
            size="sm"
            leftIcon="share"
            onPress={() => {
              // TODO: Implement share functionality
            }}
          />
          <Button
            title="Comments"
            variant="outline"
            size="sm"
            leftIcon="chatbubble"
            onPress={() => setShowComments(true)}
          />
          <Button
            title="Download"
            variant="outline"
            size="sm"
            leftIcon="download"
            onPress={() => {
              // TODO: Implement download functionality
            }}
          />
        </View>

        <DocumentComments
          document={document}
          isVisible={showComments}
          onClose={() => setShowComments(false)}
          tenantId={tenantId}
        />
      </View>
    </Modal>
  );
} 