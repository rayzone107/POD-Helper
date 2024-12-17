import React, { useState } from 'react';
import './VariantsTable.css';
import { Product } from 'shared/types/Product';

interface VariantsTableProps {
  product: Product;
}

const VariantsTable: React.FC<VariantsTableProps> = ({ product }) => {
  const [expandedSize, setExpandedSize] = useState<number | null>(null);

  return (
    <table className="variants-table">
      <thead>
        <tr>
          <th>Size</th>
          <th>Colors</th>
          <th>Cost</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {product.options
          ?.find((option) => option.type === 'size')
          ?.values.map((sizeOption) => {
            const sizeVariants = product.variants.filter(
              (variant) =>
                variant.options.includes(sizeOption.id) && variant.is_enabled
            );

            if (sizeVariants.length === 0) return null;

            const costRange = `${Math.min(...sizeVariants.map((v) => v.cost)) / 100} - ${
              Math.max(...sizeVariants.map((v) => v.cost)) / 100
            }`;
            const priceRange = `${Math.min(...sizeVariants.map((v) => v.price)) / 100} - ${
              Math.max(...sizeVariants.map((v) => v.price)) / 100
            }`;

            return (
              <React.Fragment key={sizeOption.id}>
                <tr
                  className="collapsible-row"
                  onClick={() =>
                    setExpandedSize((prev) =>
                      prev === sizeOption.id ? null : sizeOption.id
                    )
                  }
                >
                  <td>{sizeOption.title}</td>
                  <td>{sizeVariants.length}</td>
                  <td>${costRange}</td>
                  <td>${priceRange}</td>
                </tr>
                {expandedSize === sizeOption.id &&
                  sizeVariants.map((variant) => {
                    const colorId = variant.options.find((optionId) =>
                      product.options
                        .find((option) => option.type === 'color')
                        ?.values.some((value) => value.id === optionId)
                    );
                    const colorValue = product.options
                      .find((option) => option.type === 'color')
                      ?.values.find((value) => value.id === colorId);

                    return (
                      <tr key={variant.id} className="variant-row">
                        <td>{sizeOption.title}</td>
                        <td>
                          <div className="color-display">
                            <div
                              className="color-circle"
                              style={{
                                backgroundColor:
                                  colorValue?.colors?.[0] || '#cccccc',
                              }}
                            ></div>
                            <span>{colorValue?.title || 'Unknown'}</span>
                          </div>
                        </td>
                        <td>${(variant.cost / 100).toFixed(2)}</td>
                        <td>${(variant.price / 100).toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  );
};

export default VariantsTable;
