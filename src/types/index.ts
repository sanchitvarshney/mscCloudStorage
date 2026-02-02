export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modifiedAt: string;
  sharedWith?: string[];
  sharedBy?: string;
  dateShared?: Date;
  isFavourite?: boolean;
  isTrashed?: boolean;
  isSpam?: boolean;
  parentId?: string;
  ownerId?: string;
  fileType?: string;
  unique_key?: string;
  favorite?: boolean;
}

export interface StorageInfo {
  used: number; // in GB
  total: number; // in GB
  users: number;
}

export type ViewType =
  | "home"
  // | "myDrive"
  // | "sharedDrives"
  | "sharedWithMe"
  | "starred"
  // | "spam"
  | "trash";
