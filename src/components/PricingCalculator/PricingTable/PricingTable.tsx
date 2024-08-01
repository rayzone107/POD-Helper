import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import './PricingTable.css';

interface PricingTableProps {
  prices: Record<string, { productionCost: number; profitAmount: number; profitPercentage: number; afterDiscountPrice: number; finalPriceRounded: number }>;
}

const PricingTable: React.FC<PricingTableProps> = ({ prices }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Size Variant</TableCell>
            <TableCell>Production Cost</TableCell>
            <TableCell>Profit Amount</TableCell>
            <TableCell>Profit Percentage</TableCell>
            <TableCell>Discounted Price</TableCell>
            <TableCell className="rounded-price">.99 Pricing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(prices).map(([size, priceInfo]) => (
            <TableRow key={size}>
              <TableCell>{size}</TableCell>
              <TableCell>${priceInfo.productionCost.toFixed(2)}</TableCell>
              <TableCell>${priceInfo.profitAmount.toFixed(2)}</TableCell>
              <TableCell>{priceInfo.profitPercentage.toFixed(2)}%</TableCell>
              <TableCell>${priceInfo.afterDiscountPrice.toFixed(2)}</TableCell>
              <TableCell className="rounded-price">
                <Typography variant="h6" component="span">
                  ${priceInfo.finalPriceRounded.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PricingTable;
