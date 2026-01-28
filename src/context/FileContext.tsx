import React, { createContext, useContext, useState, ReactNode } from "react";
import { FileItem, StorageInfo, ViewType } from "../types";

interface FileContextType {
  files: FileItem[];
  currentView: ViewType;
  storageInfo: StorageInfo;
  searchQuery: string;
  setCurrentView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  addFile: (file: FileItem) => void;
  addFolder: (name: string) => void;
  shareFile: (id: string, userIds: string[]) => void;
  toggleFavourite: (id: string) => void;
  restoreFile: (id: string) => void;
  updateStorage: (used: number) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Sample data for "Shared with me" view
  const sampleFiles: FileItem[] = [
    {
      id: "1",
      name: "WorkSheet.xlsx",
      type: "file",
      size: 245760,
      modified: new Date(),
      dateShared: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      sharedBy: "Sanchit Varshney",
      sharedWith: ["user1@example.com"],
      isFavourite: false,
      isTrashed: false,
      isSpam: false,
      ownerId: "sanchit",
      fileType: "xlsx",
    },
    {
      id: "2",
      name: "socket_part2.zip",
      type: "file",
      size: 1572864,
      modified: new Date(),
      dateShared: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Last month
      sharedBy: "vishalgupta.rgec@gmail.com",
      sharedWith: ["user1@example.com"],
      isFavourite: false,
      isTrashed: false,
      isSpam: false,
      ownerId: "vishal",
      fileType: "zip",
    },
    {
      id: "3",
      name: "Himansu_Ranjan_Patra.pdf",
      type: "file",
      size: 1048576,
      modified: new Date(),
      dateShared: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // Older
      sharedBy: "Ruchima Verma",
      sharedWith: ["user1@example.com"],
      isFavourite: false,
      isTrashed: false,
      isSpam: false,
      ownerId: "ruchima",
      fileType: "pdf",
    },
  ];

  const [files, setFiles] = useState<FileItem[]>(sampleFiles);
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    total: 15,
    users: 0,
  });

  const addFile = (file: FileItem) => {
    setFiles((prev) => [...prev, file]);
    const sizeInGB = (file.size || 0) / (1024 * 1024 * 1024);
    updateStorage(storageInfo.used + sizeInGB);
  };

  const addFolder = (name: string) => {
    const folder: FileItem = {
      id: Date.now().toString(),
      name,
      type: "folder",
      modified: new Date(),
      sharedWith: [],
      isFavourite: false,
      isTrashed: false,
      isSpam: false,
      ownerId: "current-user",
    };
    setFiles((prev) => [...prev, folder]);
  };

  const shareFile = (id: string, userIds: string[]) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, sharedWith: userIds } : file,
      ),
    );
    setStorageInfo((prev) => ({ ...prev, users: userIds.length }));
  };

  const toggleFavourite = (id: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isFavourite: !file.isFavourite } : file,
      ),
    );
  };

  const restoreFile = (id: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isTrashed: false } : file,
      ),
    );
  };

  const updateStorage = (used: number) => {
    setStorageInfo((prev) => ({ ...prev, used }));
  };

  return (
    <FileContext.Provider
      value={{
        files,
        currentView,
        storageInfo,
        searchQuery,
        setCurrentView,
        setSearchQuery,
        addFile,
        addFolder,
        shareFile,
        toggleFavourite,
        restoreFile,
        updateStorage,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within FileProvider");
  }
  return context;
};
