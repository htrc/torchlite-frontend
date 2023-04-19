import { useState } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import CustomButton from 'components/Button';
interface IMockState {
  label: string;
  checked: boolean;
  value: string;
}

const FilterKeys = [
  { label: 'Genre', checked: false, value: '' },
  { label: 'Resource type', checked: false, value: '' },
  { label: 'Category', checked: false, value: '' },
  { label: 'Availability', checked: false, value: '' },
  { label: 'Contributor', checked: false, value: '' },
  { label: 'Publisher', checked: false, value: '' },
  { label: 'Place of publication', checked: false, value: '' },
  { label: 'Publication title', checked: false, value: '' }
];

const DataFilter = () => {
  const [filterKeys, setFilterKeys] = useState<IMockState[]>(FilterKeys);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFilterKeys((prev) => prev.map((type) => (type.label === event.target.value ? { ...type, checked } : type)));
  };
  const handleKeyChange = (event: SelectChangeEvent<string>) => {
    setFilterKeys((prev) => prev.map((type) => (type.label === event.target.name ? { ...type, value: event.target.value } : type)));
  };

  return (
    <Stack direction="column" sx={{ minHeight: '500px', padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {filterKeys.map((item: IMockState) => (
            <Box key={item.label}>
              <FormControlLabel
                value={item.label}
                control={<Checkbox checked={item.checked} onChange={handleChange} />}
                label={item.label}
                labelPlacement="end"
                sx={{ mr: 1 }}
              />
              {item.checked && (
                <Stack spacing={1}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                    <Select value={item.value} name={item.label} onChange={handleKeyChange}>
                      <MenuItem value="">
                        <em>Select {item.label}</em>
                      </MenuItem>
                      <MenuItem value={'Ten'}>Ten</MenuItem>
                      <MenuItem value={'Twenty'}>Twenty</MenuItem>
                      <MenuItem value={'Thirty'}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              )}
            </Box>
          ))}
        </FormGroup>
      </FormControl>
      <Box mb={4}>
        <CustomButton
          variant="contained"
          sx={{
            width: '140px',
            height: '40px',
            padding: '2px 2px 2px 2px',
            borderRadius: '15px',
            backgroundColor: '#1e98d7',
            boxSizing: 'border-box',
            fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
            fontSize: '13px',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 'normal'
          }}
        >
          {'Confirm my selections'}
        </CustomButton>
      </Box>
    </Stack>
  );
};

export default DataFilter;
