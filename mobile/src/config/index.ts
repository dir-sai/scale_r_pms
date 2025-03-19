import { z } from 'zod';

const MobileConfigSchema = z.object({
  app: z.object({
    name: z.string(),
    apiUrl: z.string().url(),
    baseUrl: z.string().url(),
  }),
  auth: z.object({
    googleClientId: z.string(),
    facebookAppId: z.string(),
  }),
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string(),
  }),
  storage: z.object({
    authPersistKey: z.string(),
    tokenPersistKey: z.string(),
  }),
});

type MobileConfig = z.infer<typeof MobileConfigSchema>;

const getMobileConfig = (): MobileConfig => {
  const config = {
    app: {
      name: process.env.EXPO_PUBLIC_APP_NAME!,
      apiUrl: process.env.EXPO_PUBLIC_API_URL!,
      baseUrl: process.env.EXPO_PUBLIC_APP_URL!,
    },
    auth: {
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID!,
    },
    supabase: {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    },
    storage: {
      authPersistKey: '@auth',
      tokenPersistKey: '@token',
    },
  };

  try {
    return MobileConfigSchema.parse(config);
  } catch (error) {
    console.error('Mobile configuration validation failed:', error);
    throw new Error('Invalid mobile configuration');
  }
};

export const mobileConfig = getMobileConfig();