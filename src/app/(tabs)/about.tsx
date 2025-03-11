import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, Card } from '@react-native-material/core'

const values = [
  {
    title: 'Trust & Transparency',
    description: 'Building lasting relationships through honest communication and clear processes.'
  },
  {
    title: 'Innovation',
    description: 'Leveraging technology to simplify property management and enhance tenant experience.'
  },
  {
    title: 'Community',
    description: 'Creating harmonious living spaces that foster strong communities and connections.'
  },
  {
    title: 'Excellence',
    description: 'Delivering exceptional service through attention to detail and continuous improvement.'
  },
  {
    title: 'Sustainability',
    description: 'Promoting eco-friendly practices and sustainable property management solutions.'
  }
];

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>About Scale-R PMS</Text>

        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.text}>
            Founded in 2024, Scale-R PMS emerged from a vision to transform property management in Ghana. We recognized the challenges faced by property owners and tenants in managing their rental relationships effectively. Our solution combines local expertise with modern technology to create a seamless property management experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.text}>
            We are committed to revolutionizing property management in Ghana by providing an innovative, user-friendly platform that connects property owners and tenants. Our goal is to streamline rental processes, enhance communication, and create positive living experiences while promoting sustainable property management practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {values.map((value, index) => (
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