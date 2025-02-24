const express = require("express");
const Admin = require("../model/adminModel");
const Customer = require("../model/customerModel");
const Agents = require("../model/agentModel");
const Tickets = require("../model/ticketModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types; // Import ObjectId from mongoose

/* Admin registration */
const register = async (req, res) => {
  try {
    const { user_unique_ID, username, email, password, role } = req.body;
    const adminExist = await Admin.findOne({ email: email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const adminCreated = await Admin.create({
      user_unique_ID: email,
      username,
      email,
      password,
      role,
    });
    return res
      .status(201)
      .json({ message: "Admin created successfully", admin: adminCreated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* Admin login */
const login = async (req, res) => {
  try {
    const { user_unique_ID: email, password } = req.body;
    // console.log('uniqueid',user_unique_ID,password)
    const adminExist = await Admin.findOne({ email }); // Corrected variable name
    if (!adminExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(password, adminExist.password); // Corrected variable name
    if (isPasswordMatch) {
      const token = adminExist.generateAuthToken(); // Corrected variable name
      return res.status(200).json({
        message: "Login successful",
        token,
        userID: adminExist._id.toString(),
        role: adminExist.role,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//to send admin data - admin Login:
const admin = async (req, res) => {
  try {
    const adminData = req.user;
    // console.log(adminData)
    return res.status(200).json({ adminBody: adminData });
  } catch (error) {
    // console.log(`error form the user route ${error}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//to send all customers data for customers collection filter by admin id
const customersCollection = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    const allCustomers = await Customer.find({ createdByAdmin: req.adminId });
    if (!allCustomers || allCustomers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }
    // console.log("Sending response with customer data", allCustomers);
    return res.status(200).json(allCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    if (!res.headersSent) {
      // Check headers
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
};

//to send all agent data for agents collection filter by admin id
const agentsCollection = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    const allAgents = await Agents.find({ createdByAdmin: req.adminId });
    // console.log("llagents>>",allAgents)
    if (!allAgents || allAgents.length === 0) {
      return res.status(404).json({ message: "No Agents found" });
    }
    // console.log("Sending response with agents data", allAgents);
    return res.status(200).json(allAgents);
  } catch (error) {
    console.error("Error fetching Agents:", error);
    if (!res.headersSent) {
      // Check headers
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
};

// to get agent by ID:
const agentByID = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    const { id } = req.params; // Destructure `id` from `req.params`
    if (!id) {
      console.error("Agent ID not provided");
      return res.status(404).json({ message: "Agent not found" });
    }
    const agent = await Agents.findOne({ user_unique_ID: id, createdByAdmin: req.adminId });
    // console.log("agent>>",agent)
    if (!agent) {
      console.error("Agent not found");
      return res.status(404).json({ message: "Agent not found" });
    }
    // console.log("Agent by ID:", agent);
    return res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching Agent:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// update agent by ID for IT:
const updateAgentByIDIT = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }

    const { id } = req.params;
    if (!id) {
      console.error("Agent ID not provided");
      return res.status(404).json({ message: "Agent not found" });
    }

    // Fetch the agent document by user_unique_ID and createdByAdmin
    const agent = await Agents.findOne({ user_unique_ID: id, createdByAdmin: req.adminId,department:"IT" });
    // console.log(agent)
    if (!agent) {
      console.error("Agent not found");
      return res.status(404).json({ message: "Agent not found" });
    }

    // Destructure fields from the request body (only agentAdminIT and agentAdminSAP)
    const { agentAdminIT, agentAdminSAP } = req.body;

    // Set default values for fields that are not provided in the request
    const updateFields = {};

    // If 'agentAdminIT' is provided in the request body, update it; otherwise, keep it false (default)
    updateFields.agentAdminIT = agentAdminIT !== undefined ? agentAdminIT : agent.agentAdminIT;

    // If 'agentAdminSAP' is provided in the request body, update it; otherwise, keep it false (default)
    updateFields.agentAdminSAP = false

    // Perform the update
    const updatedAgent = await Agents.updateOne(
      { user_unique_ID: id, createdByAdmin: req.adminId },
      { $set: updateFields }
    );

    // If no fields were modified, return the current agent data (no change)
    if (updatedAgent.nModified === 0) {
      return res.status(200).json(agent);
    }

    // Fetch the updated agent data and return it
    const updatedAgentDetails = await Agents.findOne({ user_unique_ID: id, createdByAdmin: req.adminId });
    return res.status(200).json(updatedAgentDetails);

  } catch (error) {
    console.error("Error updating Agent:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update agent by ID for SAP:
const updateAgentByIDSAP = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }

    const { id } = req.params;
    if (!id) {
      console.error("Agent ID not provided");
      return res.status(404).json({ message: "Agent not found" });
    }

    // Fetch the agent document by user_unique_ID and createdByAdmin
    const agent = await Agents.findOne({ user_unique_ID: id, createdByAdmin: req.adminId,department:"SAP" });
    // console.log(agent)
    if (!agent) {
      console.error("Agent not found");
      return res.status(404).json({ message: "Agent not found" });
    }

    // Destructure fields from the request body (only agentAdminIT and agentAdminSAP)
    const { agentAdminIT, agentAdminSAP } = req.body;

    // Set default values for fields that are not provided in the request
    const updateFields = {};

    // If 'agentAdminIT' is provided in the request body, update it; otherwise, keep it false (default)
    updateFields.agentAdminIT = false;

    // If 'agentAdminSAP' is provided in the request body, update it; otherwise, keep it false (default)
    updateFields.agentAdminSAP = agentAdminSAP !== undefined ? agentAdminSAP :agent.agentAdminSAP;

    // Perform the update
    const updatedAgent = await Agents.updateOne(
      { user_unique_ID: id, createdByAdmin: req.adminId },
      { $set: updateFields }
    );

    // If no fields were modified, return the current agent data (no change)
    if (updatedAgent.nModified === 0) {
      return res.status(200).json(agent);
    }

    // Fetch the updated agent data and return it
    const updatedAgentDetails = await Agents.findOne({ user_unique_ID: id, createdByAdmin: req.adminId });
    return res.status(200).json(updatedAgentDetails);

  } catch (error) {
    console.error("Error updating Agent:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update agent admin by ID for IT agentAdminIT: false:
const updateAgentAdminByIdIT = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }

    // Retrieve agents with agentAdminIT true created by this admin
    const allAgents = await Agents.find({ createdByAdmin: req.adminId, agentAdminIT: true });
    // console.log("allAgents>>", allAgents);

    if (!allAgents || allAgents.length === 0) {
      return res.status(404).json({ message: "No Agents found" });
    }

    // Update `agentAdminIT` field only if specified as false in req.body
    const updatedAgents = [];
    for (const agent of allAgents) {
      if (req.body.agentAdminIT === false) {
        agent.agentAdminIT = false;
        await agent.save();
        updatedAgents.push(agent);
      }
    }

    // Return updated agents if any were modified
    if (updatedAgents.length > 0) {
      return res.status(200).json(updatedAgents);
    } else {
      return res.status(200).json({ message: "No changes made to agentAdminIT status" });
    }
  } catch (error) {
    console.error("Error updating Agents:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// update agent admin by ID for IT agentAdminIT: false:
const updateAgentAdminByIdSap = async (req, res) => {
  try {
    // Ensure req.adminId is defined for debugging
    if (!req.adminId) {
      console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }

    // Retrieve agents with agentAdminIT true created by this admin
    const allAgents = await Agents.find({ createdByAdmin: req.adminId, agentAdminSAP: true });
    // console.log("allAgents>>", allAgents);

    if (!allAgents || allAgents.length === 0) {
      return res.status(404).json({ message: "No Agents found" });
    }

    // Update `agentAdminIT` field only if specified as false in req.body
    const updatedAgents = [];
    for (const agent of allAgents) {
      if (req.body.agentAdminSAP === false) {
        agent.agentAdminSAP = false;
        await agent.save();
        updatedAgents.push(agent);
      }
    }
// console.log("updatedAgents>>",updatedAgents)
    // Return updated agents if any were modified
    if (updatedAgents.length > 0) {
      return res.status(200).json(updatedAgents);
    } else {
      return res.status(200).json({ message: "No changes made to agentAdminIT status" });
    }
  } catch (error) {
    console.error("Error updating Agents:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    // Ensure adminId is provided, possibly from the authenticated request
    const adminId = req.adminId || req.user?.adminId; // Use req.user if using JWT or middleware
    if (!adminId) {
      // console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    // Fetch tickets associated with the adminId
    const tickets = await Tickets.find({ adminId }).populate(
      "adminAssigned.assignedTo"
    );
    // Check if tickets were found
    if (!tickets || tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this admin" });
    }
    // Return the tickets in the response
    res.status(200).json(tickets);
  } catch (err) {
    // Log and respond with a 500 status code for server errors
    console.error("Error fetching tickets:", err.message);
    res
      .status(500)
      .json({ error: "Server error occurred while fetching tickets" });
  }
};

//get ticketByID
const getTicketById = async (req, res) => {
  try {
    const adminId = req.adminId || req.user?.adminId;
    const adminMailID = req.email || req.user?.email;
    // console.log("adminMailID>>", adminMailID);
    if (!adminId) {
      // console.error("adminId not provided in request");
      return res.status(400).json({ message: "adminId is missing" });
    }
    // console.log("adminId>>", adminId);
    // console.log("Request Params:", req.params);
    if (!req.params.id) {
      return res.status(400).json({ message: "uniqueticketID is missing" });
    }
    const ticket = await Tickets.findOne({
      adminMailID,
      uniqueticketID: req.params.id,
    }).populate("adminAssigned.assignedTo");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // console.log("ticket.adminId>>", ticket.adminId.toString());
    // Convert adminId to ObjectId for comparison
    const adminObjectId = new ObjectId(adminId); // Create a new ObjectId
    // console.log("adminObjectId >>",adminObjectId.toString())
    // Ensure the admin has access to the ticket
    if (ticket.adminId.toString() !== adminObjectId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this ticket" });
    }
    // console.log("Ticket found:", ticket);
    res.status(200).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  register,
  login,
  admin,
  customersCollection,
  agentsCollection,
  agentByID,
  getAllTickets,
  getTicketById,
  updateAgentByIDIT,
  updateAgentByIDSAP,
  updateAgentAdminByIdIT,
  updateAgentAdminByIdSap,
};
