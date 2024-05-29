import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from './Api'; // Importing the custom api instance

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setError("Failed to load products. Please try again later.");
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Product List</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="product-container">
        {products.map((product) => (
          <div key={product.ProductID} className="product-card">
            <img
              src={`http://localhost:5000/uploads/${product.ProductImage}`}
              alt={product.ProductName}
              style={{
                maxWidth: "200px",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <Link to={`/product/${product.ProductID}`}>
              <h2>{product.ProductName}</h2>
            </Link>
            <p>{product.Price} THB</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
