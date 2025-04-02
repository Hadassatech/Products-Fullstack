const { getDB } = require('../config/database');
const { client } = require('../config/elasticsearch');
const Product = require('../models/Product');

// GET all products for the logged-in user
exports.getAllProducts = async (req, res) => {
    try {
        const db = getDB();
        const userId = req.user.id;
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const [rows] = await db.query(
            'SELECT * FROM products WHERE user_id = ? LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );
        const products = rows.map(
            row => new Product(row.id, row.name, row.description, row.price, row.created_at, row.user_id)
        );
        res.json(products);
    } catch (err) {
        console.error('getAllProducts error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST create new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const userId = req.user.id;
        const db = getDB();
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            return res.status(400).json({ message: 'Invalid price value' });
        }
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, created_at, user_id) VALUES (?, ?, ?, NOW(), ?)',
            [name, description, numericPrice, userId]
        );
        const newProduct = new Product(result.insertId, name, description, numericPrice, new Date(), userId);
        await client.index({
            index: 'products',
            id: String(result.insertId),
            document: newProduct
        });
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('createProduct error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const db = getDB();
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            return res.status(400).json({ message: 'Invalid price value' });
        }
        await db.execute(
            'UPDATE products SET name=?, description=?, price=? WHERE id=?',
            [name, description, numericPrice, id]
        );
        await client.update({
            index: 'products',
            id,
            doc: { name, description, price: numericPrice }
        });
        res.json({ message: 'Product updated' });
    } catch (err) {
        console.error('updateProduct error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        const exists = await client.exists({
            index: 'products',
            id: String(id)
        });
        if (exists) {
            await client.delete({ index: 'products', id: String(id) });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error('deleteProduct error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// SEARCH products for current user
exports.searchProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const { q, minPrice, maxPrice, sortBy } = req.query;
        const must = [{ match: { user_id: userId } }];
        if (q) {
            must.push({
                multi_match: {
                    query: q,
                    fields: ['name', 'description'],
                    fuzziness: 'auto'
                }
            });
        }
        const filter = [];
        if (minPrice || maxPrice) {
            const range = {};
            if (minPrice) range.gte = parseFloat(minPrice);
            if (maxPrice) range.lte = parseFloat(maxPrice);
            filter.push({ range: { price: range } });
        }
        const body = {
            query: {
                bool: {
                    must,
                    filter
                }
            },
            sort: []
        };
        if (sortBy === 'price') body.sort.push({ price: 'asc' });
        if (sortBy === 'date') body.sort.push({ created_at: 'desc' });
        const { hits } = await client.search({ index: 'products', body });
        const results = hits.hits.map(hit => hit._source);
        res.json(results);
    } catch (err) {
        console.error('searchProducts error:', err);
        res.status(500).json({ message: 'Search error' });
    }
};
