import { FC, ReactNode } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number | string;
}

const RightDrawer: FC<RightDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: width,
          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#202124" }}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#5f6368",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f5f5f5",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#999",
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  );
};

export default RightDrawer;
