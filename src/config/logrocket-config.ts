import LogRocket from 'logrocket';

// Sensitive data patterns to redact
const SENSITIVE_DATA_PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PHONE: /(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
  CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  SSN: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
};

// Network request rules
const NETWORK_RULES = [
  {
    // Redact sensitive data from request bodies
    requestSanitizer: (request: any) => {
      if (request.body) {
        // Deep clone to avoid modifying original request
        const sanitizedBody = JSON.parse(JSON.stringify(request.body));
        
        // Redact sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'creditCard', 'ssn'];
        sensitiveFields.forEach(field => {
          if (sanitizedBody[field]) {
            sanitizedBody[field] = '[REDACTED]';
          }
        });
        
        request.body = sanitizedBody;
      }
      return request;
    },
    
    // Redact sensitive data from response bodies
    responseSanitizer: (response: any) => {
      if (response.body) {
        // Redact sensitive data patterns
        Object.values(SENSITIVE_DATA_PATTERNS).forEach(pattern => {
          response.body = response.body.replace(pattern, '[REDACTED]');
        });
      }
      return response;
    },
    
    // URLs to ignore completely
    urlsToIgnore: [
      '/api/auth',
      '/api/payments',
      '/api/verification',
    ],
  },
];

// DOM element rules
const DOM_RULES = [
  {
    // Prevent logging of sensitive input fields
    selector: 'input[type="password"], input[name*="credit"], input[name*="ssn"]',
    hide: true,
  },
  {
    // Mask potentially sensitive text inputs
    selector: 'input[type="text"], input[type="email"], input[type="tel"]',
    mask: true,
  },
];

export const initializeLogrocket = () => {
  if (typeof window === 'undefined') return;

  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!, {
    release: process.env.NEXT_PUBLIC_APP_VERSION,
    dom: {
      baseHref: process.env.NEXT_PUBLIC_APP_URL,
      textSanitizer: true,
      inputSanitizer: true,
      elements: DOM_RULES,
    },
    network: {
      isEnabled: true,
      rules: NETWORK_RULES,
    },
    console: {
      isEnabled: true,
      shouldAggregateConsoleErrors: true,
    },
    privacy: {
      blacklist: [
        'password',
        'secret',
        'token',
        'creditCard',
        'ssn',
        'socialSecurity',
      ],
    },
    uploadLimit: 50, // MB
  });

  // Set up error grouping
  LogRocket.getSessionURL(sessionURL => {
    window._lrSettings = {
      errorGrouping: {
        enabled: true,
        rules: [
          {
            name: 'API Errors',
            condition: (error: Error) => error.message.includes('API Error'),
            groupBy: (error: Error) => error.message.split(':')[0],
          },
          {
            name: 'Authentication Errors',
            condition: (error: Error) => error.message.includes('Auth Error'),
            groupBy: (error: Error) => 'Authentication Error',
          },
        ],
      },
    };
  });
};