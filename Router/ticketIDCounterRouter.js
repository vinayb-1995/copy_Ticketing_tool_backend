const express = require('express');
const router = express.Router();
const ticketCounter = require('../controllers/ticketIDCounterController');

// Define routes for IT and SAP ticket ID counters
router.post('/incrementIt', ticketCounter.generateITID);
router.post('/incrementSap', ticketCounter.generateSAPID);
router.post('/decrementIT', ticketCounter.decrementITID);
router.post('/decrementSAP', ticketCounter.decrementSAPID);

module.exports = router;
