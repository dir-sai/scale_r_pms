import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, SegmentedButtons } from '@react-native-material/core';
import { FeedbackService } from '@/lib/services/FeedbackService';

interface Props {
  userId: string;
  userType: 'tenant' | 'landlord' | 'agent';
  onComplete?: () => void;
}

export function VoCSurvey({ userId, userType, onComplete }: Props) {
  const [category, setCategory] = useState<'bug' | 'feature' | 'experience' | 'support' | 'other'>('experience');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await FeedbackService.submitVoC({
        category,
        sentiment,
        feedback,
        userId,
        userType,
        context: {
          screen: 'current_screen_name',
          timestamp: new Date().toISOString(),
        },
      });
      onComplete?.();
    } catch (error) {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Feedback</Text>
      
      <SegmentedButtons
        value={category}
        onValueChange={setCategory}
        buttons={[
          { value: 'bug', label: 'Bug' },
          { value: 'feature', label: 'Feature' },
          { value: 'experience', label: 'Experience' },
          { value: 'support', label: 'Support' },
          { value: 'other', label: 'Other' },
        ]}
      />

      <SegmentedButtons
        value={sentiment}
        onValueChange={setSentiment}
        buttons={[
          { value: 'positive', label: '😊' },
          { value: 'neutral', label: '😐' },
          { value: 'negative', label: '😞' },
        ]}
      />

      <TextInput
        label="Tell us more about your experience"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
        style={styles.feedback}
      />

      <Button
        title="Submit Feedback"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={!feedback || isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  feedback: {
    marginVertical: 16,
  },
});