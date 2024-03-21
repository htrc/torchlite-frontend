import React from 'react';
import { Backdrop, CircularProgress, useTheme } from '@mui/material';

interface IBackDrop {
  loading: boolean;
}

const CustomBackdrop = ({ loading }: IBackDrop) => {
  const theme = useTheme();
  return (
    <Backdrop sx={{ color: theme.palette.common.white/*'#fff'*/, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CustomBackdrop;
