export const SECURITY_APIS = {
  recaptcha: {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    secretKey: process.env.RECAPTCHA_SECRET_KEY
  },
  verification: {
    ghana: {
      // Ghana Card verification
      ndaVerification: {
        apiKey: process.env.NDA_VERIFICATION_API_KEY
      },
      // Drivers license verification
      dvlaVerification: {
        apiKey: process.env.DVLA_VERIFICATION_API_KEY
      }
    }
  }
}