// src/components/ManageProducts.js
import React, { useState, useEffect } from 'react';
import api from './Api'; // Importing the custom api instance
import '../styles/App.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        api.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    };

    const deleteProduct = (id) => {
        api.delete(`/api/products/${id}`)
            .then(response => {
                alert('Product deleted successfully');
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error deleting the product!', error);
            });
    };

    return (
        <div>
            <h1>Manage Products</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.ProductID}>
                            <td>{product.ProductID}</td>
                            <td>{product.ProductName}</td>
                            <td>{product.ProductPrice} THB</td>
                            <td>
                                <button onClick={() => deleteProduct(product.ProductID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;
