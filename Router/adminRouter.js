const express = require("express");
const router = express.Router();

//post method  to register and login post
const adminController = require("../controllers/adminController");

//authMiddleware get user data from token and validate the token
const authMiddleware = require("../authMiddleware/authMiddleware");

// Define the route for registering admin
router.route("/adminregister").post(adminController.register);
router.route("/adminlogin").post(adminController.login);


//get admin data
router.route("/admindata").get(authMiddleware, adminController.admin);

//get customer data
router.route("/allcustomersdata").get(authMiddleware, adminController.customersCollection);

router.route("/allagentsdata").get(authMiddleware, adminController.agentsCollection);
router.route("/agent/:id").get(authMiddleware, adminController.agentByID);

//two update agets it
router.route("/updateAgentByIdIt/:id").put(authMiddleware, adminController.updateAgentByIDIT);
//two update agent sap
router.route("/updateAgentByIdSap/:id").put(authMiddleware, adminController.updateAgentByIDSAP);

//to update agentAdmin IT 
router.route("/updateAdminAgentByIdIt").patch(authMiddleware, adminController.updateAgentAdminByIdIT);
router.route("/updateAdminAgentByIdSap").patch(authMiddleware, adminController.updateAgentAdminByIdSap);

//to update agentAdmin sap  


//get all tickets
router.route("/allTickets").get(authMiddleware, adminController.getAllTickets);

//get new tickets
router.route("/allTickets").get(authMiddleware, adminController.getAllTickets);
router.route("/tickets/:id").get(authMiddleware, adminController.getTicketById);

module.exports = router;
