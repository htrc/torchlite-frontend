import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// third-party

// project import
import NavItem from './NavItem';

import useConfig from 'hooks/useConfig';

// types
import { NavItemType } from 'types/menu';
import { RootStateProps } from 'types/root';
import { LAYOUT_CONST } from 'types/config';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface Props {
  item: NavItemType;
}

const NavGroup = ({ item }: Props) => {
  const theme = useTheme();
  // const router = useRouter();
  // const { asPath } = router;

  const { menuOrientation } = useConfig();
  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const navItem = item ? (
    <NavItem item={item} level={1} />
  ) : (
    <Typography variant="h6" color="error" align="center">
      Fix - Group Collapse or Items
    </Typography>
  );

  const Icon = item.icon!;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
  const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
  return (
    <>
      {menuOrientation === LAYOUT_CONST.VERTICAL_LAYOUT || downLG ? (
        <List>{navItem}</List>
      ) : (
        <List>
          <ListItemButton
            sx={{
              p: 1,
              my: 0.5,
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'inherit',
              '&.Mui-selected': {
                bgcolor: 'transparent'
              }
            }}
          >
            {itemIcon && (
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  color: textColor,
                  ...(!drawerOpen && {
                    borderRadius: 1.5,
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'secondary.light' : 'secondary.lighter'
                    }
                  })
                }}
              >
                {itemIcon}
              </ListItemIcon>
            )}
            <ListItemText
              sx={{ mr: 1 }}
              primary={
                <Typography variant="body1" color={theme.palette.secondary.dark}>
                  {item.title}
                </Typography>
              }
            />
          </ListItemButton>
        </List>
      )}
    </>
  );
};

export default NavGroup;
