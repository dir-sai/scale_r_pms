import { google } from 'googleapis';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class GoogleApisClient {
  private static instance: GoogleApisClient;
  private auth: any;

  private constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_SERVICES_CONFIG.credentials,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/bigquery',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/sqlservice.admin',
        'https://www.googleapis.com/auth/monitoring',
        'https://www.googleapis.com/auth/logging.admin',
        'https://www.googleapis.com/auth/trace.append',
      ],
    });
  }

  public static getInstance(): GoogleApisClient {
    if (!GoogleApisClient.instance) {
      GoogleApisClient.instance = new GoogleApisClient();
    }
    return GoogleApisClient.instance;
  }

  public getApis() {
    return {
      analytics: google.analytics('v3'),
      bigquery: google.bigquery('v2'),
      bigqueryconnection: google.bigqueryconnection('v1'),
      bigquerydatapolicy: google.bigquerydatapolicy('v1'),
      bigquerymigration: google.bigquerymigration('v2'),
      bigqueryreservation: google.bigqueryreservation('v1'),
      bigquerystorage: google.bigquerystorage('v1'),
      dataplex: google.dataplex('v1'),
      datastore: google.datastore('v1'),
      logging: google.logging('v2'),
      monitoring: google.monitoring('v3'),
      sql: google.sql('v1beta4'),
      storage: google.storage('v1'),
      cloudtrace: google.cloudtrace('v2'),
      dataform: google.dataform('v1beta1'),
      gmail: google.gmail('v1'),
      calendar: google.calendar('v3'),
      drive: google.drive('v3'),
      maps: google.maps('v1'),
      iam: google.iam('v1'),
      servicemanagement: google.servicemanagement('v1'),
      serviceusage: google.serviceusage('v1'),
    };
  }

  public async getAuthenticatedClient() {
    const client = await this.auth.getClient();
    return client;
  }
}