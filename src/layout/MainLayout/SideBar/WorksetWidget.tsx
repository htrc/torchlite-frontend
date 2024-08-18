import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  FormControl,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Box
} from '@mui/material';
import CustomTableRow from 'components/CustomTableRow';
import { WorksetSummary } from 'types/torchlite';
import useDashboardState from 'hooks/useDashboardState';

const WorksetWidget = () => {
  const theme = useTheme();
  const router = useRouter();
  const { dashboardState, availableWorksets, onChangeDashboardState } = useDashboardState();

  // const { worksets } = useSelector((state) => state.dashboard);
  const [type, setType] = useState<string>('featured');
  const [selected, setSelected] = useState<WorksetSummary | null>(null);
  const [worksetData, setWorksetData] = useState<WorksetSummary[]>(availableWorksets?.featured || []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
  };

  const handleSelectWorkSet = (prop: WorksetSummary) => {
//    console.log("dashboardState:")
//    console.log(dashboardState)
//    console.log(dashboardState?.worksetId)
    if (prop.id !== dashboardState?.worksetId) {
//      console.log(router.pathname)
//      console.log(prop)
      router.push({
        pathname: router.pathname,
        query: { ...router.query, worksetId: prop.id, filters: undefined }
      });
//      console.log("HERE")
      setSelected(prop);
      onChangeDashboardState({
//        worksetId: prop.id,
        importedId: prop.id,
        filters: {}
      });
    }
  };

  useEffect(() => {
    if (type === 'featured') {
      setWorksetData(availableWorksets?.featured || []);
    } else if (type === 'user') {
      setWorksetData(availableWorksets?.user || []);
    } else {
      setWorksetData(availableWorksets?.public || []);
    }
  }, [type, availableWorksets, status]);

  useEffect(() => {
    if (worksetData) {
      if (dashboardState?.worksetId) {
        const filtered = worksetData.filter((workset) => workset.id === dashboardState?.worksetId);
        if (filtered && filtered.length > 0) {
          setSelected(filtered[0]);
        }
      }
      setWorksetData(worksetData);
    }
  }, [worksetData, dashboardState?.worksetId]);

  return (
    <>
      <Stack sx={{ margin: theme.spacing(1) }} spacing={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <Select value={type} color="secondary" onChange={handleChange}>
            <MenuItem value={'featured'}>Recommended Worksets</MenuItem>
            <MenuItem value={'user'}>My Worksets</MenuItem>
            <MenuItem value={'public'}>All Worksets</MenuItem>
          </Select>
        </FormControl>
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right"># of Volumes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {worksetData.map((item, index) => (
                <CustomTableRow
                  key={`${item.name}_${index}`}
                  item={item}
                  selected={item.id === selected?.id}
                  handleSelectWorkSet={handleSelectWorkSet}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <Typography variant="h5" color="primary" sx={{ padding: theme.spacing(1.5) }}>
            Selected Workset Name:
            <Typography>{selected?.name}</Typography>
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default WorksetWidget;
