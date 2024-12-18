// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// type
import { LAYOUT_CONST } from 'types/config';
import Share from './Share';
import Customization from './Customization';
import GetHelpMenu from './GetHelpMenu';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG && <DrawerHeader open={true} />}
      <Box sx={{ width: '100%', ml: 1 }} />
      <Share />
      <Customization />
      <GetHelpMenu />
      <Profile />
    </>
  );
};

export default HeaderContent;
