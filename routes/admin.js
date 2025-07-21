const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { getSlotsForUser, bookSlotForUser } = require('../controller/adminController');

router.get('/slots', auth, authorize('Admin'), getSlotsForUser);
router.post('/book', auth, authorize('Admin'), bookSlotForUser);

module.exports = router; 