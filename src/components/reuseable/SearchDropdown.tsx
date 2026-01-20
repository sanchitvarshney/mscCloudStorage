import { FC, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileIcon from "../FileManager/FileIcon";
import { formatDate } from "../../utils";

interface SearchDropdownProps {
  searchQuery: string;
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
  onPersonFilter?: (personName: string) => void;
  selectedPerson?: string | null;
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  searchQuery,
  files,
  onFileClick,
  onPersonFilter,
  selectedPerson,
}) => {
  // Extract unique people from files
  const people = useMemo(() => {
    const peopleSet = new Set<string>();
    files.forEach((file) => {
      if (file.sharedBy) {
        peopleSet.add(file.sharedBy);
      }
      if (file.sharedWith) {
        file.sharedWith.forEach((email) => peopleSet.add(email));
      }
    });
    return Array.from(peopleSet);
  }, [files]);

  // Filter people based on search query
  const filteredPeople = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return people
      .filter((person) => person.toLowerCase().includes(query))
      .slice(0, 1); // Show only first match
  }, [people, searchQuery]);

  // Filter files based on search query and selected person
  const filteredFiles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return files
      .filter((file) => {
        if (file.isTrashed || file.isSpam) return false;
        
        // If person filter is selected, filter by person first
        if (selectedPerson) {
          const matchesPerson =
            file.sharedBy?.toLowerCase() === selectedPerson.toLowerCase() ||
            file.sharedWith?.some(
              (email) => email.toLowerCase() === selectedPerson.toLowerCase()
            );
          if (!matchesPerson) return false;
        }
        
        // Then filter by search query if present
        if (query) {
          const matchesName = file.name.toLowerCase().includes(query);
          const matchesPerson =
            file.sharedBy?.toLowerCase().includes(query) ||
            file.sharedWith?.some((email) =>
              email.toLowerCase().includes(query)
            );
          return matchesName || matchesPerson;
        }
        
        // If only person filter is active, show all files for that person
        return true;
      })
      .slice(0, 4); // Show max 4 results
  }, [files, searchQuery, selectedPerson]);

  if (!searchQuery && !selectedPerson) return null;

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        mt: 0,
        maxWidth: 720,
        maxHeight: 500,
        overflow: "auto",
        boxShadow: "0 2px 10px 2px rgba(60,64,67,.15)",
        borderRadius: "0 0 8px 8px",
        zIndex: 1300,
      }}
    >
      {/* Person Filter Pill */}
      {selectedPerson && (
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f1f3f4",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#34a853",
              fontSize: "14px",
              mr: 1.5,
            }}
          >
            {selectedPerson.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "#202124", flex: 1 }}
          >
            {selectedPerson}
          </Typography>
          <Link
            component="button"
            //@ts-ignore
            onClick={() => onPersonFilter?.(null)}
            sx={{
              color: "#1a73e8",
              fontSize: "14px",
              textDecoration: "none",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Remove
          </Link>
        </Box>
      )}

      {/* People Suggestions */}
      {!selectedPerson && filteredPeople.length > 0 && (
        <Box sx={{ p: 1.5 }}>
          <Box
            onClick={() => onPersonFilter?.(filteredPeople[0])}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: "8px",
              backgroundColor: "#f1f3f4",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#e8eaed",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#34a853",
                fontSize: "14px",
                mr: 1.5,
              }}
            >
              {filteredPeople[0].charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "#202124" }}>
              {filteredPeople[0]}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Search Results */}
      {filteredFiles.length > 0 && (
        <>
          {(!selectedPerson || filteredPeople.length === 0) && <Divider />}
          <List sx={{ py: 0 }}>
            {filteredFiles.map((file) => (
              <ListItem
                key={file.id}
                disablePadding
                onClick={() => onFileClick?.(file)}
              >
                <ListItemButton
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FileIcon file={file} size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#202124" }}
                      >
                        {file.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ color: "#5f6368", display: "block", mt: 0.5 }}
                      >
                        {file.sharedBy || file.sharedWith?.[0] || "Unknown"}
                      </Typography>
                    }
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#5f6368", ml: 2 }}
                  >
                    {formatDate(file.dateShared || file.modified)}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Footer Links */}
      {(filteredFiles.length > 0 || searchQuery) && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
            }}
          >
            <Link
              component="button"
              sx={{
                color: "#1a73e8",
                fontSize: "14px",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Advanced search
            </Link>
            <Link
              component="button"
              sx={{
                color: "#1a73e8",
                fontSize: "14px",
                textDecoration: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <ArrowBack sx={{ fontSize: 16, transform: "rotate(180deg)" }} />
              All results
            </Link>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SearchDropdown;
