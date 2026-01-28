import { FC } from "react";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import {
  Download,
  Share,
  Delete,
  Star,
  StarBorder,
  RestoreFromTrash,
} from "@mui/icons-material";
import { FileItem } from "../../types";
import { useSelector } from "react-redux";

interface FileContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  file: any | null;
  currentView: string;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onToggleFavourite: (fileId: string) => void;
  onDelete: (file: any) => void;
  onRestore: (file: string) => void;
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
  onRestore,
  onDelete,
}) => {
  const {
    isDeleting,
    isFavoriting,
    isRestoring,
    deletingFileId,
    favoritingFileId,
    restoringFileId,
  } = useSelector((state: any) => state.loadingState);

  const isFileDeleting = isDeleting && deletingFileId === file?.unique_key;
  const isFileFavoriting =
    isFavoriting && favoritingFileId === file?.unique_key;
  const isFileRestoring = isRestoring && restoringFileId === file?.unique_key;

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
          if (file && !isFileFavoriting) {
            onToggleFavourite(file);
          }
        }}
        disabled={isFileFavoriting}
      >
        {file?.favorite ? (
          <>
            {isFileFavoriting ? (
              <CircularProgress size={15} sx={{ mr: 1 }} />
            ) : (
              <Star sx={{ mr: 1 }} fontSize="small" />
            )}
            Remove from Favourites
          </>
        ) : (
          <>
            {isFileFavoriting ? (
              <CircularProgress size={15} sx={{ mr: 1 }} />
            ) : (
              <StarBorder sx={{ mr: 1 }} fontSize="small" />
            )}
            Add to Favourites
          </>
        )}
      </MenuItem>
      {currentView === "trash" ? (
        <MenuItem
          onClick={() => {
            if (file && !isFileRestoring) {
              onRestore(file);
            }
            onClose();
          }}
          disabled={isFileRestoring}
        >
          {isFileRestoring ? (
            <CircularProgress size={15} sx={{ mr: 1 }} />
          ) : (
            <RestoreFromTrash sx={{ mr: 1 }} fontSize="small" />
          )}
          Restore
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            if (file && !isFileDeleting) {
              onDelete(file);
            }
            onClose();
          }}
          disabled={isFileDeleting}
        >
          {isFileDeleting ? (
            <CircularProgress size={15} sx={{ mr: 1 }} />
          ) : (
            <Delete sx={{ mr: 1 }} fontSize="small" />
          )}
          Trash
        </MenuItem>
      )}
    </Menu>
  );
};

export default FileContextMenu;
