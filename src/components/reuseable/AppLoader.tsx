import { LinearProgress, Typography } from "@mui/material";

const AppLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center w-full  bg-white">
      <img src={"/mscorpres_auto_logo.png"} alt="Mscorpres Logo" className="w-[500px] opacity-50" />

      <LinearProgress sx={{ width: "500px", height: "5px", mt: 2 }} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Loading ESS Portal
      </Typography>
    </div>
  );
};

export default AppLoader;
