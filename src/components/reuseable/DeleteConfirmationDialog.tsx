import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  itemType?: "file" | "folder" | "item";
  isLoading?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType = "item",
  isLoading = false,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const defaultTitle = title || `Delete ${itemType === "file" ? "File" : itemType === "folder" ? "Folder" : "Item"}`;
  const defaultMessage =
    message ||
    `Are you sure you want to trash "${itemName || "this item"}"? This can be deleted permanently after 20 days.`;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: 0,
          minWidth: { xs: 280, sm: 400 },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.27)",
            backdropFilter: "blur(0px)",
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 0, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <DeleteIcon color="error" />
        <Typography variant="h6" component="span">
          {defaultTitle}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {defaultMessage}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 0, py: 1, mt: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          variant="contained"
          color="error"
          startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
