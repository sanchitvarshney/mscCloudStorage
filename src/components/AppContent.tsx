import { Cloud, Settings, Person, Logout } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./reuseable/SearchBar";
import RightDrawer from "./reuseable/RightDrawer";
import Sidebar from "./Sidebar";
import HelpCenter from "./HelpCenter";
import SendFeedbackDialog from "./SendFeedbackDialog";
import { useConnectivity } from "../hooks/useConnectivity";
import Profile from "./Profile";
import { useAuth } from "../hooks/AuthHook";
import DomainSettings from "./DomainSettings";
import { useGetProfileQuery } from "../services/auth";
import { setSpace } from "../slices/loadingSlice";

const DEFAULT_STORAGE_BYTES = 15 * 1024 * 1024 * 1024; 

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [domainSettingsDrawerOpen, setDomainSettingsDrawerOpen] =
    useState(false);
  const { isOnline } = useConnectivity();
  const { data: profileData } = useGetProfileQuery({});

  useEffect(() => {
    if (!isOnline && location.pathname !== "/offline") {
      navigate("/offline");
    }
  }, [isOnline, location.pathname, navigate]);

  useEffect(() => {
    if (profileData) {
      const data = profileData?.userData ?? profileData;
      const usedSpace = Number(data?.spaceOccupied) || 0;
      const totalSpace =
        Number(data?.storageTotal) || DEFAULT_STORAGE_BYTES;
      const freeSpace = totalSpace - usedSpace;
      dispatch(
        setSpace({
          totalSpace,
          freeSpace,
        })
      );
    }
  }, [profileData, dispatch]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsMenuAnchor(null);
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
          mt: 0,
          transition: "margin-top 0.3s ease",
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: "space-between", px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
            <Cloud sx={{ color: "#1976d2", fontSize: 30 }} />
            <Typography variant="h6" sx={{ color: "#5f6368", fontWeight: 400 }}>
              Drive
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SearchBar />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <IconButton
              size="small"
              onClick={handleHelpClick}
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <HelpOutline />
            </IconButton> */}
            {/* <Menu
              anchorEl={helpMenuAnchor}
              open={Boolean(helpMenuAnchor)}
              onClose={handleHelpClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleHelpClose();
                  setHelpDrawerOpen(true);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <HelpCenterIcon />
                </ListItemIcon>
                Help Center
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleHelpClose();
                  setFeedbackDialogOpen(true);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <Feedback />
                </ListItemIcon>
                Send Feedback
              </MenuItem>
            </Menu> */}
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Settings />
            </IconButton>
            <Menu
              anchorEl={settingsMenuAnchor}
              open={Boolean(settingsMenuAnchor)}
              onClose={handleSettingsClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleSettingsClose();
                  setDomainSettingsDrawerOpen(true);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <Settings />
                </ListItemIcon>
                General
              </MenuItem>
              {/* {[
                { label: "Storage", icon: <Storage /> },
                { label: "Privacy", icon: <PrivacyTip /> },
              ].map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={handleSettingsClose}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: "inherit",
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  {option.label}
                </MenuItem>
              ))} */}
            </Menu>

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
                {user?.name?.[0] ?? "U"}
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
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  setProfileDrawerOpen(true);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <Person />
                </ListItemIcon>
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  signOut();
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <Logout />
                </ListItemIcon>
                Sign out
              </MenuItem>
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
          <Outlet />
        </Box>
      </Box>

      {/* Help Center Drawer */}
      <RightDrawer
        open={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
        title="Help Center"
        width={480}
      >
        <HelpCenter />
      </RightDrawer>

      {/* Send Feedback Dialog */}
      <SendFeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
      />

      {/* Profile Drawer */}
      <RightDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        title="Account Details"
        width={600}
      >
        {/* @ts-ignore */}
        <Profile userData={profileData} />
      </RightDrawer>

      {/* Domain Settings Drawer */}
      <RightDrawer
        open={domainSettingsDrawerOpen}
        onClose={() => setDomainSettingsDrawerOpen(false)}
        title="Domain & Port Settings"
        width={600}
      >
        <DomainSettings />
      </RightDrawer>
    </Box>
  );
};

export default AppContent;
