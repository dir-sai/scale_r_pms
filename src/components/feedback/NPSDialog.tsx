import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Textarea,
} from '@/components/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  touchpoint: string;
}

export function NPSDialog({ open, onClose, touchpoint }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === null) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, feedback, touchpoint }),
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit NPS:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How likely are you to recommend us?</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-11 gap-1 my-4">
          {[0,1,2,3,4,5,6,7,8,9,10].map((value) => (
            <button
              key={value}
              onClick={() => setScore(value)}
              className={`p-3 rounded ${
                score === value 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <Textarea
          placeholder="What's the main reason for your score?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />

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
            disabled={score === null || isSubmitting}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}