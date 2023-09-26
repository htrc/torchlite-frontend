import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Stack, FormControl, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import CustomButton from 'components/Button';

const DashboardHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const widgetList1 = ['Mapping Contributor Data', 'Publication Date Timeline', 'Workset Languages'];
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
        <FormControl sx={{ m: 1, mr: '25px' }}>
          <Select
            value={widget1}
            name={'widget_1'}
            sx={{
              width: '11.875rem',
              height: '1.5625rem',
              padding: theme.spacing(0.25),
              borderRadius: '0.815rem',
              boxSizing: 'border-box',
              fontSize: '0.8125rem'
            }}
            color="secondary"
            onChange={handleChange}
          >
            <MenuItem value="Add Widgets">Add Widgets</MenuItem>
            {widgetList1.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1 }}>
          <Select
            value={widget2}
            name={'widget_2'}
            sx={{
              width: '18.75rem',
              height: '25px',
              padding: '2px 2px 2px 2px',
              borderRadius: '13px',
              boxSizing: 'border-box',
              fontSize: '13px'
            }}
            color="secondary"
            onChange={handleChange}
          >
            {widgetList2.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!session && (
          <CustomButton
            variant="contained"
            color="secondary"
            sx={{
              width: '145px',
              height: '39px',
              padding: '2px',
              borderRadius: '14px',
              backgroundColor: '#1e98d7',
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

export default DashboardHeader;
