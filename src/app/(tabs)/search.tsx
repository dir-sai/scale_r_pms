import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function Search() {
  const locations = ['East Legon', 'Cantonments', 'Airport', 'Osu', 'Labone'];
  const propertyTypes = ['Apartment', 'House', 'Villa', 'Office'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchHeader}>
        <TextInput
          mode="outlined"
          placeholder="Search locations..."
          left={<TextInput.Icon icon="magnify" />}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filtersSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Popular Locations
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipContainer}>
            {locations.map((location) => (
              <Chip
                key={location}
                mode="outlined"
                style={styles.chip}
                onPress={() => {}}>
                {location}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <Text variant="titleMedium" style={[styles.sectionTitle, styles.mt16]}>
          Property Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipContainer}>
            {propertyTypes.map((type) => (
              <Chip
                key={type}
                mode="outlined"
                style={styles.chip}
                onPress={() => {}}>
                {type}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <View style={styles.priceRange}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Price Range (GHS)
          </Text>
          <View style={styles.priceInputs}>
            <TextInput
              mode="outlined"
              placeholder="Min"
              style={styles.priceInput}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              mode="outlined"
              placeholder="Max"
              style={styles.priceInput}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Button
          mode="contained"
          style={styles.searchButton}
          icon="search"
          onPress={() => {}}>
          Search Properties
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchHeader: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: 'white',
  },
  filtersSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#2D3748',
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  chip: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  mt16: {
    marginTop: 16,
  },
  priceRange: {
    marginTop: 16,
    marginBottom: 24,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  priceSeparator: {
    marginHorizontal: 8,
    color: '#4A5568',
  },
  searchButton: {
    backgroundColor: '#4A5568',
    marginTop: 8,
  },
});