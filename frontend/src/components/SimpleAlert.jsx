import React from 'react';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Displays a success alert with a custom message.
 *
 * @param {string} message - The message to show inside the alert.
 */
const SimpleAlert = ({ message }) => {
  return (
    <Alert
      icon={<CheckCircleIcon fontSize="small" />}
      severity="success"
      variant="filled"
      className="alert"
    >
      {message}
    </Alert>
  );
};

export default SimpleAlert;
