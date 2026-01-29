import { FC } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import AnimatedIcon from "../reuseable/AnimatedIcon";

interface ViewToggleProps {
  viewMode: "list" | "grid";
  onViewChange: (mode: "list" | "grid") => void;
}

const ViewToggle: FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(_, newMode) => {
        localStorage.setItem("viewMode", newMode);
        newMode && onViewChange(newMode)
      }}
      size="small"
      sx={{
        background: "#f4f6f8",
        borderRadius: "20px",
        padding: "4px",
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "20px",
          padding: "6px 12px",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        },
        "& .Mui-selected": {
          backgroundColor: "#1976d2 !important",
          color: "#fff",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        },
      }}
    >
          <ToggleButton value="grid" disableRipple>
        <AnimatedIcon active={viewMode === "grid"}>
          <ViewModule
            sx={{ color: viewMode === "grid" ? "#fff" : "#5f6368" }}
          />
        </AnimatedIcon>
      </ToggleButton>
      <ToggleButton value="list" disableRipple>
        <AnimatedIcon active={viewMode === "list"}>
          <ViewList
            sx={{ color: viewMode === "list" ? "#fff" : "#5f6368" }}
          />
        </AnimatedIcon>
      </ToggleButton>
  
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
