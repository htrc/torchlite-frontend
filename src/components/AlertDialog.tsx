import React, { useState } from 'react';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText } from '@mui/material';

interface CustomAlert {
  message: string;
}

const AlertDialog = ({message}: CustomAlert) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
    >
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog;