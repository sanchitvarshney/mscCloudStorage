import { FC, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert,
  Download,
  Visibility,
  Star,
} from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatFileSize } from "../../utils";
import { useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import { useFileContext } from "../../context/FileContext";

interface FileItemRowProps {
  file: FileItem;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onView?: (file: FileItem) => void;
  isSharedWithMe?: boolean;
  onClickFolder?: (file: FileItem) => void;
}

const FileItemRow: FC<FileItemRowProps> = ({
  file,
  onMenuClick,
  onDownload,
  onView,
  isSharedWithMe = false,
  onClickFolder,
}) => {
  const { showToast } = useToast();
  const {
    isViewing,
    viewingFileId,
    isRestoring,
    restoringFileId,
    isDownloading,
    downloadingFileId,
  } = useSelector((state: any) => state.loadingState);
  const isFileViewing = isViewing && viewingFileId === file?.unique_key;
  const isFileRestoring = isRestoring && restoringFileId === file?.unique_key;
  const isFileDownloading =
    isDownloading && downloadingFileId === file?.unique_key;
      const { currentView } = useFileContext();

  useEffect(() => {
    if (isFileDownloading) {
      showToast("Please wait...", "success", isFileDownloading);
    }
    if (isFileViewing) {
      showToast("Please wait...", "success", isFileViewing);
    }
    return () => {
      showToast("Working...", "success");
    };
  }, [isFileDownloading]);

  const handleDoubleClick = () => {
    if (file.type === "folder" && onClickFolder) {
      onClickFolder(file);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload && file.type === "file") {
      onDownload(file);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(file);
    }
  };
  if (isSharedWithMe) {
    return (
      <TableRow
        key={file.unique_key}
        onDoubleClick={handleDoubleClick}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          cursor: "pointer",
          position: "relative",
          opacity: isFileRestoring ? 0.6 : 1,
          pointerEvents: isFileRestoring ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <FileIcon file={file} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {file.name}
              </Typography>

              {file.favorite && (
                <Star
                  sx={{
                    fontSize: 18,
                    color: "#fbbc04",
                    fill: "#fbbc04",
                  }}
                />
              )}

              {/* {file.sharedWith && file.sharedWith.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  {[
                    ...Array(Math.min(file.sharedWith.length, 2)),
                  ].map((_, i) => (
                    <Avatar
                      key={i}
                      sx={{
                        width: 16,
                        height: 16,
                        fontSize: "8px",
                      }}
                    >
                      {file.sharedWith![i].charAt(0).toUpperCase()}
                    </Avatar>
                  ))}
                </Box>
              )} */}
            </Box>
          </Box>
        </TableCell>
               <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              {file?.sharedBy}
            </Typography>
           
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              {file?.modifiedAt}
            </Typography>
           
          </Box>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {file.type === "file" && currentView !== "trash" &&  (
              <>
             
                  <IconButton
                    size="small"
                    onClick={handleDownload}
                    sx={{
                      p: 0.5,
                    }}
                  >
                    {isFileDownloading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Download fontSize="small" />
                    )}
                  </IconButton>
               
               
                  <IconButton
                    size="small"
                    onClick={handleView}
                    disabled={isFileViewing}
                    sx={{
                      p: 0.5,
                    }}
                  >
                    {isFileViewing ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
              
              </>
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled={isFileRestoring}
              sx={{
                p: 0.5,
              }}
            >
              {isFileRestoring ? (
                <CircularProgress size={16} />
              ) : (
                <MoreVert fontSize="small" />
              )}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      key={file.id}
      onDoubleClick={handleDoubleClick}

      sx={{
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
        cursor: "pointer",
        position: "relative",
        opacity: isFileRestoring ? 0.6 : 1,
        pointerEvents: isFileRestoring ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 0,
          }}
        >
          <FileIcon file={file} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {file.favorite && (
              <Star
                sx={{
                  fontSize: 16,
                  color: "#fbbc04",
                  fill: "#fbbc04",
                }}
              />
            )}
            <Typography variant="body2">{file.name}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "#5f6368", p: 0 }}>
          {file?.modifiedAt}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "#5f6368", p: 0 }}>
          {file?.type === "file" ? formatFileSize(file?.size) : "-"}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {file.type === "file" &&  currentView !== "trash" && (
            <>
              {onDownload && (
                <IconButton
                  size="small"
                  onClick={handleDownload}
                  sx={{
                    p: 0.5,
                  }}
                >
                  {isFileDownloading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Download fontSize="small" />
                  )}
                </IconButton>
              )}
              {onView && (
                <IconButton
                  size="small"
                  onClick={handleView}
                  disabled={isFileViewing}
                  sx={{
                    p: 0.5,
                  }}
                >
                  {isFileViewing ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              )}
            </>
          )}
          <IconButton
            sx={{
              p: 0.5,
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(e, file);
            }}
            disabled={isFileRestoring}
          >
            {isFileRestoring ? (
              <CircularProgress size={16} />
            ) : (
              <MoreVert fontSize="small" />
            )}
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default FileItemRow;
