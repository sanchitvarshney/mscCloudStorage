import { FC, memo } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { ArrowBack, Refresh, NavigateNext } from "@mui/icons-material";
import { ViewType } from "../../types";
import ViewToggle from "./ViewToggle";
import type { BreadcrumbSegment } from "../../utils/cookies";

export type SharedWithMeTypeFilter = "all" | "folder" | "file";

interface FileManagerHeaderProps {
  currentView: ViewType;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  folder: any;
  breadcrumbSegments?: BreadcrumbSegment[];
  onBreadcrumbClick?: (segment: BreadcrumbSegment) => void;
  onBack?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  sharedWithMeTypeFilter?: SharedWithMeTypeFilter;
  onSharedWithMeTypeFilterChange?: (value: SharedWithMeTypeFilter) => void;
}

const FileManagerHeader: FC<FileManagerHeaderProps> = ({
  currentView,
  viewMode,
  onViewModeChange,
  folder,
  breadcrumbSegments = [],
  onBreadcrumbClick,
  onBack,
  onRefresh,
  isRefreshing = false,
  sharedWithMeTypeFilter = "all",
  onSharedWithMeTypeFilterChange,
}) => {
  const isFolderView = !!folder;
  const segments =
    breadcrumbSegments.length > 0
      ? breadcrumbSegments
      : [{ id: null, name: folder || "My Drive" }];

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
          <Breadcrumbs
            separator={
              <NavigateNext fontSize="small" sx={{ color: "#5f6368" }} />
            }
            aria-label="breadcrumb"
            sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}
          >
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              if (isLast) {
                return (
                  <Typography
                    key={segment.id ?? "root"}
                    variant="h5"
                    sx={{ fontWeight: 400, color: "#202124" }}
                  >
                    {segment.name}
                  </Typography>
                );
              }
              return (
                <Link
                  key={segment.id ?? "root"}
                  component="button"
                  variant="h5"
                  onClick={() => onBreadcrumbClick?.(segment)}
                  sx={{
                    fontWeight: 400,
                    color: "#5f6368",
                    textDecoration: "none",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#202124",
                    },
                  }}
                >
                  {segment.name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        {currentView === "sharedWithMe" && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sharedWithMeTypeFilter}
                onChange={(e) =>
                  onSharedWithMeTypeFilterChange?.(
                    e.target.value as SharedWithMeTypeFilter,
                  )
                }
                sx={{ maxHeight: 40 }}
                displayEmpty
              >
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

export default memo(FileManagerHeader);
