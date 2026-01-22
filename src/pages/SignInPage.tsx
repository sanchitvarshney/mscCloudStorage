import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [inpVal, setInpVal] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (field: any, value: any) => {
    setInpVal((prev) => ({ ...prev, [field]: value }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = () => {
    console.log("Login Data:", inpVal);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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

        {/* RIGHT SECTION - LOGIN FORM */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Box width="100%" maxWidth="600px">
              <Typography sx={{ color: "gray", mb: 2 }} variant="h6">
                Login to your account
              </Typography>

              <TextField
                label="Email / Mobile Number"
                fullWidth
                margin="normal"
                value={inpVal.username}
                onChange={(e) => inputHandler("username", e.target.value)}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={inpVal.password}
                onChange={(e) => inputHandler("password", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{mr:0.6}}>
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                  mb: 1,
                }}
              >
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleForgotPassword}
                  sx={{
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
