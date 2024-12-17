import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../utils/endpoints/endpoints';
import { Product } from 'shared/types/Product';
import './ProductDetail.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ShippingProfile } from 'src/types';
import ShippingTable from './components/ShippingTable/ShippingTable';
import VariantsTable from './components/VariantsTable/VariantsTable';
import { fetchSettings } from '../../../services/settingsService';
import { calculateEtsyPrice } from '../../../services/pricingCalculatorService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingProfile[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Configurable pricing values
  const [profitPercentage, setProfitPercentage] = useState<number>(10);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [updatedPrices, setUpdatedPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          axios.get<Product>(ENDPOINTS.PRODUCT_DETAILS(id!)),
          fetchSettings(),
        ]);

        setProduct(productRes.data);
        setProfitPercentage(settingsRes.defaultProfitPercentage);
        setDiscountPercentage(settingsRes.defaultEtsySalePercentage);

        const response = await axios.get<ShippingProfile[]>(
          `${ENDPOINTS.SHIPPING_INFO(productRes.data.blueprint_id, productRes.data.print_provider_id)}`
        );
        setShippingInfo(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCalculatePrices = () => {
    if (!product || !shippingInfo) return;

    const usShippingCost = Math.max(
      ...shippingInfo
        .filter((profile) => profile.countries.includes('US'))
        .map((profile) => profile.first_item.cost)
    );

    const prices: Record<string, number> = {};

    product.variants.forEach((variant) => {
      const productionCost = variant.cost / 100;

      const { finalPrice } = calculateEtsyPrice(
        productionCost,
        profitPercentage,
        discountPercentage,
        false, // runAds
        true, // freeShipping
        usShippingCost / 100
      );

      prices[variant.id] = finalPrice;
    });

    setUpdatedPrices(prices);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-detail">
      <div className="back-button" onClick={() => navigate(-1)}>
        <ArrowBack />
        <span>Back to all products</span>
      </div>

      <h1 className="product-title">{product?.title}</h1>

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
        {product?.images.map((image, index) => (
          <div className="carousel-image-wrapper" key={index}>
            <img src={image.src} alt={`Product Image ${index + 1}`} className="product-carousel-image" />
          </div>
        ))}
      </Carousel>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="description-content" id="description-header">
          <Typography variant="h6">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>{product?.description}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Shipping Table */}
      <ShippingTable shippingInfo={shippingInfo || []} />

      {/* Pricing Configuration */}
      <div className="pricing-configurations">
        <Typography variant="h6" className="config-title"
          sx={{ marginBottom: '20px', marginTop: '40px' }}>
          Pricing Configuration
        </Typography>
        <div className="config-inputs">
          <TextField
            label="Profit Percentage"
            type="number"
            variant="outlined"
            value={profitPercentage}
            onChange={(e) => setProfitPercentage(Number(e.target.value))}
            size="small"
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Discount Percentage"
            type="number"
            variant="outlined"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            size="small"
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleCalculatePrices}>
            Calculate Price
          </Button>
        </div>
      </div>

      {/* Variants Table */}
      <VariantsTable product={product!} updatedPrices={updatedPrices} />

      <div className="bottom-margin"></div>
    </div>
  );
};

export default ProductDetail;
