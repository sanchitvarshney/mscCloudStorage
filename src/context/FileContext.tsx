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


  const [files, setFiles] = useState<FileItem[]>([]);
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
      modifiedAt: "",
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
