import { useEffect, useState, useCallback } from 'react';
import { TableCell, TableRow, Tooltip } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { InfoOutlined } from '@ant-design/icons';
import { IWorkset } from 'types/dashboard';
import { useDispatch, useSelector } from 'store';
import { setTooltipId } from 'store/reducers/dashboard';

interface ICustomTableRow {
  item: IWorkset;
  selected: boolean;
  handleSelectWorkSet: (item: IWorkset) => any;
}

const CustomTableRow = ({ item, handleSelectWorkSet, selected }: ICustomTableRow) => {
  const { tooltipId } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = useCallback(() => {
    if (tooltipId !== item.id) dispatch(setTooltipId(item.id));
    else setOpen((prev) => !prev);
  }, [dispatch, item.id, tooltipId]);

  useEffect(() => {
    if (item.id === tooltipId) setOpen((prev) => !prev);
    else setOpen(false);
  }, [item.id, tooltipId]);
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
        <Tooltip
          arrow
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={item.description}
          placement="bottom-start"
        >
          <IconButton
            size="small"
            shape="rounded"
            variant="outlined"
            color="secondary"
            sx={{
              ml: 1,
              borderBottomColor: 'rgba(255,255,255,0.05)',
              width: '18px',
              height: '18px',
              position: 'absolute',
              top: '16px',
              right: '5px'
            }}
            onClick={handleTooltipOpen}
          >
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default CustomTableRow;
