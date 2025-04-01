export const INFRASTRUCTURE_APIS = {
  database: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    redis: {
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN
    }
  },
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || 'eu-west-1',
    }
  },
  cdn: {
    cloudfront: {
      url: process.env.CLOUDFRONT_URL,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY
    }
  }
}