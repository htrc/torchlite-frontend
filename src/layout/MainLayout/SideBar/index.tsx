import { useSelector } from 'store';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box, useTheme } from '@mui/material';
import CleanDataWidget from './CleanDataWidget';
import DownloadWidget from './DownloadWidget';
import DataFilterWidget from './DataFilterWidget';
import WorksetWidget from './WorksetWidget';
import { useState, useEffect } from 'react';
import { hasFilters } from 'utils/helpers';

const SideBar = () => {
  const theme = useTheme();
  const { selectedWorksetId, appliedFilters } = useSelector((state) => state.dashboard);
  const [isWorksetExpanded, setWorksetExpanded] = useState(!!selectedWorksetId);
  const [isFilterExpanded, setFilterExpanded] = useState(hasFilters(appliedFilters));

  useEffect(() => {
    setFilterExpanded(hasFilters(appliedFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setWorksetExpanded(!!selectedWorksetId);
  }, [selectedWorksetId]);

  return (
    <Box
      sx={{
        '& .MuiAccordion-root': {
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            bgcolor: 'transparent',
            flexDirection: 'row'
          },
          '& .MuiAccordionDetails-root': {
            borderColor: theme.palette.divider
          },
          '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' },
          '& .Mui-expanded': {
            color: '#000000'/*'#1e98d7'*/, //changing header color to black
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : 'inherit'
          },
          '& h5:hover': { color: '#C35400'/*'#1e98d7'*/ } //changing the hover over color to HT orange
        }
      }}
    >
      <Accordion expanded={isWorksetExpanded} onChange={(event, newExpanded) => setWorksetExpanded(newExpanded)}>
        <AccordionSummary aria-controls="workset-content" id="workset-header">
          <Typography variant="h5">Select Workset</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WorksetWidget />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={isFilterExpanded} onChange={(event, newExpanded) => setFilterExpanded(newExpanded)}>
        <AccordionSummary aria-controls="filter-content" id="filter-header">
          <Typography variant="h5">Apply Data Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataFilterWidget />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="data-content" id="data-header">
          <Typography variant="h5">Clean the Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CleanDataWidget />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="data-content" id="data-header">
          <Typography variant="h5">Download the Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DownloadWidget />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SideBar;
