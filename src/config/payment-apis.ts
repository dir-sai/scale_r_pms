export const PAYMENT_APIS = {
  momo: {
    mtn: {
      baseUrl: 'https://proxy.momoapi.mtn.com',
      subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
      userId: process.env.MTN_USER_ID,
      apiKey: process.env.MTN_API_KEY,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    },
    vodafone: {
      baseUrl: process.env.VODAFONE_API_BASE_URL,
      merchantId: process.env.VODAFONE_MERCHANT_ID,
      apiKey: process.env.VODAFONE_API_KEY,
    },
    airtelTigo: {
      baseUrl: process.env.AIRTEL_TIGO_API_BASE_URL,
      merchantId: process.env.AIRTEL_TIGO_MERCHANT_ID,
      apiKey: process.env.AIRTEL_TIGO_API_KEY,
    }
  },
  aggregators: {
    paystack: {
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      secretKey: process.env.PAYSTACK_SECRET_KEY,
      baseUrl: 'https://api.paystack.co',
      merchantEmail: process.env.PAYSTACK_MERCHANT_EMAIL,
    },
    hubtel: {
      clientId: process.env.HUBTEL_CLIENT_ID,
      clientSecret: process.env.HUBTEL_CLIENT_SECRET,
      merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER,
      baseUrl: 'https://api.hubtel.com/v2',
    },
    expressPay: {
      merchantId: process.env.EXPRESSPAY_MERCHANT_ID,
      apiKey: process.env.EXPRESSPAY_API_KEY,
      baseUrl: 'https://api.expresspaygh.com',
    },
    slydepay: {
      merchantEmail: process.env.SLYDEPAY_MERCHANT_EMAIL,
      merchantKey: process.env.SLYDEPAY_MERCHANT_KEY,
      baseUrl: 'https://api.slydepay.com.gh',
    }
  },
  banks: {
    ghipss: {
      merchantId: process.env.GHIPSS_MERCHANT_ID,
      apiKey: process.env.GHIPSS_API_KEY,
      baseUrl: process.env.GHIPSS_API_BASE_URL,
    }
  }
};