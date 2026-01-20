import { FC } from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import { MoreVert, ArrowDownward } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatDate } from "../../utils";
import { formatFileSize } from "../../utils";

interface FileItemRowProps {
  file: FileItem;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
  isSharedWithMe?: boolean;
}

const FileItemRow: FC<FileItemRowProps> = ({
  file,
  onMenuClick,
  isSharedWithMe = false,
}) => {
  if (isSharedWithMe) {
    return (
      <TableRow
        key={file.id}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          cursor: "pointer",
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
              {file.sharedWith && file.sharedWith.length > 0 && (
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
              )}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            {file.sharedBy || "Unknown"}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "#5f6368" }}>
              {formatDate(file.dateShared || file.modified)}
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
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(e, file);
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      key={file.id}
      sx={{
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
        cursor: "pointer",
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
          {formatDate(file.modified)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ color: "#5f6368", p: 0 }}>
          {file.type === "file" ? formatFileSize(file.size) : "-"}
        </Typography>
      </TableCell>
      <TableCell align="right">
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
      </TableCell>
    </TableRow>
  );
};

export default FileItemRow;
