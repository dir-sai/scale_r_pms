import { GoogleServicesClient } from './GoogleServicesClient';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class MonitoringService {
  private monitoring = GoogleServicesClient.getInstance().getMonitoring();
  private logging = GoogleServicesClient.getInstance().getLogging();

  async createMetric(
    name: string,
    description: string,
    metricType: 'GAUGE' | 'DELTA' | 'CUMULATIVE'
  ): Promise<void> {
    const client = this.monitoring.projectMetricDescriptorPath(
      GOOGLE_SERVICES_CONFIG.project.id
    );

    await this.monitoring.createMetricDescriptor({
      name: client,
      metricDescriptor: {
        displayName: name,
        description,
        type: `custom.googleapis.com/${name}`,
        metricKind: metricType,
        valueType: 'INT64',
      },
    });
  }

  async logMetric(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    const dataPoint = {
      interval: {
        endTime: {
          seconds: Date.now() / 1000,
        },
      },
      value: {
        int64Value: value,
      },
    };

    const timeSeriesData = {
      metric: {
        type: `custom.googleapis.com/${name}`,
        labels,
      },
      resource: {
        type: 'global',
        labels: {
          project_id: GOOGLE_SERVICES_CONFIG.project.id,
        },
      },
      points: [dataPoint],
    };

    await this.monitoring.createTimeSeries({
      name: this.monitoring.projectPath(GOOGLE_SERVICES_CONFIG.project.id),
      timeSeries: [timeSeriesData],
    });
  }

  async logError(error: Error, metadata: Record<string, any> = {}): Promise<void> {
    const log = this.logging.log('errors');
    const entry = log.entry({
      severity: 'ERROR',
      resource: {
        type: 'global',
      },
      labels: {
        ...metadata,
      },
      jsonPayload: {
        message: error.message,
        stack: error.stack,
        ...metadata,
      },
    });

    await log.write(entry);
  }
}