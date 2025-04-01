import { ServiceEnablement } from './ServiceEnablement';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export async function initializeGoogleServices() {
  if (process.env.NODE_ENV === 'production') {
    try {
      // Enable all required APIs
      await ServiceEnablement.enableRequiredApis();
      
      // Check API status
      const enabledServices = await ServiceEnablement.checkApiStatus();
      console.log('Enabled Google Cloud Services:', enabledServices);
      
    } catch (error) {
      console.error('Failed to initialize Google Services:', error);
      throw error;
    }
  }
}