import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { IconButton, CircularProgress } from "@mui/material";

import { Close } from "@mui/icons-material";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void;
  type: "success" | "error";
  /** When true, toast stays open and shows loading spinner; when false/undefined, toast auto-closes after duration */
  loading?: boolean;
}

// Slide direction function
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const ToastShow: React.FC<ToastShowProps> = ({ isOpen, msg, onClose, loading = false }) => {
  const action = loading ? (
    <CircularProgress size={20} color="inherit" sx={{ mr: 0.5 }} />
  ) : (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClose}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        open={isOpen}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={loading ? null : 4000}
        key={"bottom" + "center"}
        message={msg}
        action={action}
      />
    </Box>
  );
};

export default ToastShow;
