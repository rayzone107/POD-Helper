// src/components/PricingCalculator/PricingTable/NetCostDialog/NetCostDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { FeeBreakdown } from '../../../../types';

interface NetCostDialogProps {
  open: boolean;
  onClose: () => void;
  breakdown: FeeBreakdown;
}

const NetCostDialog: React.FC<NetCostDialogProps> = ({ open, onClose, breakdown }) => {
  const renderTableRow = (
    name: string,
    calculationSteps: string[],
    fee: number,
    tax: number,
    total: number
  ) => (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        {calculationSteps.map((step, index) => (
          <div key={index}>{step}</div>
        ))}
      </TableCell>
      <TableCell>${fee.toFixed(2)}</TableCell>
      <TableCell>${tax.toFixed(2)}</TableCell>
      <TableCell>${total.toFixed(2)}</TableCell>
    </TableRow>
  );

  const renderPassTable = (
    title: string,
    pass: FeeBreakdown['firstPass' | 'secondPass'],
    baseAmount: number,
    netProductionCost: number
  ) => (
    <>
      <Typography variant="h6" style={{ marginTop: '16px' }}>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fee Name</TableCell>
              <TableCell>Calculation</TableCell>
              <TableCell>Fee Amount</TableCell>
              <TableCell>Tax Amount</TableCell>
              <TableCell>Total (Fee + Tax)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableRow(
              'Etsy Fees (6.5%)',
              [
                `6.5% of $${baseAmount.toFixed(2)}`,
                `13% of ${pass.etsyFees.toFixed(2)}`,
              ],
              pass.etsyFees,
              pass.etsyTaxes,
              pass.etsyFees + pass.etsyTaxes
            )}
            {renderTableRow(
              'Payment Processing Fees (4%)',
              [
                `4% of $${baseAmount.toFixed(2)}`,
                `13% of ${pass.paymentProcessingFees.toFixed(2)}`,
              ],
              pass.paymentProcessingFees,
              pass.paymentProcessingTaxes,
              pass.paymentProcessingFees + pass.paymentProcessingTaxes
            )}
            {renderTableRow(
              'Regulatory Operating Fees (1.15%)',
              [
                `1.15% of $${baseAmount.toFixed(2)}`,
                `13% of ${pass.regulatoryOperatingFees.toFixed(2)}`,
              ],
              pass.regulatoryOperatingFees,
              pass.regulatoryOperatingTaxes,
              pass.regulatoryOperatingFees + pass.regulatoryOperatingTaxes
            )}
            {renderTableRow(
              'Flat Fee',
              [
                `Fixed at $${pass.flatFee.toFixed(2)}`,
                `13% of $${pass.flatFee.toFixed(2)}`,
              ],
              pass.flatFee,
              pass.flatFee * 0.13,
              pass.flatFee + pass.flatFee * 0.13
            )}
            {renderTableRow(
              'Listing Fee',
              [
                `Fixed at $${pass.listingFee.toFixed(2)}`,
                `13% of $${pass.listingFee.toFixed(2)}`,
              ],
              pass.listingFee,
              pass.listingFee * 0.13,
              pass.listingFee + pass.listingFee * 0.13
            )}
            <TableRow>
              <TableCell>
                <strong>Totals</strong>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <strong>${pass.totalBaseFees.toFixed(2)}</strong>
              </TableCell>
              <TableCell>
                <strong>${pass.totalTaxes.toFixed(2)}</strong>
              </TableCell>
              <TableCell>
                <strong>${pass.totalFees.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" style={{ marginTop: '8px' }}>
        <strong>Total Amount After Fees:</strong> ${netProductionCost.toFixed(2)} + $
        {pass.totalFees.toFixed(2)} = ${(
          netProductionCost + pass.totalFees
        ).toFixed(2)}
      </Typography>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Net Cost Breakdown</DialogTitle>
      <DialogContent>
        <Box marginBottom={2}>
          <Typography variant="body1">
            <strong>Production Cost:</strong> ${breakdown.productionCost.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Shipping Cost:</strong> ${breakdown.shippingCost.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Total Production Cost:</strong> $
            {(breakdown.productionCost + breakdown.shippingCost).toFixed(2)}
          </Typography>
        </Box>

        {renderPassTable(
          'First Pass Calculations',
          breakdown.firstPass,
          breakdown.productionCost + breakdown.shippingCost,
          breakdown.productionCost + breakdown.shippingCost
        )}
        {renderPassTable(
          'Second Pass Calculations',
          breakdown.secondPass,
          breakdown.productionCost + breakdown.shippingCost + breakdown.firstPass.totalFees,
          breakdown.productionCost + breakdown.shippingCost
        )}

        <Box marginTop={2}>
          <Typography variant="h6">
            <strong>Total Net Cost:</strong> ${breakdown.netCost.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <Button onClick={onClose} style={{ margin: '16px' }} variant="contained" color="primary">
        Close
      </Button>
    </Dialog>
  );
};

export default NetCostDialog;
