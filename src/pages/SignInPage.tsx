import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLoginGoogleMutation } from "../services/auth";
import { useAuth } from "../hooks/AuthHook";

const Login = () => {
  const navigate = useNavigate();
  const { signIn} = useAuth();
 
    const [loginGoogle, { isLoading: isLoadingGoogle }] =
    useLoginGoogleMutation();

  const handleLoginWithGoogle = (googleResponse: any) => {
    const data: any = {
      credential: googleResponse.credential,
    };
    console.log(data,"data")
    loginGoogle(data)
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          localStorage.setItem("user", JSON.stringify(res.data));
          signIn();
          navigate("/home");
        } else {
          // showToast(res?.message, "error");
          console.log(res,"res")
        }
      })
      .catch((err: any) => {
          console.log(err,"res")
        // showToast(
        //   err?.data?.message ||
        //     err?.message ||
        //     "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        //   "error",
        // );
      });
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
        <Box>
          {isLoadingGoogle ? (
           
              <CircularProgress />
          
          ) : (
            <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleLoginWithGoogle(credentialResponse);
            }}
            onError={() => {
              // showToast("Login failed", "error");
            }}
            shape="circle"
            text="continue_with"
          />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
