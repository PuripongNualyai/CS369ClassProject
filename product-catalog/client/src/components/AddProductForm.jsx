import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const AddProductForm = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        ProductName: '',
        Price: '', 
        Description: '' 
    });
    const [picture, setPicture] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setPicture(file);
        } else {
            console.log('Please select an image file.');
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('ProductName', product.ProductName);
        formData.append('Price', product.Price);
        formData.append('Description', product.Description);
        formData.append('picture', picture);

        try {
            const response = await api.post('/insert', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                alert('Product added successfully');
                setProduct({
                    ProductName: '',
                    Price: '',
                    Description: ''
                });
                setPicture(null);
                navigate('/ProductList');
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('There was an error adding the product:', error);
            setError('Failed to add product. Please try again.');
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Add Product</h1>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '300px' }}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <input 
                        type="text" 
                        name="ProductName" 
                        value={product.ProductName} 
                        onChange={handleChange} 
                        placeholder="Product Name" 
                        required 
                        className="form-input" 
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        name="picture" 
                        onChange={handleImageChange} 
                        required 
                        className="form-input" 
                    />
                    <input 
                        type="number" 
                        name="Price" 
                        value={product.Price} 
                        onChange={handleChange} 
                        placeholder="Product Price" 
                        required 
                        className="form-input" 
                    />
                    <textarea 
                        name="Description" 
                        value={product.Description} 
                        onChange={handleChange} 
                        placeholder="Product Description" 
                        required 
                        className="form-input" 
                    />
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
