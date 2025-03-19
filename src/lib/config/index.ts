import { z } from 'zod';

const ConfigSchema = z.object({
  app: z.object({
    name: z.string(),
    url: z.string().url(),
    apiUrl: z.string().url(),
    cdnUrl: z.string().url(),
    baseUrl: z.string().url(),
    environment: z.enum(['development', 'staging', 'production']),
  }),
  database: z.object({
    url: z.string(),
    sslEnabled: z.boolean(),
  }),
  auth: z.object({
    nextAuthUrl: z.string().url(),
    nextAuthSecret: z.string(),
    jwtSecret: z.string(),
    googleClientId: z.string(),
    googleClientSecret: z.string(),
    facebookAppId: z.string(),
    facebookAppSecret: z.string(),
  }),
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string(),
  }),
  redis: z.object({
    url: z.string(),
    password: z.string().optional(),
  }),
});

type Config = z.infer<typeof ConfigSchema>;

const getConfig = (): Config => {
  const config = {
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME!,
      url: process.env.NEXT_PUBLIC_APP_URL!,
      apiUrl: process.env.NEXT_PUBLIC_API_URL!,
      cdnUrl: process.env.NEXT_PUBLIC_CDN_URL!,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
      environment: (process.env.NODE_ENV || 'development') as Config['app']['environment'],
    },
    database: {
      url: process.env.DATABASE_URL!,
      sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    },
    auth: {
      nextAuthUrl: process.env.NEXTAUTH_URL!,
      nextAuthSecret: process.env.NEXTAUTH_SECRET!,
      jwtSecret: process.env.JWT_SECRET!,
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
      facebookAppSecret: process.env.FACEBOOK_APP_SECRET!,
    },
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    redis: {
      url: process.env.REDIS_URL!,
      password: process.env.REDIS_PASSWORD,
    },
  };

  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw new Error('Invalid configuration');
  }
};

export const config = getConfig();