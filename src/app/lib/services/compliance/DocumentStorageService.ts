import { IntegrationService, IntegrationConfig } from '../integrations/IntegrationService';

export interface DocumentMetadata {
  id: string;
  type: 'lease' | 'inspection' | 'certificate' | 'notice' | 'form';
  title: string;
  description?: string;
  propertyId?: string;
  tenantId?: string;
  expiryDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'expired' | 'archived';
  version: number;
}

export interface DocumentContent {
  content: Buffer;
  contentType: string;
  filename: string;
  size: number;
}

export interface DocumentStorageConfig extends IntegrationConfig {
  bucketName: string;
  region?: string;
}

export abstract class DocumentStorageService extends IntegrationService {
  protected config: DocumentStorageConfig;

  constructor(config: DocumentStorageConfig) {
    super(config);
    this.config = config;
  }

  abstract uploadDocument(
    metadata: Omit<DocumentMetadata, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
    content: DocumentContent
  ): Promise<DocumentMetadata>;

  abstract updateDocument(
    id: string,
    metadata: Partial<DocumentMetadata>,
    content?: DocumentContent
  ): Promise<DocumentMetadata>;

  abstract getDocument(id: string): Promise<{
    metadata: DocumentMetadata;
    content: DocumentContent;
  }>;

  abstract listDocuments(filters?: {
    type?: DocumentMetadata['type'];
    propertyId?: string;
    tenantId?: string;
    status?: DocumentMetadata['status'];
    tags?: string[];
  }): Promise<DocumentMetadata[]>;

  abstract deleteDocument(id: string): Promise<void>;

  abstract generateSignedUrl(id: string, expiresInMinutes?: number): Promise<string>;
} 