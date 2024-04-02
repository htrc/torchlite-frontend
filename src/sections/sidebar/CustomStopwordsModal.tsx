import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Box, Typography, Grid, Button, useTheme, TextField, Divider } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  
    '@media (max-width: 768px)': {
      width: '90%'
    }
  };

function CustomStopwordsModal ({open, onClose}: { open: boolean, onClose: () => void }) {
    const [stopwordsName, setStopwordsName] = useState("");
    const [filePath, setFilePath] = useState("");
    const [url, setUrl] = useState('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStopwordsName(event.target.value);
      console.log(stopwordsName);
    }

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(event.target.value);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setFilePath(file.name);
        // Do something with the file, like saving it or processing it
      }
    }

    const handleClose = () => {
      setStopwordsName(''); // Reset the text box value when modal is closed
      setFilePath('');
      setUrl('');
      onClose();
  };

    const handleUploadButtonClick = () => {
      if(fileInputRef.current) {
        fileInputRef.current.click();
      }
    }

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="stopwords-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
                    Name your stopwords list
                </Typography>
                <TextField
                  id="stopwords-name"
                  label="Your list name"
                  variant="outlined"
                  value={stopwordsName}
                  onChange={handleNameChange}
                  fullWidth
                  sx={{mb: 2}}
                />
                <Divider sx={{my:2}} />
                <Typography id="upload-options-title" variant="h5" component="h3" sx={{ mb: 2 }}>
                  Choose how you would like to upload your stopword list (.txt files only)
                </Typography>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Button variant="contained" color="primary" sx={{ height: '30px', textTransform: 'none'}} onClick={handleUploadButtonClick}>
                      Upload from your computer
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{display: 'none'}}
                      onChange={handleFileChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ textAlign: 'right' }}>{filePath}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography id="or-text" variant="h5" component="h3" sx={{ mb: 2 }}>
                      OR
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h5">
                      URL pointing to a publicily-available text file that contains the list of stopwords, formatted so that each word
                      is on a separate line
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <TextField 
                      id="url-input"
                      label="Enter URL"
                      variant="outlined"
                      fullWidth
                      sx={{mb: 2}}
                      value={url}
                      onChange={handleUrlChange}
                    />
                  </Grid>
                  <Divider sx={{my:2}} />
                  <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button variant="contained" color="secondary" onClick={handleClose} sx={{ minWidth: '100px', marginRight: '8px'}}>
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" sx={{ minWidth: '100px' }}>
                      Save
                    </Button>
                  </Grid>
                </Grid>
            </Box>
        </Modal>
      )
}

export default CustomStopwordsModal;