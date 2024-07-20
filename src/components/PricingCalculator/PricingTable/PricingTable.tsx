import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface PricingTableProps {
  prices: Record<string, number>;
}

const PricingTable: React.FC<PricingTableProps> = ({ prices }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Size Variant</TableCell>
          <TableCell>Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(prices).map(([variant, price]) => (
          <TableRow key={variant}>
            <TableCell>{variant}</TableCell>
            <TableCell>${price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PricingTable;
