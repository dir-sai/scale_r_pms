import { useState, useEffect } from 'react';

const FEEDBACK_COOLDOWN = 30 * 24 * 60 * 60 * 1000; // 30 days

export function useFeedback() {
  const [showNPS, setShowNPS] = useState(false);
  const [showVoC, setShowVoC] = useState(false);
  const [currentTouchpoint, setCurrentTouchpoint] = useState('');

  const checkFeedbackTrigger = async (key: string) => {
    const lastShown = localStorage.getItem(key);
    if (!lastShown) return true;
    
    const timeSinceLastShown = Date.now() - parseInt(lastShown, 10);
    return timeSinceLastShown > FEEDBACK_COOLDOWN;
  };

  const markFeedbackShown = (key: string) => {
    localStorage.setItem(key, Date.now().toString());
  };

  const triggerNPS = async (touchpoint: string) => {
    const key = `nps_${touchpoint}`;
    const shouldShow = await checkFeedbackTrigger(key);
    if (shouldShow) {
      setCurrentTouchpoint(touchpoint);
      setShowNPS(true);
      markFeedbackShown(key);
    }
  };

  const triggerVoC = async () => {
    const shouldShow = await checkFeedbackTrigger('voc');
    if (shouldShow) {
      setShowVoC(true);
      markFeedbackShown('voc');
    }
  };

  return {
    showNPS,
    showVoC,
    currentTouchpoint,
    setShowNPS,
    setShowVoC,
    triggerNPS,
    triggerVoC,
  };
}