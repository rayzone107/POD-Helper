// React and Core Imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Third-Party Libraries
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

// Shared Types and Utilities
import { ENDPOINTS } from 'src/utils/endpoints/endpoints';
import { Product } from 'shared/types/Product';
import { ShippingProfile } from 'src/types';

// Local Components
import ShippingTable from './components/ShippingTable/ShippingTable';
import VariantsTable from './components/VariantsTable/VariantsTable';

// Styles
import './ProductDetail.css';

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
            <ShippingTable shippingInfo={shippingInfo} />
          ) : (
            <Typography>No shipping information available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Variants Table */}
      <h2>Variants</h2>
      <VariantsTable product={product} />
    </div>
  );
};

export default ProductDetail;
