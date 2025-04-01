import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { CloudFrontRequestSigner } from '@aws-sdk/cloudfront-signer';

interface AWSConfig {
  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    region: string;
  };
  cloudfront: {
    url: string;
    keyPairId: string;
    privateKey: string;
  };
}

export class AWSService {
  private s3Client: S3Client;
  private cloudfrontClient: CloudFrontClient;
  private config: AWSConfig;

  constructor(config: AWSConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });

    this.cloudfrontClient = new CloudFrontClient({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      CacheControl: 'max-age=31536000', // 1 year cache
    });

    await this.s3Client.send(command);
    return this.getCloudFrontUrl(key);
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
    await this.invalidateCache([key]);
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  getCloudFrontUrl(key: string): string {
    return `${this.config.cloudfront.url}/${key}`;
  }

  async getSignedCloudFrontUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const url = this.getCloudFrontUrl(key);
    const signer = new CloudFrontRequestSigner(
      this.config.cloudfront.keyPairId,
      this.config.cloudfront.privateKey
    );

    return signer.getSignedUrl({
      url,
      dateLessThan: new Date(Date.now() + expiresIn * 1000),
    });
  }

  private async invalidateCache(paths: string[]): Promise<void> {
    const command = new CreateInvalidationCommand({
      DistributionId: this.config.cloudfront.url.split('.')[0],
      InvalidationBatch: {
        Paths: {
          Quantity: paths.length,
          Items: paths.map(path => `/${path}`),
        },
        CallerReference: Date.now().toString(),
      },
    });

    await this.cloudfrontClient.send(command);
  }
}