// @ts-nocheck
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControl, FormControlLabel, FormHelperText, FormGroup, Stack, RadioGroup, Radio, useTheme, MenuItem, InputLabel, Select as MUISelect, SelectChangeEvent  } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CustomButton from 'components/Button';
import { colourStyles } from 'styles/react-select';
import { BootstrapTooltip } from 'components/BootstrapTooltip';
import CustomStopwordsModal from 'sections/sidebar/CustomStopwordsModal';

interface IMockState {
  label: string;
  checked: boolean;
  value: any;
  description: string;
}

//stopwords dropdown
 const defaultStopwordsOptions = [
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
  /*{ label: 'Ignore case', checked: false, value: null, description: 'Read all letters as lowercase' },
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
  { label: 'Filter by parts-of-speech', checked: false, value: [], description: 'Include specific parts-of-speech', options: filterSpeech }*/
];

const animatedComponents = makeAnimated();

const CleanDataWidget = () => {
  const theme = useTheme();
  const [typeGroup, setTypeGroup] = useState<IMockState[]>(dataTypes);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  //const [selectedValue, setSelectedValue] = useState('default');
  const [stopwordsOptions, setStopwordsOptions] = useState(defaultStopwordsOptions)
  const [selectedOption, setSelectedOption] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false);
  const [stopwordsName, setStopwordsName] = useState('');
  const [applyStopwordsChecked, setApplyStopwordsChecked] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);


  //old handler for the upload stopwords button
  /*const handleButtonClick = () => {
    setSelectedValue('upload');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };*/

  //modal handlers for the custom stopwords upload button
  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleClearButton = () => {
    // Reset checkboxes and radios to their original state
    setTypeGroup((prevTypeGroup) =>
      prevTypeGroup.map((item) => ({
        ...item,
        checked: false,
        value: item.label === 'Apply Stopwords' ? null : (item.label === 'Page Features' ? [
          { subLabel: 'Remove headers', checked: false },
          { subLabel: 'Remove footers', checked: false },
          { subLabel: 'Remove body', checked: false }
        ] : item.label === 'Filter by parts-of-speech' ? []
         : item.value )// Reset specific values if needed
      }))
    );
    // Reset other state variables if needed
    setSelectedOption('');
    setSelectedFilters([]);
  }

  //stopwords selection change
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);

    router.push({
      pathname: router.pathname,
      query: { ...router.query, datacleaning: event.target.value as string }
    });

    onChangeDashboardState({
      datacleaning: event.target.value as string
    });
};

//stopwords -- saving user selection
const handleSaveName = (name: string) => {
  setStopwordsName(name); // Update state with the saved name
  // Check if the name is not already in the list of options
  if (!stopwordsOptions.some(option => option.label === name)) {
    // Add the new name to the list of options
    setStopwordsOptions(prevOptions => [
      ...prevOptions,
      { value: name, label: name }
    ]);
}
  setSelectedOption(name);
};

  //stopwords update check
  useEffect(() => {
    console.log("Selected Option State:", selectedOption);
  }, [selectedOption]);
  
  const handleDownload = () => {
    const fname = 'example.txt';
    const fileContent = 'This is an example file content.';
    //text file with each line is key in stopwords or csv with single row or best is send back txt
    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fname;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  //@router.get("/{dashboard_id}/stopwords", description=““)

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile.name);
  };

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  /*const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setTypeGroup((prev) => prev.map((type) => (type.label === event.target.value ? { ...type, checked } : type)));
  };*/

const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
  const { value } = event.target;
  setTypeGroup(prev =>
    prev.map((type) => {
      if (type.label === value) {
        // Toggle the checked state of the clicked checkbox
        let updatedType = { ...type, checked };
        if (!checked && type.label === 'Filter by parts-of-speech') {
          // Clear the value array when unchecked
          updatedType = { ...updatedType, value: [] };
        }
        console.log("This is what has changed: ", updatedType)
        return updatedType;
      }
      return type;
    })
  );
  // If the changed checkbox is "Apply stopwords" or "Ignore case", update their checked states separately
  if (value === 'Apply Stopwords') {
    setApplyStopwordsChecked(checked);
    // If unchecked, clear the selectedOption state
    if (!checked) setSelectedOption('');
    //not sure if this ignore case is needed in the future with real data or not
  } 
    if (value === 'Ignore case') {
    // Update the state of the "Ignore case" checkbox
    setTypeGroup(prev =>
      prev.map(type =>
        type.label === 'Ignore case' ? { ...type, checked } : type
      )
    );
  }
  if (value === 'Page Features') {
    handleSubItemChange(value, checked);
  }
};

const handleSubItemChange = (subLabel: string, checked: boolean) => {
  setTypeGroup(prev =>
    prev.map(type => {
      if (type.label === 'Page Features') {
        if (!checked && subLabel === 'Page Features') {
          // If the "Page Features" parent box is unchecked, uncheck all sub-items
          const updatedValue = type.value.map((item: any) => ({ ...item, checked: false }));
          console.log("Returning updatedValue for unchecked 'Page Features' box:", updatedValue);
          return { ...type, value: updatedValue };
        } else {
          // Only update the specific sub-item that triggered the change
          const updatedValue = type.value.map((item: any) =>
            item.subLabel === subLabel ? { ...item, checked } : item
          );
          console.log("Returning updatedValue for sub-item change:", updatedValue);
          return { ...type, value: updatedValue };
        }
      }
      console.log("Returning unchanged type:", type);
      return type;
    })
  );
};

const handleFilterChange = (selectedFilterOptions) => {
  const selectedValues = selectedFilterOptions.map(option => option.value);

  // Updating the state with the selected values
  setTypeGroup(prev =>
    prev.map(type => {
      if (type.label === 'Filter by parts-of-speech') {
        console.log("Selected values:", selectedValues);
        return { ...type, value: selectedValues };
      }

      return type;
    })
  );
};


// Determine whether to enable the button based on the states of "Apply Stopwords", "Ignore case" checkboxes, "Page features" sublabels, and "Filter by parts-of-speech"
const isButtonEnabled = (
  selectedOption !== "" || 
  typeGroup.find(item => item.label === 'Ignore case')?.checked || 
  (typeGroup.find(item => item.label === 'Page Features')?.checked &&
  typeGroup.find(item => item.label === 'Page Features')?.value.some(subItem => subItem.checked)) || 
  (typeGroup.find(item => item.label === 'Filter by parts-of-speech')?.checked &&
  typeGroup.find(item => item.label === 'Filter by parts-of-speech')?.value.length > 0)
);

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
                //value={selectedOption}
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
              <CustomButton 
                variant='outlined'
                sx={{
                  height: '21px',
                  padding: '2px',
                  marginTop: '10px',
                  textTransform: 'none'
                }}
                onClick={handleDownload}
                disabled={!selectedOption}
              >
                Download selected list (optional)
              </CustomButton>
            </Stack>
            <Stack>
              {/*<FormControlLabel value="upload" control={<Radio color="secondary" />} label="Upload customized list" />*/}
              {fileName}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
               
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
                onClick={handleUploadClick}
              >
                Or upload a custom list
              </CustomButton>
              <CustomStopwordsModal open={modalOpen} onClose={handleCloseModal} onSaveName={handleSaveName}/>
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
                control={<Checkbox color="secondary" checked={item.checked} onChange={(event) => handleSubItemChange(item.subLabel, event.target.checked)} />}
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
                onChange={handleFilterChange}
              />
            </FormControl>
          </Stack>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, modalOpen, stopwordsName]);
  return (
    <Stack direction="column" sx={{ padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {typeGroup.map((item: IMockState) => (
            <Box key={item.label} sx={{ position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 1.5}}>
              <Typography>{item.label}</Typography>
              {/*<FormControlLabel
                value={item.label}
                control={<Checkbox checked={item.checked} color="secondary" onChange={handleChange} />}
                label={item.label}
                labelPlacement="end"
                sx={{ mr: 1 }}
              />*/}
              <BootstrapTooltip title={item.description}>
                <Box
                  component="img"
                  sx={{
                    height: 15,
                    width: 15,
                    maxHeight: { xs: 15, md: 15 },
                    maxWidth: { xs: 15, md: 15 },
                    // position: 'absolute',
                    marginLeft: 1,
                    top: '10px',
                    right: '10px'
                  }}
                  alt={item.label}
                  src={theme.palette.mode === 'dark' ? '/images/info_white.png' : '/images/info.png'}
                />
              </BootstrapTooltip>
              </Box>
              {childItem(item)}
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
            disabled={!isButtonEnabled}
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
