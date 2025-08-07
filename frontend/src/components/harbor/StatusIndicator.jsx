import React from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Typography
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const StatusIndicator = ({ healthStatus, connectionStatus }) => {
  const getHealthChip = () => {
    if (!healthStatus) {
      return (
        <Chip
          icon={<ErrorIcon />}
          label="서비스 오프라인"
          color="error"
          size="small"
        />
      );
    }

    const isHealthy = healthStatus.status === 'ok' && healthStatus.agentStatus === 'ready';
    
    return (
      <Tooltip title={`API Version: ${healthStatus.apiVersion || 'Unknown'}`}>
        <Chip
          icon={isHealthy ? <CheckIcon /> : <WarningIcon />}
          label={isHealthy ? '서비스 정상' : '서비스 점검 중'}
          color={isHealthy ? 'success' : 'warning'}
          size="small"
        />
      </Tooltip>
    );
  };

  const getConnectionChip = () => {
    return (
      <Chip
        icon={connectionStatus ? <CheckIcon /> : <ErrorIcon />}
        label={connectionStatus ? '연결됨' : '연결 끊김'}
        color={connectionStatus ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {getHealthChip()}
      {getConnectionChip()}
    </Box>
  );
};

export default StatusIndicator;
