import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const LIME_GREEN = '#32CD32';

const properties = [
  {
    id: 1,
    title: 'Modern Apartment in East Legon',
    price: 'GHS 2,500/month',
    location: 'East Legon, Accra',
    type: 'Apartment',
    beds: 3,
    baths: 2,
    area: '150 sqm',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  },
  {
    id: 2,
    title: 'Luxury Villa in Cantonments',
    price: 'GHS 5,000/month',
    location: 'Cantonments, Accra',
    type: 'Villa',
    beds: 4,
    baths: 3,
    area: '300 sqm',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  },
  {
    id: 3,
    title: 'Office Space in Airport City',
    price: 'GHS 3,500/month',
    location: 'Airport City, Accra',
    type: 'Commercial',
    beds: null,
    baths: 2,
    area: '200 sqm',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  },
  {
    id: 4,
    title: 'Townhouse in Labone',
    price: 'GHS 4,000/month',
    location: 'Labone, Accra',
    type: 'House',
    beds: 3,
    baths: 2,
    area: '180 sqm',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  },
];

export default function Properties() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Available Properties
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Discover your perfect space in Ghana's most sought-after locations
        </Text>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Apartment', 'House', 'Villa', 'Commercial'].map((filter) => (
            <Chip
              key={filter}
              mode="outlined"
              style={styles.filterChip}
              textStyle={styles.filterChipText}
              onPress={() => {}}>
              {filter}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.propertiesGrid}>
        {properties.map((property) => (
          <Card key={property.id} style={styles.propertyCard}>
            <Card.Cover source={{ uri: property.image }} style={styles.propertyImage} />
            <Card.Content>
              <Text variant="titleLarge" style={styles.propertyTitle}>
                {property.title}
              </Text>
              <Text variant="headlineSmall" style={styles.propertyPrice}>
                {property.price}
              </Text>
              <Text variant="bodyMedium" style={styles.propertyLocation}>
                <Ionicons name="location" size={16} color={LIME_GREEN} /> {property.location}
              </Text>
              
              <View style={styles.propertyFeatures}>
                {property.beds && (
                  <Text variant="bodyMedium" style={styles.feature}>
                    <Ionicons name="bed" size={16} color="#4A5568" /> {property.beds} Beds
                  </Text>
                )}
                <Text variant="bodyMedium" style={styles.feature}>
                  <Ionicons name="water" size={16} color="#4A5568" /> {property.baths} Baths
                </Text>
                <Text variant="bodyMedium" style={styles.feature}>
                  <Ionicons name="resize" size={16} color="#4A5568" /> {property.area}
                </Text>
              </View>

              <Button
                mode="contained"
                style={styles.viewButton}
                onPress={() => {}}>
                View Details
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 40,
    backgroundColor: '#2D3748',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#E2E8F0',
    textAlign: 'center',
  },
  filters: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: 'white',
    borderColor: LIME_GREEN,
  },
  filterChipText: {
    color: '#4A5568',
  },
  propertiesGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  propertyCard: {
    flex: 1,
    minWidth: width < 768 ? '100%' : width < 1024 ? '45%' : '30%',
  },
  propertyImage: {
    height: 200,
  },
  propertyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#2D3748',
    fontWeight: 'bold',
  },
  propertyPrice: {
    color: LIME_GREEN,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyLocation: {
    color: '#718096',
    marginBottom: 16,
  },
  propertyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feature: {
    color: '#4A5568',
  },
  viewButton: {
    backgroundColor: LIME_GREEN,
  },
});