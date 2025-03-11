import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface DocumentUploadProps {
  onUpload: (file: DocumentPicker.DocumentPickerSuccessResult) => Promise<void>;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export function DocumentUpload({
  onUpload,
  allowedTypes = ['application/pdf', 'image/*'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
}: DocumentUploadProps) {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerSuccessResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState(0);

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    dropZone: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: 'dashed',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.secondary,
    },
    activeDropZone: {
      borderColor: theme.colors.status.success,
      backgroundColor: `${theme.colors.status.success}10`,
    },
    icon: {
      marginBottom: theme.spacing.md,
    },
    text: {
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    fileList: {
      marginTop: theme.spacing.md,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
    fileName: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    fileSize: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.sizes.small,
      marginLeft: theme.spacing.sm,
    },
    error: {
      color: theme.colors.status.error,
      marginTop: theme.spacing.sm,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
    },
  });

  const handleFilePick = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const fileSize = result.assets[0].size ?? 0;
        // Validate file size
        if (fileSize > maxSize) {
          setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
          return;
        }

        setSelectedFiles(prev => multiple ? [...prev, result] : [result]);
        setError(undefined);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [allowedTypes, maxSize, multiple]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(undefined);
    setUploadProgress(0);

    try {
      for (const file of selectedFiles) {
        await onUpload(file);
        setUploadProgress((prev) => prev + (100 / selectedFiles.length));
      }

      // Clear selected files after successful upload
      setSelectedFiles([]);
      setUploadProgress(100);

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileToRemove: DocumentPicker.DocumentPickerSuccessResult) => {
    setSelectedFiles(prev => 
      prev.filter(file => file.assets[0].uri !== fileToRemove.assets[0].uri)
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.dropZone}>
          <Ionicons
            name="cloud-upload-outline"
            size={48}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text style={styles.text}>
            {Platform.OS === 'web'
              ? 'Drag and drop files here or click to select'
              : 'Tap to select files'}
          </Text>
          <Button
            title="Select Files"
            onPress={handleFilePick}
            disabled={uploading}
            leftIcon="folder-open"
          />
        </View>

        {selectedFiles.length > 0 && (
          <View style={styles.fileList}>
            {selectedFiles.map((file) => (
              <View key={file.assets[0].uri} style={styles.fileItem}>
                <Ionicons
                  name="document-outline"
                  size={24}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.fileName}>
                  {file.assets[0].name}
                </Text>
                <Text style={styles.fileSize}>
                  {formatFileSize(file.assets[0].size ?? 0)}
                </Text>
                <Button
                  title="Remove"
                  variant="outline"
                  onPress={() => removeFile(file)}
                  disabled={uploading}
                  leftIcon="close-circle"
                />
              </View>
            ))}

            <Button
              title={uploading ? 'Uploading...' : 'Upload Files'}
              onPress={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              loading={uploading}
              style={{ marginTop: theme.spacing.md }}
            />

            {uploadProgress > 0 && (
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${uploadProgress}%` },
                  ]}
                />
              </View>
            )}
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </Card>
    </View>
  );
} 