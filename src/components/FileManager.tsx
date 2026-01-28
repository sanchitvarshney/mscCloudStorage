import { FC, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useFileContext } from "../context/FileContext";
import { FileItem } from "../types";
import FileManagerHeader from "./FileManager/FileManagerHeader";
import FileListView from "./FileManager/FileListView";
import FileGridView from "./FileManager/FileGridView";
import FileContextMenu from "./FileManager/FileContextMenu";
import CreateFolderDialog from "./FileManager/CreateFolderDialog";
import ShareDialog from "./FileManager/ShareDialog";
import EmptyState from "./FileManager/EmptyState";
import {
  useCreateFolderMutation,
  useFetchFilesQuery,
  useOnDeleteFileMutation,
  useOnFaviroteFileMutation,
  useOnRestoreFileMutation,
  useUploadFilesMutation,
  useViewFileMutation,
} from "../services/dirManager/dirServices";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import {
  setDeleting,
  setFavoriting,
  setRestoring,
  setFetching,
} from "../slices/loadingSlice";
import { useDispatch } from "react-redux";

interface FileManagerProps {
  folder?: {};
}

const FileManager: FC<FileManagerProps> = ({ folder }) => {
  const { showToast } = useToast();
  //@ts-ignore
  const { folderId, folderName, folderPath } = folder ?? {};

  const navigate = useNavigate();
  const { currentView, searchQuery, addFile, shareFile } = useFileContext();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [driveData, setDriveData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [createFolder, { isLoading: isFolderCreating }] =
    useCreateFolderMutation();
  const [uploadFiles] = useUploadFilesMutation();
  const {
    data,
    refetch,
    isLoading: isFetching,
  } = useFetchFilesQuery(
    { folderId, isTrash: currentView === "trash" },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [onDeleteFile] = useOnDeleteFileMutation();
  const [onRestoreFile] = useOnRestoreFileMutation();
  const [onFaviroteFile] = useOnFaviroteFileMutation();

  const [viewFile, { isLoading: isViewing }] = useViewFileMutation();

  useEffect(() => {
    dispatch(setFetching({ loading: isFetching }));
  }, [isFetching, dispatch]);

  const handleTrashFile = async (file: any) => {
    const payload = {
      key: file.unique_key,
      type: file.type,
    };

    dispatch(setDeleting({ loading: true, fileId: file.unique_key }));
    try {
      const res: any = await onDeleteFile(payload).unwrap();
      if (res.success) {
        showToast(res.message, "success");
        refetch();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
      showToast("Failed to delete file", "error");
    } finally {
      dispatch(setDeleting({ loading: false, fileId: null }));
    }
  };

  const handleRestoreFile = async (file: any) => {
    const payload = {
      key: file.unique_key,
      type: file.type,
    };

    dispatch(setRestoring({ loading: true, fileId: file.unique_key }));
    try {
      const res: any = await onRestoreFile(payload).unwrap();
      if (res.success) {
        showToast(res.message, "success");
        refetch();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.error("Failed to restore file:", err);
      showToast("Failed to restore file", "error");
    } finally {
      dispatch(setRestoring({ loading: false, fileId: null }));
    }
  };
  const handleFavouriteFile = async (file: any) => {
    const payload = {
      key: file.unique_key,
      type: file.type,
      isFav: !file.favorite,
    };

    dispatch(setFavoriting({ loading: true, fileId: file.unique_key }));
    try {
      const res: any = await onFaviroteFile(payload).unwrap();
      if (res.success) {
        showToast(res.message, "success");
        handleMenuClose();
        refetch();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      console.error("Failed to favorite file:", err);
      showToast("Failed to update favorite status", "error");
    } finally {
      dispatch(setFavoriting({ loading: false, fileId: null }));
    }
  };

  const handleClickFolder = (folder: any) => {
    setDriveData([]);
    navigate(`/home/${folder.unique_key}`, {
      state: { folderName: folder.name, folderPath: folder.path },
    });
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      setDriveData(data?.data);
    }
  }, [data?.data]);

  useEffect(() => {
    const handleCreateFolder = () => {
      setFolderDialogOpen(true);
    };

    const handleFileUpload = (event: CustomEvent) => {
      const { files } = event.detail as {
        files: FileList;
        formDataCreated?: boolean;
      };
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("file", file);
          formData.append(
            "folder_path",
            folderName ? `/home/${folderName}` : "/home",
          );
          //@ts-ignore
          formData.append("folder_id", folderId || null);
        });

        handleFileUploadChange(formData);
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
  }, [folderId, folderName]);

  const handleFileUploadChange = (formData: FormData) => {
    uploadFiles(formData)
      .unwrap()
      .then((res: any) => {
        console.log(res, "upload response");
        if (res?.success) {
          refetch();
        } else {
          console.error(res?.message || "Upload failed");
        }
      })
      .catch((err: any) => {
        console.error(err, "upload error");
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

  const filteredFiles = driveData?.filter((file: any) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!file.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    switch (currentView || folderName || folderId) {
      case "home":
        return !file.trash && !file.isSpam;
      case "sharedDrives":
        return !file.trash && file.sharedWith && file.sharedWith.length > 0;
      case "sharedWithMe":
        return !file.trash && file.ownerId && file.ownerId !== "current-user";
      case "starred":
        return file.favorite && !file.trash;
      case "trash":
        return file.trash;
      default:
        return !file.trash;
    }
  });

  const handleCreateFolder = (name: string) => {
    const payload = {
      name: name.trim(),
      parent_id: folderId ?? null,
      parent_path: folderPath ?? null,
    };
    createFolder(payload)
      .unwrap()
      .then((res: any) => {
        console.log(res, "response");
        if (res?.success) {
          setFolderDialogOpen(false);
        } else {
          // showToast(res?.message, "error");
          console.log(res, "res");
        }
      })
      .catch((err: any) => {
        console.log(err, "res");
        // showToast(
        //   err?.data?.message ||
        //     err?.message ||
        //     "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        //   "error",
        // );
      });
    // if (name.trim()) {
    //   addFolder(name.trim());

    // }
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

  const handleView = async (file: any) => {
    const payload = { file_key: file.unique_key };

    try {
      const blob = await viewFile(payload).unwrap();

      if (!blob) {
        console.error("No file returned from server");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Failed to view file:", err);
    }
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

  const handleMenuClick = (event: any, file: any) => {
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
        folder={folderName}
      />

      <Box sx={{ p: 3 }}>
        {filteredFiles.length === 0 && !isFetching ? (
          <EmptyState currentView={currentView} />
        ) : viewMode === "list" ? (
          <Box
            sx={{
              maxHeight: "calc(100vh - 170px)",
              minHeight: "calc(100vh - 170px)",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isFetching ? (
              <Box
                sx={{
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <FileListView
                files={filteredFiles}
                currentView={currentView}
                onMenuClick={handleMenuClick}
                onClickFolder={handleClickFolder}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: "calc(100vh - 170px)",
              minHeight: "calc(100vh - 170px)",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isFetching ? (
              <Box
                sx={{
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <FileGridView
                files={filteredFiles}
                onMenuClick={handleMenuClick}
                onDownload={handleDownload}
                onView={handleView}
                onClickFolder={handleClickFolder}
                loading={isViewing}
              />
            )}
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
        onToggleFavourite={handleFavouriteFile}
        onRestore={handleRestoreFile}
        onDelete={handleTrashFile}
      />

      <CreateFolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={handleCreateFolder}
        isCreating={isFolderCreating}
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
