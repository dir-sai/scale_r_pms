export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.scale-r-pms.com/v1',
  TIMEOUT: 15000, // 15 seconds
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      REFRESH_TOKEN: '/auth/refresh-token',
      SOCIAL_AUTH: {
        GOOGLE: '/auth/google',
        FACEBOOK: '/auth/facebook',
      },
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
    },
    PROPERTY: {
      LIST: '/properties',
      DETAIL: (id: string) => `/properties/${id}`,
      CREATE: '/properties',
      UPDATE: (id: string) => `/properties/${id}`,
      DELETE: (id: string) => `/properties/${id}`,
      PHOTOS: {
        UPLOAD: (propertyId: string) => `/properties/${propertyId}/photos`,
        DELETE: (propertyId: string, photoId: string) => 
          `/properties/${propertyId}/photos/${photoId}`,
      },
      DOCUMENTS: {
        UPLOAD: (propertyId: string) => `/properties/${propertyId}/documents`,
        DELETE: (propertyId: string, documentId: string) =>
          `/properties/${propertyId}/documents/${documentId}`,
      },
      UNITS: {
        LIST: (propertyId: string) => `/properties/${propertyId}/units`,
        DETAIL: (propertyId: string, unitId: string) =>
          `/properties/${propertyId}/units/${unitId}`,
        CREATE: (propertyId: string) => `/properties/${propertyId}/units`,
        UPDATE: (propertyId: string, unitId: string) =>
          `/properties/${propertyId}/units/${unitId}`,
        DELETE: (propertyId: string, unitId: string) =>
          `/properties/${propertyId}/units/${unitId}`,
      },
      AMENITIES: '/amenities',
      SYNDICATE: (propertyId: string) => `/properties/${propertyId}/syndicate`,
    },
  },
  SOCIAL_AUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      SCOPES: ['profile', 'email'],
    },
    FACEBOOK: {
      APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      SCOPES: ['public_profile', 'email'],
    },
  },
}; 