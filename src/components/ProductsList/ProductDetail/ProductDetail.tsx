import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../utils/endpoints/endpoints';
import { Product } from 'shared/types/Product';
import './ProductDetail.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import {
  ArrowBack,
  ExpandMore,
} from '@mui/icons-material';
import {
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ShippingProfile } from 'src/types';
import ShippingTable from './components/ShippingTable/ShippingTable';
import VariantsTable from './components/VariantsTable/VariantsTable';
import { fetchSettings } from '../../../services/settingsService';
import {
  calculateEtsyPrice,
  calculateEtsyPriceWithoutProfit,
} from '../../../services/pricingCalculatorService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingProfile[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Configurable pricing values
  const [profitPercentage, setProfitPercentage] = useState<number>(10);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [updatedPrices, setUpdatedPrices] = useState<Record<string, number>>({});
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [smallestSizeName, setSmallestSizeName] = useState<string>('');

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

        const smallestSize = productRes.data.options.find((o) => o.type === 'size')?.values[0];
        if (smallestSize) {
          setSmallestSizeName(smallestSize.title);

          const enabledVariants = productRes.data.variants.filter(
            (v) => v.options.includes(smallestSize.id) && v.is_enabled
          );
          if (enabledVariants.length > 0) {
            setSelectedColor(enabledVariants[0].options[1]?.toString() || '');
          }
        }
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

    const groupBySize: Record<string, typeof product.variants> = product.variants
      .filter((v) => v.is_enabled)
      .reduce((acc, variant) => {
        const sizeId = variant.options[0].toString();
        if (!acc[sizeId]) acc[sizeId] = [];
        acc[sizeId].push(variant);
        return acc;
      }, {} as Record<string, typeof product.variants>);

    Object.values(groupBySize).forEach((variants) => {
      let maxPrice = 0;
      variants.forEach((variant) => {
        const productionCost = variant.cost / 100;
        const { finalPrice } = calculateEtsyPrice(
          productionCost,
          profitPercentage,
          discountPercentage,
          false,
          true,
          usShippingCost / 100
        );
        prices[variant.id] = finalPrice;
        if (finalPrice > maxPrice) maxPrice = finalPrice;
      });

      variants.forEach((variant) => (prices[variant.id] = maxPrice));
    });

    if (selectedColor) {
      const selectedVariant = product.variants.find(
        (v) => v.options[1]?.toString() === selectedColor
      );
      if (selectedVariant) {
        const productionCost = selectedVariant.cost / 100;
        const { finalPrice } = calculateEtsyPriceWithoutProfit(
          productionCost,
          discountPercentage,
          false,
          true,
          usShippingCost / 100
        );
        prices[selectedVariant.id] = finalPrice;
      }
    }

    setUpdatedPrices(prices);
  };

  const handleSavePricesToPrintify = async () => {
    if (!product) return;
  
    try {
      setIsUpdating(true); // Show the blocking loader
  
      const updatedVariants = product.variants.map((variant) => {
        if (variant.is_enabled && updatedPrices[variant.id] && updatedPrices[variant.id] !== variant.price / 100) {
          return {
            ...variant,
            price: Math.round(updatedPrices[variant.id] * 100),
          };
        }
        return variant;
      });
  
      await axios.put(`${ENDPOINTS.PRODUCT_DETAILS(product.id)}`, { variants: updatedVariants });
  
      // Show success toast
      setSnackbarMessage('Prices updated successfully on Printify!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating prices on Printify:', error);
  
      // Show error toast
      setSnackbarMessage('Failed to update prices. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsUpdating(false); // Hide the loader
    }
  };  

  if (loading) return <div className="loader"></div>;
  if (error) return <div>Error: {error}</div>;

  const smallestSizeId = product?.options
    .find((o) => o.type === 'size')
    ?.values[0]?.id;

  const enabledVariantsForSmallestSize = product?.variants.filter(
    (v) => smallestSizeId !== undefined && v.options.includes(smallestSizeId) && v.is_enabled
  );

  return (
    <div className="product-detail">
      <div className="back-button" onClick={() => navigate(-1)}>
        <ArrowBack />
        <span>Back to all products</span>
      </div>

      <h1 className="product-title">{product?.title}</h1>

      {/* Carousel */}
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

      {/* Description Accordion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
            {product?.description}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Shipping Table */}
      <ShippingTable shippingInfo={shippingInfo || []} />

      {/* Pricing Configuration */}
      <div className="pricing-configurations">
        <Typography variant="h6" className="config-title">
          Pricing Configuration
        </Typography>
        <Typography variant="subtitle1">
          Select no profit variant for size {smallestSizeName}
        </Typography>
        <div className="config-inputs">
          <TextField
            label="Profit Percentage"
            type="number"
            variant="outlined"
            value={profitPercentage}
            onChange={(e) => setProfitPercentage(Number(e.target.value))}
            size="small"
          />
          <TextField
            label="Discount Percentage"
            type="number"
            variant="outlined"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            size="small"
          />
          <Select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value as string)}
            size="small"
          >
            {enabledVariantsForSmallestSize?.map((variant) => {
              const colorTitle = product?.options
                .find((o) => o.type === 'color')
                ?.values.find((c) => c.id === variant.options[1])?.title;
              return (
                <MenuItem key={variant.id} value={variant.options[1]?.toString()}>
                  {colorTitle || 'Unknown Color'}
                </MenuItem>
              );
            })}
          </Select>
          <Button variant="contained" color="primary" onClick={handleCalculatePrices}>
            Calculate Price
          </Button>
        </div>
      </div>

      {/* Variants Table */}
      <VariantsTable product={product!} updatedPrices={updatedPrices} />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSavePricesToPrintify}
        style={{ marginTop: '20px' }}
      >
        Save Prices to Printify
      </Button>

      {isUpdating && (
        <div className="blocking-overlay">
          <div className="loader-content">
            <CircularProgress size={60} />
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Updating Product on Printify
            </Typography>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          elevation={6}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
          <div className="snackbar-progress">
            <div className="snackbar-progress-bar"></div>
          </div>
        </Alert>
      </Snackbar>

    </div>
  );
};

export default ProductDetail;
