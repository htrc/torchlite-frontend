import { useRef, useState } from 'react';

// next
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ButtonBase,
  capitalize,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';
import useUser from 'hooks/useUser';
import CustomButton from 'components/Button';
import LoginModal from 'sections/auth/LoginModal';

// assets
import { LogoutOutlined } from '@ant-design/icons';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const user = useUser();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ redirect: true });

    router.push({
      pathname: APP_DEFAULT_PATH,
      query: {}
    });
  };

  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';

  return (
    <>
      {user && (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
          <ButtonBase
            sx={{
              p: 0.25,
              bgcolor: open ? iconBackColorOpen : 'transparent',
              borderRadius: 1,
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'secondary.light' : 'secondary.lighter' },
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.secondary.dark}`,
                outlineOffset: 2
              }
            }}
            aria-label="open profile"
            ref={anchorRef}
            aria-controls={open ? 'profile-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            {user && (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.25, px: 0.75 }}>
                <Avatar alt={user.name} src={user.avatar} sx={{ width: 30, height: 30 }} />
                <Typography variant="subtitle1"> {capitalize(user.name)}</Typography>
              </Stack>
            )}
          </ButtonBase>
          <Popper
            placement="bottom-end"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 9]
                  }
                }
              ]
            }}
          >
            {({ TransitionProps }) => (
              <Transitions type="fade" in={open} {...TransitionProps}>
                <Paper
                  sx={{
                    boxShadow: theme.customShadows.z1,
                    width: 290,
                    minWidth: 240,
                    maxWidth: 290,
                    [theme.breakpoints.down('md')]: {
                      maxWidth: 250
                    }
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard elevation={0} border={false} content={false}>
                      <CardContent sx={{ px: 2.5, pt: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            {user && (
                              <Stack direction="row" spacing={1.25} alignItems="center">
                                <Avatar alt={user.name} src={user.avatar} />
                                <Stack>
                                  <Typography variant="h6">{user.name}</Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {user.email}
                                  </Typography>
                                </Stack>
                              </Stack>
                            )}
                          </Grid>
                          <Grid item>
                            <Tooltip title="Logout">
                              <IconButton size="large" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                                <LogoutOutlined rev={undefined} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </MainCard>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
            )}
          </Popper>
        </Box>
      )}
      {!user && (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.25, px: 0.75 }}>
          <CustomButton
            variant="contained"
            color="secondary"
            sx={{
              width: '120px',
              height: '36px',
              borderRadius: '4px',
              backgroundColor: /*'#73787A'/*'#1e98d7'*/ theme.palette.primary[700],
              boxSizing: 'border-box',
              color: theme.palette.common.white/*'#ffffff'*/,
              textAlign: 'center',
              lineHeight: 'normal'
            }}
            onClick={openModal}
          >
            Sign in
          </CustomButton>
          <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        </Stack>
      )}
    </>
  );
};

export default Profile;
