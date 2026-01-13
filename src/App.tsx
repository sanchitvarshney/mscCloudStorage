import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Paper,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Tune,
  HelpOutline,
  Settings,
  Apps,
  Cloud,
} from '@mui/icons-material';
import { FileProvider, useFileContext } from './context/FileContext';
import Sidebar from './components/Sidebar';
import FileManager from './components/FileManager';

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
        p: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 720,
        backgroundColor: '#f1f3f4',
        boxShadow: 'none',
        border: 'none',
        borderRadius: '24px',
      }}
    >
      <Search sx={{ color: '#5f6368', fontSize: 20, mr: 1 }} />
      <InputBase
        sx={{
          flex: 1,
          color: '#202124',
          fontSize: '14px',
          '& input::placeholder': {
            color: '#5f6368',
            opacity: 1,
          },
        }}
        placeholder="Search in Drive"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        inputProps={{ 'aria-label': 'search in drive' }}
      />
      <IconButton
        size="small"
        onClick={handleFilterClick}
        sx={{
          color: '#5f6368',
          width: 32,
          height: 32,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleFilterClose}>File type</MenuItem>
        <MenuItem onClick={handleFilterClose}>Date modified</MenuItem>
        <MenuItem onClick={handleFilterClose}>Owner</MenuItem>
      </Menu>
    </Paper>
  );
};

const AppContent: React.FC = () => {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            <Cloud sx={{ color: '#1976d2', fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: '#5f6368', fontWeight: 400 }}>
              Drive
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchBar />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <HelpOutline />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Settings />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Apps />
            </IconButton>
            <Box
              onClick={handleProfileClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                ml: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: '24px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#4285f4',
                  fontSize: '14px',
                }}
              >
                U
              </Avatar>
            </Box>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileClose}>Sign out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
          }}
        >
          <FileManager />
        </Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <FileProvider>
      <AppContent />
    </FileProvider>
  );
};

export default App;
