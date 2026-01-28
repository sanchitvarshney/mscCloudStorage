import { FC, useState } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { MoreVert, ArrowDownward, Download, Visibility } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatDate } from "../../utils";
import { formatFileSize } from "../../utils";
import { useSelector } from "react-redux";

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
  const [isHover, setIsHover] = useState(false);
  const { isViewing, viewingFileId } = useSelector(
    (state: any) => state.loadingState,
  );
  const isFileViewing = isViewing && viewingFileId === file?.unique_key;

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
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          cursor: "pointer",
          position: "relative",
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
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {file.name}
              </Typography>
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
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            {file?.sharedBy || "Unknown"}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              {formatDate(file?.dateShared || file?.modified)}
            </Typography>
            <ArrowDownward
              sx={{
                fontSize: 14,
                ml: 0.5,
                verticalAlign: "middle",
              }}
            />
          </Box>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isHover && file.type === "file" && (
              <>
                {onDownload && (
                  <IconButton
                    size="small"
                    onClick={handleDownload}
                    sx={{
                      p: 0.5,
                    }}
                  >
                    <Download fontSize="small" />
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
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick(e, file);
              }}
              sx={{
                p: 0.5,
              }}
            >
              <MoreVert fontSize="small" />
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
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      sx={{
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
        cursor: "pointer",
        position: "relative",
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
          <Typography variant="body2">{file.name}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "#5f6368", p: 0 }}>
          {formatDate(file?.modified)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "#5f6368", p: 0 }}>
          {file?.type === "file" ? formatFileSize(file?.size) : "-"}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {isHover && file.type === "file" && (
            <>
              {onDownload && (
                <IconButton
                  size="small"
                  onClick={handleDownload}
                  sx={{
                    p: 0.5,
                  }}
                >
                  <Download fontSize="small" />
                </IconButton>
              )}
              {onView && (
                <IconButton
                  size="small"
                  onClick={handleView}
                  sx={{
                    p: 0.5,
                  }}
                >
                  {loading ? (
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
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default FileItemRow;
