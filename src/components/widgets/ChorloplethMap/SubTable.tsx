import React from 'react';

// @ts-ignore
const SubTable = ({ data }) => {
  return (
    <table className="sub-table">
      <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default SubTable;
