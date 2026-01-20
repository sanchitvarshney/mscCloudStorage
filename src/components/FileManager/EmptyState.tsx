import { FC } from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  currentView: string;
}

const EmptyState: FC<EmptyStateProps> = ({ currentView }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 190px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
      }}
    >
      <img
        src={"/trash.png"}
        alt="No Files"
        width={220}
        height={"auto"}
      />
      <Typography variant="h6" gutterBottom>
        No files or folders
      </Typography>
      <Typography variant="body2">
        {currentView === "sharedWithMe"
          ? "Files shared with you will appear here"
          : "Upload files or create folders to get started"}
      </Typography>
    </Box>
  );
};

export default EmptyState;
