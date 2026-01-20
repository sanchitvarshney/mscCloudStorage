import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { FileItem } from "../../types";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  onShare: (emails: string[]) => void;
  file: FileItem | null;
}

const ShareDialog: FC<ShareDialogProps> = ({ open, onClose, onShare, file }) => {
  const [shareEmails, setShareEmails] = useState(
    file?.sharedWith?.join(", ") || ""
  );

  useEffect(() => {
    if (file) {
      setShareEmails(file.sharedWith?.join(", ") || "");
    } else {
      setShareEmails("");
    }
  }, [file, open]);

  const handleShare = () => {
    if (file) {
      const emails = shareEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      onShare(emails);
      setShareEmails("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          boxShadow: 0,
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
      <DialogTitle sx={{ px: 0, py: 1 }}>Share "{file?.name}"</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ mt: 1, minWidth: { xs: 200, md: 400 } }}>
          <TextField
            autoFocus
            fullWidth
            label="Email addresses (comma separated)"
            variant="outlined"
            value={shareEmails}
            onChange={(e) => setShareEmails(e.target.value)}
            placeholder="user1@example.com, user2@example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleShare();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 0, py: 1, mt: 0.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleShare} variant="contained">
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
