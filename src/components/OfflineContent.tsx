import { FC } from "react";
import { Box, Typography, Button } from "@mui/material";
import { CloudOff, Refresh } from "@mui/icons-material";
import { useConnectivity } from "../hooks/useConnectivity";
import { useNavigate } from "react-router-dom";

const OfflineContent: FC = () => {
  const { isOnline } = useConnectivity();
  const navigate = useNavigate();

  const handleRetry = () => {
    // Force a check by reloading the page or checking connectivity
    if (navigator.onLine) {
     navigate("/");

    } else {
      // Show a message that they're still offline
      alert("You're still offline. Please check your network connection.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 70px)",
        p: 4,
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      
        <CloudOff sx={{ fontSize: 160, color: "#cccccc" }} />

      <Typography
        variant="body2"
        sx={{ color: "#5f6368", mb: 3, maxWidth: 400 }}
      >
        You're currently offline. Check your network connection and try again.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Refresh />}
        onClick={handleRetry}
        disabled={!isOnline}
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
          "&:disabled": {
            backgroundColor: "#e8eaed",
            color: "#5f6368",
          },
        }}
      >
        Retry
      </Button>
    </Box>
  );
};

export default OfflineContent;
