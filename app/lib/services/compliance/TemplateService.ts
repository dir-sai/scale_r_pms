import { IntegrationService } from '../integrations/IntegrationService';
import { DocumentMetadata, DocumentContent } from './DocumentStorageService';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // For select type
  description?: string;
}

export interface DocumentTemplate {
  id: string;
  type: DocumentMetadata['type'];
  title: string;
  description?: string;
  content: string;
  variables: TemplateVariable[];
  language: 'en' | 'other';
  version: number;
  status: 'draft' | 'active' | 'archived';
  category: 'standard' | 'custom';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

export interface GenerateDocumentOptions {
  templateId: string;
  variables: Record<string, string>;
  propertyId?: string;
  tenantId?: string;
  format?: 'pdf' | 'docx';
}

export class TemplateService extends IntegrationService {
  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid template service configuration');
    }
  }

  validateConfig(): boolean {
    return true; // No specific config needed for base implementation
  }

  async createTemplate(data: Omit<DocumentTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<DocumentTemplate> {
    return this.handleRequest(
      (async () => {
        // Implementation would store the template in the database
        const template: DocumentTemplate = {
          id: `template_${Date.now()}`,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return template;
      })(),
      'Failed to create document template'
    );
  }

  async updateTemplate(
    id: string,
    data: Partial<Omit<DocumentTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt'>>
  ): Promise<DocumentTemplate> {
    return this.handleRequest(
      (async () => {
        // Implementation would update the template in the database
        const template: DocumentTemplate = {
          id,
          version: 2, // Increment version
          updatedAt: new Date(),
          ...data,
        } as DocumentTemplate;
        return template;
      })(),
      'Failed to update document template'
    );
  }

  async getTemplate(id: string): Promise<DocumentTemplate> {
    return this.handleRequest(
      (async () => {
        // Implementation would retrieve the template from the database
        throw new Error('Template not found');
      })(),
      'Failed to get document template'
    );
  }

  async listTemplates(filters?: {
    type?: DocumentMetadata['type'];
    status?: DocumentTemplate['status'];
    category?: DocumentTemplate['category'];
    tags?: string[];
  }): Promise<DocumentTemplate[]> {
    return this.handleRequest(
      (async () => {
        // Implementation would query templates from the database
        return [];
      })(),
      'Failed to list document templates'
    );
  }

  async generateDocument(options: GenerateDocumentOptions): Promise<{
    metadata: DocumentMetadata;
    content: DocumentContent;
  }> {
    return this.handleRequest(
      (async () => {
        const template = await this.getTemplate(options.templateId);
        
        // Validate all required variables are provided
        const missingVariables = template.variables
          .filter(v => v.required && !options.variables[v.key])
          .map(v => v.key);
        
        if (missingVariables.length > 0) {
          throw new Error(`Missing required variables: ${missingVariables.join(', ')}`);
        }

        // Replace variables in template content
        let content = template.content;
        Object.entries(options.variables).forEach(([key, value]) => {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        // Generate document metadata
        const metadata: Omit<DocumentMetadata, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
          type: template.type,
          title: this.replaceVariables(template.title, options.variables),
          propertyId: options.propertyId,
          tenantId: options.tenantId,
          tags: [...template.tags],
          status: 'active',
        };

        // Generate document content
        const documentContent: DocumentContent = {
          content: Buffer.from(content),
          contentType: options.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          filename: `${metadata.title}.${options.format || 'docx'}`,
          size: Buffer.from(content).length,
        };

        return {
          metadata: {
            ...metadata,
            id: `doc_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
          },
          content: documentContent,
        };
      })(),
      'Failed to generate document from template'
    );
  }

  private replaceVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/{{(\w+)}}/g, (match, key) => variables[key] || match);
  }
} 