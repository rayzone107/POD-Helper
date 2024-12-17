import React from 'react';
import { ShippingProfile } from 'src/types';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ShippingTableProps {
  shippingInfo?: ShippingProfile[];
}

const ShippingTable: React.FC<ShippingTableProps> = ({ shippingInfo = [] }) => {
  if (shippingInfo.length === 0) {
    return <p>No shipping information available.</p>;
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="shipping-content" id="shipping-header">
        <Typography variant="h6">Shipping Info</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table className="shipping-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {shippingInfo.map((profile, index) => (
              <tr key={index}>
                <td>{profile.countries.join(', ').replace(/_/g, ' ')}</td>
                <td>
                  ${profile.first_item.cost / 100} (First Item), $
                  {profile.additional_items.cost / 100} (Additional Items)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
};

export default ShippingTable;
