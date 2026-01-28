import { FC, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { MoreVert, Download, Visibility } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatFileSize } from "../../utils";

interface FileItemCardProps {
  file: FileItem;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onView?: (file: FileItem) => void;
  onClickFolder?: (file: FileItem) => void;
  loading: boolean;
}

const FileItemCard: FC<FileItemCardProps> = ({
  file,
  onMenuClick,
  onDownload,
  onView,
  onClickFolder,
  loading,
}) => {
  const [isHover, setIsHover] = useState(false);

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
  return (
    <Card
      onDoubleClick={() => {
        if (file.type === "folder" && onClickFolder) {
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
        <Box sx={{ p: 0.5 }}>
          <FileIcon file={file} />
        </Box>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 500 }}>
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
          <Typography variant="subtitle2" color="text.secondary">
            {file.type === "file" ? formatFileSize(file.size) : "Folder"}
          </Typography>
          {file.sharedWith && file.sharedWith.length > 0 && (
            <Chip
              label={`Shared with ${file.sharedWith.length}`}
              size="small"
              sx={{ fontSize: "0.7rem" }}
            />
          )}
        </Box>

        {file.type === "file" && (
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
                {file.type === "file" && onDownload && (
                  <IconButton
                    onClick={handleDownload}
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
                    <Download />
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
                    {loading ? <CircularProgress size={20} /> : <Visibility />}
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
