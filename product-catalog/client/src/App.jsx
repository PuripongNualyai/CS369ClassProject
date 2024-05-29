// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AddProductForm from "./components/AddProductForm";
import ManageProducts from "./components/ManageProducts";
import "./styles/App.css";
import Header from "./components/Header";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && (
        <>
          <Header title={"CS369 STORE"} />
          <Navbar isAuthenticated={isAuthenticated} />
        </>
      )}
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/productlist" // เปลี่ยนเส้นทางจาก /home เป็น /productlist
          element={isAuthenticated ? <ProductList /> : <Navigate to="/" />}
        />
        <Route
          path="/product/:id"
          element={isAuthenticated ? <ProductDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/add-product"
          element={isAuthenticated ? <AddProductForm /> : <Navigate to="/" />}
        />
        <Route
          path="/manage-products"
          element={isAuthenticated ? <ManageProducts /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
