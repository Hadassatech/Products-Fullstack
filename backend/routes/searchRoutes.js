const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

router.get('/', auth, searchController.search);

module.exports = router;
