import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { WorkOrder } from '../../../types/maintenance';
import { maintenanceService } from '../../../lib/services/MaintenanceService';

type AssignedTo = {
  id: string;
  type: 'staff' | 'vendor';
  name: string;
  contact: {
    phone?: string;
    email?: string;
  };
};

interface WorkOrderFormProps {
  requestId: string;
  propertyId: string;
  unitId: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<WorkOrder>;
}

export function WorkOrderForm({
  requestId,
  propertyId,
  unitId,
  onSubmit,
  onCancel,
  initialData,
}: WorkOrderFormProps) {
  const theme = useTheme();
  const [assignedTo, setAssignedTo] = useState<AssignedTo>({
    id: initialData?.assignedTo?.id || '',
    type: initialData?.assignedTo?.type || 'staff',
    name: initialData?.assignedTo?.name || '',
    contact: {
      email: initialData?.assignedTo?.contact?.email,
      phone: initialData?.assignedTo?.contact?.phone,
    },
  });
  const [estimatedCost, setEstimatedCost] = useState(initialData?.estimatedCost?.toString() || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [materials, setMaterials] = useState<{ item: string; quantity: number; cost: number }[]>(
    initialData?.materials || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMaterial = () => {
    setMaterials([...materials, { item: '', quantity: 0, cost: 0 }]);
  };

  const handleUpdateMaterial = (index: number, field: keyof typeof materials[0], value: string) => {
    const updatedMaterials = [...materials];
    if (field === 'item') {
      updatedMaterials[index].item = value;
    } else {
      updatedMaterials[index][field] = parseFloat(value) || 0;
    }
    setMaterials(updatedMaterials);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!assignedTo.id || !assignedTo.name) {
        throw new Error('Please select an assignee');
      }

      const workOrderData = {
        requestId,
        propertyId,
        unitId,
        assignedTo,
        estimatedCost: parseFloat(estimatedCost) || 0,
        materials,
        startDate,
        dueDate,
      };

      if (initialData?.id) {
        await maintenanceService.updateWorkOrder(initialData.id, workOrderData);
      } else {
        await maintenanceService.createWorkOrder(workOrderData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save work order');
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
    materialItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    materialInput: {
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
          <Text style={styles.sectionTitle}>Assignment Details</Text>
          <Input
            label="Assignee Name"
            value={assignedTo.name}
            onChangeText={(value) => setAssignedTo({ ...assignedTo, name: value })}
            placeholder="Enter assignee name"
            leftIcon={<Ionicons name="person" size={20} color={theme.colors.text.secondary} />}
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
            label="Contact Email"
            value={assignedTo.contact.email || ''}
            onChangeText={(value) =>
              setAssignedTo({
                ...assignedTo,
                contact: { ...assignedTo.contact, email: value },
              })
            }
            placeholder="Enter contact email"
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail" size={20} color={theme.colors.text.secondary} />}
            style={styles.input}
          />

          <Input
            label="Contact Phone"
            value={assignedTo.contact.phone || ''}
            onChangeText={(value) =>
              setAssignedTo({
                ...assignedTo,
                contact: { ...assignedTo.contact, phone: value },
              })
            }
            placeholder="Enter contact phone"
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call" size={20} color={theme.colors.text.secondary} />}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & Cost</Text>
          <Input
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            leftIcon={<Ionicons name="calendar" size={20} color={theme.colors.text.secondary} />}
            style={styles.input}
          />

          <Input
            label="Due Date"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            leftIcon={<Ionicons name="calendar" size={20} color={theme.colors.text.secondary} />}
            style={styles.input}
          />

          <Input
            label="Estimated Cost"
            value={estimatedCost}
            onChangeText={setEstimatedCost}
            placeholder="Enter estimated cost"
            keyboardType="numeric"
            leftIcon={<Ionicons name="cash" size={20} color={theme.colors.text.secondary} />}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials</Text>
          {materials.map((material, index) => (
            <View key={index} style={styles.materialItem}>
              <Input
                placeholder="Item name"
                value={material.item}
                onChangeText={(value) => handleUpdateMaterial(index, 'item', value)}
                style={styles.materialInput}
              />
              <Input
                placeholder="Qty"
                value={material.quantity.toString()}
                onChangeText={(value) => handleUpdateMaterial(index, 'quantity', value)}
                keyboardType="numeric"
                style={[styles.materialInput, { flex: 0.5 }]}
              />
              <Input
                placeholder="Cost"
                value={material.cost.toString()}
                onChangeText={(value) => handleUpdateMaterial(index, 'cost', value)}
                keyboardType="numeric"
                style={[styles.materialInput, { flex: 0.5 }]}
              />
              <Button
                title="Remove"
                onPress={() => handleRemoveMaterial(index)}
                variant="outline"
                size="sm"
              />
            </View>
          ))}
          <Button
            title="Add Material"
            onPress={handleAddMaterial}
            variant="outline"
            leftIcon={<Ionicons name="add" size={20} color={theme.colors.primary} />}
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
            title={initialData?.id ? 'Update Work Order' : 'Create Work Order'}
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