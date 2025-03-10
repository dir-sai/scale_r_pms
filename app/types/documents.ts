export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  changes: string;
  createdAt: string;
  userId: string;
  userName: string;
  size: number;
  mimeType: string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  version: number;
  status: 'pending' | 'active' | 'archived';
  tags?: string[];
  uri?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  permission: 'view' | 'comment' | 'edit';
  expiresAt?: string;
  createdAt: string;
} 