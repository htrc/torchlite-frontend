import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Grid, Button, useTheme } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  
    '@media (max-width: 768px)': {
      width: '90%'
    }
  };

function CustomStopwordsModal ({open, onClose}: { open: boolean, onClose: () => void }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography id="stopwords-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
                    Name your stopwords list
                </Typography>
                <Grid container></Grid>
            </Box>
        </Modal>
      )
}

export default CustomStopwordsModal;