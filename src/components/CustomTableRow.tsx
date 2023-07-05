import { Box, TableCell, TableRow, useTheme } from '@mui/material';
import { IWorkset } from 'types/dashboard';
import { BootstrapTooltip } from './BootstrapTooltip';

interface ICustomTableRow {
  item: IWorkset;
  selected: boolean;
  handleSelectWorkSet: (item: IWorkset) => any;
}

const CustomTableRow = ({ item, handleSelectWorkSet, selected }: ICustomTableRow) => {
  const theme = useTheme();
  return (
    <TableRow
      selected={selected}
      onClick={() => handleSelectWorkSet(item)}
      sx={{ '&:hover': { cursor: 'pointer' }, '& .MuiTooltip-tooltip': { whiteSpace: 'normal', textAlign: 'left' }, position: 'relative' }}
    >
      <TableCell scope="row" sx={{ whiteSpace: 'break-spaces' }}>
        {item.name}
      </TableCell>
      <TableCell align="center">
        {item.volumes}
        <BootstrapTooltip title={item.description}>
          <Box
            component="img"
            sx={{
              height: 15,
              width: 15,
              maxHeight: { xs: 15, md: 15 },
              maxWidth: { xs: 15, md: 15 },
              position: 'absolute',
              top: '10px',
              right: '10px'
            }}
            alt={item.description}
            src={theme.palette.mode === 'dark' ? '/images/info_white.png' : '/images/info.png'}
          />
        </BootstrapTooltip>
      </TableCell>
    </TableRow>
  );
};

export default CustomTableRow;
