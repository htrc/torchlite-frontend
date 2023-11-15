import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Stack, RadioGroup, Radio, useTheme, Typography } from '@mui/material';
import CustomButton from 'components/Button';
import { useSelector } from 'store';
import { saveAs } from 'file-saver';

const CleanDataWidget = () => {
  const theme = useTheme();
  const { worksetMetadata, filteredWorksetMetadata } = useSelector((state) => state.dashboard);
  const [selectedValue, setSelectedValue] = useState('full');

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const onClickDownload = () => {
    if (selectedValue === 'full') {
      const blob = new Blob([JSON.stringify(worksetMetadata, null, 2)], { type: 'application/json' });
      saveAs(blob, 'full-EF.json');
    } else if (selectedValue === 'filtered') {
      const blob = new Blob([JSON.stringify(filteredWorksetMetadata, null, 2)], { type: 'application/json' });
      saveAs(blob, 'filtered-EF.json');
    }
  };

  return (
    <Stack direction="column" sx={{ padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <RadioGroup aria-label="size" name="radio-buttons-group" defaultValue="full">
          <Typography variant="subtitle1">Extracted Features Dataset (JSON):</Typography>
          <Stack sx={{ ml: 3 }}>
            <FormControlLabel value="full" control={<Radio color="secondary" onChange={handleChange} />} label="Full" />
            <FormControlLabel value="filtered" control={<Radio color="secondary" onChange={handleChange} />} label="Filtered" />
          </Stack>
          <Typography variant="subtitle1">Metadata only:</Typography>
          <Stack sx={{ ml: 3, mt: 1 }}>
            <Typography>JSON</Typography>
            <Stack sx={{ ml: 2 }}>
              <FormControlLabel value="full-meta" control={<Radio color="secondary" onChange={handleChange} />} label="Full" />
              <FormControlLabel value="filtered-meta" control={<Radio color="secondary" onChange={handleChange} />} label="Filtered" />
            </Stack>
          </Stack>
          <Stack sx={{ ml: 3 }}>
            <Typography>CSV</Typography>
            <Stack sx={{ ml: 2 }}>
              <FormControlLabel value="full-meta-csv" control={<Radio color="secondary" onChange={handleChange} />} label="Full" />
              <FormControlLabel value="filtered-meta-csv" control={<Radio color="secondary" onChange={handleChange} />} label="Filtered" />
            </Stack>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <CustomButton
            variant="contained"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              backgroundColor: '#505759'/*'#1e98d7'*/,
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              color: theme.palette.common.white,
              textAlign: 'center',
              textTransform: 'none'
            }}
            onClick={onClickDownload}
          >
            Download
          </CustomButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default CleanDataWidget;
