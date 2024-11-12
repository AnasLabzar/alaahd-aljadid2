import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface CustomAlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ severity, message, onClose }) => (
  <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert severity={severity} onClose={onClose}>
      {message}
    </Alert>
  </Stack>
);

export default CustomAlert;
