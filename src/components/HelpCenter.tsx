import { FC } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  HelpOutline,
  Article,
  VideoLibrary,
  School,
  ContactSupport,
  Keyboard,
  Security,
  Storage,
  Share,
} from "@mui/icons-material";

const HelpCenter: FC = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: <School />,
      items: [
        { label: "Quick Start Guide", link: "#" },
        { label: "Uploading Files", link: "#" },
        { label: "Organizing Files", link: "#" },
      ],
    },
    {
      title: "Features",
      icon: <Article />,
      items: [
        { label: "Sharing Files", link: "#", icon: <Share /> },
        { label: "Storage Management", link: "#", icon: <Storage /> },
        { label: "Security & Privacy", link: "#", icon: <Security /> },
      ],
    },
    {
      title: "Troubleshooting",
      icon: <HelpOutline />,
      items: [
        { label: "Common Issues", link: "#" },
        { label: "File Sync Problems", link: "#" },
        { label: "Access Denied", link: "#" },
      ],
    },
  ];

  const quickLinks = [
    { label: "Video Tutorials", icon: <VideoLibrary />, link: "#" },
    { label: "Keyboard Shortcuts", icon: <Keyboard />, link: "#" },
    { label: "Contact Support", icon: <ContactSupport />, link: "#" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, color: "#202124", mb: 1 }}
        >
          Welcome to Help Center
        </Typography>
        <Typography variant="body2" sx={{ color: "#5f6368" }}>
          Find answers to common questions and learn how to get the most out of
          Drive.
        </Typography>
      </Box>

      {/* Search Section */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          bgcolor: "#f8f9fa",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, color: "#202124" }}>
          Search for help
        </Typography>
        <Box
          component="input"
          placeholder="Search help articles..."
          sx={{
            width: "100%",
            p: 1.5,
            border: "1px solid #dadce0",
            borderRadius: 1,
            fontSize: "14px",
            "&:focus": {
              outline: "none",
              borderColor: "#1976d2",
            },
          }}
        />
      </Box>

      {/* Quick Links */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, color: "#202124", mb: 2 }}
        >
          Quick Links
        </Typography>
        <List>
          {quickLinks.map((link, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component="a"
                href={link.link}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "#f1f3f4",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "#5f6368" }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { color: "#202124" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Help Categories */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, color: "#202124", mb: 2 }}
        >
          Browse by Topic
        </Typography>
        {helpCategories.map((category, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box sx={{ color: "#1976d2" }}>{category.icon}</Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: "#202124" }}
              >
                {category.title}
              </Typography>
            </Box>
            <List>
              {category.items.map((item, itemIndex) => (
                <ListItem key={itemIndex} disablePadding>
                  <ListItemButton
                    component="a"
                    href={item.link}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      "&:hover": {
                        backgroundColor: "#f1f3f4",
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { color: "#5f6368" },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Popular Articles */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "#e8f0fe", borderRadius: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 500, color: "#202124", mb: 1 }}
        >
          Popular Articles
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {["How to share files", "Storage limits", "File permissions"].map(
            (article, index) => (
              <Chip
                key={index}
                label={article}
                size="small"
                component="a"
                href="#"
                clickable
                sx={{
                  bgcolor: "#fff",
                  "&:hover": {
                    bgcolor: "#f1f3f4",
                  },
                }}
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HelpCenter;
