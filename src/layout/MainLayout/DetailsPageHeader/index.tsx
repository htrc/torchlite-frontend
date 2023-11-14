import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Stack, FormControl, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import CustomButton from 'components/Button';
import { APP_DEFAULT_PATH } from 'config';

const DetailsPageHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const widgetList1 = ['Mapping Contrubutor Data', 'Publication Date Timeline', 'Workset Languages'];
  const widgetList2 = [
    'Jupyter Notebooks',
    'Extracted Features API Demo',
    'Customize a Dashboard Widget',
    'Combining Extracted Feature and Outside Data'
  ];
  const [widget1, setWidget1] = useState<string>(widgetList1[0]);
  const [widget2, setWidget2] = useState<string>(widgetList2[0]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'widget_1') setWidget1(value);
    else if (name === 'widget_2') setWidget2(value);
  };

  return (
    <Stack
      sx={{
        padding: theme.spacing(2),
        '& .MuiButton-root::after': { boxShadow: 'none' }
      }}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Box>
        <CustomButton
          variant="outlined"
          color="secondary"
          sx={{
            width: '145px',
            height: '39px',
            padding: '2px',
            borderRadius: '14px',
            // backgroundColor: 'transparent',
            boxSizing: 'border-box',
            // color: '#ffffff',
            textAlign: 'center',
            lineHeight: 'normal',
            marginLeft: '1.3125rem'
          }}
          onClick={() => {
            router.push({
              pathname: APP_DEFAULT_PATH
            });
          }}
        >
          Back to Home
        </CustomButton>
        {!session && (
          <CustomButton
            variant="contained"
            color="secondary"
            sx={{
              width: '145px',
              height: '39px',
              padding: '2px',
              borderRadius: '14px',
              backgroundColor: '#505759'/*'#1e98d7'*/,
              boxSizing: 'border-box',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 'normal',
              marginLeft: '1.3125rem'
            }}
            onClick={() => {
              router.push({
                pathname: '/login',
                query: { from: router.asPath }
              });
            }}
          >
            Sign in
          </CustomButton>
        )}
      </Box>
    </Stack>
  );
};

export default DetailsPageHeader;
