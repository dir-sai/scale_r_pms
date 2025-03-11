import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme/theme';
import { Button } from '../common/Button';
import { Container } from '../common/Container';
import { Row, Col } from '../common/Grid';
import { Icon } from '../common/IconProvider';
import { useAnimation } from '../../hooks/useAnimation';

export const Hero: React.FC = () => {
  const fadeInAnimation = useAnimation({
    type: 'fade',
    initialValue: 0,
    finalValue: 1,
    duration: 1000,
  });

  const slideUpAnimation = useAnimation({
    type: 'slide',
    initialValue: 50,
    finalValue: 0,
    duration: 1000,
  });

  return (
    <View style={styles.hero}>
      <Container>
        <Row>
          <Col size={{ xs: 12, md: 10, lg: 8 }} offset={2}>
            <View style={[styles.content, { opacity: fadeInAnimation.value, transform: [{ translateY: slideUpAnimation.value }] }]}>
              <View style={styles.iconContainer}>
                <Icon name="home" size="xl" color={theme.colors.primary} />
              </View>
              <Text style={styles.preTitle}>WELCOME TO SCALE-R PMS</Text>
              <Text style={styles.title}>
                Transforming Property{'\n'}Management in Ghana
              </Text>
              <Text style={styles.subtitle}>
                Streamline your property operations, enhance tenant satisfaction, and boost your revenue with Ghana's most comprehensive property management solution.
              </Text>
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size="sm" color={theme.colors.status.success} />
                  <Text style={styles.featureText}>Efficient Property Management</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size="sm" color={theme.colors.status.success} />
                  <Text style={styles.featureText}>Automated Rent Collection</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="check-circle" size="sm" color={theme.colors.status.success} />
                  <Text style={styles.featureText}>Real-time Analytics</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button 
                  title="Get Started" 
                  onPress={() => {}} 
                  variant="primary"
                  size="large"
                />
                <Button 
                  title="Watch Demo" 
                  onPress={() => {}} 
                  variant="secondary"
                  size="large"
                />
              </View>
            </View>
          </Col>
        </Row>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.background.primary,
    minHeight: Dimensions.get('window').height * 0.8,
    paddingVertical: theme.spacing[12],
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  preTitle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold as any,
    letterSpacing: 4,
    color: theme.colors.primary,
    marginBottom: theme.spacing[4],
    textTransform: 'uppercase' as const,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['5xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    lineHeight: theme.typography.lineHeights.tight * theme.typography.sizes['5xl'],
  },
  subtitle: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.lg,
    maxWidth: 600,
  },
  features: {
    marginBottom: theme.spacing[8],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  featureText: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[2],
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginTop: theme.spacing[6],
  },
}); 