import React, { useState, useEffect } from 'react';
import { getIdplist } from 'services';
import { Modal, Box, Typography, Grid, Button, useTheme } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { colourStyles } from 'styles/react-select';
import AnimateButton from 'components/@extended/AnimateButton';
import { signIn } from 'next-auth/react';
import { getCookieValue, setCookieValue } from 'utils/helpers';
import { IdpProvider } from 'types/auth';

const animatedComponents = makeAnimated();

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,

  '@media (max-width: 768px)': {
    width: '90%'
  }
};

function AuthModal({ isOpen, onClose }: any) {
  const idpPrefCookie = getCookieValue('idp_pref');
  const theme = useTheme();
  const [idpList, setIdpList] = useState<any>([]);
  const [selected, setSelected] = useState<any>({});

  // Fetch idpList from /getIdpList API when the modal is opened
  useEffect(() => {
    async function fetchData() {
      try {
        if (isOpen) {
          const data: IdpProvider[] = await getIdplist();
          const modifiedData = data.map((item: any) => ({
            label: item.institutionName,
            value: item.entityId,
            tag: item.tag
          }));
          setIdpList(modifiedData);

          let selected: any = {};
          if (idpPrefCookie) {
            // The cookie exists, now extract 'tag' and 'entityID' values
            const cookieData = JSON.parse(idpPrefCookie);
            if (cookieData.tag && cookieData.entityID) {
              selected = modifiedData.find((item: any) => item.value === cookieData.entityID && item.tag === cookieData.tag);
            }
          }

          setSelected(selected);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [isOpen]);

  const handleSelectChange = (selected: any) => {
    const newCookieData = { tag: selected.tag, entityID: selected.value };
    const newCookieValue = JSON.stringify(newCookieData);
    setCookieValue('idp_pref', newCookieValue, 60 * 60 * 24 * 365);
    setSelected(selected);
  };

  const handleLogin = () => {
    if (selected.tag === 'hathi') {
      signIn('keycloak', {
        redirect: false,
        callbackUrl: '/'
      }).then((res: any) => {
        console.log(res);
      });
    } else if (selected.tag === 'cilogon') {
      signIn(
        'keycloak',
        { callbackUrl: '/' },
        {
          kc_idp_hint: 'cilogon',
          idphint: selected.value
        }
      ).then((res: any) => {
        console.log(res);
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ mb: 2 }}>
          Select Institution
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              onBlur={() => {}}
              onFocus={() => {}}
              components={animatedComponents}
              defaultValue={selected || []}
              onChange={(selected) => handleSelectChange(selected)}
              options={idpList}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selected || []}
              {...(theme.palette.mode === 'dark' ? { styles: colourStyles } : {})}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="modal-modal-description">
              Enabled by HathiTrust and CILogon. By clicking continue you agree to the HathiTrust{' '}
              <a href="https://www.hathitrust.org/acceptable-use" target="_blank" rel="noreferrer">
                Acceptable Use Policy
              </a>{' '}
              and{' '}
              <a href="https://www.hathitrust.org/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              , to the{' '}
              <a href="https://www.cilogon.org/privacy" target="_blank" rel="noreferrer">
                CILogon privacy policy
              </a>
              , and to sharing your institutional username, email address, and affiliation with HTRC, HathiTrust, and CILogon.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <AnimateButton>
              <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary" onClick={handleLogin}>
                Login
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default AuthModal;
