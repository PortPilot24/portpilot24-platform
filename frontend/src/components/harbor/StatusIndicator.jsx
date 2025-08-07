import React from 'react';
import {
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import {
  FiberManualRecord as DotIcon
} from '@mui/icons-material';

const StatusIndicator = ({ healthStatus, connectionStatus }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="서비스 상태">
        <Chip
          icon={<DotIcon sx={{ fontSize: 12 }} />}
          label="실시간 응답"
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.75rem',
            height: 24,
            borderColor: connectionStatus ? '#4caf50' : '#f44336',
            color: connectionStatus ? '#4caf50' : '#f44336',
            '& .MuiChip-icon': {
              color: connectionStatus ? '#4caf50' : '#f44336'
            }
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default StatusIndicator;
