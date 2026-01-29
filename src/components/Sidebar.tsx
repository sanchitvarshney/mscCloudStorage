import React, { useState, useRef } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Home,
  Business,
  People,
  Star,
  Delete,
  Add,
  CreateNewFolder,
  UploadFile,
} from "@mui/icons-material";
import { Cloud } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ViewType } from "../types";
import { getRouteFromView, getViewFromRoute } from "../utils/routeMapping";
import StorageInfo from "./StorageInfo";

const drawerWidth = 280;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const menuItems: { label: string; view: ViewType; icon: React.ReactNode }[] =
    [
      { label: "Home", view: "home", icon: <Home /> },
      { label: "Shared Drives", view: "sharedDrives", icon: <Business /> },
      { label: "Shared with me", view: "sharedWithMe", icon: <People /> },
      { label: "Starred", view: "starred", icon: <Star /> },
      { label: "Trash", view: "trash", icon: <Delete /> },
    ];

  const handleNewClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNewMenuAnchor(event.currentTarget);
  };

  const handleNewMenuClose = () => {
    setNewMenuAnchor(null);
  };

  const handleNewFolder = () => {
    handleNewMenuClose();
    // Trigger folder creation dialog - we'll need to pass this to parent or use context
    const event = new CustomEvent("createFolder");
    window.dispatchEvent(event);
  };

  const handleFileUpload = () => {
    handleNewMenuClose();
    fileInputRef.current?.click();
  };


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          borderRight: "none",
          // boxSizing: 'border-box',
          // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Logo Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Cloud sx={{ fontSize: 32, color: "#1976d2" }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#1976d2" }}>
            Drive
          </Typography>
        </Box>

        {/* New Button */}
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleNewClick}
            fullWidth
            sx={{
              maxWidth: { sm: "100%", md: 150 },
              textTransform: "none",
              borderRadius: 2,
              py: 1,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            New
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const formData = new FormData();
                Array.from(files).forEach((file) => {
                  formData.append("files", file);
                });

                const event = new CustomEvent("fileUpload", {
                  detail: { files, formDataCreated: true },
                });
                window.dispatchEvent(event);
              }
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
          <input
            type="file"
            ref={folderInputRef}
            style={{ display: "none" }}
            {...({ webkitdirectory: "", directory: "" } as any)}
            multiple
            onChange={(e) => {
              const event = new CustomEvent("folderUpload", {
                detail: e.target.files,
              });
              window.dispatchEvent(event);
              if (folderInputRef.current) folderInputRef.current.value = "";
            }}
          />
        </Box>

        {/* New Menu */}
        <Menu
          anchorEl={newMenuAnchor}
          open={Boolean(newMenuAnchor)}
          onClose={handleNewMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 240,
              boxShadow: 3,
              borderRadius: 2,
            },
          }}
        >
          <MenuItem
            onClick={handleNewFolder}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <CreateNewFolder fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="New folder"
              primaryTypographyProps={{
                variant: "body2",
                sx: { fontWeight: 400 },
              }}
            />
            {/* <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                ml: 'auto',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              Alt+C then F
            </Typography> */}
          </MenuItem>
          <MenuItem
            onClick={handleFileUpload}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <UploadFile fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="File upload"
              primaryTypographyProps={{
                variant: "body2",
                sx: { fontWeight: 400 },
              }}
            />
          </MenuItem>
        
        </Menu>

        <Divider />

        {/* Navigation Menu */}
        <List sx={{ flex: 1, py: 0.5, px: 1.5 }}>
          {menuItems.map((item) => {
            const route = getRouteFromView(item.view);
            // Get current route from location
            const currentRoute =
              location.pathname.split("/").filter(Boolean)[0] || "home";
            const routeView = getViewFromRoute(currentRoute);
            const isSelected = routeView === item.view;

            return (
              <ListItem key={item.view} disablePadding>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    navigate(`/${route}`);
                  }}
                  sx={{
                    py: 0.5,
                    px: 1.5,

                    borderRadius: 10,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",

                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.12)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? "#1976d2" : "inherit",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <StorageInfo />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
