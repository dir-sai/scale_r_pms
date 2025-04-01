export const GOOGLE_SERVICES_CONFIG = {
  project: {
    id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    region: process.env.GOOGLE_CLOUD_REGION || 'us-central1',
  },
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  bigQuery: {
    datasetId: process.env.BIGQUERY_DATASET_ID,
    location: process.env.BIGQUERY_LOCATION || 'US',
  },
  storage: {
    bucketName: process.env.GOOGLE_STORAGE_BUCKET,
  },
  cloudSql: {
    instanceName: process.env.CLOUD_SQL_INSTANCE,
    database: process.env.CLOUD_SQL_DATABASE,
  },
  apis: {
    calendar: {
      calendarId: process.env.GOOGLE_CALENDAR_ID,
    },
    maps: {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    gmail: {
      userId: 'me',
    }
  }
};