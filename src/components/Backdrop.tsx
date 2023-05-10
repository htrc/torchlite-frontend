import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface IBackDrop {
  loading: boolean;
}

const CustomBackdrop = ({ loading }: IBackDrop) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CustomBackdrop;
