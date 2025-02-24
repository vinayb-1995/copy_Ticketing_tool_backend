const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const adminmidelware=require('../authMiddleware/authMiddleware')
const upload = require('../authMiddleware/uploadMiddleware'); // Multer middleware

// Create a new ticket with image upload
router.post('/createTicket', upload.single('image'), ticketController.createTicket);
router.put('/assignTickets/:id', adminmidelware,ticketController.assignTickets);

// Other routes...

module.exports = router;
