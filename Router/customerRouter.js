const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); // Update the path if necessary
const customerAuthMiddleware=require('../authMiddleware/customerAuthMiddleware')

// Customer registration route
router.post('/customerregister', customerController.register);
//customer login
router.post('/customerlogin', customerController.login);

//get customer data
router.route("/customerdata").get(customerAuthMiddleware, customerController.customer);

//get get tickets
router.route("/cutomerAllTickets").get(customerAuthMiddleware, customerController.getcustomerAllTickets);

//get customerDetails of customer
// router.route("/:customerId").get(customerAuthMiddleware, customerController.getCustomerWithAdminDetails);
// router.get('/:customerId', customerController.getCustomerWithAdminDetails);

module.exports = router;
