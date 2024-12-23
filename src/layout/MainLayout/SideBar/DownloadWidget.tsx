import React, { useState, useRef, useContext, useEffect } from 'react';
import { Box, FormControl, FormControlLabel, Stack, RadioGroup, Radio, useTheme, Typography, Backdrop, Button } from '@mui/material';
import CustomButton from 'components/Button';
import { saveAs } from 'file-saver';
import useDashboardState from 'hooks/useDashboardState';
import { getWorksetData } from '../../../../src/services/index';
import { AppContext } from 'contexts/AppContext'; // Import AppContext

const CleanDataWidget = () => {
  const theme = useTheme();
  const { dashboardState } = useDashboardState();
  const { widgetLoadingState } = useContext(AppContext); // Access widgetLoadingState from context
  const [selectedValue, setSelectedValue] = useState('full');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const isDownloadingRef = useRef(true); // Ref to track if download is ongoing

  let downloadData: any = null;

  // Check if all widgets are loaded by verifying widgetLoadingState
  const allWidgetsLoaded = Object.values(widgetLoadingState).every((isLoaded) => isLoaded === true);

  console.log("Download button enabled:", allWidgetsLoaded); // Debug log to check button status

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const onClickDownload = async () => {
    const dashboardId = dashboardState?.id;
    setLoading(true);
    setProgress(0);
    isDownloadingRef.current = true; // Set ref to true on download start

    try {
      // Fetch the selected data based on user selection
      if (selectedValue === 'full') {
        downloadData = await getWorksetData(dashboardId, 'data', false);
      } else if (selectedValue === 'filtered') {
        downloadData = await getWorksetData(dashboardId, 'data', true);
      } else if (selectedValue === 'filtered-meta') {
        downloadData = await getWorksetData(dashboardId, 'metadata', true);
      }

      if (isDownloadingRef.current) {
        initiateDownload(downloadData, selectedValue === 'full' ? 'full-data-EF.json' : selectedValue === 'filtered' ? 'filtered-data-EF.json' : 'filtered-metadata-EF.json');
      } else {
        console.log("Download was canceled before it started.");
        setLoading(false);
      }
    } catch (error) {
      console.log('Error downloading:', error);
      setLoading(false);
    }
  };

  const initiateDownload = (data: any, filename: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (!isDownloadingRef.current) { // Check ref instead of state
        clearInterval(interval);
        setLoading(false);
        setProgress(0);
        console.log('Download canceled');
        downloadData = null;
        return;
      }

      currentProgress += 20;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);

        if (isDownloadingRef.current && downloadData) {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          saveAs(blob, filename);
          downloadData = null;
        }

        setLoading(false);
      }
    }, 500);
  };

  const handleCancel = () => {
    isDownloadingRef.current = false; // Set ref to false on cancel
    setLoading(false);
    downloadData = null;
  };

  return (
    <Stack direction="column" sx={{ padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <RadioGroup aria-label="size" name="radio-buttons-group" defaultValue="full">
          <Typography variant="subtitle1">Extracted Features Dataset (JSON):</Typography>
          <Stack sx={{ ml: 3 }}>
            <FormControlLabel 
              value="full" 
              control={<Radio color="secondary" onChange={handleChange} />} 
              label="Full" 
            />
            <FormControlLabel 
              value="filtered" 
              control={<Radio color="secondary" onChange={handleChange} />} 
              label="Filtered" 
            />
            <FormControlLabel 
              value="filtered-meta" 
              control={<Radio color="secondary" onChange={handleChange} />} 
              label="Filtered metadata only" 
            />
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
              backgroundColor: theme.palette.primary[700],
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              color: theme.palette.common.white,
              textAlign: 'center',
              textTransform: 'none',
            }}
            onClick={onClickDownload}
            disabled={!allWidgetsLoaded} // Disable button if widgets are not fully loaded
          >
            Download
          </CustomButton>
        </Box>
      </Stack>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <Box 
          sx={{ 
            width: '400px', 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" mb={2} color="textPrimary">Downloading in progress</Typography>
          <Typography variant="body2" mb={2} color="textSecondary">
            Give us a few minutes while we download your data!
          </Typography>
          <Box 
            sx={{
              width: '100%', 
              height: '20px', 
              backgroundColor: '#ddd', 
              borderRadius: '10px', 
              overflow: 'hidden', 
              mb: 2
            }}
          >
            <Box 
              sx={{ 
                height: '100%', 
                width: `${progress}%`, 
                backgroundColor: '#d2691e', 
                transition: 'width 0.3s' 
              }} 
            />
          </Box>
          <Typography variant="body2" color="textSecondary">{progress}%</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleCancel}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Backdrop>
    </Stack>
  );
};

export default CleanDataWidget;
