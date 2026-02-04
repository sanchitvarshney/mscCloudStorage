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
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useFetchSharedFileInfoQuery,
  useLazyFetchFilesQuery,
  useViewFileMutation,
} from "../services/dirManager/dirServices";
import { useToast } from "../hooks/useToast";

function formatSize(bytes: number | undefined): string {
  if (bytes == null || bytes === 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

const PublicSharePage: FC = () => {
  const [searchParams] = useSearchParams();
  const shareKey = searchParams.get("key");
  const nav = useNavigate();
  const { showToast } = useToast();
  const theme = useTheme();
  const [viewFile] = useViewFileMutation();
  const [breadcrumb, setBreadcrumb] = useState<{ key: string; name: string }[]>([]);

  const { data: linkData, isLoading: linkLoading, isError: linkError } =
    useFetchSharedFileInfoQuery({ share_key: shareKey! }, { skip: !shareKey });

  const shareInfo = linkData?.data;
  const rootFolderKey = shareInfo?.key;
  const currentParentKey =
    breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].key : rootFolderKey;
  const isFolder = shareInfo?.type === "folder";

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

  const handleDownloadFile = async (file: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const pageBg = alpha(theme.palette.primary.main, 0.04);
  const cardBg = theme.palette.background.paper;

  if (!shareKey) {
    return null;
  }

  if (linkLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: pageBg,
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Checking shared link…
          </Typography>
        </Paper>
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
          bgcolor: pageBg,
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.error.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 32, color: "error.main" }} />
          </Box>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Invalid or expired link
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This shared link may have been removed or the sharing may have ended.
          </Typography>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => nav("/signin")}
            sx={{ borderRadius: 2 }}
          >
            Go to Sign in
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
          bgcolor: pageBg,
          display: "flex",
          flexDirection: "column",
          pb: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            px: { xs: 2, sm: 3 },
            py: 2,
            bgcolor: cardBg,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <FolderOpenIcon color="primary" sx={{ fontSize: 22 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Shared with you
            </Typography>
          </Box>
          <Breadcrumbs
            separator={<ChevronRightIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
            sx={{ flexWrap: "wrap", "& .MuiBreadcrumbs-li": { maxWidth: "180px" } }}
          >
            <Typography
              component="button"
              variant="body2"
              fontWeight={600}
              onClick={() => setBreadcrumb([])}
              sx={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "text.primary",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "block",
                textAlign: "left",
                "&:hover": { color: "primary.main" },
              }}
            >
              {folderName}
            </Typography>
            {breadcrumb.map((item, index) => (
              <Typography
                key={item.key}
                component="button"
                variant="body2"
                onClick={() => handleBreadcrumbClick(index)}
                sx={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "text.secondary",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "block",
                  textAlign: "left",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.name}
              </Typography>
            ))}
          </Breadcrumbs>
        </Paper>

        <Box sx={{ flex: 1, px: { xs: 2, sm: 3 }, pt: 2, maxWidth: 900, width: "100%", mx: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              overflow: "hidden",
              bgcolor: cardBg,
            }}
          >
            {folderLoading ? (
              <Box sx={{ p: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="text" width="20%" height={16} sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : folderItems.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  px: 2,
                  textAlign: "center",
                }}
              >
                <FolderIcon sx={{ fontSize: 64, color: "action.hover", mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  This folder is empty
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  There are no files or subfolders here.
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {folderItems.map((item: any, index: number) => {
                  const key = item.unique_key ?? item.key ?? item.id;
                  const name = item.name ?? "Item";
                  const isItemFolder = item.type === "folder";
                  const size = item.size ?? item.file_size;
                  return (
                    <ListItem
                      key={key}
                      disablePadding
                      sx={{
                        borderBottom:
                          index < folderItems.length - 1
                            ? `1px solid ${alpha(theme.palette.divider, 0.4)}`
                            : "none",
                      }}
                    >
                      <ListItemButton
                        onClick={() =>
                          isItemFolder ? handleOpenFolder(item) : handleViewFile(item)
                        }
                        sx={{
                          py: 1.5,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          {isItemFolder ? (
                            <FolderIcon sx={{ color: "primary.main", fontSize: 28 }} />
                          ) : (
                            <InsertDriveFileIcon sx={{ color: "action.active", fontSize: 26 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              noWrap
                              sx={{ pr: 1 }}
                            >
                              {name}
                            </Typography>
                          }
                          secondary={
                            !isItemFolder && (
                              <Typography variant="caption" color="text.secondary">
                                {formatSize(size)}
                              </Typography>
                            )
                          }
                        />
                        {!isItemFolder && (
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDownloadFile(item, e)}
                              sx={{
                                "&:hover": {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>

          <Typography
            component="button"
            variant="caption"
            color="text.secondary"
            onClick={() => nav("/signin")}
            sx={{
              mt: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              border: "none",
              background: "none",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <LoginIcon sx={{ fontSize: 16 }} />
            Sign in to access your storage
          </Typography>
        </Box>
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
        bgcolor: pageBg,
        p: 3,
      }}
    >
      <Button
        variant="contained"
        startIcon={<LoginIcon />}
        onClick={() => nav("/signin")}
        sx={{ borderRadius: 2 }}
      >
        Go to Sign in
      </Button>
    </Box>
  );
};

export default PublicSharePage;
