import { useState, useRef, useEffect } from "react";
import { useFileContext } from "../../context/FileContext";
import {
  IconButton,
  InputBase,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import SearchDropdown from "./SearchDropdown";

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, files } = useFileContext();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    setShowDropdown(isFocused && (searchQuery.length > 0 || selectedPerson !== null));
  }, [isFocused, searchQuery, selectedPerson]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const handlePersonFilter = (person: string | null) => {
    setSelectedPerson(person);
    if (person) {
      setShowDropdown(true);
    } else {
      setSearchQuery("");
    }
  };

  const handleFileClick = () => {
    // Optionally close dropdown or navigate to file
    // setIsFocused(false);
  };

  return (
    <Box
      ref={searchBarRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
      }}
    >
      <Paper
        component="form"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
         
          if (!searchBarRef.current?.contains(e.relatedTarget as Node)) {
            setTimeout(() => setIsFocused(false), 200);
          }
        }}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          backgroundColor: isFocused ? "#fff" : "#f1f3f4",
          boxShadow: isFocused
            ? "0 2px 5px 1px rgba(64,60,67,.16)"
            : "none",
          border: isFocused ? "1px solid transparent" : "1px solid transparent",
          borderRadius: showDropdown ? "24px 24px 0 0" : "24px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: isFocused ? "#fff" : "#e8eaed",
            boxShadow: isFocused
              ? "0 2px 5px 1px rgba(64,60,67,.16)"
              : "0 1px 3px 0 rgba(60,64,67,.3)",
          },
        }}
      >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          ml: 0.5,
        }}
      >
        <Search
          sx={{
            color: "#5f6368",
            fontSize: 20,
          }}
        />
      </Box>
        <InputBase
          sx={{
            flex: 1,
            color: "#202124",
            fontSize: "14px",
            fontWeight: 400,
            "& input": {
              "&::placeholder": {
                color: "#5f6368",
                opacity: 1,
              },
            },
          }}
          placeholder="Search in Drive"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ "aria-label": "search in drive" }}
        />
        {selectedPerson && (
          <Chip
            label={selectedPerson}
            size="small"
            onDelete={() => {
              setSelectedPerson(null);
              setSearchQuery("");
            }}
            sx={{
              height: 24,
              mr: 0.5,
              backgroundColor: "#e8eaed",
              "& .MuiChip-deleteIcon": {
                fontSize: 16,
              },
            }}
          />
        )}
        {searchQuery && !selectedPerson && (
          <IconButton
            size="small"
            onClick={() => {
              setSearchQuery("");
              setSelectedPerson(null);
            }}
            sx={{
              color: "#5f6368",
              width: 36,
              height: 36,
              mr: 0.5,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      
      </Paper>
      {showDropdown && (
        <SearchDropdown
          searchQuery={searchQuery}
          files={files}
          selectedPerson={selectedPerson}
          onPersonFilter={handlePersonFilter}
          onFileClick={handleFileClick}
        />
      )}
    </Box>
  );
};

export default SearchBar;
