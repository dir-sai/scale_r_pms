import { View, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'

interface Feature {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: 'Smart Property Management',
    description: 'Efficiently manage multiple properties with our intuitive dashboard. Track rent payments, maintenance requests, and tenant communications in one place.'
  },
  {
    title: 'Seamless Payments',
    description: 'Process rent payments securely through multiple payment methods including mobile money, bank transfers, and cards. Automated reminders and receipt generation included.'
  },
  {
    title: 'Maintenance Tracking',
    description: 'Stay on top of maintenance requests with our comprehensive tracking system. Assign tasks, monitor progress, and communicate with tenants and service providers efficiently.'
  },
  {
    title: 'Document Management',
    description: 'Securely store and manage all property-related documents including leases, receipts, and maintenance records. Easy access and sharing capabilities included.'
  }
];

export default function HomePage() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Welcome to Scale-R PMS</ThemedText>
      <ThemedText style={styles.description}>
        Your comprehensive property management solution in Ghana. Streamline operations, enhance tenant satisfaction, and grow your property business with our innovative platform.
      </ThemedText>

      <View style={styles.featuresContainer}>
        <ThemedText type="subtitle" style={styles.featuresTitle}>Key Features</ThemedText>

        {features.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <ThemedText type="subtitle2">{feature.title}</ThemedText>
            <ThemedText>{feature.description}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featuresTitle: {
    marginBottom: 20,
  },
  feature: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
