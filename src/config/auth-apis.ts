export const AUTH_APIS = {
  nextAuth: {
    url: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID,
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY
  }
}