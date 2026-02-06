import { FC } from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  currentView: string;
}

const EmptyState: FC<EmptyStateProps> = ({ currentView }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 170px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
      }}
    >
      <img
        src={
          currentView === "spam"
            ? "/spam.png"
            : currentView === "trash"
              ? "/trash.png"
              : "/empty-cart.png"
        }
        alt="No Files"
        width={220}
        height={"auto"}
      />
      <Typography variant="h6" gutterBottom>
        {currentView === "trash"
          ? "Trash is Empty"
          : currentView === "spam"
            ? "Your Spam is Empty"
            : "Your Drive is Empty"}
      </Typography>
      <Typography variant="body2">
        {currentView === "trash"
          ? "Items in the Trash will be deleted permanently after 30 days"
          : currentView === "spam"
            ? "Files in spam won't appear anywhere else in Drive. Files are permanently removed after 30 days "
            : "Oh no! Looks like you don't have any files or folders."}
      </Typography>
    </Box>
  );
};

export default EmptyState;
