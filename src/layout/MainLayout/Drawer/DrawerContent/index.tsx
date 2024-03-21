import { useSelector } from 'react-redux';

// material-ui
// import { useMediaQuery, useTheme } from '@mui/material';

// project import
import SimpleBar from 'components/third-party/SimpleBar';

// types
import { RootStateProps } from 'types/root';
import SideBar from 'layout/MainLayout/SideBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  // const theme = useTheme();
  // const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;

  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {drawerOpen && <SideBar />}
    </SimpleBar>
  );
};

export default DrawerContent;
