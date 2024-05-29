import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
                setError('Failed to load products. Please try again later.');
            });
    }, []);

    return (
        <div>
            <h1>Product List</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {products.map(product => (
                    <div key={product.ProductID} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
                        <Link to={`/product/${product.ProductID}`}>
                            <img
                                src={`http://localhost:5000/uploads/${product.ProductImage}`}
                                alt={product.ProductName}
                                style={{width: '100px', height: '100px', objectFit: 'cover'}}
                            />
                            <h2>{product.ProductName}</h2>
                            <p>{product.Price} THB</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
