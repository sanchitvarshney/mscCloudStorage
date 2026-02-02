import { FC, useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Box, CircularProgress } from "@mui/material";
import { useFileContext } from "../context/FileContext";
import { FileItem } from "../types";
import FileManagerHeader, { SharedWithMeTypeFilter } from "./FileManager/FileManagerHeader";
import FileListView from "./FileManager/FileListView";
import FileGridView from "./FileManager/FileGridView";
import FileContextMenu from "./FileManager/FileContextMenu";
import CreateFolderDialog from "./FileManager/CreateFolderDialog";
import ShareDialog from "./FileManager/ShareDialog";
import EmptyState from "./FileManager/EmptyState";
import DeleteConfirmationDialog from "./reuseable/DeleteConfirmationDialog";
import {
  useCreateFolderMutation,
  useLazyFetchFilesQuery,
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
  setDownloading,
} from "../slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";

interface FileManagerProps {
  folder?: {};
  linkData?: any;
}

const FileManager: FC<FileManagerProps> = ({ folder }) => {
  const { showToast } = useToast();
  //@ts-ignore
  const { folderId, folderName, folderPath } = folder ?? {};

  const navigate = useNavigate();
  const { currentView, searchQuery, addFile, files } = useFileContext();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [scrollRoot, setScrollRoot] = useState<Element | null>(null);
  const { ref: loadMoreSentinelRef, inView } = useInView({
    root: scrollRoot,
    rootMargin: "100px",
    threshold: 0,
  });
  const [sharedWithMeTypeFilter, setSharedWithMeTypeFilter] =
    useState<SharedWithMeTypeFilter>("all");
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [createFolder, { isLoading: isFolderCreating }] =
    useCreateFolderMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();
  const [viewFile] = useViewFileMutation();

  useEffect(() => {
    if (isUploading) {
      showToast("Working please wait ....", "success", isUploading);
    }
 
  }, [isUploading]);

  const queryArgs = useCallback(async () => {
    const args: {
      folderId?: string;
      isTrash?: number;
      currentView: string;
      isShared?: number;
      type?: string;
    } = {
      currentView,
    };

    if (folderId) {
      args.folderId = folderId;
    }
    if (currentView === "trash") {
      args.isTrash = 1;
    }
    if (currentView === "sharedWithMe") {
      args.isShared = 1;
    }

    return args;
  }, [folderId, currentView]);

  useEffect(() => {
    const storedViewMode = localStorage.getItem("viewMode");
    if (storedViewMode) {
      setViewMode(storedViewMode as "list" | "grid");
    }
  }, []);

  const [fetchFiles, { isLoading: loadingPosts, isFetching }] = useLazyFetchFilesQuery();

  // Decrypted API response: { message, success, data, hasMore, nextOffset }
  const loadMorePosts = useCallback(
    async (reset = false) => {
      if (loadingPosts) return;
      if (!reset && !hasMore) return;

      const requestOffset = reset ? 0 : offset;
      const queryValues = await queryArgs();

      try {
        const res = await fetchFiles({
          ...queryValues,
          offset: requestOffset,
          limit,
        }).unwrap();

        if (res?.success === false) {
          showToast(res?.message || "Failed to load files", "error");
          return;
        }

        const newPosts = Array.isArray(res?.data) ? res.data : [];
        addFile((prev: any) => (reset ? newPosts : [...prev, ...newPosts]));
        setHasMore(res?.hasMore ?? false);
        setOffset(res?.nextOffset ?? requestOffset + limit);
      } catch (err: any) {
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "We're Sorry An unexpected error has occurred.",
          "error"
        );
      }
    },
    [queryArgs, offset, limit, hasMore, loadingPosts]
  );

  const refetch = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    addFile([]);
    loadMorePosts(true);
  }, [loadMorePosts]);

  // Initial load and when folder/view changes: reset and load first page
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    addFile([]);
    loadMorePosts(true);
  }, [folderId, currentView]);

  // Infinite scroll trigger: load more when sentinel is in view
  useEffect(() => {
    if (inView && hasMore && !loadingPosts) {
      loadMorePosts(false);
    }
  }, [inView, hasMore, loadingPosts]);

  const isFetchingFiles = loadingPosts;

  const [onDeleteFile] = useOnDeleteFileMutation();
  const [onRestoreFile] = useOnRestoreFileMutation();
  const [onFaviroteFile] = useOnFaviroteFileMutation();

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
        showToast(res.message || "File restored successfully", "success");
        refetch();
        handleMenuClose();
      } else {
        showToast(res.message || "Failed to restore file", "error");
        handleMenuClose();
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to restore file";
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
          res.message || "Favorite status updated successfully",
          "success",
        );
        handleMenuClose();
        refetch();
      } else {
        showToast(res.message || "Failed to update favorite status", "error");
        handleMenuClose();
      }
    } catch (err: any) {
      console.error("Failed to favorite file:", err);
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
    addFile([]);
    const baseRoute = getRouteFromView(currentView);
    navigate(`/${baseRoute}/${folder.unique_key}`, {
      state: { folderName: folder.name, folderPath: folder.path },
    });
  };

  const handleBack = () => {
    addFile([]);
    // const baseRoute = getRouteFromView(currentView);
    navigate(-1);
  };

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

      if (!files || files.length === 0) return;

      const formData = new FormData();

      // Take only the first file
      const file = files[0];

      formData.append("file", file);
      formData.append(
        "folder_path",
        folderName && localStorePath ? localStorePath : "/home",
      );

      //@ts-ignore
      formData.append("folder_id", folderId);

      handleFileUploadChange(formData);
    };

    window.addEventListener("createFolder" as any, handleCreateFolder);
    window.addEventListener("fileUpload" as any, handleFileUpload);

    return () => {
      window.removeEventListener("createFolder" as any, handleCreateFolder);
      window.removeEventListener("fileUpload" as any, handleFileUpload);
    };
  }, [folderId, folderName]);

  const handleFileUploadChange = (formData: FormData) => {
    uploadFiles(formData)
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          showToast(res?.message || "File(s) uploaded successfully", "success");
          refetch();
        } else {
          showToast(res?.message || "Upload failed", "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Upload failed",
          "error",
        );
      });
  };

  const filteredFiles = files?.filter((file: any) => {
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

    
      case "sharedWithMe": {
        if (sharedWithMeTypeFilter !== "all" && file.type !== sharedWithMeTypeFilter) {
          return false;
        }
        return true;
      }
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
          showToast(res?.message || "Folder created successfully", "success");
          refetch();
        } else {
          showToast(res?.message || "Failed to create folder", "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Failed to create folder",
          "error",
        );
      });
  };

  const handleDownload = async (file: FileItem) => {
    if (!file.unique_key) {
      showToast("Cannot download: file key missing", "error");
      return;
    }
    dispatch(setDownloading({ loading: true, fileId: file.unique_key }));
    try {
      const blob = await viewFile({ file_key: file.unique_key }).unwrap();
      if (!blob) {
        showToast("No file data received", "error");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name ?? "download";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Download started", "success");
    } catch (err: any) {
      console.error("Download failed:", err);
      showToast(
        err?.data?.message ?? err?.message ?? "Download failed",
        "error",
      );
    } finally {
      dispatch(setDownloading({ loading: false, fileId: null }));
    }
  };

  const handleView = async (file: any) => {
    const payload = {
      file_key: file.unique_key,
      type: currentView === "sharedWithMe" ? "share" : "list",
    };

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
                sharedWithMeTypeFilter={sharedWithMeTypeFilter}
        onSharedWithMeTypeFilterChange={setSharedWithMeTypeFilter}
      />

      <Box sx={{ p: 3 }}>
        {filteredFiles.length === 0 && !isFetchingFiles ? (
          <EmptyState currentView={currentView} />
        ) : viewMode === "list" ? (
          <Box
            ref={(el: unknown) => setScrollRoot(el instanceof Element ? el : null)}
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
              <>
                <FileListView
                  files={filteredFiles}
                  currentView={currentView}
                  onMenuClick={handleMenuClick}
                  onDownload={handleDownload}
                  onView={handleView}
                  onClickFolder={handleClickFolder}
                />
                <div ref={loadMoreSentinelRef} style={{ height: 1, minHeight: 1 }} aria-hidden="true" />
                {hasMore && loadingPosts && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </>
            )}
          </Box>
        ) : (
          <Box
            ref={(el: unknown) => setScrollRoot(el instanceof Element ? el : null)}
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
              <>
                <FileGridView
                  files={filteredFiles}
                  onMenuClick={handleMenuClick}
                  onDownload={handleDownload}
                  onView={handleView}
                  onClickFolder={handleClickFolder}
                />
                <div ref={loadMoreSentinelRef} style={{ height: 1, minHeight: 1 }} aria-hidden="true" />
                {hasMore && loadingPosts && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </>
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
        }}
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
