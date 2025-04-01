import { GoogleServicesClient } from './GoogleServicesClient';
import { GOOGLE_SERVICES_CONFIG } from '../../../config/google-services';

export class StorageService {
  private storage = GoogleServicesClient.getInstance().getStorage();
  private bucket = this.storage.bucket(GOOGLE_SERVICES_CONFIG.storage.bucketName);

  async uploadFile(
    file: Buffer,
    destination: string,
    metadata?: { [key: string]: string }
  ): Promise<string> {
    const blob = this.bucket.file(destination);
    
    await blob.save(file, {
      metadata: {
        contentType: metadata?.contentType || 'application/octet-stream',
        ...metadata,
      },
    });

    return blob.publicUrl();
  }

  async deleteFile(path: string): Promise<void> {
    await this.bucket.file(path).delete();
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const [url] = await this.bucket.file(path).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });
    return url;
  }
}