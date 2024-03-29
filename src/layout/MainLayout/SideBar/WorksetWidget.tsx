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
  const [type, setType] = useState<string>('all');
  const [selected, setSelected] = useState<WorksetSummary | null>(null);
  const [worksetData, setWorksetData] = useState<WorksetSummary[]>(availableWorksets || []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
  };

  const handleSelectWorkSet = (prop: WorksetSummary) => {
    if (prop.id !== dashboardState?.worksetId) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, worksetId: prop.id, filters: undefined }
      });
      setSelected(prop);
      onChangeDashboardState({
        worksetId: prop.id,
        filters: {}
      });
    }
  };

  useEffect(() => {
    if (type === 'all' || type === 'A') {
      setWorksetData(availableWorksets || []);
    } else {
      setWorksetData([]);
    }
  }, [type, availableWorksets]);

  useEffect(() => {
    if (availableWorksets) {
      if (dashboardState?.worksetId) {
        const filtered = availableWorksets.filter((workset) => workset.id === dashboardState?.worksetId);
        if (filtered && filtered.length > 0) {
          setSelected(filtered[0]);
        }
      }
      setWorksetData(availableWorksets);
    }
  }, [availableWorksets, dashboardState?.worksetId]);

  return (
    <>
      <Stack sx={{ margin: theme.spacing(1) }} spacing={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <Select value={type} color="secondary" onChange={handleChange}>
            <MenuItem value={'all'}>All Worksets</MenuItem>
            <MenuItem value={'A'}>Recommended Worksets</MenuItem>
            <MenuItem value={'B'}>My Worksets</MenuItem>
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
