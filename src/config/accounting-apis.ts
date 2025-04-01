export const ACCOUNTING_APIS = {
  softTribe: {
    baseUrl: 'https://api.softtribe.com',
    clientId: process.env.SOFTTRIBE_CLIENT_ID,
    clientSecret: process.env.SOFTTRIBE_CLIENT_SECRET,
  },
  tally: {
    baseUrl: 'https://api.tally.com.gh',
    apiKey: process.env.TALLY_API_KEY,
  }
};