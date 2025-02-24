const express = require('express');
const router = express.Router();
const agnetController = require('../controllers/agentController'); // Update the path if necessary
const agentAuthMiddleware=require('../authMiddleware/agentAuthMiddleware')

// agents registration route
router.post('/agentregister', agnetController.register);
//agents login
router.post('/agentlogin', agnetController.login);

//get agents data
router.route("/agentdata").get(agentAuthMiddleware, agnetController.agent);

//get get agents ALL tickets
router.route("/agentAllTickets").get(agentAuthMiddleware, agnetController.getAgentAllTickets);


//get customerDetails of customer
// router.route("/:customerId").get(customerAuthMiddleware, customerController.getCustomerWithAdminDetails);
// router.get('/:customerId', customerController.getCustomerWithAdminDetails);

module.exports = router;

