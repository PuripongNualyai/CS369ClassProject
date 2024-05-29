// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated }) => {
    return (
        <nav>
            <ul>
                {!isAuthenticated && <li><Link to="/">Login</Link></li>}
                {isAuthenticated && <li><Link to="/productList">Product List</Link></li>}
                {isAuthenticated && <li><Link to="/manage-products">Manage Products</Link></li>}
                {isAuthenticated && <li><Link to="/add-product">Add Product</Link></li>}
            </ul>
        </nav>
    );
};

export default Navbar;

