const Agent = require("../model/agentModel");
const Admin = require("../model/adminModel");
const Tickets = require("../model/ticketModel");

/* Customer registration */
const register = async (req, res) => {
  try {
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

    const {
      accountstatus,
      createdByAdmin,
      department,
      group,
      email,
      role,
      password,
      phoneNumber,
      fullname,
      agentAdminIT,
      agentAdminSAP,
    } = req.body;

    // console.log('Registering customer:', { firstname, lastname, email, createdByAdmin });
    // Check if the customer already exists for the admin
    const agentExist = await Agent.findOne({ email, createdByAdmin });
    if (agentExist) {
      return res.status(400).json({
        message: "Customer with this email already exists for this admin",
      });
    }

    // Generate a unique customer ID in the format AGNT-XXXXX
    const user_unique_ID = `AGNT-${nanoid()}`;
    // console.log("user_unique_ID>>",user_unique_ID)
    const admin = await Admin.findById(createdByAdmin).select("username email");
    // console.log('admin>>',admin)

    // Create new customer
    const newAgent = await Agent.create({
      user_unique_ID,
      accountstatus,
      createdByAdmin,
      department,
      group,
      email,
      role,
      password,
      phoneNumber,
      fullname,
      adminDetails: {
        // New field for admin's details
        _id: admin._id,
        username: admin.username,
        email: admin.email,
      },
      agentAdminIT,
      agentAdminSAP
    });
    // console.log("new customeer",newCustomer)
    return res.status(201).json({
      message: "agent created successfully",
      agent: newAgent,
    });
  } catch (error) {
    console.error("Error in Agent registration:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Agent with this email already exists for this admin",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/* customer  login */
const login = async (req, res) => {
    try {
      const { user_unique_ID, password } = req.body;
      // console.log("Login attempt:", { user_unique_ID, password,  });
      // Validate input
      if (!user_unique_ID || !password) {
        return res
          .status(400)
          .json({ message: "Please provide both Customer ID and Password" });
      }
      const agent = await Agent.findOne({
        user_unique_ID,
      });
      // console.log("customer>>", customer);
      if (!agent) {
        return res
          .status(401)
          .json({ message: "Invalid Customer ID or Password" });
      }
      // Use the comparePassword method to validate the password
      const isPasswordMatch = await agent.comparePassword(password);
      // console.log("Password match result:", isPasswordMatch);
  
      if (isPasswordMatch) {
        const token = agent.generateAuthToken();
        return res.status(200).json({
          message: "Login successful",
          token,
          userID: agent._id.toString(),
          role: agent.role,
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  //to send agent data - agent Login:
const agent = async (req, res) => {
    try {
      const agentData = req.user;
      // const adminData=customerData.populate('createdByAdmin')
    //   console.log(agentData);
      // console.log(adminData)
      return res.status(200).json({ agentBody: agentData });
    } catch (error) {
      console.log(`error form the user route ${error}`);
    }
  };

  // Get agents all  tickets
  const getAgentAllTickets = async (req, res) => {
    try {
      // Retrieve the agent's unique ID from the request, possibly via JWT or middleware
      const agentUniqueID = req.user?.user_unique_ID; // Adjust based on your JWT payload
      if (!agentUniqueID) {
        return res.status(400).json({ message: "Agent unique ID is missing" });
      }
  
      // Fetch tickets assigned to this agent
      const tickets = await Tickets.find({
        "adminAssigned.isAssigned": true,
        "adminAssigned.assignedTo": agentUniqueID,
      }).populate("adminAssigned.assignedTo", "fullname email department");
  
      // Check if tickets exist
      if (!tickets || tickets.length === 0) {
        return res
          .status(404)
          .json({ message: "No tickets found for this agent" });
      }
  
      // Return the tickets in the response
      res.status(200).json(tickets);
    } catch (err) {
      console.error("Error fetching tickets:", err.message);
      res
        .status(500)
        .json({ error: "Server error occurred while fetching tickets" });
    }
  };
  

//get ticketByID
/* const getTicketById = async (req, res) => {
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
}; */

module.exports = { register, login, agent,getAgentAllTickets};
