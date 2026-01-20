import { FC } from "react";
import { Grid } from "@mui/material";
import { FileItem } from "../../types";
import FileItemCard from "./FileItemCard";

interface FileGridViewProps {
  files: FileItem[];
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
}

const FileGridView: FC<FileGridViewProps> = ({ files, onMenuClick }) => {
  return (
    <Grid container spacing={2} sx={{p:1}}>
      {files.map((file) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
          <FileItemCard file={file} onMenuClick={onMenuClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FileGridView;
