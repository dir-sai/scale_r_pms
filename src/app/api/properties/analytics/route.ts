import { AnalyticsService } from '@/lib/services/google/AnalyticsService';
import { MonitoringService } from '@/lib/services/google/MonitoringService';

const analyticsService = new AnalyticsService();
const monitoringService = new MonitoringService();

export async function POST(req: Request) {
  try {
    const { propertyId } = await req.json();
    
    // Track property view
    await analyticsService.trackPropertyView(propertyId);
    
    // Log metric
    await monitoringService.logMetric('property.views', 1, { propertyId });
    
    return Response.json({ success: true });
  } catch (error) {
    await monitoringService.logError(error as Error, { endpoint: '/api/properties/analytics' });
    return Response.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!propertyId) {
      return Response.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const analytics = await analyticsService.getPropertyAnalytics(propertyId, days);
    return Response.json(analytics);
  } catch (error) {
    await monitoringService.logError(error as Error, { endpoint: '/api/properties/analytics' });
    return Response.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}