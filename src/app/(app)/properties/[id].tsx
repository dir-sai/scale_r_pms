import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProperty } from '../../../app/context/PropertyContext';
import { Container } from '../../../app/components/Container';
import { Text } from '../../../app/components/Text';
import { Button } from '../../../app/components/Button';
import { Card } from '../../../app/components/Card';
import { useTheme } from '../../../app/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Unit } from '../../../types/property';

export default function PropertyDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    selectedProperty,
    units,
    isLoading,
    error,
    getProperty,
    loadUnits,
    deleteProperty,
  } = useProperty();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      getProperty(id as string);
      loadUnits(id as string);
    }
  }, [id, getProperty, loadUnits]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    },
    header: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    backIcon: {
      marginRight: theme.spacing.xs,
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    content: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    photo: {
      width: '48%',
      height: 150,
      borderRadius: theme.borderRadius.md,
    },
    amenityList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    amenityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    amenityIcon: {
      marginRight: theme.spacing.xs,
    },
    unitCard: {
      marginBottom: theme.spacing.md,
    },
    unitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    unitStatus: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    error: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.status.error,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.text.light,
    },
    deleteConfirm: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.secondary,
    },
    deleteActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/properties/${id}/edit`);
  };

  const handleAddUnit = () => {
    router.push(`/properties/${id}/units/new`);
  };

  const handleUnitPress = (unitId: string) => {
    router.push(`/properties/${id}/units/${unitId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id as string);
      router.replace('/properties');
    } catch (err) {
      // Error is handled by the context
    }
  };

  const getStatusColor = (status: Unit['status']) => {
    switch (status) {
      case 'vacant':
        return theme.colors.status.success;
      case 'occupied':
        return theme.colors.status.warning;
      case 'maintenance':
        return theme.colors.status.error;
      case 'reserved':
        return theme.colors.status.info;
      default:
        return theme.colors.text.secondary;
    }
  };

  if (isLoading || !selectedProperty) {
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
              style={styles.backIcon}
            />
            <Text>Back to Properties</Text>
          </Pressable>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Loading...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
            style={styles.backIcon}
          />
          <Text>Back to Properties</Text>
        </Pressable>
        <Text variant="h2" weight="bold">{selectedProperty.name}</Text>
        <Text variant="body" color={theme.colors.text.secondary}>
          {selectedProperty.address.street}, {selectedProperty.address.city}
        </Text>
        <View style={styles.headerActions}>
          <Button
            title="Add Unit"
            onPress={handleAddUnit}
            icon="add-circle-outline"
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Button
              variant="outline"
              title="Edit"
              onPress={handleEdit}
              icon="create-outline"
            />
            <Button
              variant="outline"
              title="Delete"
              onPress={() => setShowDeleteConfirm(true)}
              icon="trash-outline"
              style={{ borderColor: theme.colors.status.error }}
              textStyle={{ color: theme.colors.status.error }}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {selectedProperty.photos.map((photo) => (
              <Image
                key={photo.id}
                source={{ uri: photo.url }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>Description</Text>
          <Text variant="body">{selectedProperty.description}</Text>
        </View>

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenityList}>
            {selectedProperty.amenities.map((amenity) => (
              <View key={amenity.id} style={styles.amenityItem}>
                {amenity.icon && (
                  <Ionicons
                    name={amenity.icon as any}
                    size={16}
                    color={theme.colors.text.secondary}
                    style={styles.amenityIcon}
                  />
                )}
                <Text variant="small">{amenity.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>Units</Text>
          {units.map((unit) => (
            <Card
              key={unit.id}
              style={styles.unitCard}
              onPress={() => handleUnitPress(unit.id)}
            >
              <View style={styles.unitHeader}>
                <View>
                  <Text variant="h3" weight="bold">{unit.name}</Text>
                  <Text variant="small" color={theme.colors.text.secondary}>
                    {unit.size.value} {unit.size.unit} • {unit.bedrooms} bed • {unit.bathrooms} bath
                  </Text>
                </View>
                <View
                  style={[
                    styles.unitStatus,
                    { backgroundColor: getStatusColor(unit.status) },
                  ]}
                >
                  <Text variant="small" color={theme.colors.text.light}>
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text variant="h3" weight="bold" color={theme.colors.primary}>
                ${unit.rent.amount.toLocaleString()}/{unit.rent.period}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      {showDeleteConfirm && (
        <View style={styles.deleteConfirm}>
          <Text variant="h3" weight="bold">Delete Property?</Text>
          <Text variant="body" color={theme.colors.text.secondary}>
            This action cannot be undone. All associated units and data will be permanently deleted.
          </Text>
          <View style={styles.deleteActions}>
            <Button
              variant="outline"
              title="Cancel"
              onPress={() => setShowDeleteConfirm(false)}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              style={{ backgroundColor: theme.colors.status.error }}
            />
          </View>
        </View>
      )}
    </Container>
  );
} 