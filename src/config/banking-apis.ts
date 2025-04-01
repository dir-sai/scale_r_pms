export const BANKING_APIS = {
  ecobank: {
    baseUrl: 'https://developer.ecobank.com',
    clientId: process.env.ECOBANK_CLIENT_ID,
    clientSecret: process.env.ECOBANK_CLIENT_SECRET,
  },
  calbank: {
    baseUrl: 'https://api.calbank.net',
    apiKey: process.env.CALBANK_API_KEY,
  },
  fidelitybank: {
    baseUrl: 'https://api.fidelitybank.com.gh',
    apiKey: process.env.FIDELITY_API_KEY,
  }
};