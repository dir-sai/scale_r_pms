import { useEffect } from 'react';
import { SECURITY_APIS } from '@/config/security-apis';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function RecaptchaExample() {
  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${SECURITY_APIS.recaptcha.siteKey}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async () => {
    try {
      const token = await window.grecaptcha.execute(SECURITY_APIS.recaptcha.siteKey, {
        action: 'submit'
      });
      
      // Send token to your backend for verification
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (result.success) {
        // Handle successful verification
        console.log('reCAPTCHA verification successful');
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit with reCAPTCHA
    </button>
  );
}