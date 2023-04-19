import { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import { openDrawer } from 'store/reducers/menu';

// types
import { RootStateProps } from 'types/root';
import { LAYOUT_CONST } from 'types/config';

// ==============================|| MAIN LAYOUT ||============================== //

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();
  const dispatch = useDispatch();

  const isHorizontal = menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;

  // drawer toggler
  const [open, setOpen] = useState(!miniDrawer || drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {!isHorizontal ? <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> : <HorizontalBar />}
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 0, sm: 2 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
          {children}
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
