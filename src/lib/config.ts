interface Config {
  app: {
    name: string;
    url: string;
    apiUrl: string;
    cdnUrl: string;
    baseUrl: string;
  };
  auth: {
    nextAuthUrl: string;
    googleClientId: string;
    facebookAppId: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

const development: Config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME!,
    url: process.env.NEXT_PUBLIC_APP_URL!,
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL!,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  },
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL!,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
};

const production: Config = {
  ...development,
  // Override production-specific values here
};

const staging: Config = {
  ...development,
  // Override staging-specific values here
};

const configs = {
  development,
  production,
  staging,
};

const environment = process.env.NODE_ENV || 'development';
export const config = configs[environment as keyof typeof configs];