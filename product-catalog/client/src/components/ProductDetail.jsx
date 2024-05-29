import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from './Api'; // Importing the custom api instance

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
        setError("Failed to load product details. Please try again later.");
      });
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.ProductName}</h1>
      <div className="product-detail-container">
        <div className="product-detail-content">
          <br />
          <img
            src={`http://localhost:5000/uploads/${product.ProductImage}`}
            alt={product.ProductName}
          />
          <p>Price: {product.Price} THB</p>
          <p>{product.Description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
