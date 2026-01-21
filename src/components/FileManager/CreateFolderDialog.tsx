import { FC, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateFolderDialog: FC<CreateFolderDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [newFolderName, setNewFolderName] = useState("Unnamed Folder");
  const folderInputRef = useRef<any>(null);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(
    null,
  );

  const focusAndSelectInput = () => {
    const tryFocus = (element: HTMLInputElement | null) => {
      if (!element) return false;

      try {
        if (document.contains(element)) {
          element.focus();
          requestAnimationFrame(() => {
            element.select();
          });
          return true;
        }
      } catch (error) {
        console.warn("Focus error:", error);
      }
      return false;
    };

    if (tryFocus(folderInputRef.current)) return;
    if (tryFocus(inputElement)) return;

    const dialog = document.querySelector('[role="dialog"]');
    if (dialog) {
      const input = dialog.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      if (tryFocus(input)) return;
    }
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        focusAndSelectInput();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setNewFolderName("Unnamed Folder");
    }
  }, [open]);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreate(newFolderName.trim());
      setNewFolderName("Unnamed Folder");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      //@ts-ignore
      onEntered={() => {
        focusAndSelectInput();
      }}
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
      <DialogTitle sx={{ px: 0, py: 1 }}>New Folder</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ mt: 1, minWidth: { xs: 200, md: 400 } }}>
          <TextField
            inputRef={(el) => {
              folderInputRef.current = el;
              if (el) setInputElement(el);
            }}
            fullWidth
            value={newFolderName}
            onChange={(e) => {
              e.preventDefault();
              setNewFolderName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 0, py: 1, mt: 0.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
