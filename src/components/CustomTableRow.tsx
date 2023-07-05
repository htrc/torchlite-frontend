import { styled } from '@mui/material/styles';
import { Box, TableCell, TableRow, Tooltip } from '@mui/material';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { IWorkset } from 'types/dashboard';

interface ICustomTableRow {
  item: IWorkset;
  selected: boolean;
  handleSelectWorkSet: (item: IWorkset) => any;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} arrow classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black
    }
  })
);

const CustomTableRow = ({ item, handleSelectWorkSet, selected }: ICustomTableRow) => {
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
            src="/images/info.png"
          />
        </BootstrapTooltip>
      </TableCell>
    </TableRow>
  );
};

export default CustomTableRow;
