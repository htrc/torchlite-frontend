import React, { useState } from 'react';
import SubTable from './SubTable';
import { Typography } from '@mui/material';
// @ts-ignore
const DataTable = ({ data, type, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <table className="main-table" style={{ marginTop: '20px' }}>
      <Typography>{title ? title : null}</Typography>
      <tbody>
      {data.map((item, index) => (
        <tr
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <td className="sub-table-cell">
            {item}
            {hoveredIndex === 0 && index === 0 && type === "widget" ? <SubTable data={['GitHub', 'External Libraries']} />
            : null}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default DataTable;
