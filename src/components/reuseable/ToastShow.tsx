import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import type { SlideProps } from "@mui/material/Slide";
import { IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";

interface ToastShowProps {
  isOpen: boolean;
  msg: string;
  onClose?: () => void;
  type: "success" | "error";
}

// Slide direction function
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const ToastShow: React.FC<ToastShowProps> = ({ isOpen, msg, onClose }) => {
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        open={isOpen}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={4000}
        key={"bottom" + "center"}
        message={msg}
        action={action}
      />
    </Box>
  );
};

export default ToastShow;
