// @ts-nocheck
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormGroup, Stack, RadioGroup, Radio, useTheme, MenuItem, InputLabel, Select as MUISelect, SelectChangeEvent  } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomButton from 'components/Button';
import { colourStyles } from 'styles/react-select';
import { BootstrapTooltip } from 'components/BootstrapTooltip';
interface IMockState {
  label: string;
  checked: boolean;
  value: any;
  description: string;
}

//stopwords
 const stopwordsOptions = [
   { value: 'English', label: 'English' },
   { value: 'French', label: 'French' },
   { value: 'German', label: 'German' },
   { value: 'Spanish', label: 'Spanish' },
  // Add other options as needed
 ];

const filterSpeech = [
  { label: 'CC: Coordinating conjunction', value: 'CC' },
  { label: 'CD: Cardinal number', value: 'CD' },
  { label: 'DT: Determiner', value: 'DT' },
  { label: 'EX: Existential ‘there’', value: 'EX' },
  { label: 'FW: Foreign word', value: 'FW' },
  { label: 'IN: Preposition or subordinating conjunction', value: 'IN' },
  { label: 'JJ: Adjective', value: 'JJ' },
  { label: 'JJR: Adjective, comparative', value: 'JJR' },
  { label: 'JJS: Adjective, superlative', value: 'JJS' },
  { label: 'LS: List item marker', value: 'LS' },
  { label: 'MD: Modal', value: 'MD' },
  { label: 'NN: Noun, singular or mass', value: 'NN' },
  { label: 'NNS: Noun, plural', value: 'NNS' },
  { label: 'NNPS: Proper noun, singular', value: 'NNPS' }
];
const dataTypes = [
  { label: 'Apply Stopwords', checked: false, value: null, description: 'Remove common words from analysis' },
  { label: 'Ignore case', checked: false, value: null, description: 'Read all letters as lowercase' },
  {
    label: 'Page Features',
    checked: false,
    value: [
      { subLabel: 'Remove headers', checked: false },
      { subLabel: 'Remove footers', checked: false },
      { subLabel: 'Remove body', checked: false }
    ],
    description: 'Exclude volume sections from analysis'
  },
  { label: 'Filter by parts-of-speech', checked: false, value: '', description: 'Include specific parts-of-speech' }
];
const animatedComponents = makeAnimated();
const CleanDataWidget = () => {
  const theme = useTheme();
  const [typeGroup, setTypeGroup] = useState<IMockState[]>(dataTypes);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [selectedValue, setSelectedValue] = useState('default');

  const handleButtonClick = () => {
    setSelectedValue('upload');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearButton = () => {
    // Reset checkboxes and radios to their original state
    setTypeGroup((prevTypeGroup) =>
      prevTypeGroup.map((item) => ({
        ...item,
        checked: false,
        value: item.label === 'Apply Stopwords' ? null : item.value // Reset specific values if needed
      }))
    );
    // Reset other state variables if needed
    setSelectedOption('');
  }

  //stopwords
  const [selectedOption, setSelectedOption] = useState(''); 


  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  //stopwords
  useEffect(() => {
    console.log("Selected Option State:", selectedOption);
  }, [selectedOption]);
  
  const handleDownload = () => {
    const fname = 'example.txt';
    const fileContent = 'This is an example file content.';

    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fname;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name);
  };
  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTypeGroup((prev) => prev.map((type) => (type.label === event.target.value ? { ...type, checked } : type)));
  };
  useEffect(() => {
    console.log(fileName);
  }, [fileName]);
  const childItem = useCallback((type: any) => {
    switch (type.label) {
      case 'Apply Stopwords':
        return (
          <RadioGroup aria-label="size" name="radio-buttons-group" sx={{ ml: 3 }} defaultValue="default">
            <Stack direction="row" alignItems="left">   
            <FormControl>
              <InputLabel>Choose a list</InputLabel>  
              <MUISelect
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  minWidth: '200px',
                  borderColor: theme.palette.primary[700],
                }}
              >
                {stopwordsOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </MUISelect>
            </FormControl>         
            </Stack>
            <Stack>
              <button
                style={{
                  color: theme.palette.common.black/*'#1e98d7'*/,
                  backgroundColor: theme.palette.background.default,
                  textAlign: 'left',
                  lineHeight: 'normal',
                  cursor: selectedOption !== '' ? 'pointer' : 'default',
                  marginTop: '10px',
                  width: '220px',
                  border: '.5px solid',
                  borderRadius: '5px'
                }}
                onClick={handleDownload}
                disabled={selectedOption === ''} 
              >
                Download selected list (optional)
              </button>
            </Stack>
            <Stack>
              {/*<FormControlLabel value="upload" control={<Radio color="secondary" />} label="Upload customized list" />*/}
              {fileName}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              {selectedOption === '' && 
              <CustomButton
                variant="contained"
                sx={{
                  height: '21px',
                  padding: '2px',
                  borderRadius: '10px',
                  backgroundColor: theme.palette.primary[700]/*'#1e98d7'*/,
                  color: theme.palette.common.white,
                  textAlign: 'center',
                  lineHeight: 'normal',
                  marginTop: '20px',
                  textTransform: 'none'
                }}
                onClick={handleButtonClick}
                //disabled={selectedOption !== ''}
              >
                Or upload a custom list
              </CustomButton>}
            </Stack>
          </RadioGroup>
        );
      case 'Ignore case':
        return null;
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
      case 'Filter by parts-of-speech':
        return (
          <Stack spacing={1}>
            <FormControl sx={{}} fullWidth>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={filterSpeech}
                className="basic-multi-select"
                classNamePrefix="select"
                {...(theme.palette.mode === 'dark' ? { styles: colourStyles } : {})}
              />
            </FormControl>
          </Stack>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);
  return (
    <Stack direction="column" sx={{ padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {typeGroup.map((item: IMockState) => (
            <Box key={item.label} sx={{ position: 'relative' }}>
              <FormControlLabel
                value={item.label}
                control={<Checkbox checked={item.checked} color="secondary" onChange={handleChange} />}
                label={item.label}
                labelPlacement="end"
                sx={{ mr: 1 }}
              />
              <BootstrapTooltip title={item.description}>
                <Box
                  component="img"
                  sx={{
                    height: 15,
                    width: 15,
                    maxHeight: { xs: 15, md: 15 },
                    maxWidth: { xs: 15, md: 15 },
                    // position: 'absolute',
                    top: '10px',
                    right: '10px'
                  }}
                  alt={item.label}
                  src={theme.palette.mode === 'dark' ? '/images/info_white.png' : '/images/info.png'}
                />
              </BootstrapTooltip>
              {item.checked && childItem(item)}
            </Box>
          ))}
        </FormGroup>
      </FormControl>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <CustomButton
            variant="contained"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              backgroundColor: theme.palette.primary[700]/*'#1e98d7'*/,
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              color: theme.palette.common.white,
              textAlign: 'center',
              textTransform: 'none'
            }}
          >
            Apply cleaning
          </CustomButton>
        </Box>
        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <CustomButton
            variant="outlined"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              textAlign: 'center',
              textTransform: 'none'
            }}
            onClick={handleClearButton}
          >
            Clear cleaning
          </CustomButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default CleanDataWidget;
