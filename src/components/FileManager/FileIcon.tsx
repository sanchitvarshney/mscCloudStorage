import { FC } from "react";
import {
  Folder,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  Archive,
  Image,
  VideoFile,
  AudioFile,
  Code,
} from "@mui/icons-material";
import { FileItem } from "../../types";

interface FileIconProps {
  file: FileItem;
  size?: number;
}

const FileIcon: FC<FileIconProps> = ({ file, size = 24 }) => {
  if (file.type === "folder") {
    return <Folder sx={{ fontSize: size, color: "#ffa726" }} />;
  }

  const fileType = file.fileType || file.name.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "pdf":
      return <PictureAsPdf sx={{ fontSize: size, color: "#d32f2f" }} />;
    case "xlsx":
    case "xls":
      return <Description sx={{ fontSize: size, color: "#2e7d32" }} />;
    case "zip":
    case "rar":
      return <Archive sx={{ fontSize: size, color: "#616161" }} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image sx={{ fontSize: size, color: "#1976d2" }} />;
    case "mp4":
    case "avi":
    case "mov":
      return <VideoFile sx={{ fontSize: size, color: "#7b1fa2" }} />;
    case "mp3":
    case "wav":
      return <AudioFile sx={{ fontSize: size, color: "#f57c00" }} />;
    case "js":
    case "ts":
    case "html":
    case "css":
      return <Code sx={{ fontSize: size, color: "#0288d1" }} />;
    default:
      return <InsertDriveFile sx={{ fontSize: size, color: "#42a5f5" }} />;
  }
};

export default FileIcon;
