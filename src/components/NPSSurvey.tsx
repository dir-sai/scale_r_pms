import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from '@react-native-material/core';
import { FeedbackService, NPSScore } from '@/lib/services/FeedbackService';

interface Props {
  userId: string;
  userType: 'tenant' | 'landlord' | 'agent';
  touchpoint: string;
  onComplete?: () => void;
}

export function NPSSurvey({ userId, userType, touchpoint, onComplete }: Props) {
  const [score, setScore] = useState<NPSScore | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === null) return;
    
    setIsSubmitting(true);
    try {
      await FeedbackService.submitNPS({
        score,
        feedback,
        userId,
        userType,
        touchpoint,
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
      <Text style={styles.question}>
        How likely are you to recommend Scale-R PMS to others?
      </Text>
      <View style={styles.scoreContainer}>
        {([0,1,2,3,4,5,6,7,8,9,10] as NPSScore[]).map((value) => (
          <Button
            key={value}
            onPress={() => setScore(value)}
            style={[
              styles.scoreButton,
              score === value && styles.selectedScore
            ]}
            title={value.toString()}
          />
        ))}
      </View>
      <TextInput
        label="What's the main reason for your score?"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        style={styles.feedback}
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={score === null || isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreButton: {
    width: 40,
    height: 40,
  },
  selectedScore: {
    backgroundColor: '#007AFF',
  },
  feedback: {
    marginBottom: 16,
  },
});