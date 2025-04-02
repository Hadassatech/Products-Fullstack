import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ API_URL, token, setProducts, onReset }) {

    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('');

    // Function to perform product search using query and sort
    const searchProducts = async () => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (sortBy) params.append('sortBy', sortBy);

        try {
            const res = await fetch(`${API_URL}/products/search?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setProducts(data); 
        } catch {
            alert('Search failed');
        }
    };

    // Trigger search on Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    };

    return (
        <div className="search-bar">
            <input
                placeholder="Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="">Sort by</option>
                <option value="price">Price</option>
                <option value="date">Date</option>
            </select>
            <button onClick={searchProducts}>Search</button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
}
