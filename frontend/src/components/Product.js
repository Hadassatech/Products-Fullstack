import React from 'react';
import './Product.css';

export default function Product({ product, onDelete, onEdit }) {
  return (
    <div className="product-item">
      <b>{product.name}</b> - {product.description} - ${product.price}
      <div className="product-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={() => onDelete(product.id)}>Delete</button>
      </div>
    </div>
  );
}
