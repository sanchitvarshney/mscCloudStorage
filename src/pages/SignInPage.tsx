import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLoginGoogleMutation, useLoginWithEmailMutation } from "../services/auth";
import { useAuth } from "../hooks/AuthHook";
import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginGoogle, { isLoading: isLoadingGoogle }] =
    useLoginGoogleMutation();
  const [loginWithEmail, { isLoading: isLoadingEmail }] =
    useLoginWithEmailMutation();

  const handleLoginWithGoogle = (googleResponse: any) => {
    const data: any = {
      credential: googleResponse.credential,
    };

    loginGoogle(data)
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          localStorage.setItem("user", JSON.stringify(res.data));
          signIn();
          navigate("/home");
        } else {
          showToast(res?.message || "Login failed", "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Login failed",
          "error",
        );
      });
  };

  const handleLoginWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please enter email and password", "error");
      return;
    }
    loginWithEmail({ email: email.trim(), password })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          localStorage.setItem("user", JSON.stringify(res.data));
          signIn();
          navigate("/home");
        } else {
          showToast(res?.message || "Login failed", "error");
        }
      })
      .catch((err: any) => {
        showToast(
          err?.data?.message || err?.message || "Login failed",
          "error",
        );
      });
  };
     const user = localStorage.getItem("user");
  useEffect(() => {
 
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 420,
          padding: "40px 30px",
          borderRadius: "20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Box mb={2}>
          <img
            src="/mscorpres_auto_logo.png"
            alt="Logo"
            width={120}
            style={{ marginBottom: 10 }}
          />
        </Box>
        <Typography variant="h5" fontWeight={700}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to continue to your drive
        </Typography>

        {/* Email & Password form */}
        <Box
          component="form"
          onSubmit={handleLoginWithEmail}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoadingEmail || isLoadingGoogle}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoadingEmail || isLoadingGoogle}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    size="small"
                    disabled={isLoadingEmail || isLoadingGoogle || !password}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoadingEmail || isLoadingGoogle}
            sx={{
              py: 1.25,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isLoadingEmail ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in with email"
            )}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: 50,
            alignItems: "center",
          }}
        >
          {isLoadingGoogle ? (
            <Box>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary" mt={2}>
                Please wait, Loading...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleLoginWithGoogle(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                text="continue_with"
                shape="pill"
              />
            </Box>
          )}
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={4}
        >
          Sign in with email or Google
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
