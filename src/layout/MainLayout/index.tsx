import { useRouter } from 'next/router';
import { useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CustomBackdrop from 'components/Backdrop';

import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import { openDrawer } from 'store/reducers/menu';

// types
import { RootStateProps } from 'types/root';
import { LAYOUT_CONST } from 'types/config';
import { DRAWER_WIDTH } from 'config';
import { getWorksets } from 'services';
import { setSelectedWorksetId, setWorksets, setAppliedFilters } from 'store/reducers/dashboard';
import { useDispatch } from 'store';
import { getFeaturedState } from 'services';

// ==============================|| MAIN LAYOUT ||============================== //

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    // Parse URL params
    const init = async () => {
      try {
        const { worksetId } = router.query;
        const filters = qs.parse(router.query.filters as string, { comma: true });

        let selectedWorksetId, appliedFilters;
        if (worksetId) {
          selectedWorksetId = worksetId;
          appliedFilters = filters;
        } else {
          const res = await getFeaturedState();
          const apiRes = res.data;

          if (apiRes.status === 'success' && apiRes.row?.data) {
            const featuredState = JSON.parse(apiRes.row?.data ?? '{}') ?? {};
            selectedWorksetId = featuredState.worksetId;
            appliedFilters = featuredState.filters;
            localStorage.setItem('featured_state', apiRes.row?.data);
          }
        }

        const response = await getWorksets();
        const worksets: any[] = response.data;

        dispatch(setWorksets(worksets));
        await dispatch(setSelectedWorksetId(selectedWorksetId || worksets[0].id));
        await dispatch(setAppliedFilters(appliedFilters || {}));

        if (!worksetId) {
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              worksetId: selectedWorksetId || worksets[0].id,
              filters: qs.stringify(appliedFilters, { arrayFormat: 'comma', encode: false })
            }
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const { worksetId } = router.query;
      if (!worksetId) {
        console.log('url changing!');
        const featuredState = JSON.parse(localStorage.getItem('featured_state') ?? '{}') ?? {};
        const selectedWorksetId = featuredState.worksetId;
        const appliedFilters = featuredState.filters;
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            worksetId: selectedWorksetId,
            filters: qs.stringify(appliedFilters, { arrayFormat: 'comma', encode: false })
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, isLoading]);

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  if (isLoading) {
    return <CustomBackdrop loading={isLoading} />;
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {!isHorizontal ? <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> : <HorizontalBar />}
      <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: { xs: 2, sm: 3 } }}>
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
