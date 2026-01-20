import {  Cloud, HelpOutline, Settings } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SearchBar from "./reuseable/SearchBar";
import Sidebar from "./Sidebar";
import FileManager from "./FileManager";

const AppContent: React.FC = () => {
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: "space-between", px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
            <Cloud sx={{ color: "#1976d2", fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: "#5f6368", fontWeight: 400 }}>
              Drive
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SearchBar />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <HelpOutline />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Settings />
            </IconButton>
          
            <Box
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                ml: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: "24px",
                cursor: "pointer",
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#4285f4",
                  fontSize: "14px",
                }}
              >
                U
              </Avatar>
            </Box>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {["Profile", "Settings", "Sign out"].map((option) => (
                <MenuItem key={option} onClick={handleProfileClose}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
          }}
        >
          <FileManager />
        </Box>
      </Box>
    </Box>
  );
};

export default AppContent;
