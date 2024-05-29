// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add-product">Add Product</Link></li>
                <li><Link to="/manage-products">Manage Products</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
