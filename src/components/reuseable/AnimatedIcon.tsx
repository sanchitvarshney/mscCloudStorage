import { Check } from "@mui/icons-material";

  const AnimatedIcon = ({ active, children }:any) => {
  return (
 <span
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.6s ease",
    transform: active ? "scale(1.02)" : "scale(1)",
  }}
>
  {children}

  <Check
    sx={{
      fontSize: 18,
      overflow: "hidden",
    maxWidth: active ? "16px" : "0px",
      opacity: active ? 1 : 0,
      marginLeft: active ? "2px" : "0px",
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
      color: active ? "#fff" : "#5f6368",
    }}
  />
</span>

  );
};

export default AnimatedIcon;
