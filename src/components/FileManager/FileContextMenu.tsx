import { FC } from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  Download,
  Share,
  Delete,
  Star,
  StarBorder,
  RestoreFromTrash,
} from "@mui/icons-material";
import { FileItem } from "../../types";

interface FileContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: FileItem | null;
  currentView: string;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onToggleFavourite: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onRestore: (fileId: string) => void;
}

const FileContextMenu: FC<FileContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  file,
  currentView,
  onDownload,
  onShare,
  onToggleFavourite,
  onDelete,
  onRestore,
}) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {file && file.type === "file" && (
        <MenuItem onClick={() => file && onDownload(file)}>
          <Download sx={{ mr: 1 }} fontSize="small" />
          Download
        </MenuItem>
      )}
      <MenuItem onClick={() => file && onShare(file)}>
        <Share sx={{ mr: 1 }} fontSize="small" />
        Share
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (file) {
            onToggleFavourite(file.id);
          }
          onClose();
        }}
      >
        {file?.isFavourite ? (
          <>
            <Star sx={{ mr: 1 }} fontSize="small" />
            Remove from Favourites
          </>
        ) : (
          <>
            <StarBorder sx={{ mr: 1 }} fontSize="small" />
            Add to Favourites
          </>
        )}
      </MenuItem>
      {currentView === "trash" ? (
        <MenuItem
          onClick={() => {
            if (file) {
              onRestore(file.id);
            }
            onClose();
          }}
        >
          <RestoreFromTrash sx={{ mr: 1 }} fontSize="small" />
          Restore
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            if (file) {
              onDelete(file.id);
            }
            onClose();
          }}
         
        >
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Trash
        </MenuItem>
      )}
    </Menu>
  );
};

export default FileContextMenu;
