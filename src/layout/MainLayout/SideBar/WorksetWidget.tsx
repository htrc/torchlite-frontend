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
  useTheme
} from '@mui/material';
import { IWorkset } from 'types/menu';
import { useDispatch, useSelector } from 'store';
import { getTimeLineData, getWorksets } from 'store/reducers/dashboard';
import useUser from 'hooks/useUser';
import { setSelectedWorkset } from 'store/reducers/dashboard';

interface Idata extends IWorkset {
  selected: boolean;
}
const WorksetWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useUser();
  const [type, setType] = useState<string>('all');
  const [worksetData, setWorksetData] = useState<Idata[]>([]);
  const [selected, setSelected] = useState<Partial<IWorkset>>({});
  const { worksets } = useSelector((state) => state.dashboard);
  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
    setSelected({});
  };

  const handleSelectWorkSet = (prop: IWorkset, index: number) => {
    setSelected(prop);
    setWorksetData((prev) => prev.map((item, i) => (i === index ? { ...item, selected: true } : { ...item, selected: false })));
  };

  useEffect(() => {
    dispatch(getWorksets(type));
    dispatch(getTimeLineData(type));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    setWorksetData(() => worksets.map((item) => ({ ...item, selected: false })));
  }, [worksets]);

  useEffect(() => {
    dispatch(setSelectedWorkset(selected));
  }, [dispatch, selected]);
  return (
    <Stack sx={{ margin: theme.spacing(1) }} spacing={1}>
      <FormControl sx={{ minWidth: 120 }}>
        <Select value={type} color="secondary" onChange={handleChange}>
          <MenuItem value={'all'}>All Worksets</MenuItem>
          <MenuItem value={'recommend'}>Recommended Worksets</MenuItem>
          {user && <MenuItem value={user.name}>My Worksets</MenuItem>}
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Creator</TableCell>
              <TableCell align="right">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {worksetData.map((item, index) => (
              <TableRow
                key={`${item.name}_${index}`}
                selected={item.selected}
                onClick={() => handleSelectWorkSet(item, index)}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <TableCell scope="data">{item.name}</TableCell>
                <TableCell align="right">{item.creator}</TableCell>
                <TableCell align="right">{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" color="primary" sx={{ padding: theme.spacing(1.5) }}>
        Selected Workset Name: {selected?.name}
      </Typography>
    </Stack>
  );
};

export default WorksetWidget;
