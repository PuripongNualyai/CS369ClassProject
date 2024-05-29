// Header.js
import React from 'react';
import Navbar from './Navbar'; // Import Navbar component

const Header = ({ title }) => {
    return (
        <header className="header">
            <div className="header-title">{title}</div>
        </header>
    );
};


export default Header;
