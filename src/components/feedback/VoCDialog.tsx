import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function VoCDialog({ open, onClose }: Props) {
  const [category, setCategory] = useState('experience');
  const [sentiment, setSentiment] = useState('neutral');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback/voc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          sentiment,
          feedback,
          context: {
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit VoC:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="experience">User Experience</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-4">
            {['negative', 'neutral', 'positive'].map((value) => (
              <button
                key={value}
                onClick={() => setSentiment(value)}
                className={`p-3 rounded ${
                  sentiment === value 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value === 'positive' ? '😊' : value === 'neutral' ? '😐' : '😞'}
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Tell us more about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!feedback || isSubmitting}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}