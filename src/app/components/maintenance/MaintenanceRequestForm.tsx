import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { MaintenanceCategory, MaintenanceRequestPriority } from '../../../types/maintenance';
import { maintenanceService } from '../../../lib/services/MaintenanceService';
import { useAuth } from '../../../hooks/useAuth';

interface MaintenanceRequestFormProps {
  propertyId: string;
  unitId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export function MaintenanceRequestForm({
  propertyId,
  unitId,
  onSubmit,
  onCancel,
}: MaintenanceRequestFormProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('other');
  const [priority, setPriority] = useState<MaintenanceRequestPriority>('low');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { label: 'Plumbing', value: 'plumbing' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'HVAC', value: 'hvac' },
    { label: 'Appliance', value: 'appliance' },
    { label: 'Structural', value: 'structural' },
    { label: 'Pest Control', value: 'pest_control' },
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Painting', value: 'painting' },
    { label: 'Security', value: 'security' },
    { label: 'Other', value: 'other' },
  ];

  const priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Emergency', value: 'emergency' },
  ];

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setAttachments([...attachments, result.assets[0]]);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!title.trim()) {
        throw new Error('Please enter a title');
      }

      if (!description.trim()) {
        throw new Error('Please enter a description');
      }

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      await maintenanceService.createMaintenanceRequest({
        propertyId,
        unitId,
        tenantId: user.id,
        title,
        category,
        priority,
        description,
      });

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to submit maintenance request');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    description: {
      height: 120,
      textAlignVertical: 'top',
    },
    attachmentsContainer: {
      marginBottom: theme.spacing.md,
    },
    attachmentsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    attachmentPreview: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter request title"
          leftIcon={<Ionicons name="create" size={20} color={theme.colors.text.secondary} />}
          style={styles.input}
        />

        <Select
          label="Category"
          value={category}
          onValueChange={(value) => setCategory(value as MaintenanceCategory)}
          items={categories}
          style={styles.input}
        />

        <Select
          label="Priority"
          value={priority}
          onValueChange={(value) => setPriority(value as MaintenanceRequestPriority)}
          items={priorities}
          style={styles.input}
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue in detail"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.description]}
        />

        <View style={styles.attachmentsContainer}>
          <Text style={{ marginBottom: theme.spacing.sm }}>Attachments</Text>
          <Button
            title="Add Photo/Video"
            onPress={pickImage}
            variant="outline"
            leftIcon={<Ionicons name="camera" size={20} color={theme.colors.primary} />}
          />
          <View style={styles.attachmentsList}>
            {attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentPreview}>
                <Ionicons
                  name={attachment.type === 'video' ? 'videocam' : 'image'}
                  size={32}
                  color={theme.colors.text.secondary}
                />
              </View>
            ))}
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title="Submit Request"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 