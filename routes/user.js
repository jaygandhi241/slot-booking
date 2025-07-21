const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { addAvailability } = require('../controller/userController');


router.post('/availability', auth, authorize('User'), addAvailability);

module.exports = router; 