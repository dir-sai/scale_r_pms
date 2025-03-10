import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>About Scale-R PMS</Text>
        
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.text}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {[
              { title: 'Integrity', description: 'We maintain the highest standards of integrity in all our dealings.' },
              { title: 'Excellence', description: 'We strive for excellence in every aspect of our service.' },
              { title: 'Innovation', description: 'We continuously innovate to provide better solutions.' },
              { title: 'Customer Focus', description: 'We put our customers first in everything we do.' },
            ].map((value, index) => (
              <Card key={index} style={styles.valueCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.valueTitle}>{value.title}</Text>
                  <Text style={styles.valueDescription}>{value.description}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 40,
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  title: {
    color: '#2D3748',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: '#2D3748',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  valueCard: {
    flex: 1,
    minWidth: 250,
  },
  valueTitle: {
    color: '#32CD32',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  valueDescription: {
    color: '#718096',
  },
});