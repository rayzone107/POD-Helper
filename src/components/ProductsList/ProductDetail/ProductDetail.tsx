import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../../utils/endpoints/endpoints';
import { Product } from 'shared/types/Product';
import './ProductDetail.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { ArrowBack, ExpandMore } from '@mui/icons-material';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSize, setExpandedSize] = useState<number | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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

      {/* Product Description */}
      <div className="product-description-container">
        <div
          className="description-header"
          onClick={() => setDescriptionExpanded((prev) => !prev)}
        >
          <h2>Description</h2>
          <ExpandMore
            className={`expand-icon ${
              descriptionExpanded ? 'expanded' : ''
            }`}
          />
        </div>
        {descriptionExpanded && (
          <p className="product-description">{product.description}</p>
        )}
      </div>

      {/* Blueprint and Print Provider IDs */}
      <div className="product-meta">
        <p>
          <strong>Blueprint ID:</strong> {product.blueprint_id}
        </p>
        <p>
          <strong>Print Provider ID:</strong> {product.print_provider_id}
        </p>
      </div>

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
