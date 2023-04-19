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
  Paper
} from '@mui/material';

interface ITableItem {
  name: string;
  creator: string;
  description: string;
}
const mockTableData = [
  { name: '1', creator: '1', description: '1' },
  { name: '2', creator: '2', description: '2' }
];
const WorkSet = () => {
  const [workSetType, setWorkSetType] = useState<string>('Recommended Worksets');
  const [rows, setRows] = useState<ITableItem[]>([]);
  const handleChange = (event: SelectChangeEvent<string>) => {
    setWorkSetType(event.target.value);
  };

  useEffect(() => {
    setRows(mockTableData);
  }, []);
  return (
    <Stack sx={{ margin: '5px' }} spacing={1}>
      <FormControl sx={{ minWidth: 120 }}>
        <Select value={workSetType} onChange={handleChange}>
          <MenuItem value={'Recommended Worksets'}>Recommended Worksets</MenuItem>
          <MenuItem value={'All Worksets'}>All Worksets</MenuItem>
          <MenuItem value={'My Worksets'}>My Worksets</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Creator</TableCell>
              <TableCell align="right">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell scope="row">{row.name}</TableCell>
                <TableCell align="right">{row.creator}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" color="primary" sx={{ padding: '12px' }}>
        {'Selected Workset Name'}
      </Typography>
    </Stack>
  );
};

export default WorkSet;
