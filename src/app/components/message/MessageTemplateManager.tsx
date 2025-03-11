import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';
import { Ionicons } from '@expo/vector-icons';
import { webSocketService, WebSocketEvent } from '../../../lib/services/WebSocketService';

interface MessageTemplate {
  id: string;
  name: string;
  category: 'payment' | 'maintenance' | 'lease' | 'general';
  subject: string;
  content: string;
  variables: string[];
  channels: ('email' | 'sms' | 'push')[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessageTemplateFormData {
  name: string;
  category: MessageTemplate['category'];
  subject: string;
  content: string;
  channels: MessageTemplate['channels'];
}

const initialFormData: MessageTemplateFormData = {
  name: '',
  category: 'general',
  subject: '',
  content: '',
  channels: ['email'],
};

export function MessageTemplateManager() {
  const theme = useTheme();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState<MessageTemplateFormData>(initialFormData);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
    },
    templateList: {
      flex: 1,
      marginRight: theme.spacing.md,
      maxWidth: 300,
    },
    templateCard: {
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    selectedTemplate: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    templateName: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      marginBottom: theme.spacing.xs,
    },
    templateMeta: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    editor: {
      flex: 2,
    },
    formGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
    },
    contentInput: {
      height: 200,
      textAlignVertical: 'top',
    },
    channelContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    preview: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
    },
    previewTitle: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      marginBottom: theme.spacing.sm,
    },
    variableInput: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
  });

  useEffect(() => {
    // Connect to WebSocket when component mounts
    webSocketService.connect('your-auth-token-here');

    return () => {
      // Disconnect when component unmounts
      webSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    loadTemplates();

    // Subscribe to WebSocket events
    const unsubscribeCreated = webSocketService.subscribe('template_created', (event: WebSocketEvent) => {
      const template = event.payload as MessageTemplate;
      setTemplates(prev => [...prev, template]);
    });

    const unsubscribeUpdated = webSocketService.subscribe('template_updated', (event: WebSocketEvent) => {
      const template = event.payload as MessageTemplate;
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? template : t
      ));
      
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(template);
      }
    });

    const unsubscribeDeleted = webSocketService.subscribe('template_deleted', (event: WebSocketEvent) => {
      const { id } = event.payload as { id: string };
      setTemplates(prev => prev.filter(template => template.id !== id));
      
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
        setFormData(initialFormData);
        setIsEditing(false);
      }
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/message-templates');
      const data = await response.json();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      content: template.content,
      channels: template.channels,
    });
    setIsEditing(false);

    // Initialize preview data with template variables
    const initialPreviewData: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialPreviewData[variable] = `[${variable}]`;
    });
    setPreviewData(initialPreviewData);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setFormData(initialFormData);
    setPreviewData({});
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map(match => match.slice(2, -2).trim());
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const variables = extractVariables(formData.content);
      const templateData = {
        ...formData,
        variables,
        isActive: true,
      };

      if (selectedTemplate) {
        // Update existing template
        await fetch(`/api/message-templates/${selectedTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
      } else {
        // Create new template
        await fetch('/api/message-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData),
        });
      }

      await loadTemplates();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      setError(undefined);

      await fetch(`/api/message-templates/${selectedTemplate.id}`, {
        method: 'DELETE',
      });

      await loadTemplates();
      setSelectedTemplate(null);
      setFormData(initialFormData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!formData.content) return null;

    let previewContent = formData.content;
    Object.entries(previewData).forEach(([variable, value]) => {
      previewContent = previewContent.replace(
        new RegExp(`\\{\\{${variable}\\}\\}`, 'g'),
        value
      );
    });

    return (
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview</Text>
        {formData.subject && (
          <Text style={{ fontWeight: theme.typography.weights.medium }}>
            Subject: {formData.subject}
          </Text>
        )}
        <Text>{previewContent}</Text>
      </View>
    );
  };

  const renderVariableInputs = () => {
    const variables = extractVariables(formData.content);
    if (variables.length === 0) return null;

    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>Template Variables</Text>
        {variables.map(variable => (
          <View key={variable} style={styles.variableInput}>
            <Text style={{ marginRight: theme.spacing.sm }}>{variable}:</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={previewData[variable] || ''}
              onChangeText={(value) =>
                setPreviewData(prev => ({ ...prev, [variable]: value }))
              }
              placeholder={`Enter value for ${variable}`}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Message Templates</Text>
        <Button
          title="Create New Template"
          onPress={handleCreateNew}
          leftIcon="add"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.row}>
        <ScrollView style={styles.templateList}>
          {templates.map(template => (
            <Card
              key={template.id}
              style={[
                styles.templateCard,
                selectedTemplate?.id === template.id && styles.selectedTemplate,
              ]}
              onPress={() => handleSelectTemplate(template)}
            >
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateMeta}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </Text>
              <Text style={styles.templateMeta}>
                {template.channels.join(', ')}
              </Text>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.editor}>
          {(selectedTemplate || isEditing) && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Template Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(name) => setFormData(prev => ({ ...prev, name }))}
                  placeholder="Enter template name"
                  editable={isEditing}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <Select
                  label="Category"
                  value={formData.category}
                  onValueChange={(category) =>
                    setFormData(prev => ({
                      ...prev,
                      category: category as MessageTemplate['category'],
                    }))
                  }
                  items={[
                    { label: 'Payment', value: 'payment' },
                    { label: 'Maintenance', value: 'maintenance' },
                    { label: 'Lease', value: 'lease' },
                    { label: 'General', value: 'general' },
                  ]}
                  style={isEditing ? undefined : { opacity: 0.5 }}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Subject (for email)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.subject}
                  onChangeText={(subject) => setFormData(prev => ({ ...prev, subject }))}
                  placeholder="Enter email subject"
                  editable={isEditing}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Content</Text>
                <Text style={[styles.label, { fontStyle: 'italic' }]}>
                  Use {'{{'} variableName {'}}'}  for dynamic content
                </Text>
                <TextInput
                  style={[styles.input, styles.contentInput]}
                  value={formData.content}
                  onChangeText={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Enter template content"
                  multiline
                  editable={isEditing}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Channels</Text>
                <View style={styles.channelContainer}>
                  {(['email', 'sms', 'push'] as const).map(channel => (
                    <Button
                      key={channel}
                      title={channel.toUpperCase()}
                      variant={formData.channels.includes(channel) ? 'primary' : 'outline'}
                      onPress={() => {
                        if (!isEditing) return;
                        setFormData(prev => ({
                          ...prev,
                          channels: prev.channels.includes(channel)
                            ? prev.channels.filter(c => c !== channel)
                            : [...prev.channels, channel],
                        }));
                      }}
                      disabled={!isEditing}
                    />
                  ))}
                </View>
              </View>

              {renderVariableInputs()}
              {renderPreview()}

              <View style={[styles.row, { marginTop: theme.spacing.md }]}>
                {isEditing ? (
                  <>
                    <Button
                      title={selectedTemplate ? 'Save Changes' : 'Create Template'}
                      onPress={handleSave}
                      disabled={loading}
                    />
                    <Button
                      title="Cancel"
                      variant="outline"
                      onPress={() => {
                        setIsEditing(false);
                        if (selectedTemplate) {
                          handleSelectTemplate(selectedTemplate);
                        } else {
                          setFormData(initialFormData);
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Button title="Edit" onPress={handleEdit} />
                    <Button
                      title="Delete"
                      variant="outline"
                      onPress={handleDelete}
                      style={{
                        backgroundColor: theme.colors.status.error + '20',
                        borderColor: theme.colors.status.error,
                        borderWidth: 1
                      }}
                    />
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
} 