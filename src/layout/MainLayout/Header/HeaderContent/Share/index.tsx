'use client'
import * as React from 'react';
//import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Popover, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from 'components/@extended/IconButton';
import { LinkOutlined } from '@ant-design/icons';

const Share = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0, mr: 2 }}>
      <IconButton
        id="share-link-button"
        aria-controls={open ? 'share-link-popover' : undefined}
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100' }}
        onClick={handleClick}
        aria-label="Link to share dashboard"
      >
        <LinkOutlined />
      </IconButton>
      <Popover
        id="share-link-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          borderRadius: 6,
          marginTop: theme.spacing(1),
          minWidth: 150
        }}>
          <Typography sx={{ p: 2 }}>Copy link to share your dashboard:</Typography>
          <TextField
            sx={{ px: 2, paddingBottom: 2 }}
            fullWidth
            id="share-link-read-only-input"
            value={window.location}
            inputProps={{readOnly: true}}
          />
      </Popover>
    </Box>
  );
};

export default Share;