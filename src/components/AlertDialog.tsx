import React, { useState } from 'react';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

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
        {message != '' ?
        <DialogContentText>
          {message}
        </DialogContentText> :
        <Typography>
          Worksets are currently unavailable.
          <br></br>
          Try again in 15 minutes.
          <br></br>
          If the issue persists, email us at <Link href="mailto:htrc-help@hathitrust.org">htrc-help@hathitrust.org</Link>
        </Typography>}
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