import { FC } from "react";
import { Box, Typography, FormControl, Select, MenuItem, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { ViewType } from "../../types";
import { getViewTitle } from "../../utils";
import ViewToggle from "./ViewToggle";

interface FileManagerHeaderProps {
  currentView: ViewType;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  folder: any;
  onBack?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const FileManagerHeader: FC<FileManagerHeaderProps> = ({
  currentView,
  viewMode,
  onViewModeChange,
  folder,
  onBack,
  onRefresh,
  isRefreshing = false,
}) => {
  const isFolderView = !!folder;
  return (
    <Box
      sx={{
        py: 1.8,
        px: 3,
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isFolderView && onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                color: "#5f6368",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h5" sx={{ fontWeight: 400, color: "#202124" }}>
            {folder ?? getViewTitle(currentView)}
          </Typography>
        </Box>
        {currentView === "sharedWithMe" && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" sx={{ maxHeight: 40 }} displayEmpty>
                <MenuItem value="all">Type</MenuItem>
                <MenuItem value="folder">Folders</MenuItem>
                <MenuItem value="file">Files</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" sx={{ maxHeight: 40 }} displayEmpty>
                <MenuItem value="all">People</MenuItem>
                <MenuItem value="me">Shared with me</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" sx={{ maxHeight: 40 }} displayEmpty>
                <MenuItem value="all">Modified</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This week</MenuItem>
                <MenuItem value="month">This month</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" sx={{ maxHeight: 40 }} displayEmpty>
                <MenuItem value="all">Source</MenuItem>
                <MenuItem value="drive">My Drive</MenuItem>
                <MenuItem value="shared">Shared with me</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton 
            size="small" 
            sx={{ 
              color: "#5f6368",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }} 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <CircularProgress size={20} sx={{ color: "#5f6368" }} />
            ) : (
              <Refresh />
            )}
          </IconButton>
       
        <ViewToggle viewMode={viewMode} onViewChange={onViewModeChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default FileManagerHeader;
