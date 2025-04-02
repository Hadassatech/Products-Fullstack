const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

router.get('/', auth, productController.getAllProducts);
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.get('/search', auth, productController.searchProducts);

module.exports = router;
