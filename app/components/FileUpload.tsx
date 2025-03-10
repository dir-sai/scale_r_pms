import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text as RNText } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Text } from './Text';
import { Button } from './Button';
import { useTheme } from '../../hooks/useTheme';

interface FileUploadProps {
  label: string;
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface FileAsset {
  uri: string;
  name: string;
  mimeType: string;
}

export function FileUpload({
  label,
  onFileSelect,
  accept,
  multiple = false,
  style,
}: FileUploadProps) {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept ? accept.split(',') : '*/*',
        multiple,
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const files = result.assets.map((asset: DocumentPicker.DocumentPickerAsset) => new File([asset.uri], asset.name, {
          type: asset.mimeType || 'application/octet-stream',
        }));
        setSelectedFiles(multiple ? [...selectedFiles, ...files] : files);
        onFileSelect(multiple ? [...selectedFiles, ...files] : files);
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing[3],
    },
    label: {
      marginBottom: theme.spacing[2],
    },
    fileList: {
      marginTop: theme.spacing[2],
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius[2],
      marginBottom: theme.spacing[2],
    },
    fileName: {
      flex: 1,
      marginRight: theme.spacing[2],
      color: theme.colors.text.primary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Button
        title="Choose Files"
        onPress={handleFilePick}
        variant="outline"
        leftIcon="document"
      />
      {selectedFiles.length > 0 && (
        <View style={styles.fileList}>
          {selectedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <RNText style={styles.fileName} ellipsizeMode="tail" numberOfLines={1}>
                {file.name}
              </RNText>
              <Button
                title="Remove"
                onPress={() => handleRemoveFile(index)}
                variant="outline"
                size="sm"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
} 