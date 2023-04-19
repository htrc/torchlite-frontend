import { useState } from 'react';
import { Box, Stack, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import CustomButton from 'components/Button';

const DashboardHeader = () => {
  const widgetList = ['Mapping Contrubutor Data', 'Publication Date Timeline', 'Workset Languages'];
  const list = [
    'Jupyter Notebooks',
    'Extracted Features API Demo',
    'Customize a Dashboard Widget',
    'Combining Extracted Feature and Outside Data'
  ];
  const [widget1, setWidget1] = useState<string>('Add Widget');
  const [widget2, setWidget2] = useState<string>(list[0]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'widget_1') setWidget1(value);
    else if (name === 'widget_2') setWidget2(value);
  };

  return (
    <Stack
      sx={{ '& .css-nt2730-MuiButtonBase-root-MuiButton-root::after': { boxShadow: 'none' } }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <CustomButton
        variant="outlined"
        sx={{
          width: '120px',
          height: '32px',
          color: '#333',
          padding: '2px',
          borderRadius: '15px',
          border: '1px solid #797979',
          boxSizing: 'border-box',
          fontSize: '13px',
          fontFamily: "'ArialMT', 'Arial', sans-serif",
          textAlign: 'center',
          lineHeight: 'normal'
        }}
      >
        Download Data
      </CustomButton>
      <Box>
        <FormControl sx={{ m: 1, mr: '25px' }}>
          <Select
            value={widget1}
            name={'widget_1'}
            sx={{
              width: '191px',
              height: '25px',
              padding: '2px 2px 2px 2px',
              borderRadius: '13px',
              border: '1px solid #797979',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              fontSize: '13px',
              fontFamily: "'ArialMT', 'Arial', sans-serif",
              color: '#000000'
            }}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Add Widgets</em>
            </MenuItem>
            {widgetList.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, mr: '21px' }}>
          <Select
            value={widget2}
            name={'widget_2'}
            sx={{
              width: '300px',
              height: '25px',
              padding: '2px 2px 2px 2px',
              borderRadius: '13px',
              border: '1px solid #797979',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              fontSize: '13px',
              fontFamily: "'ArialMT', 'Arial', sans-serif",
              color: '#000000'
            }}
            onChange={handleChange}
          >
            {list.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CustomButton
          variant="contained"
          sx={{
            width: '145px',
            height: '39px',
            padding: '2px',
            borderRadius: '14px',
            backgroundColor: '#1e98d7',
            boxSizing: 'border-box',
            fontFamily: "'ArialMT', 'Aria', sans-serif",
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 'normal'
          }}
        >
          Sign in
        </CustomButton>
      </Box>
    </Stack>
  );
};

export default DashboardHeader;
