const express = require('express');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', searchController.search);

module.exports = router;