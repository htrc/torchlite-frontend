import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const ContributorTable = (data) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log("MApping COntri", data)

  return (
    <div style={{ paddingTop: '20px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>HathiTrust ID</TableCell>
              <TableCell>Contributor</TableCell>
              <TableCell>Contributor Birthplace</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row, index) => {
              const rowIndex = index + page * rowsPerPage;
              if (rowIndex < (page + 1) * rowsPerPage) {
                return (
                  <TableRow key={index}>
                    <TableCell>{row.htid}</TableCell>
                    <TableCell>
                      {row.metadata.contributor.length > 1 ? row.metadata.contributor.map((item, index) => {
                        return (
                          <div key={index}>
                            {item.name}
                          </div>
                        )
                      }) : row.metadata.contributor.name }
                    </TableCell>
                    <TableCell>
                      {row.metadata.category}
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ContributorTable;
