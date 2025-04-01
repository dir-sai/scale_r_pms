import { AWSService } from '../aws/AWSService';
import { INFRASTRUCTURE_APIS } from '../../../config/infrastructure-apis';

export class StorageService {
  private static instance: StorageService;
  private awsService: AWSService;

  private constructor() {
    this.awsService = new AWSService({
      s3: {
        accessKeyId: INFRASTRUCTURE_APIS.storage.aws.accessKeyId!,
        secretAccessKey: INFRASTRUCTURE_APIS.storage.aws.secretAccessKey!,
        bucket: INFRASTRUCTURE_APIS.storage.aws.bucket!,
        region: INFRASTRUCTURE_APIS.storage.aws.region,
      },
      cloudfront: {
        url: INFRASTRUCTURE_APIS.cdn.cloudfront.url!,
        keyPairId: INFRASTRUCTURE_APIS.cdn.cloudfront.keyPairId!,
        privateKey: INFRASTRUCTURE_APIS.cdn.cloudfront.privateKey!,
      },
    });
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadFile(
    file: Buffer,
    path: string,
    options: {
      contentType?: string;
      isPublic?: boolean;
      metadata?: Record<string, string>;
    } = {}
  ): Promise<string> {
    const contentType = options.contentType || 'application/octet-stream';
    const url = await this.awsService.uploadFile(file, path, contentType);
    
    if (options.isPublic) {
      return url;
    }
    
    return this.awsService.getSignedCloudFrontUrl(path);
  }

  async deleteFile(path: string): Promise<void> {
    await this.awsService.deleteFile(path);
  }

  async getSignedUrl(path: string, expiresIn?: number): Promise<string> {
    return this.awsService.getSignedCloudFrontUrl(path, expiresIn);
  }

  getPublicUrl(path: string): string {
    return this.awsService.getCloudFrontUrl(path);
  }
}