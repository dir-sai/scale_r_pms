import { DocumentMetadata, DocumentComment, DocumentVersion, DocumentShare } from '../../types/documents';
import { api } from '../api';

class DocumentService {
  static async getComments(tenantId: string, documentId: string): Promise<DocumentComment[]> {
    const response = await api.get(`/tenants/${tenantId}/documents/${documentId}/comments`);
    return response.data;
  }

  static async addComment(
    tenantId: string,
    documentId: string,
    data: { content: string; parentId?: string }
  ): Promise<DocumentComment> {
    const response = await api.post(`/tenants/${tenantId}/documents/${documentId}/comments`, data);
    return response.data;
  }

  static async updateComment(
    tenantId: string,
    documentId: string,
    commentId: string,
    data: { content: string }
  ): Promise<DocumentComment> {
    const response = await api.put(
      `/tenants/${tenantId}/documents/${documentId}/comments/${commentId}`,
      data
    );
    return response.data;
  }

  static async deleteComment(
    tenantId: string,
    documentId: string,
    commentId: string
  ): Promise<void> {
    await api.delete(`/tenants/${tenantId}/documents/${documentId}/comments/${commentId}`);
  }

  static async getVersions(tenantId: string, documentId: string): Promise<DocumentVersion[]> {
    const response = await api.get(`/tenants/${tenantId}/documents/${documentId}/versions`);
    return response.data;
  }

  static async getVersion(
    tenantId: string,
    documentId: string,
    versionId: string
  ): Promise<DocumentVersion> {
    const response = await api.get(
      `/tenants/${tenantId}/documents/${documentId}/versions/${versionId}`
    );
    return response.data;
  }

  static async shareDocument(
    tenantId: string,
    documentId: string,
    data: {
      userId: string;
      permission: 'view' | 'comment' | 'edit';
      expiresAt?: string;
    }
  ): Promise<DocumentShare> {
    const response = await api.post(
      `/tenants/${tenantId}/documents/${documentId}/share`,
      data
    );
    return response.data;
  }

  static async updateShare(
    tenantId: string,
    documentId: string,
    shareId: string,
    data: {
      permission: 'view' | 'comment' | 'edit';
      expiresAt?: string;
    }
  ): Promise<DocumentShare> {
    const response = await api.put(
      `/tenants/${tenantId}/documents/${documentId}/share/${shareId}`,
      data
    );
    return response.data;
  }

  static async removeShare(
    tenantId: string,
    documentId: string,
    shareId: string
  ): Promise<void> {
    await api.delete(`/tenants/${tenantId}/documents/${documentId}/share/${shareId}`);
  }

  static async getShares(tenantId: string, documentId: string): Promise<DocumentShare[]> {
    const response = await api.get(`/tenants/${tenantId}/documents/${documentId}/shares`);
    return response.data;
  }
}

export { DocumentService }; 