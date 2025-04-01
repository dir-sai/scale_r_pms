export const FINANCIAL_APIS = {
  momo: {
    mtn: {
      baseUrl: 'https://proxy.momoapi.mtn.com',
      subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
      userId: process.env.MTN_USER_ID,
      apiKey: process.env.MTN_API_KEY,
      environment: process.env.MTN_ENVIRONMENT || 'sandbox'
    },
    vodafone: {
      baseUrl: process.env.VODAFONE_API_BASE_URL,
      merchantId: process.env.VODAFONE_MERCHANT_ID,
      apiKey: process.env.VODAFONE_API_KEY
    },
    airtelTigo: {
      baseUrl: process.env.AIRTEL_TIGO_API_BASE_URL,
      merchantId: process.env.AIRTEL_TIGO_MERCHANT_ID,
      apiKey: process.env.AIRTEL_TIGO_API_KEY
    }
  },
  aggregators: {
    paystack: {
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      secretKey: process.env.PAYSTACK_SECRET_KEY,
      merchantEmail: process.env.PAYSTACK_MERCHANT_EMAIL
    },
    hubtel: {
      clientId: process.env.HUBTEL_CLIENT_ID,
      clientSecret: process.env.HUBTEL_CLIENT_SECRET,
      merchantNumber: process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER
    }
  },
  ghipss: {
    merchantId: process.env.GHIPSS_MERCHANT_ID,
    apiKey: process.env.GHIPSS_API_KEY,
    baseUrl: process.env.GHIPSS_API_BASE_URL
  },
  banking: {
    ecobank: {
      clientId: process.env.ECOBANK_CLIENT_ID,
      clientSecret: process.env.ECOBANK_CLIENT_SECRET
    },
    calbank: {
      apiKey: process.env.CALBANK_API_KEY
    }
  }
}