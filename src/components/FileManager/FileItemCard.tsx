import { FC, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { MoreVert, Download, Visibility, Star } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatFileSize } from "../../utils";
import { useSelector } from "react-redux";
import { useFileContext } from "../../context/FileContext";

interface FileItemCardProps {
  file: FileItem;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onView?: (file: FileItem) => void;
  onClickFolder?: (file: FileItem) => void;
}

const FileItemCard: FC<FileItemCardProps> = ({
  file,
  onMenuClick,
  onDownload,
  onView,
  onClickFolder,
}) => {
  const [isHover, setIsHover] = useState(false);
 const {currentView} = useFileContext();
  const { isViewing, viewingFileId, isRestoring, restoringFileId, isDownloading, downloadingFileId } =
    useSelector((state: any) => state.loadingState);
  const isFileViewing = isViewing && viewingFileId === file?.unique_key;
  const isFileRestoring = isRestoring && restoringFileId === file?.unique_key;
  const isFileDownloading = isDownloading && downloadingFileId === file?.unique_key;

  const handleDownload = (e: React.MouseEvent, file: FileItem) => {
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
  return (
    <Card
      onDoubleClick={() => {
        if (file.type === "folder" && onClickFolder && currentView !== "trash") {
          onClickFolder(file);
        }
      }}
      sx={{
        boxShadow: "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#edf4fb",
        position: "relative",
        overflow: "hidden",
        opacity: isFileRestoring ? 0.6 : 1,
        pointerEvents: isFileRestoring ? "none" : "auto",
        transition: "opacity 0.2s ease",
        cursor: currentView === "trash" || file?.type === "file" ? "cursor" : "pointer",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.5,
          position: "relative",
          zIndex: 3,
        }}
      >
        <FileIcon file={file} />

        <Typography
          variant="subtitle2"
          noWrap
          sx={{ fontWeight: 500, ml: 0.5 }}
        >
          {file.name}
        </Typography>

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
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>
      <CardContent
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        sx={{ width: "100%", position: "relative", zIndex: 1, flex: 1 }}
      >
        <Box
          sx={{
            width: "100%",
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FileIcon file={file} size={80} />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 12 }}
            color="text.secondary"
          >
            {file.type === "file" ? formatFileSize(file.size) : "Folder"}
          </Typography>
          {file.favorite && (
            <Star
              sx={{
                fontSize: 20,
                color: "#fbbc04",
                fill: "#fbbc04",
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        {file.type === "file" &&  currentView !== "trash" && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isHover ? "rgba(0, 0, 0, 0.1)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: isHover ? "auto" : "none",
              transition: "background-color 0.3s ease",
              zIndex: 2,
            }}
          >
            {isHover && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                {(file.type === "file"  ) && onDownload &&  (
                  <IconButton
                    onClick={(e) => handleDownload(e, file)}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#202124",
                      textTransform: "none",
                      fontWeight: 500,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {isFileDownloading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Download />
                    )}
                  </IconButton>
                )}
                {onView && (
                  <IconButton
                    onClick={handleView}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#202124",
                      textTransform: "none",
                      fontWeight: 500,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {isFileViewing ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FileItemCard;
