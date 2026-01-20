import { useState } from "react";
import { useFileContext } from "../../context/FileContext";
import { IconButton, InputBase, Menu, MenuItem, Paper } from "@mui/material";
import { Search, Tune } from "@mui/icons-material";

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFileContext();
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 8px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 720,
        backgroundColor: "#f1f3f4",
        boxShadow: "none",
        border: "none",
        borderRadius: "24px",
      }}
    >
      <Search sx={{ color: "#5f6368", fontSize: 20, mr: 1 }} />
      <InputBase
        sx={{
          flex: 1,
          color: "#202124",
          fontSize: "14px",
          "& input::placeholder": {
            color: "#5f6368",
            opacity: 1,
          },
        }}
        placeholder="Search in Drive"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        inputProps={{ "aria-label": "search in drive" }}
      />
      <IconButton
        size="small"
        onClick={handleFilterClick}
        sx={{
          color: "#5f6368",
          width: 32,
          height: 32,
          border: "1px solid rgba(0, 0, 0, 0.12)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Tune sx={{ fontSize: 18 }} />
      </IconButton>
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {["File type", "Date modified", "Owner"].map((option) => (
          <MenuItem key={option} onClick={handleFilterClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default SearchBar;
