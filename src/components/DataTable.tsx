// material-ui
import { Box, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useTable, useSortBy, useFilters, usePagination, Column, HeaderGroup, Row, Cell } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, TablePagination, HeaderSort } from 'components/third-party/ReactTable';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, top, sort }: { columns: Column[]; data: []; top?: boolean; sort?: boolean }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <Stack>
      {top && (
        <Box sx={{ p: 2 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
        </Box>
      )}

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
          {headerGroups.map((headerGroup, index) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: HeaderGroup, i) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])} key={i}>
                  <HeaderSort column={column} sort={sort} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: Row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={i}>
                {row.cells.map((cell: Cell, index) => (
                  <TableCell {...cell.getCellProps([{ className: cell.column.className }])} key={index}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {!top && (
            <TableRow>
              <TableCell sx={{ p: 2 }} colSpan={7}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

// ==============================|| REACT TABLE - PAGINATION ||============================== //

const DataTable = ({ data, columns, sort, title }: any) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const formattedTitle = `${title.replace(/\s+/g, '_')}_${currentDate}.csv`;

  return (
    <Grid item xs={12}>
      <MainCard title={title} content={false} secondary={data && <CSVExport data={data} filename={formattedTitle} />}>
        <ScrollX>
          <ReactTable columns={columns} data={data} sort={sort} />
        </ScrollX>
      </MainCard>
    </Grid>
  );
};

export default DataTable;
