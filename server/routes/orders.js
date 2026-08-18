const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/dashboard', auth, adminAuth, getDashboardStats);
router.get('/', auth, adminAuth, getAllOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
