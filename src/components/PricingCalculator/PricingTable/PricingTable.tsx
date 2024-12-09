import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Link,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NetCostDialog from './NetCostDialog/NetCostDialog';
import { PricingInfo } from '../../../types';
import './PricingTable.css';

interface PricingTableProps {
  prices: Record<
    string,
    {
      productionCost: number;
      profitAmount: number;
      shippingCost: number;
      netCost: number;
      afterDiscountPrice: number;
      finalPrice: number;
      breakdown?: PricingInfo['breakdown']; // Nullable breakdown
    }
  >;
}

const PricingTable: React.FC<PricingTableProps> = ({ prices }) => {
  const [copiedRow, setCopiedRow] = useState<string | null>(null);
  const [selectedBreakdown, setSelectedBreakdown] = useState<PricingInfo['breakdown'] | null>(null);

  const handleCopy = (price: number, rowKey: string) => {
    navigator.clipboard.writeText(price.toFixed(2)).then(() => {
      setCopiedRow(rowKey);
      setTimeout(() => {
        setCopiedRow(null); // Reset after 1 second
      }, 1000);
    });
  };

  const handleOpenDialog = (breakdown: PricingInfo['breakdown']) => {
    setSelectedBreakdown(breakdown);
  };

  const handleCloseDialog = () => {
    setSelectedBreakdown(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Size Variant</TableCell>
              <TableCell>Production Cost</TableCell>
              <TableCell>Profit Amount</TableCell>
              <TableCell>Shipping Cost</TableCell>
              <TableCell>Net Cost</TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell className="rounded-price">Final Pricing</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(prices).map(([size, priceInfo]) => {
              return (
                <TableRow key={size}>
                  <TableCell>{size}</TableCell>
                  <TableCell>${priceInfo.productionCost.toFixed(2)}</TableCell>
                  <TableCell>${priceInfo.profitAmount.toFixed(2)}</TableCell>
                  <TableCell>${priceInfo.shippingCost.toFixed(2)}</TableCell>
                  <TableCell>
                    {priceInfo.breakdown ? (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleOpenDialog(priceInfo.breakdown)}
                      >
                        ${priceInfo.netCost.toFixed(2)}
                      </Link>
                    ) : (
                      `$${priceInfo.netCost.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>${priceInfo.afterDiscountPrice.toFixed(2)}</TableCell>
                  <TableCell className="rounded-price">
                    <Typography variant="h6" component="span">
                      ${priceInfo.finalPrice.toFixed(2)}
                    </Typography>
                    <IconButton onClick={() => handleCopy(priceInfo.finalPrice, size)}>
                      {copiedRow === size ? (
                        <CheckCircleIcon fontSize="small" style={{ color: 'green' }} />
                      ) : (
                        <ContentCopyIcon fontSize="small" style={{ color: 'green' }} />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Net Cost Dialog */}
      {selectedBreakdown && (
        <NetCostDialog
          breakdown={selectedBreakdown}
          open={Boolean(selectedBreakdown)}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default PricingTable;
