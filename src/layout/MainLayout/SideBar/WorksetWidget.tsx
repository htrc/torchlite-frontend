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
import { IWorkset } from 'types/dashboard';
import { useDispatch, useSelector } from 'store';
import { setTooltipId } from 'store/reducers/dashboard';
import { setSelectedWorksetId } from 'store/reducers/dashboard';
import CustomTableRow from 'components/CustomTableRow';

const WorksetWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const { worksets, selectedWorksetId, selectedDashboard, loading } = useSelector((state) => state.dashboard);
  const [type, setType] = useState<string>('all');
  const [selected, setSelected] = useState<IWorkset | null>(null);
  const [worksetData, setWorksetData] = useState<IWorkset[]>(worksets);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
  };

  const handleSelectWorkSet = (prop: IWorkset) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, worksetId: prop.id }
    });
    setSelected(prop);
    dispatch(setSelectedWorksetId(prop.id));

    // if (selectedDashboard) {
    //   dispatch(setLoading(true));
    //   confirmWorkset(selectedDashboard?.id, prop.id)
    //     .then((response) => {
    //       dispatch(setSelectedDashboard(response[0]));
    //     })
    //     .catch((error) => dispatch(hasError(error)))
    //     .finally(() => {
    //       dispatch(setLoading(false));
    //     });
    // }
  };

  useEffect(() => {
    if (type === 'all' || type === 'A') {
      setWorksetData(worksets);
    } else {
      setWorksetData([]);
    }
  }, [type, worksets]);

  useEffect(() => {
    if (selectedWorksetId) {
      const filtered = worksets.filter((workset) => workset.id === selectedWorksetId);
      if (filtered && filtered.length > 0) {
        setSelected(filtered[0]);
      }
    }

    setWorksetData(worksets);
    dispatch(setTooltipId(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worksets, selectedWorksetId]);

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
