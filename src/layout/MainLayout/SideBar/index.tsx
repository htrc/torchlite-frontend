import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Box } from '@mui/material';
import CleanData from './Cleandata';
import DataFilter from './DataFilter';
import WorkSet from './Workset';

const SideBar = () => {
  const [expanded, setExpanded] = useState<string | false>('workset');
  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(panel);
  };
  return (
    <Box
      sx={{
        '& h6:hover': { color: '#1e98d7' },
        '& .Mui-expanded > h5': { color: '#1e98d7' },
        '& .MuiAccordionDetails-root': { padding: 0, margin: 0 },
        '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' },
        '& .MuiAccordionSummary-root': {
          height: '56px',
          padding: '2px 2px 2px 12px',
          backgroundColor: '#fff',
          boxSizing: 'border-box',
          fontFamily: "'Roboto-Regular', 'Robot', 'sans-serif'",
          textAlign: 'left',
          lineHeight: 'normal',
          letterSpacing: '0.4px'
        },
        '& .Mui-expanded .MuiAccordionSummary-root': { color: '#1e98d7', backgroundColor: 'rgba(0, 0, 0, 0.04)' }
      }}
    >
      <Accordion expanded={expanded === 'workset'} onChange={handleChange('workset')}>
        <AccordionSummary aria-controls="workset-content" id="workset-header">
          <Typography variant="h5">Select Workset</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <WorkSet />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'filter'} onChange={handleChange('filter')}>
        <AccordionSummary aria-controls="filter-content" id="filter-header">
          <Typography variant="h5">Apply Data Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataFilter />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'data'} onChange={handleChange('data')}>
        <AccordionSummary aria-controls="data-content" id="data-header">
          <Typography variant="h5">Clean the Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CleanData />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SideBar;
