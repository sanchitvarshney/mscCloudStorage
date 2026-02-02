import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLoginGoogleMutation } from "../services/auth";
import { useAuth } from "../hooks/AuthHook";
import { useToast } from "../hooks/useToast";
import { useEffect } from "react";

const Login = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [loginGoogle, { isLoading: isLoadingGoogle }] =
    useLoginGoogleMutation();

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
            width={140}
            style={{ marginBottom: 10 }}
          />
        </Box>
        <Typography variant="h5" fontWeight={700}>
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          Sign in to continue to your drive
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: 50,
            alignItems: "center",
          }}
        >
          {isLoadingGoogle ? (
            <Box sx={{}}>
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
          Secure login powered by Google OAuth
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
