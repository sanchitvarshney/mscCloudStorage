import React, { createContext, useContext, useState, ReactNode } from "react";
import { FileItem, ViewType } from "../types";
import { getViewFromRoute } from "../utils/routeMapping";

function getInitialViewFromUrl(): ViewType {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname || "";
  const route = path.split("/").filter(Boolean)[0] || "Home";
  return getViewFromRoute(route);
}

interface FileContextType {
  files: FileItem[];
  currentView: ViewType;
  searchQuery: string;
  setCurrentView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  addFile: any;
  addFolder: (name: string) => void;
  shareFile: (id: string, userIds: string[]) => void;
  toggleFavourite: (id: string) => void;
  restoreFile: (id: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(getInitialViewFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const addFile = (files: any[]) => {
    
    setFiles(files);
  
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

 

  return (
    <FileContext.Provider
      value={{
        files,
        currentView,
        searchQuery,
        setCurrentView,
        setSearchQuery,
        addFile,
        addFolder,
        shareFile,
        toggleFavourite,
        restoreFile,
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
