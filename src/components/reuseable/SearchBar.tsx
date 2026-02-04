import { useState, useRef, useEffect, useCallback } from "react";
import { useFileContext } from "../../context/FileContext";
import {
  IconButton,
  InputBase,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { debounce } from "../../utils";
import { useLazyOnSearchFilesQuery } from "../../services/dirManager/dirServices";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, addFile, currentView } = useFileContext();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const [onSearchFiles] = useLazyOnSearchFilesQuery();

  const searchDepsRef = useRef({ onSearchFiles, addFile, currentView });
  searchDepsRef.current = { onSearchFiles, addFile, currentView };

  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);
  if (debouncedSearchRef.current === null) {
    //@ts-ignore
    debouncedSearchRef.current = debounce((query: string) => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) return;
      const { onSearchFiles, addFile, currentView } = searchDepsRef.current;
      if (currentView !== "home") return;
      onSearchFiles({ search: trimmed })
        .unwrap()
        .then((res: any) => {
          const list = Array.isArray(res?.data) ? res.data : [];
          addFile(list);
        })
        .catch(() => {
          addFile([]);
        });
    }, SEARCH_DEBOUNCE_MS);
  }

  useEffect(() => {
    return () => {
      debouncedSearchRef.current?.cancel?.();
    };
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    debouncedSearchRef.current?.(value);
  }, [setSearchQuery]);
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





  return (
    <Box
      ref={searchBarRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "100%", sm: "600px" },
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
          // borderRadius: showDropdown ? "24px 24px 0 0" : "24px",
            borderRadius:"24px",
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
          onChange={(e) => handleSearchChange(e.target.value)}
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
      {/* {showDropdown && (
        <SearchDropdown
          searchQuery={searchQuery}
          files={files}
          selectedPerson={selectedPerson}
          onPersonFilter={handlePersonFilter}
          onFileClick={handleFileClick}
        />
      )} */}
    </Box>
  );
};

export default SearchBar;
