import { useState, useCallback } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  useTheme
} from '@mui/material';
import CustomButton from 'components/Button';
interface IMockState {
  label: string;
  checked: boolean;
  value: any;
}

const dataTypes = [
  { label: 'Apply Stopword', checked: false, value: null },
  { label: 'Make Lowercase', checked: false, value: null },
  { label: 'Lemmatize', checked: false, value: '' },
  { label: 'Stem', checked: false, value: '' },
  { label: 'Search and Replace', checked: false, value: '' },
  {
    label: 'Page Features',
    checked: false,
    value: [
      { subLabel: 'Remove headers', checked: false },
      { subLabel: 'Remove footers', checked: false },
      { subLabel: 'Remove body', checked: false }
    ]
  },
  { label: 'POS Tags', checked: false, value: '' },
  { label: 'Token Count Limits', checked: false, value: [0, 10] }
];

const CleanDataWidget = () => {
  const theme = useTheme();
  const [typeGroup, setTypeGroup] = useState<IMockState[]>(dataTypes);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTypeGroup((prev) => prev.map((type) => (type.label === event.target.value ? { ...type, checked } : type)));
  };

  const childItem = useCallback((type: any) => {
    switch (type.label) {
      case 'Apply Stopword':
        return (
          <RadioGroup aria-label="size" defaultValue="success" name="radio-buttons-group" sx={{ ml: 3 }}>
            <Stack direction="row" alignItems="center">
              <FormControlLabel value="default" control={<Radio color="secondary" />} label="Default" />
              <CustomButton
                variant="contained"
                sx={{
                  width: '73px',
                  height: '15px',
                  padding: '2px',
                  borderRadius: '5px',
                  backgroundColor: '#1e98d7',
                  color: theme.palette.common.white,
                  textAlign: 'center',
                  lineHeight: 'normal'
                }}
              >
                See list
              </CustomButton>
            </Stack>
            <Stack>
              <FormControlLabel value="upload" control={<Radio color="secondary" />} label="Upload my own" />
              <CustomButton
                variant="contained"
                sx={{
                  width: '75px',
                  height: '21px',
                  padding: '2px',
                  borderRadius: '10px',
                  backgroundColor: '#1e98d7',
                  color: theme.palette.common.white,
                  textAlign: 'center',
                  lineHeight: 'normal'
                }}
              >
                Upload
              </CustomButton>
            </Stack>
          </RadioGroup>
        );
      case 'Make Lowercase':
        return null;
      case 'Lemmatize':
        return (
          <TextField
            id="outlined-multiline-static"
            color="secondary"
            fullWidth
            multiline
            rows={5}
            placeholder="Specify parameters"
            value={type.value}
          />
        );
      case 'Stem':
        return (
          <TextField
            id="outlined-multiline-static"
            color="secondary"
            fullWidth
            multiline
            rows={5}
            placeholder="Specify parameters"
            value={type.value}
          />
        );
      case 'Search and Replace':
        return (
          <TextField
            id="outlined-multiline-static"
            color="secondary"
            fullWidth
            multiline
            rows={5}
            placeholder="Specify parameters"
            value={type.value}
          />
        );
      case 'Page Features':
        return (
          <Stack sx={{ ml: 3 }}>
            {type.value.map((item: any) => (
              <FormControlLabel
                key={item.subLabel}
                value={item.subLabel}
                control={<Checkbox color="secondary" />}
                label={item.subLabel}
                labelPlacement="end"
                sx={{ mr: 1 }}
              />
            ))}
          </Stack>
        );
      case 'POS Tags':
        return (
          <Stack spacing={1}>
            <FormControl sx={{}} fullWidth>
              <Select color="secondary">
                <MenuItem value="Filter by: ">
                  <em>Filter by: </em>
                </MenuItem>
                <MenuItem value={'Ten'}>Ten</MenuItem>
                <MenuItem value={'Twenty'}>Twenty</MenuItem>
                <MenuItem value={'Thirty'}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );
      case 'Token Count Limits':
        return (
          <Box sx={{ '& .MuiTextField-root': { pb: 1 } }}>
            <TextField color="secondary" placeholder="Minimum number limit" fullWidth />
            <TextField color="secondary" placeholder="Maximum number limit" fullWidth />
          </Box>
        );
    }
  }, []);
  return (
    <Stack direction="column" sx={{ minHeight: '500px', padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {typeGroup.map((item: IMockState) => (
            <Box key={item.label}>
              <FormControlLabel
                value={item.label}
                control={<Checkbox checked={item.checked} color="secondary" onChange={handleChange} />}
                label={item.label}
                labelPlacement="end"
                sx={{ mr: 1 }}
              />
              {item.checked && childItem(item)}
            </Box>
          ))}
        </FormGroup>
      </FormControl>
      <Box mb={4} sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
        <CustomButton
          variant="contained"
          color="secondary"
          sx={{
            width: theme.spacing(17.5),
            height: theme.spacing(5),
            padding: theme.spacing(0.25),
            borderRadius: theme.spacing(2),
            backgroundColor: '#1e98d7',
            boxSizing: 'border-box',
            fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
            fontSize: '13px',
            color: theme.palette.common.white,
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

export default CleanDataWidget;
