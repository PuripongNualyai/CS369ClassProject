// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AddProductForm from './components/AddProductForm';
import ManageProducts from './components/ManageProducts';
import './styles/App.css'; // นำเข้าไฟล์ CSS

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/productList" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/add-product" element={<AddProductForm />} />
                <Route path="/manage-products" element={<ManageProducts />} />
            </Routes>
        </Router>
    );
};

export default App;
