import { GoogleApisClient } from './GoogleApisClient';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class ServiceEnablement {
  private static readonly REQUIRED_APIS = [
    'analyticsreporting.googleapis.com',
    'bigquery.googleapis.com',
    'bigqueryconnection.googleapis.com',
    'bigquerydatapolicy.googleapis.com',
    'bigquerymigration.googleapis.com',
    'bigqueryreservation.googleapis.com',
    'bigquerystorage.googleapis.com',
    'dataplex.googleapis.com',
    'datastore.googleapis.com',
    'logging.googleapis.com',
    'monitoring.googleapis.com',
    'sqladmin.googleapis.com',
    'storage.googleapis.com',
    'cloudtrace.googleapis.com',
    'dataform.googleapis.com',
    'gmail.googleapis.com',
    'calendar-json.googleapis.com',
    'drive.googleapis.com',
    'maps-backend.googleapis.com',
    'iam.googleapis.com',
    'servicemanagement.googleapis.com',
    'serviceusage.googleapis.com',
  ];

  private static async enableApi(serviceName: string) {
    const client = await GoogleApisClient.getInstance().getAuthenticatedClient();
    const serviceusage = GoogleApisClient.getInstance().getApis().serviceusage;

    const request = {
      name: `projects/${GOOGLE_SERVICES_CONFIG.project.id}/services/${serviceName}`,
      auth: client,
    };

    try {
      await serviceusage.services.enable(request);
      console.log(`Enabled ${serviceName}`);
    } catch (error) {
      console.error(`Error enabling ${serviceName}:`, error);
      throw error;
    }
  }

  public static async enableRequiredApis() {
    for (const api of this.REQUIRED_APIS) {
      await this.enableApi(api);
    }
  }

  public static async checkApiStatus() {
    const client = await GoogleApisClient.getInstance().getAuthenticatedClient();
    const serviceusage = GoogleApisClient.getInstance().getApis().serviceusage;

    const request = {
      parent: `projects/${GOOGLE_SERVICES_CONFIG.project.id}`,
      filter: 'state:ENABLED',
      auth: client,
    };

    try {
      const response = await serviceusage.services.list(request);
      return response.data.services;
    } catch (error) {
      console.error('Error checking API status:', error);
      throw error;
    }
  }
}