import { useSelector } from 'store';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box, useTheme } from '@mui/material';
import CleanDataWidget from './CleanDataWidget';
import DataFilterWidget from './DataFilterWidget';
import WorksetWidget from './WorksetWidget';
import { useState, useEffect } from 'react';

const SideBar = () => {
  const theme = useTheme();
  const { selectedWorksetId } = useSelector((state) => state.dashboard);
  const [isAccordionExpanded, setAccordionExpanded] = useState(!!selectedWorksetId);
  useEffect(() => {
    setAccordionExpanded(!!selectedWorksetId);
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
            color: '#1e98d7',
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : 'inherit'
          },
          '& h5:hover': { color: '#1e98d7' }
        }
      }}
    >
      <Accordion expanded={isAccordionExpanded} onChange={(event, newExpanded) => setAccordionExpanded(newExpanded)}>
        <AccordionSummary aria-controls="workset-content" id="workset-header">
          <Typography variant="h5">Select Workset</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WorksetWidget />
        </AccordionDetails>
      </Accordion>
      <Accordion>
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
    </Box>
  );
};

export default SideBar;
