import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { Logging } from '@google-cloud/logging';
import { Monitoring } from '@google-cloud/monitoring';
import { Trace } from '@google-cloud/trace-agent';
import { calendar_v3, google } from 'googleapis';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class GoogleServicesClient {
  private static instance: GoogleServicesClient;
  private bigquery: BigQuery;
  private storage: Storage;
  private logging: Logging;
  private monitoring: Monitoring;
  private calendar: calendar_v3.Calendar;

  private constructor() {
    // Initialize services
    this.bigquery = new BigQuery({
      projectId: GOOGLE_SERVICES_CONFIG.project.id,
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
    });

    this.storage = new Storage({
      projectId: GOOGLE_SERVICES_CONFIG.project.id,
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
    });

    this.logging = new Logging({
      projectId: GOOGLE_SERVICES_CONFIG.project.id,
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
    });

    this.monitoring = new Monitoring({
      projectId: GOOGLE_SERVICES_CONFIG.project.id,
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
    });

    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  public static getInstance(): GoogleServicesClient {
    if (!GoogleServicesClient.instance) {
      GoogleServicesClient.instance = new GoogleServicesClient();
    }
    return GoogleServicesClient.instance;
  }

  public getBigQuery(): BigQuery {
    return this.bigquery;
  }

  public getStorage(): Storage {
    return this.storage;
  }

  public getLogging(): Logging {
    return this.logging;
  }

  public getMonitoring(): Monitoring {
    return this.monitoring;
  }

  public getCalendar(): calendar_v3.Calendar {
    return this.calendar;
  }
}