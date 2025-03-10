import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { DocumentUpload } from './DocumentUpload';
import { DocumentPreview } from './DocumentPreview';
import { DocumentShare } from './DocumentShare';
import { DocumentVersionHistory } from './DocumentVersionHistory';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTenant } from '../../../hooks/useTenant';
import { webSocketService } from '../../../lib/services/WebSocketService';
import { DocumentService } from '../../../lib/services/DocumentService';
import { DocumentMetadata } from '../../../types/documents';

interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  comment?: string;
}

interface DocumentComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  category: string;
  tags: string[];
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  expiresAt?: string;
  status: 'active' | 'archived' | 'expired';
  versions: DocumentVersion[];
  comments: DocumentComment[];
  sharedWith: string[];
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
}

export function DocumentManager() {
  const theme = useTheme();
  const { selectedTenant } = useTenant();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [previewDocument, setPreviewDocument] = useState<DocumentMetadata | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [shareDocument, setShareDocument] = useState<DocumentMetadata | null>(null);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [versionDocument, setVersionDocument] = useState<DocumentMetadata | null>(null);
  const [isVersionVisible, setIsVersionVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    categoryChip: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedCategoryChip: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      color: theme.colors.text.primary,
    },
    selectedCategoryChipText: {
      color: theme.colors.text.light,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    documentsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    documentCard: {
      width: 200,
      padding: theme.spacing.md,
    },
    selectedDocumentCard: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    documentIcon: {
      alignSelf: 'center',
      marginBottom: theme.spacing.sm,
    },
    documentName: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      marginBottom: theme.spacing.xs,
    },
    documentMeta: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    tag: {
      backgroundColor: theme.colors.background.secondary,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: theme.borderRadius.sm,
    },
    tagText: {
      fontSize: theme.typography.sizes.tiny,
      color: theme.colors.text.secondary,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    documentActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
  });

  useEffect(() => {
    loadDocuments();
    loadCategories();
    subscribeToDocumentUpdates();
  }, []);

  const subscribeToDocumentUpdates = () => {
    webSocketService.subscribe('document_updated', (event: any) => {
      loadDocuments();
    });
  };

  const loadDocuments = async () => {
    if (!selectedTenant) return;
    
    try {
      setLoading(true);
      const data = await DocumentService.getDocuments(selectedTenant.id);
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (!selectedTenant) return;
    
    try {
      const data = await DocumentService.getCategories(selectedTenant.id);
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSort = (by: 'name' | 'date' | 'size') => {
    if (sortBy === by) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortOrder('asc');
    }
  };

  const toggleDocumentSelection = (doc: DocumentMetadata) => {
    setSelectedDocuments(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(doc.id)) {
        newSelection.delete(doc.id);
      } else {
        newSelection.add(doc.id);
      }
      return newSelection;
    });
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'share') => {
    if (!selectedTenant || selectedDocuments.size === 0) return;

    try {
      setLoading(true);
      switch (action) {
        case 'delete':
          await Promise.all(
            Array.from(selectedDocuments).map(id =>
              DocumentService.deleteDocument(selectedTenant.id, id)
            )
          );
          break;
        case 'archive':
          await Promise.all(
            Array.from(selectedDocuments).map(id =>
              DocumentService.archiveDocument(selectedTenant.id, id)
            )
          );
          break;
        case 'share':
          const doc = documents.find(d => d.id === Array.from(selectedDocuments)[0]);
          if (doc) {
            setShareDocument(doc);
            setIsShareVisible(true);
          }
          break;
      }
      await loadDocuments();
      setSelectedDocuments(new Set());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: DocumentPicker.DocumentPickerSuccessResult) => {
    if (!selectedTenant || !file.assets?.[0]) return;
    
    try {
      const asset = file.assets[0];
      await DocumentService.uploadDocument(selectedTenant.id, asset as unknown as File, {
        name: asset.name || 'Untitled',
        type: asset.mimeType || 'application/octet-stream',
        size: asset.size || 0,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      });
      await loadDocuments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePreview = (doc: DocumentMetadata) => {
    setPreviewDocument(doc);
    setIsPreviewVisible(true);
  };

  const handleShare = (doc: DocumentMetadata) => {
    setShareDocument(doc);
    setIsShareVisible(true);
  };

  const handleVersionHistory = (doc: DocumentMetadata) => {
    setVersionDocument(doc);
    setIsVersionVisible(true);
  };

  const handleContextMenu = (doc: DocumentMetadata) => {
    // TODO: Implement context menu with options:
    // - Preview
    // - Share
    // - Version History
    // - Download
    // - Delete
    // - Archive
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => 
      (selectedCategory === 'all' || doc.category === selectedCategory) &&
      (searchQuery === '' || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Button
            title="New Folder"
            variant="outline"
            leftIcon="folder-add"
            onPress={() => {/* Implement new folder creation */}}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesContainer}>
            <Pressable
              style={[
                styles.categoryChip,
                selectedCategory === 'all' && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === 'all' && styles.selectedCategoryChipText,
                ]}
              >
                All Documents
              </Text>
            </Pressable>
            {categories.map(category => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedCategoryChip,
                  category.color && { borderColor: category.color },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.selectedCategoryChipText,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.toolbar}>
          <View style={styles.sortContainer}>
            <Text>Sort by:</Text>
            <Button
              title="Name"
              variant={sortBy === 'name' ? 'primary' : 'outline'}
              onPress={() => handleSort('name')}
              size="sm"
            />
            <Button
              title="Date"
              variant={sortBy === 'date' ? 'primary' : 'outline'}
              onPress={() => handleSort('date')}
              size="sm"
            />
            <Button
              title="Size"
              variant={sortBy === 'size' ? 'primary' : 'outline'}
              onPress={() => handleSort('size')}
              size="sm"
            />
          </View>

          {selectedDocuments.size > 0 && (
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Button
                title="Share"
                variant="outline"
                leftIcon="share"
                onPress={() => handleBulkAction('share')}
              />
              <Button
                title="Archive"
                variant="outline"
                leftIcon="archive"
                onPress={() => handleBulkAction('archive')}
              />
              <Button
                title="Delete"
                variant="outline"
                leftIcon="trash"
                onPress={() => handleBulkAction('delete')}
              />
            </View>
          )}
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <ScrollView>
        <View style={styles.documentsGrid}>
          {filteredAndSortedDocuments.map(doc => (
            <Pressable
              key={doc.id}
              onPress={() => toggleDocumentSelection(doc)}
              onLongPress={() => handleContextMenu(doc)}
            >
              <Card
                style={[
                  styles.documentCard,
                  selectedDocuments.has(doc.id) && styles.selectedDocumentCard,
                ]}
              >
                <Ionicons
                  name="document-outline"
                  size={32}
                  color={theme.colors.primary}
                  style={styles.documentIcon}
                />
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentMeta}>
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </Text>
                <Text style={styles.documentMeta}>
                  {(doc.size / 1024).toFixed(1)} KB
                </Text>
                <View style={styles.tagsContainer}>
                  {doc.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.documentActions}>
                  <Button
                    title="Preview"
                    variant="outline"
                    size="sm"
                    leftIcon="eye"
                    onPress={() => handlePreview(doc)}
                  />
                  <Button
                    title="Share"
                    variant="outline"
                    size="sm"
                    leftIcon="share"
                    onPress={() => handleShare(doc)}
                  />
                  <Button
                    title="History"
                    variant="outline"
                    size="sm"
                    leftIcon="time"
                    onPress={() => handleVersionHistory(doc)}
                  />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>

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

      <DocumentPreview
        document={previewDocument}
        isVisible={isPreviewVisible}
        onClose={() => {
          setIsPreviewVisible(false);
          setPreviewDocument(null);
        }}
        tenantId={selectedTenant?.id || ''}
      />

      <DocumentShare
        document={shareDocument}
        isVisible={isShareVisible}
        onClose={() => {
          setIsShareVisible(false);
          setShareDocument(null);
        }}
        tenantId={selectedTenant?.id || ''}
        onShare={loadDocuments}
      />

      <DocumentVersionHistory
        document={versionDocument}
        isVisible={isVersionVisible}
        onClose={() => {
          setIsVersionVisible(false);
          setVersionDocument(null);
        }}
        tenantId={selectedTenant?.id || ''}
      />
    </View>
  );
} 