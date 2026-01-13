import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
} from '@mui/material';
import {
  CreateNewFolder,
  Upload,
  MoreVert,
  Download,
  Share,
  Delete,
  Folder,
  InsertDriveFile,
  Star,
  StarBorder,
  RestoreFromTrash,
  ViewList,
  ViewModule,
  ArrowDownward,
  PictureAsPdf,
  Description,
  Archive,
  Image,
  VideoFile,
  AudioFile,
  Code,
} from '@mui/icons-material';
import { useFileContext } from '../context/FileContext';
import { FileItem, ViewType } from '../types';

const FileManager: React.FC = () => {
  const {
    files,
    currentView,
    searchQuery,
    addFile,
    addFolder,
    deleteFile,
    shareFile,
    toggleFavourite,
    restoreFile,
  } = useFileContext();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareEmails, setShareEmails] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Listen for events from Sidebar
  React.useEffect(() => {
    const handleCreateFolder = () => {
      setFolderDialogOpen(true);
    };

    const handleFileUpload = (event: CustomEvent) => {
      const files = event.detail as FileList;
      if (files) {
        handleFileUploadChange(files);
      }
    };

    const handleFolderUpload = (event: CustomEvent) => {
      const files = event.detail as FileList;
      if (files) {
        handleFolderUploadChange(files);
      }
    };

    window.addEventListener('createFolder' as any, handleCreateFolder);
    window.addEventListener('fileUpload' as any, handleFileUpload);
    window.addEventListener('folderUpload' as any, handleFolderUpload);

    return () => {
      window.removeEventListener('createFolder' as any, handleCreateFolder);
      window.removeEventListener('fileUpload' as any, handleFileUpload);
      window.removeEventListener('folderUpload' as any, handleFolderUpload);
    };
  }, []);

  const handleFileUploadChange = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'file',
        size: file.size,
        modified: new Date(),
        sharedWith: [],
        isFavourite: false,
        isTrashed: false,
        isSpam: false,
        ownerId: 'current-user',
        fileType: file.name.split('.').pop()?.toLowerCase(),
      };
      addFile(fileItem);
    });
  };

  const handleFolderUploadChange = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'file',
        size: file.size,
        modified: new Date(),
        sharedWith: [],
        isFavourite: false,
        isTrashed: false,
        isSpam: false,
        ownerId: 'current-user',
        fileType: file.name.split('.').pop()?.toLowerCase(),
      };
      addFile(fileItem);
    });
  };

  const filteredFiles = files.filter((file) => {
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!file.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Apply view filter
    switch (currentView) {
      case 'home':
        return !file.isTrashed && !file.isSpam;
      case 'myDrive':
        return !file.isTrashed && !file.isSpam && file.ownerId === 'current-user';
      case 'sharedDrives':
        return !file.isTrashed && file.sharedWith && file.sharedWith.length > 0;
      case 'sharedWithMe':
        return !file.isTrashed && file.ownerId && file.ownerId !== 'current-user';
      case 'starred':
        return file.isFavourite && !file.isTrashed && !file.isSpam;
      case 'spam':
        return file.isSpam;
      case 'trash':
        return file.isTrashed;
      default:
        return !file.isTrashed;
    }
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setFolderDialogOpen(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      handleFileUploadChange(uploadedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (file: FileItem) => {
    const blob = new Blob(['File content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setShareEmails(file.sharedWith?.join(', ') || '');
    setShareDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleShareSubmit = () => {
    if (selectedFile) {
      const emails = shareEmails
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email);
      shareFile(selectedFile.id, emails);
      setShareDialogOpen(false);
      setShareEmails('');
      setSelectedFile(null);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    file: FileItem
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedFile(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return 'Last month';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder sx={{ fontSize: 24, color: '#ffa726' }} />;
    }

    const fileType = file.fileType || file.name.split('.').pop()?.toLowerCase();
    
    switch (fileType) {
      case 'pdf':
        return <PictureAsPdf sx={{ fontSize: 24, color: '#d32f2f' }} />;
      case 'xlsx':
      case 'xls':
        return <Description sx={{ fontSize: 24, color: '#2e7d32' }} />;
      case 'zip':
      case 'rar':
        return <Archive sx={{ fontSize: 24, color: '#616161' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image sx={{ fontSize: 24, color: '#1976d2' }} />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoFile sx={{ fontSize: 24, color: '#7b1fa2' }} />;
      case 'mp3':
      case 'wav':
        return <AudioFile sx={{ fontSize: 24, color: '#f57c00' }} />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
        return <Code sx={{ fontSize: 24, color: '#0288d1' }} />;
      default:
        return <InsertDriveFile sx={{ fontSize: 24, color: '#42a5f5' }} />;
    }
  };

  const groupFilesByDate = (files: FileItem[]) => {
    const groups: { [key: string]: FileItem[] } = {
      'Yesterday': [],
      'Last month': [],
      'Older': [],
    };

    files.forEach((file) => {
      const date = file.dateShared || file.modified;
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        groups['Yesterday'].push(file);
      } else if (diffDays <= 30) {
        groups['Last month'].push(file);
      } else {
        groups['Older'].push(file);
      }
    });

    return groups;
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'home':
        return 'Home';
      case 'myDrive':
        return 'My Drive';
      case 'sharedDrives':
        return 'Shared Drives';
      case 'sharedWithMe':
        return 'Shared with me';
      case 'starred':
        return 'Starred';
      case 'spam':
        return 'Spam';
      case 'trash':
        return 'Trash';
      default:
        return 'Files';
    }
  };

  const renderListView = () => {
    if (currentView === 'sharedWithMe') {
      const groupedFiles = groupFilesByDate(filteredFiles);
      const sections = [
        { label: 'Yesterday', files: groupedFiles['Yesterday'] },
        { label: 'Last month', files: groupedFiles['Last month'] },
        { label: 'Older', files: groupedFiles['Older'] },
      ];

      return (
        <Box>
          {sections.map((section) =>
            section.files.length > 0 ? (
              <Box key={section.label} sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: '#5f6368', fontWeight: 500, px: 2 }}
                >
                  {section.label}
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>
                          Shared by
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>
                          Date shared
                          <ArrowDownward sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle' }} />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.files.map((file) => (
                        <TableRow
                          key={file.id}
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              {getFileIcon(file)}
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                  {file.name}
                                </Typography>
                                {file.sharedWith && file.sharedWith.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                    {[...Array(Math.min(file.sharedWith.length, 2))].map((_, i) => (
                                      <Avatar
                                        key={i}
                                        sx={{ width: 16, height: 16, fontSize: '8px' }}
                                      >
                                        {file.sharedWith![i].charAt(0).toUpperCase()}
                                      </Avatar>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#5f6368' }}>
                              {file.sharedBy || 'Unknown'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#5f6368' }}>
                              {formatDate(file.dateShared || file.modified)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e, file);
                              }}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : null
          )}
        </Box>
      );
    }

    // Default list view for other pages
    return (
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>Modified</TableCell>
              <TableCell sx={{ fontWeight: 500, color: '#5f6368' }}>Size</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFiles.map((file) => (
              <TableRow
                key={file.id}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                  cursor: 'pointer',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {getFileIcon(file)}
                    <Typography variant="body2">{file.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    {formatDate(file.modified)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    {file.type === 'file' ? formatFileSize(file.size) : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, file);
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderGridView = () => {
    return (
      <Grid container spacing={2}>
        {filteredFiles.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    pb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFileIcon(file)}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, file);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                <CardContent sx={{ flex: 1, pt: 1 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.type === 'file'
                      ? formatFileSize(file.size)
                      : 'Folder'}
                  </Typography>
                  {file.sharedWith && file.sharedWith.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`Shared with ${file.sharedWith.length}`}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#fff' }}>
      {/* Header Section */}
      <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 400, color: '#202124' }}>
            {getViewTitle()}
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
            <ToggleButton value="grid">
              <ViewModule />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filter Bar - Only show for Shared with me */}
        {currentView === 'sharedWithMe' && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" displayEmpty>
                <MenuItem value="all">Type</MenuItem>
                <MenuItem value="folder">Folders</MenuItem>
                <MenuItem value="file">Files</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" displayEmpty>
                <MenuItem value="all">People</MenuItem>
                <MenuItem value="me">Shared with me</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" displayEmpty>
                <MenuItem value="all">Modified</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This week</MenuItem>
                <MenuItem value="month">This month</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value="all" displayEmpty>
                <MenuItem value="all">Source</MenuItem>
                <MenuItem value="drive">My Drive</MenuItem>
                <MenuItem value="shared">Shared with me</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        {filteredFiles.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No files or folders
            </Typography>
            <Typography variant="body2">
              {currentView === 'sharedWithMe'
                ? 'Files shared with you will appear here'
                : 'Upload files or create folders to get started'}
            </Typography>
          </Box>
        ) : viewMode === 'list' ? (
          renderListView()
        ) : (
          renderGridView()
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedFile && selectedFile.type === 'file' && (
          <MenuItem onClick={() => selectedFile && handleDownload(selectedFile)}>
            <Download sx={{ mr: 1 }} fontSize="small" />
            Download
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedFile && handleShare(selectedFile)}>
          <Share sx={{ mr: 1 }} fontSize="small" />
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFile) {
              toggleFavourite(selectedFile.id);
            }
            handleMenuClose();
          }}
        >
          {selectedFile?.isFavourite ? (
            <>
              <Star sx={{ mr: 1 }} fontSize="small" />
              Remove from Favourites
            </>
          ) : (
            <>
              <StarBorder sx={{ mr: 1 }} fontSize="small" />
              Add to Favourites
            </>
          )}
        </MenuItem>
        {currentView === 'trash' ? (
          <MenuItem
            onClick={() => {
              if (selectedFile) {
                restoreFile(selectedFile.id);
              }
              handleMenuClose();
            }}
          >
            <RestoreFromTrash sx={{ mr: 1 }} fontSize="small" />
            Restore
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              if (selectedFile) {
                deleteFile(selectedFile.id);
              }
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        )}
      </Menu>

      {/* Dialogs */}
      <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share "{selectedFile?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email addresses (comma separated)"
            fullWidth
            variant="outlined"
            value={shareEmails}
            onChange={(e) => setShareEmails(e.target.value)}
            placeholder="user1@example.com, user2@example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShareSubmit} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileManager;
