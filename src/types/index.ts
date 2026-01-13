export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  sharedWith?: string[];
  sharedBy?: string; // Name of person who shared
  dateShared?: Date; // Date when file was shared
  isFavourite?: boolean;
  isTrashed?: boolean;
  isSpam?: boolean;
  parentId?: string;
  ownerId?: string; // For shared files
  fileType?: string; // File extension/type (pdf, xlsx, zip, etc.)
}

export interface StorageInfo {
  used: number; // in GB
  total: number; // in GB
  users: number;
}

export type ViewType = 'home' | 'myDrive' | 'sharedDrives' | 'sharedWithMe' | 'starred' | 'spam' | 'trash';
