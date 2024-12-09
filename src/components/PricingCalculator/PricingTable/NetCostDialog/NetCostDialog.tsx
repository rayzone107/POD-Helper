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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './NetCostDialog.css';
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
    baseAmount: number
  ) => (
    <>
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
      <Typography variant="h6" className="summary-title">
        Summary
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Explanation</TableCell>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Total Net Cost After Fees</TableCell>
              <TableCell>(Production Cost + Shipping Cost + Total Fees)</TableCell>
              <TableCell>
                <strong>
                  $
                  {(
                    breakdown.productionCost +
                    breakdown.shippingCost +
                    pass.totalFees
                  ).toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Pre-Sale Amount After Fees</TableCell>
              <TableCell>
                (Production Cost + Shipping Cost + Profit + Total Fees)
              </TableCell>
              <TableCell>
                <strong>
                  $
                  {(
                    breakdown.productionCost +
                    breakdown.shippingCost +
                    breakdown.profitAmount +
                    pass.totalFees
                  ).toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="dialog-title">Net Cost Breakdown</DialogTitle>
      <DialogContent>
        <Box marginBottom={2}>
          <Typography variant="body1">
            <strong>Production Cost:</strong> ${breakdown.productionCost.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Shipping Cost:</strong> ${breakdown.shippingCost.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Net Profit:</strong> $
            {breakdown.profitAmount.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Base Amount:</strong> $
            {(breakdown.productionCost + breakdown.shippingCost + breakdown.profitAmount).toFixed(2)}
          </Typography>
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">First Pass Calculations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderPassTable(
              'First Pass Calculations',
              breakdown.firstPass,
              breakdown.productionCost + breakdown.shippingCost + breakdown.profitAmount
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Second Pass Calculations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderPassTable(
              'Second Pass Calculations',
              breakdown.secondPass,
              breakdown.productionCost +
                breakdown.shippingCost +
                breakdown.profitAmount +
                breakdown.firstPass.totalFees
            )}
          </AccordionDetails>
        </Accordion>
        <Box className="net-cost-box">
          <Typography variant="h6">
            <strong>Total Net Cost:</strong> ${breakdown.netCost.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <Button onClick={onClose} className="close-button" variant="contained" color="primary">
        Close
      </Button>
    </Dialog>
  );
};

export default NetCostDialog;
