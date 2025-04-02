import React, { useState } from 'react';
import './AddProductForm.css';

export default function AddProductForm({ onAdd, API_URL, token }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    
    //Add a specific product
    const addProduct = async () => {
        const numericPrice = parseFloat(price);
        if (!name || !description || isNaN(numericPrice)) return alert('Fill all fields correctly');
        try {
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price: numericPrice })
            });
            setName('');
            setDescription('');
            setPrice('');
            onAdd();
        } catch (err) {
        }
    };

    return (
        <div className="add-form">
            <h3>Add Product</h3>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={addProduct}>Add</button>
        </div>
    );
}
