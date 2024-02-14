//import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Accordion, AccordionDetails, AccordionSummary, Box, Drawer, Stack, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

// project import
//import ThemeMode from './ThemeMode';
//import MainCard from 'components/MainCard';
//import SimpleBar from 'components/third-party/SimpleBar';
import IconButton from 'components/@extended/IconButton';
import useConfig from 'hooks/useConfig';

// assets
//import { HighlightOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Customization = () => {
  const theme = useTheme();
  const { mode, onChangeMode } = useConfig();

  const handleToggleMode = () => {
    onChangeMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2, mr: 2 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100' }}
        onClick={handleToggleMode}
        aria-label="Toggle light/dark mode"
      >
        {mode === 'dark' ? <WbSunnyIcon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default Customization;


/*This is the old way that the light/dark mode was toggled. Preserving for now in case we want another Drawer right-side menu in the future. The below configuation is related to ThemeMode.tsx
// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  // const { mode, menuOrientation } = useConfig();
  const { mode } = useConfig();

  // eslint-disable-next-line
  const themeMode = useMemo(() => <ThemeMode />, [mode]);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
          onClick={handleToggle}
          aria-label="settings toggler"
        >
          {theme.palette.mode === 'dark' ? <WbSunnyIcon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Drawer
        sx={{
          zIndex: 2001
        }}
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340
          }
        }}
      >
        {open && (
          <MainCard
            title="Theme Customization"
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': { color: 'background.paper', bgcolor: 'primary.main', '& .MuiTypography-root': { fontSize: '1rem' } }
            }}
            content={false}
            secondary={
              <IconButton shape="rounded" size="small" onClick={handleToggle} sx={{ color: 'background.paper' }}>
                <CloseCircleOutlined style={{ fontSize: '1.15rem' }} />
              </IconButton>
            }
          >
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <Box
                sx={{
                  height: 'calc(100vh - 64px)',
                  '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'transparent',
                      flexDirection: 'row',
                      pl: 1
                    },
                    '& .MuiAccordionDetails-root': {
                      border: 'none'
                    },
                    '& .Mui-expanded': {
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <HighlightOutlined />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Theme Mode
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose light or dark mode
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMode}</AccordionDetails>
                </Accordion>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;*/
