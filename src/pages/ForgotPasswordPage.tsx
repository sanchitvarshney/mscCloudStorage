import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Reset password for:", email);
    // Add your forgot password logic here
    // After successful submission, you might want to show a success message
  };

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 30px)"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "900px",
          overflow: "hidden",
          borderRadius: "20px",
          border: "1px solid #ccc",
          gap: "20px",
          padding: "40px",
        }}
      >
        {/* LEFT SECTION */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/mscorpres_auto_logo.png" alt="Logo" width={150} />
        </Box>

        {/* RIGHT SECTION - FORGOT PASSWORD FORM */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Box width="100%" maxWidth="600px">
              <Typography sx={{ color: "gray", mb: 2 }} variant="h6">
                Forgot Password
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Enter your email address or mobile number and we'll send you a
                link to reset your password.
              </Typography>

              <TextField
                label="Email / Mobile Number"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or mobile number"
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleSubmit}
                disabled={!email.trim()}
              >
                Send Reset Link
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleBackToLogin}
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
