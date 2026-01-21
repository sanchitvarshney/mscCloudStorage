import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  useTheme,
} from '@mui/material';
import { useFileContext } from '../context/FileContext';

const StorageInfo: React.FC = () => {
  const { storageInfo } = useFileContext();
  const theme = useTheme();
  const percentage = (storageInfo.total > 0)
    ? Math.round((storageInfo.used / storageInfo.total) * 100)
    : 0;
  const freeGB = (storageInfo.total - storageInfo.used).toFixed(2);

  return (
    <Paper
      elevation={0}
      sx={{
        py: 2,
        px:4,

        // m: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
   
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {storageInfo.users} / {storageInfo.users} Users
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor:
                  percentage > 80
                    ? theme.palette.error.main
                    : percentage > 60
                    ? theme.palette.warning.main
                    : theme.palette.primary.main,
              },
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {percentage}% full - {freeGB} GB Free
        </Typography>
      </Box>
    </Paper>
  );
};

export default StorageInfo;
