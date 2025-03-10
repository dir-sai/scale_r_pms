import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import {
  PreventiveMaintenance,
  MaintenanceCategory,
} from '../../../types/maintenance';
import { maintenanceService } from '../../../lib/services/MaintenanceService';

type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

type AssigneeType = 'staff' | 'vendor';

interface ChecklistItem {
  id: string;
  task: string;
  required: boolean;
}

interface AssignedTo {
  id: string;
  type: AssigneeType;
  name: string;
}

interface PreventiveMaintenanceFormProps {
  propertyId: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<PreventiveMaintenance>;
}

export function PreventiveMaintenanceForm({
  propertyId,
  onSubmit,
  onCancel,
  initialData,
}: PreventiveMaintenanceFormProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<MaintenanceCategory>(initialData?.category || 'other');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState<PreventiveMaintenance['frequency']>(initialData?.frequency || {
    type: 'monthly',
    interval: 1,
    daysOfWeek: [],
    dayOfMonth: 1,
    monthsOfYear: [],
  });
  const [assignedTo, setAssignedTo] = useState<AssignedTo>(initialData?.assignedTo || {
    id: '',
    type: 'staff',
    name: '',
  });
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialData?.estimatedDuration?.toString() || ''
  );
  const [estimatedCost, setEstimatedCost] = useState(initialData?.estimatedCost?.toString() || '');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialData?.checklist || []
  );
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

  const frequencyTypes = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const handleAddChecklistItem = () => {
    setChecklist([
      ...checklist,
      {
        id: Math.random().toString(36).substr(2, 9),
        task: '',
        required: true,
      },
    ]);
  };

  const handleUpdateChecklistItem = (
    index: number,
    field: keyof ChecklistItem,
    value: string | boolean
  ) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = {
      ...updatedChecklist[index],
      [field]: value,
    };
    setChecklist(updatedChecklist);
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
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

      if (!assignedTo.id || !assignedTo.name) {
        throw new Error('Please select an assignee');
      }

      const maintenanceData: Omit<PreventiveMaintenance, 'id'> = {
        propertyId,
        title,
        category,
        description,
        frequency,
        assignedTo,
        estimatedDuration: parseFloat(estimatedDuration) || 0,
        estimatedCost: parseFloat(estimatedCost) || 0,
        checklist: checklist.filter((item) => item.task.trim()),
        active: true,
        notifications: [
          {
            type: 'email',
            recipients: [assignedTo.id],
            advanceNotice: 1,
          },
        ],
        nextDueDate: new Date().toISOString(),
        history: [],
      };

      if (initialData?.id) {
        await maintenanceService.updatePreventiveMaintenance(initialData.id, maintenanceData);
      } else {
        await maintenanceService.createPreventiveMaintenance(maintenanceData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save preventive maintenance schedule');
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
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    description: {
      height: 120,
      textAlignVertical: 'top',
    },
    frequencyContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    frequencyInput: {
      flex: 1,
    },
    checklistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    checklistInput: {
      flex: 1,
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter maintenance title"
            leftIcon="create"
            style={styles.input}
          />

          <Select
            label="Category"
            value={category}
            onValueChange={(value) => setCategory(value as MaintenanceCategory)}
            items={categories}
            style={styles.input}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the maintenance task"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.description]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.frequencyContainer}>
            <Select
              label="Frequency"
              value={frequency.type}
              onValueChange={(value) =>
                setFrequency({ ...frequency, type: value as FrequencyType })
              }
              items={frequencyTypes}
              style={styles.frequencyInput}
            />
            <Input
              label="Interval"
              value={frequency.interval.toString()}
              onChangeText={(value) =>
                setFrequency({ ...frequency, interval: parseInt(value) || 1 })
              }
              keyboardType="numeric"
              style={styles.frequencyInput}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assignment & Cost</Text>
          <Input
            label="Assignee Name"
            value={assignedTo.name}
            onChangeText={(value) => setAssignedTo({ ...assignedTo, name: value })}
            placeholder="Enter assignee name"
            leftIcon="person"
            style={styles.input}
          />

          <Select
            label="Assignee Type"
            value={assignedTo.type}
            onValueChange={(value) => setAssignedTo({ ...assignedTo, type: value as 'staff' | 'vendor' })}
            items={[
              { label: 'Staff', value: 'staff' },
              { label: 'Vendor', value: 'vendor' },
            ]}
            style={styles.input}
          />

          <Input
            label="Estimated Duration (hours)"
            value={estimatedDuration}
            onChangeText={setEstimatedDuration}
            placeholder="Enter estimated duration"
            keyboardType="numeric"
            leftIcon="time"
            style={styles.input}
          />

          <Input
            label="Estimated Cost"
            value={estimatedCost}
            onChangeText={setEstimatedCost}
            placeholder="Enter estimated cost"
            keyboardType="numeric"
            leftIcon="cash"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          {checklist.map((item, index) => (
            <View key={item.id} style={styles.checklistItem}>
              <Input
                placeholder="Enter task description"
                value={item.task}
                onChangeText={(value) => handleUpdateChecklistItem(index, 'task', value)}
                style={styles.checklistInput}
              />
              <Select
                label="Required"
                value={item.required ? 'required' : 'optional'}
                onValueChange={(value) =>
                  handleUpdateChecklistItem(index, 'required', value === 'required')
                }
                items={[
                  { label: 'Required', value: 'required' },
                  { label: 'Optional', value: 'optional' },
                ]}
                style={{ width: 120 }}
              />
              <Button
                title="Remove"
                onPress={() => handleRemoveChecklistItem(index)}
                variant="outline"
                size="sm"
              />
            </View>
          ))}
          <Button
            title="Add Task"
            onPress={handleAddChecklistItem}
            variant="outline"
            leftIcon="add"
          />
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
            title={initialData?.id ? 'Update Schedule' : 'Create Schedule'}
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