import React, { useState } from 'react';
import { Product } from 'shared/types/Product';
import './VariantsTable.css';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface VariantsTableProps {
  product: Product;
  updatedPrices: Record<string, number>;
}

const VariantsTable: React.FC<VariantsTableProps> = ({ product, updatedPrices }) => {
  const { sizeMap, colorMap } = mapOptions(product);
  const [expandedSize, setExpandedSize] = useState<number | null>(null);

  // Group enabled variants by size
  const groupBySize = product.variants
    .filter((variant) => variant.is_enabled) // Only include enabled variants
    .reduce((acc, variant) => {
      const sizeId = variant.options.find((id) => sizeMap[id]);
      if (!sizeId) return acc; // Skip if sizeId is not found
      if (!acc[sizeId]) acc[sizeId] = [];
      acc[sizeId].push(variant);
      return acc;
    }, {} as Record<number, typeof product.variants>);

  const calculateRange = (variants: typeof product.variants, field: 'cost' | 'price' | 'updatedPrice') => {
    const values = variants.map((v) => {
      if (field === 'updatedPrice') {
        return updatedPrices[v.id] || 0;
      }
      return v[field] / 100;
    });

    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);

    // If min and max are the same, return a single value
    return min === max ? `${min}` : `${min} - ${max}`;
  };

  return (
    <div className="variants-section">
      <h2 className="variants-title">Variants</h2>
      <table className="variants-table">
        <thead>
          <tr className="table-header">
            <th>Size</th>
            <th>Color</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Updated Price</th>
            <th></th> {/* Placeholder for the arrow icon */}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupBySize).map(([sizeId, variants]) => {
            const sizeName = sizeMap[Number(sizeId)] || 'Unknown Size';
            const costRange = calculateRange(variants, 'cost');
            const priceRange = calculateRange(variants, 'price');
            const updatedPriceRange = calculateRange(variants, 'updatedPrice');

            return (
              <React.Fragment key={sizeId}>
                {/* Summary Row */}
                <tr
                  className={`summary-row ${expandedSize === Number(sizeId) ? 'expanded' : ''}`}
                  onClick={() => setExpandedSize(expandedSize === Number(sizeId) ? null : Number(sizeId))}
                >
                  <td>{sizeName}</td>
                  <td>{variants.length} colors</td>
                  <td>${costRange}</td>
                  <td>${priceRange}</td>
                  <td>${updatedPriceRange}</td>
                  <td className="arrow-cell">
                    {expandedSize === Number(sizeId) ? <ExpandLess /> : <ExpandMore />}
                  </td>
                </tr>

                {/* Expanded Rows for Variants */}
                {expandedSize === Number(sizeId) &&
                  variants.map((variant) => {
                    const color = colorMap[variant.options.find((id) => colorMap[id]) || -1] || {
                      title: 'Unknown',
                      code: '#ccc',
                    };

                    return (
                      <tr key={variant.id} className="child-row">
                        <td>{sizeName}</td>
                        <td>
                          <div className="color-display">
                            <div
                              className="color-circle"
                              style={{ backgroundColor: color.code }}
                            ></div>
                            {color.title}
                          </div>
                        </td>
                        <td>${(variant.cost / 100).toFixed(2)}</td>
                        <td>${(variant.price / 100).toFixed(2)}</td>
                        <td>${updatedPrices[variant.id]?.toFixed(2) || '-'}</td>
                        <td></td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Helper to map sizes and colors
const mapOptions = (product: Product) => {
  const sizeMap: Record<number, string> = {};
  const colorMap: Record<number, { title: string; code: string }> = {};

  product.options.forEach((option) => {
    if (option.type === 'size') {
      option.values.forEach((size) => {
        sizeMap[size.id] = size.title;
      });
    } else if (option.type === 'color') {
      option.values.forEach((color) => {
        colorMap[color.id] = { title: color.title, code: color.colors?.[0] || '#ccc' };
      });
    }
  });

  return { sizeMap, colorMap };
};

export default VariantsTable;
