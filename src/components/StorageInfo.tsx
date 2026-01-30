import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { formatFileSize } from '../utils';

const StorageInfo: React.FC = () => {
  const { totalSpace, freeSpace } = useSelector(
    (state: any) => state.loadingState
  );
  const theme = useTheme();

  // totalSpace and freeSpace are in bytes (from profile API via Redux)
  const usedBytes = totalSpace > 0 ? totalSpace - freeSpace : 0;
  const usedPercent =
    totalSpace > 0 ? Math.min(100, (usedBytes / totalSpace) * 100) : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        py: 2,
        px: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Storage
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={usedPercent}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor:
                  usedPercent > 80
                    ? theme.palette.error.main
                    : usedPercent > 60
                    ? theme.palette.warning.main
                    : theme.palette.primary.main,
              },
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {usedPercent.toFixed(1)}% used – {formatFileSize(freeSpace)} free
        </Typography>
      </Box>
    </Paper>
  );
};

export default StorageInfo;
