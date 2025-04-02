import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProductForm from './AddProductForm';
import SearchBar from './SearchBar';
import ProductList from './ProductList';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Logout the user and redirect to login page
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/'); 
  };

  // Fetch products belonging to the current user
  const fetchProducts = async () => {
    if (!token) return alert('Login required');
    try {
      const res = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to load products');
    }
  };

  // Delete a specific product by ID
  const deleteProduct = async (id) => {
    if (!token) return alert('Login required');
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <button onClick={logout} className="logout">Logout</button>
      <h2>Hello {username ? `, ${username}` : ''}</h2>
      <SearchBar
        API_URL={API_URL}
        token={token}
        setProducts={setProducts}
        onReset={fetchProducts}
      />
      <AddProductForm
        onAdd={fetchProducts}
        API_URL={API_URL}
        token={token}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      <ProductList
        products={products}
        onDelete={deleteProduct}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        token={token}
        API_URL={API_URL}
        onUpdated={fetchProducts}
      />
    </div>
  );
}
