import React from 'react';
import './ShippingTable.css';
import { ShippingProfile } from 'src/types';

interface ShippingTableProps {
  shippingInfo: ShippingProfile[];
}

const ShippingTable: React.FC<ShippingTableProps> = ({ shippingInfo }) => {
  return (
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
  );
};

export default ShippingTable;
