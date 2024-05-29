// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the product!', error);
                setError('Failed to load product details. Please try again later.');
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
            <img 
                // src={`http://localhost:5000/${product.ProductImage}`} 
                alt={product.ProductName} 
                style={{ width: '300px', height: 'auto' }}
            />
            <p>Price: {product.Price} THB</p>
            <p>Description: {product.Description}</p>
        </div>
    );
};

export default ProductDetail;
