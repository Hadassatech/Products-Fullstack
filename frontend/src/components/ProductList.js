import React from 'react';
import Product from './Product';
import UpdateProductModal from './UpdateProductModal';
import './ProductList.css';

export default function ProductList({ products, onDelete, selectedProduct, setSelectedProduct, token, API_URL, onUpdated }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <Product
          key={product.id}
          product={product}
          onDelete={onDelete}
          onEdit={() => setSelectedProduct(product)}
        />
      ))}
      {selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          token={token}
          API_URL={API_URL}
          onClose={() => setSelectedProduct(null)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}
