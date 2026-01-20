import { FC } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "./FileIcon";
import { formatFileSize } from "../../utils";

interface FileItemCardProps {
  file: FileItem;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
}

const FileItemCard: FC<FileItemCardProps> = ({ file, onMenuClick }) => {
  return (
    <Card
      sx={{
        boxShadow: "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#edf4fb",
        "&:hover": {
         
          transform: "scale(1.02)",
        },
      }}
    >
     
        <Box
          sx={{
            width: " 100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 0.5,
          }}
        >
          <Box sx={{ p: 0.5 }}>
            <FileIcon file={file} />
          </Box>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 500 }}
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
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <CardContent sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{}}>
              <FileIcon file={file} size={80} />
            </span>
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
        </CardContent>
   
    </Card>
  );
};

export default FileItemCard;
