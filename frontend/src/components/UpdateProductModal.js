import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './UpdateProductModal.css';

export default function UpdateProductModal({ product, onClose, onUpdated, token, API_URL }) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);

    // Update a specific product by ID
    const update = async () => {
        try {
            await fetch(`${API_URL}/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price })
            });
            onUpdated();
            onClose();
        } catch {
            alert('Update failed');
        }
    };

    return (
        <Dialog.Root open={true} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Dialog.Title>Update Product</Dialog.Title>
                    <input value={name} onChange={e => setName(e.target.value)} />
                    <input value={description} onChange={e => setDescription(e.target.value)} />
                    <input value={price} onChange={e => setPrice(e.target.value)} />
                    <div style={{ marginTop: '1em', position: 'relative', right: '1em' }}>
                        <button onClick={update}>Update</button>
                        <button onClick={onClose} className="close">Cancel</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
