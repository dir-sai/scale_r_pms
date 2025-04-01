import { GoogleServicesClient } from './GoogleServicesClient';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class AnalyticsService {
  private bigquery = GoogleServicesClient.getInstance().getBigQuery();
  private dataset = GOOGLE_SERVICES_CONFIG.bigQuery.datasetId;

  async createPropertyAnalyticsTable(): Promise<void> {
    const schema = [
      { name: 'property_id', type: 'STRING' },
      { name: 'views', type: 'INTEGER' },
      { name: 'inquiries', type: 'INTEGER' },
      { name: 'timestamp', type: 'TIMESTAMP' },
    ];

    await this.bigquery
      .dataset(this.dataset)
      .createTable('property_analytics', { schema });
  }

  async trackPropertyView(propertyId: string): Promise<void> {
    const query = `
      INSERT INTO \`${GOOGLE_SERVICES_CONFIG.project.id}.${this.dataset}.property_analytics\`
      (property_id, views, inquiries, timestamp)
      VALUES (@propertyId, 1, 0, CURRENT_TIMESTAMP())
    `;

    const options = {
      query,
      params: { propertyId },
    };

    await this.bigquery.query(options);
  }

  async getPropertyAnalytics(propertyId: string, days: number = 30) {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        SUM(views) as total_views,
        SUM(inquiries) as total_inquiries
      FROM \`${GOOGLE_SERVICES_CONFIG.project.id}.${this.dataset}.property_analytics\`
      WHERE property_id = @propertyId
      AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL @days DAY)
      GROUP BY date
      ORDER BY date ASC
    `;

    const options = {
      query,
      params: { propertyId, days },
    };

    const [rows] = await this.bigquery.query(options);
    return rows;
  }
}