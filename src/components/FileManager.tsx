import { FC, useEffect, useState, useMemo } from "react";
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
import DeleteConfirmationDialog from "./reuseable/DeleteConfirmationDialog";
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
import { getRouteFromView } from "../utils/routeMapping";
import { useToast } from "../hooks/useToast";
import {
  setDeleting,
  setFavoriting,
  setRestoring,
  setFetching,
  setViewing,
} from "../slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [driveData, setDriveData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [createFolder, { isLoading: isFolderCreating }] =
    useCreateFolderMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

  useEffect(() => {
    if (!isUploading) {
      return;
    }
    showToast("Working please wait ....");
  }, [isUploading]);

  const queryArgs = useMemo(() => {
    const args: { folderId?: string; isTrash?: number; currentView: string } = {
      currentView,
    };

    if (folderId) {
      args.folderId = folderId;
    }
    if (currentView === "trash") {
      args.isTrash = 1;
    }

    return args;
  }, [folderId, currentView]);

  useEffect(() => {
    const storedViewMode = localStorage.getItem("viewMode");
    if (storedViewMode) {
      setViewMode(storedViewMode as "list" | "grid");
    }
  }, []);

  const { data, refetch, isLoading, isFetching } = useFetchFilesQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });


  const isFetchingFiles = isLoading;

  useEffect(() => {
    setDriveData([]);
  }, [folderId, currentView]);
  const [onDeleteFile] = useOnDeleteFileMutation();
  const [onRestoreFile] = useOnRestoreFileMutation();
  const [onFaviroteFile] = useOnFaviroteFileMutation();

  const [viewFile] = useViewFileMutation();

  const { isDeleting, deletingFileId } = useSelector(
    (state: any) => state.loadingState,
  );

  useEffect(() => {
    dispatch(setFetching({ loading: isFetchingFiles }));
  }, [isFetchingFiles, dispatch]);

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
        setDeleteDialogOpen(false);
        setFileToDelete(null);
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Failed to delete file", "error");
    } finally {
      dispatch(setDeleting({ loading: false, fileId: null }));
    }
  };

  const handleDeleteClick = (file: any) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      handleTrashFile(fileToDelete);
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
        handleMenuClose();
      } else {
        showToast(res.message, "error");
        handleMenuClose();
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message;
      showToast(errorMessage, "error");
      handleMenuClose();
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
        showToast(
          res.message ,
          "success",
        );
        handleMenuClose();
        refetch();
      } else {
        showToast(res.message, "error");
        handleMenuClose();
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to update favorite status";
      showToast(errorMessage, "error");
      handleMenuClose();
    } finally {
      dispatch(setFavoriting({ loading: false, fileId: null }));
    }
  };

  const handleClickFolder = (folder: any) => {
    localStorage.setItem("folderPath", folder.path);
    setDriveData([]);
    const baseRoute = getRouteFromView(currentView);
    navigate(`/${baseRoute}/${folder.unique_key}`, {
      state: { folderName: folder.name, folderPath: folder.path },
    });
  };

  const handleBack = () => {
    setDriveData([]);
    const baseRoute = getRouteFromView(currentView);
    navigate(`/${baseRoute}`, { replace: true, state: null });
  };

  useEffect(() => {
    if (isFetchingFiles) {
      return;
    }
    if (data?.data) {
      const files = Array.isArray(data.data) ? data.data : [];
      setDriveData(files);
    } else if (data !== undefined) {
      setDriveData([]);
    }
  }, [data, isFetchingFiles, folderId]);

  useEffect(() => {
    const handleCreateFolder = () => {
      setFolderDialogOpen(true);
    };

    const handleFileUpload = (event: CustomEvent) => {
      const { files } = event.detail as {
        files: FileList;
        formDataCreated?: boolean;
      };
      const localStorePath = localStorage.getItem("folderPath");
      if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("file", file);
          formData.append(
            "folder_path",
            folderName && localStorePath ? `${localStorePath}` : "/home",
          );
          //@ts-ignore
          formData.append("folder_id", folderId);
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
        if (res?.success) {
          showToast(res?.message, "success");
          refetch();
        } else {
          showToast(res?.message, "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Upload failed",
          "error",
        );
      });
  };

  const handleFolderUploadChange = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: "file",
        size: file.size,
        modifiedAt: "",
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

    if (folderId || folderName) {
      return !file.trash;
    }
    switch (currentView) {
      case "home":
        return !file.trash && !file.isSpam;
      case "sharedDrives":
        return !file.trash && file.sharedWith && file.sharedWith.length > 0;
      case "sharedWithMe":
        return !file.trash && file.ownerId && file.ownerId !== "current-user";
      case "starred":
        return file.favorite && !file.trash;
      case "trash":
        return file;
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
        if (res?.success) {
          setFolderDialogOpen(false);
          showToast(res?.message, "success");
          refetch();
        } else {
          showToast(res?.message , "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Failed to create folder",
          "error",
        );
      });
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

    dispatch(setViewing({ loading: true, fileId: file.unique_key }));
    try {
      const blob = await viewFile(payload).unwrap();

      if (!blob) {
        console.error("No file returned from server");
        showToast("No file returned from server", "error");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Failed to view file:", err);
      showToast("Failed to view file", "error");
    } finally {
      dispatch(setViewing({ loading: false, fileId: null }));
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
        onBack={handleBack}
        onRefresh={refetch}
        isRefreshing={isFetchingFiles || isFetching}
      />

      <Box sx={{ p: 3 }}>
        {filteredFiles.length === 0 && !isFetchingFiles ? (
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
            {isFetchingFiles ? (
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
                onDownload={handleDownload}
                onView={handleView}
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
            {isFetchingFiles ? (
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
        onDelete={handleDeleteClick}
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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFileToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={fileToDelete?.name}
        itemType={fileToDelete?.type || "item"}
        isLoading={isDeleting && deletingFileId === fileToDelete?.unique_key}
      />
    </Box>
  );
};

export default FileManager;
