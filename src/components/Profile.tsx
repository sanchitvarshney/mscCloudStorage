import { FC, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Paper,
  // Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Email,
  Phone,
  // LocationOn,
  // Security,
  // Notifications,
  // Language,
  // DarkMode,
  CheckCircle,
} from "@mui/icons-material";
import { formatFileSize } from "../utils";
import { useDispatch } from "react-redux";
import { setSpace } from "../slices/loadingSlice";
import { useUpdateProfileMutation } from "../services/auth";
import { useToast } from "../hooks/useToast";

const DEFAULT_STORAGE_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB

const Profile: FC = ({ userData, onRefresh }: any) => {
  const dispatch = useDispatch();
  const rawData = userData?.userData ?? userData ?? {};
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(rawData);
 const [updateProfile, { isLoading }] = useUpdateProfileMutation();
const { showToast } = useToast();




  useEffect(() => {
    const data = userData?.userData ?? userData ?? {};
    setProfileData(data);
  }, [userData]);



  const spaceOccupiedBytes = Number(profileData?.spaceOccupied) || 0;
  const storageTotalBytes =
    Number(profileData?.storageTotal) || DEFAULT_STORAGE_BYTES;

  useEffect(() => {
    if (profileData) {
      const usedSpace = Number(profileData.spaceOccupied) || 0;
      const totalSpace =
        Number(profileData.storageTotal) || DEFAULT_STORAGE_BYTES;
      const freeSpace = totalSpace - usedSpace;
      dispatch(
        setSpace({
          totalSpace,
          freeSpace,
        })
      );
    }
  }, [profileData, dispatch]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const payload = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    }
    updateProfile(payload)
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          showToast(res?.message || "Profile updated successfully", "success");
             setIsEditing(false);
             onRefresh();
        } else {
          showToast(res?.message || "Failed to update profile", "error");
             
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Failed to update profile",
          "error",
        );
      });
 
  };

  const handleChange = (field: string, value: string) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
  };

  const storagePercentage =
    storageTotalBytes > 0
      ? Math.min(100, (spaceOccupiedBytes / storageTotalBytes) * 100)
      : 0;
  const displayPhone =
    profileData.phone && profileData.phone !== "--"
      ? profileData.phone
      : "Not provided";

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#4285f4",
              fontSize: "40px",
              fontWeight: 500,
            }}
          >
            {profileData?.name?.charAt(0).toUpperCase() ?? ""}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            {isEditing ? (
              <TextField
                value={profileData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography
                variant="h4"
                sx={{ fontWeight: 500, color: "#202124", mb: 0.5 }}
              >
                {profileData.name}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckCircle sx={{ fontSize: 16, color: "#34a853" }} />
              <Typography variant="body2" sx={{ color: "#5f6368" }}>
                Verified Account
              </Typography>
            </Box>
          </Box>
          <Button
            variant={isEditing ? "contained" : "outlined"}
            startIcon={ isLoading ? <CircularProgress size={16} /> : <Edit />}
            onClick={isEditing ? handleSave : handleEdit}
            disabled={isLoading}
            sx={{
              textTransform: "none",
              ...(isEditing
                ? {
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                  }
                : {
                    borderColor: "#dadce0",
                    color: "#202124",
                    "&:hover": { borderColor: "#1976d2", bgcolor: "#f8f9fa" },
                  }),
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>
      </Box>

      {/* Storage Progress */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, color: "#202124" }}
          >
            Storage
          </Typography>
          <Typography variant="body2" sx={{ color: "#5f6368" }}>
            {formatFileSize(spaceOccupiedBytes)} of{" "}
            {formatFileSize(storageTotalBytes)} used
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 8,
            bgcolor: "#e0e0e0",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${storagePercentage}%`,
              height: "100%",
              bgcolor: storagePercentage > 80 ? "#ea4335" : "#34a853",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#5f6368", mt: 1, display: "block" }}
        >
          {storagePercentage.toFixed(1)}% used
        </Typography>
      </Paper>

      {/* Contact Information */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: "#202124", mb: 2 }}
        >
          Contact Information
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <List>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40, color: "#5f6368" }}>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={
                  isEditing ? (
                    <TextField
                      value={profileData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      type="email"
                    />
                  ) : (
                    profileData.email
                  )
                }
                secondaryTypographyProps={{
                  sx: { color: "#202124", mt: 0.5 },
                }}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40, color: "#5f6368" }}>
                <Phone />
              </ListItemIcon>
              <ListItemText
                primary="Phone"
                secondary={
                  isEditing ? (
                    <TextField
                      value={
                        profileData.phone === "--" ? "" : profileData.phone
                      }
                      onChange={(e) => handleChange("phone", e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      type="tel"
                      placeholder="Not provided"
                    />
                  ) : (
                    displayPhone
                  )
                }
                secondaryTypographyProps={{
                  sx: { color: "#202124", mt: 0.5 },
                }}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* Quick Actions */}
      {/* <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#202124", mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "Security Settings", icon: <Security />, color: "#ea4335" },
            { label: "Notifications", icon: <Notifications />, color: "#fbbc04" },
            { label: "Language", icon: <Language />, color: "#34a853" },
            { label: "Theme", icon: <DarkMode />, color: "#4285f4" },
          ].map((action, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Box sx={{ color: action.color }}>{action.icon}</Box>}
                sx={{
                  p: 2,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderColor: "#dadce0",
                  color: "#202124",
                  "&:hover": {
                    borderColor: "#1976d2",
                    bgcolor: "#f8f9fa",
                  },
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box> */}
    </Box>
  );
};

export default Profile;
