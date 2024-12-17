import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../utils/endpoints/endpoints';
import { Product } from 'shared/types/Product';
import './ProductDetail.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { ShippingProfile } from 'src/types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSize, setExpandedSize] = useState<number | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingProfile[] | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(ENDPOINTS.PRODUCT_DETAILS(id!));
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details: ' + err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      if (!product) return;
  
      try {
        const response = await axios.get<{ profiles: ShippingProfile[] }>(
          `${ENDPOINTS.SHIPPING_INFO(product.blueprint_id, product.print_provider_id)}`
        );
        setShippingInfo(response.data.profiles);
      } catch (err) {
        setShippingError('Failed to fetch shipping info: ' + err);
      }
    };
  
    if (product) fetchShippingInfo();
  }, [product]);  

  if (loading) return <div className="loader"></div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found!</div>;

  return (
    <div className="product-detail">
      <div className="back-button" onClick={() => navigate(-1)}>
        <ArrowBack />
        <span>Back to all products</span>
      </div>

      {/* Product Title */}
      <h1 className="product-title">{product.title}</h1>

      {/* Image Carousel */}
      <Carousel
        showDots
        arrows
        responsive={{
          superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
          desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
          tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
          mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
        }}
        containerClass="carousel-container"
        itemClass="carousel-item"
      >
        {product.images.map((image, index) => (
          <div className="carousel-image-wrapper" key={index}>
            <img
              src={image.src}
              alt={`Product Image ${index + 1}`}
              className="product-carousel-image"
            />
          </div>
        ))}
      </Carousel>

      {/* Product Description - Full Content */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="description-content"
          id="description-header"
        >
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Description
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
            {product.description}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Blueprint and Print Provider IDs */}
      <div className="product-meta">
        <p>
          <strong>Blueprint ID:</strong> {product.blueprint_id}
        </p>
        <p>
          <strong>Print Provider ID:</strong> {product.print_provider_id}
        </p>
      </div>

      {/* Shipping Info */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="shipping-info-content"
          id="shipping-info-header"
        >
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Shipping Info
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {shippingInfo && shippingInfo.length > 0 ? (
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
          ) : (
            <Typography>No shipping information available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Variants Table */}
      <h2>Variants</h2>
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
      <div className="bottom-margin"></div>
    </div>
  );
};

export default ProductDetail;
