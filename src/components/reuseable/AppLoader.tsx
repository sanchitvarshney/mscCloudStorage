import { Box, LinearProgress, Typography } from "@mui/material";

const AppLoader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        src="/mscorpres_auto_logo.png"
        alt="Mscorpres Logo"
        sx={{
          width: { xs: "150px", sm: "100px", md: "120px" },
          opacity: 0.5,
        }}
      />

      <LinearProgress
        sx={{
          width: { xs: "50%", sm: "40%", md: "30%" },
          height: "5px",
          mt: 2,
        }}
      />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Loading MSC Drive ...
      </Typography>
    </Box>
  );
};

export default AppLoader;
