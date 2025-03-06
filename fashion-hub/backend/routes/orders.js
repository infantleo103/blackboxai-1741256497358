const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orders');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/my', getOrders);
router.get('/:id', getOrder);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);
router.get('/stats/all', getOrderStats);

module.exports = router;
