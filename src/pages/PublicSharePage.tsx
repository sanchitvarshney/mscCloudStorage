import { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useFetchSharedFileInfoQuery,
  useLazyFetchFilesQuery,
  useViewFileMutation,
} from "../services/dirManager/dirServices";
import { useToast } from "../hooks/useToast";

const PublicSharePage: FC = () => {
  const [searchParams] = useSearchParams();
  const shareKey = searchParams.get("key");
  const nav = useNavigate();
  const { showToast } = useToast();
  const [viewFile] = useViewFileMutation();
  const [breadcrumb, setBreadcrumb] = useState<{ key: string; name: string }[]>([]);

  const { data: linkData, isLoading: linkLoading, isError: linkError } = useFetchSharedFileInfoQuery(
    { share_key: shareKey! },
    { skip: !shareKey }
  );

  const shareInfo = linkData?.data;
  const rootFolderKey = shareInfo?.key;
  const currentParentKey =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].key : rootFolderKey;
  const isFolder = shareInfo?.type === "folder";
  const isFile = shareInfo?.type === "file";

  const [fetchFiles, { data: folderListData, isLoading: folderLoading }] =
    useLazyFetchFilesQuery();

  const folderItems = Array.isArray(folderListData?.data)
    ? folderListData.data
    : (folderListData?.data as any)?.list ?? (folderListData?.data as any)?.items ?? [];

  useEffect(() => {
    if (!shareKey) {
      nav("/signin");
      return;
    }
  }, [shareKey, nav]);

  useEffect(() => {
    if (!isFolder || !currentParentKey) return;
    fetchFiles({
      folderId: currentParentKey,
      isShared: 1,
      offset: 0,
      limit: 100,
    });
  }, [isFolder, currentParentKey, fetchFiles]);

  const handleViewFile = async (file: any) => {
    const key = file.unique_key ?? file.key ?? file.id;
    if (!key) {
      showToast("Cannot view: file key missing", "error");
      return;
    }
    try {
      const blob = await viewFile({ file_key: key, type: "share" }).unwrap();
      if (!blob) {
        showToast("No file returned", "error");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err: any) {
      showToast(err?.data?.message ?? err?.message ?? "Failed to view file", "error");
    }
  };

  const handleDownloadFile = async (file: any) => {
    const key = file.unique_key ?? file.key ?? file.id;
    if (!key) {
      showToast("Cannot download: file key missing", "error");
      return;
    }
    try {
      const blob = await viewFile({ file_key: key, type: "share" }).unwrap();
      if (!blob) {
        showToast("No file data received", "error");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file?.name ?? "download";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Download started", "success");
    } catch (err: any) {
      showToast(err?.data?.message ?? err?.message ?? "Download failed", "error");
    }
  };

  const handleOpenFolder = (folder: any) => {
    const key = folder.unique_key ?? folder.key ?? folder.id;
    const name = folder.name ?? "Folder";
    setBreadcrumb((prev) => [...prev, { key, name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumb((prev) => prev.slice(0, index + 1));
  };

  if (!shareKey) {
    return null;
  }

  if (linkLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (linkError || !shareInfo) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Typography color="error" variant="h6">
          Invalid or expired link
        </Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => nav("/signin")}>
          Go to Sign in
        </Button>
      </Box>
    );
  }

  if (isFile) {
    const fileName = shareInfo.name ?? "File";
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <InsertDriveFileIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {fileName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Shared with you
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewFile(shareInfo)}
            >
              View
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadFile(shareInfo)}
            >
              Download
            </Button>
          </Box>
          <Button sx={{ mt: 3 }} size="small" onClick={() => nav("/signin")}>
            Sign in
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isFolder) {
    const folderName = shareInfo.name ?? "Folder";
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Shared with you
          </Typography>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} sx={{ mb: 1 }}>
            <Link
              component="button"
              variant="body2"
              underline="hover"
              onClick={() => setBreadcrumb([])}
              sx={{ cursor: "pointer" }}
            >
              {folderName}
            </Link>
            {breadcrumb.map((item, index) => (
              <Link
                key={item.key}
                component="button"
                variant="body2"
                underline="hover"
                onClick={() => handleBreadcrumbClick(index)}
                sx={{ cursor: "pointer" }}
              >
                {item.name}
              </Link>
            ))}
          </Breadcrumbs>
        </Paper>

        <Paper>
          {folderLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List dense>
              {folderItems.length === 0 && (
                <ListItem>
                  <ListItemText primary="This folder is empty" />
                </ListItem>
              )}
              {folderItems.map((item: any) => {
                const key = item.unique_key ?? item.key ?? item.id;
                const name = item.name ?? "Item";
                const isItemFolder = item.type === "folder";
                return (
                  <ListItem key={key} disablePadding>
                    <ListItemButton
                      onClick={() =>
                        isItemFolder ? handleOpenFolder(item) : handleViewFile(item)
                      }
                    >
                      <ListItemIcon>
                        {isItemFolder ? (
                          <FolderIcon color="primary" />
                        ) : (
                          <InsertDriveFileIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={name} />
                      {!isItemFolder && (
                        <Box
                          component="span"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(item);
                          }}
                        >
                          <Button size="small" startIcon={<DownloadIcon />}>
                            Download
                          </Button>
                        </Box>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>

        <Button sx={{ mt: 2 }} size="small" onClick={() => nav("/signin")}>
          Sign in
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Button variant="contained" onClick={() => nav("/signin")}>
        Go to Sign in
      </Button>
    </Box>
  );
};

export default PublicSharePage;
