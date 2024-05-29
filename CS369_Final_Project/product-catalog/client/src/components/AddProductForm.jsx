import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        formData.append('picture', picture); // Only append the actual file here

        try {
            const response = await axios.post('http://localhost:5000/insert', formData, {
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
                navigate('/');
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('There was an error adding the product:', error);
            setError('Failed to add product. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            {error && <div className="alert alert-danger">{error}</div>}
            <input type="text" name="ProductName" value={product.ProductName} onChange={handleChange} placeholder="Product Name" required />
            <input type="file" accept="image/*" name="picture" onChange={handleImageChange} required />
            <input type="number" name="Price" value={product.Price} onChange={handleChange} placeholder="Product Price" required />
            <textarea name="Description" value={product.Description} onChange={handleChange} placeholder="Product Description" required />
            <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
    );
};

export default AddProductForm;
