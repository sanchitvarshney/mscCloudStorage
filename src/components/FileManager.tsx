import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useFileContext } from "../context/FileContext";
import { FileItem } from "../types";
import FileManagerHeader from "./FileManager/FileManagerHeader";
import FileListView from "./FileManager/FileListView";
import FileGridView from "./FileManager/FileGridView";
import FileContextMenu from "./FileManager/FileContextMenu";
import CreateFolderDialog from "./FileManager/CreateFolderDialog";
import ShareDialog from "./FileManager/ShareDialog";
import EmptyState from "./FileManager/EmptyState";

const FileManager: FC = () => {
  const {
    files,
    currentView,
    searchQuery,
    addFile,
    addFolder,
    deleteFile,
    shareFile,
    toggleFavourite,
    restoreFile,
  } = useFileContext();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    const handleCreateFolder = () => {
      setFolderDialogOpen(true);
    };

    const handleFileUpload = (event: CustomEvent) => {
      const files = event.detail as FileList;
      if (files) {
        handleFileUploadChange(files);
      }
    };

    const handleFolderUpload = (event: CustomEvent) => {
      const files = event.detail as FileList;
      if (files) {
        handleFolderUploadChange(files);
      }
    };

    window.addEventListener("createFolder" as any, handleCreateFolder);
    window.addEventListener("fileUpload" as any, handleFileUpload);
    window.addEventListener("folderUpload" as any, handleFolderUpload);

    return () => {
      window.removeEventListener("createFolder" as any, handleCreateFolder);
      window.removeEventListener("fileUpload" as any, handleFileUpload);
      window.removeEventListener("folderUpload" as any, handleFolderUpload);
    };
  }, []);

  const handleFileUploadChange = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: "file",
        size: file.size,
        modified: new Date(),
        sharedWith: [],
        isFavourite: false,
        isTrashed: false,
        isSpam: false,
        ownerId: "current-user",
        fileType: file.name.split(".").pop()?.toLowerCase(),
      };
      addFile(fileItem);
    });
  };

  const handleFolderUploadChange = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: "file",
        size: file.size,
        modified: new Date(),
        sharedWith: [],
        isFavourite: false,
        isTrashed: false,
        isSpam: false,
        ownerId: "current-user",
        fileType: file.name.split(".").pop()?.toLowerCase(),
      };
      addFile(fileItem);
    });
  };

  const filteredFiles = files.filter((file) => {
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!file.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Apply view filter
    switch (currentView) {
      case "home":
        return !file.isTrashed && !file.isSpam;
      case "myDrive":
        return (
          !file.isTrashed && !file.isSpam && file.ownerId === "current-user"
        );
      case "sharedDrives":
        return !file.isTrashed && file.sharedWith && file.sharedWith.length > 0;
      case "sharedWithMe":
        return (
          !file.isTrashed && file.ownerId && file.ownerId !== "current-user"
        );
      case "starred":
        return file.isFavourite && !file.isTrashed && !file.isSpam;
      case "spam":
        return file.isSpam;
      case "trash":
        return file.isTrashed;
      default:
        return !file.isTrashed;
    }
  });

  const handleCreateFolder = (name: string) => {
    if (name.trim()) {
      addFolder(name.trim());
      setFolderDialogOpen(false);
    }
  };

  const handleDownload = (file: FileItem) => {
    const blob = new Blob(["File content"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleView = (file: FileItem) => {
    console.log(file)
    
    // var width = 1000;
    // var height = 600;

    // var left = window.screen.width / 2 - width / 2;
    // var top = window.screen.height / 2 - height / 2;

    // window.open(
    //   file.type === "file" ? `/viewfile/${file.id}` : "/viewfolder/" + file.id,
    //   "MsCorpres",
    //   `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    // );
 
  };

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setShareDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleShareSubmit = (emails: string[]) => {
    if (selectedFile) {
      shareFile(selectedFile.id, emails);
      setShareDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const handleMenuClick = (event: any, file: FileItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedFile(null);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#fff" }}>
      <FileManagerHeader
        currentView={currentView}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <Box sx={{ p: 3 }}>
        {filteredFiles.length === 0 ? (
          <EmptyState currentView={currentView} />
        ) : viewMode === "list" ? (
          <Box
            sx={{
              maxHeight: "calc(100vh - 170px)",
              minHeight: "calc(100vh - 170px)",
              overflow: "auto",
            }}
          >
            <FileListView
              files={filteredFiles}
              currentView={currentView}
              onMenuClick={handleMenuClick}
            />
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: "calc(100vh - 170px)",
              minHeight: "calc(100vh - 170px)",
              overflow: "auto",
            }}
          >
            <FileGridView
              files={filteredFiles}
              onMenuClick={handleMenuClick}
              onDownload={handleDownload}
              onView={handleView}
            />
          </Box>
        )}
      </Box>

      <FileContextMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        file={selectedFile}
        currentView={currentView}
        onDownload={handleDownload}
        onShare={handleShare}
        onToggleFavourite={toggleFavourite}
        onDelete={deleteFile}
        onRestore={restoreFile}
      />

      <CreateFolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={handleCreateFolder}
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedFile(null);
        }}
        onShare={handleShareSubmit}
        file={selectedFile}
      />
    </Box>
  );
};

export default FileManager;
