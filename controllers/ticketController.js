const Tickets = require("../model/ticketModel");

// Create a new ticket with image upload
const createTicket = async (req, res) => {
  try {
    const {
      uniqueticketID,
      adminName,
      adminId,
      adminMailID,
      customerName,
      customerID,
      customerMailID,
      customerContactNumber,
      department,
      subModule,
      issueType,
      description,
    } = req.body;

    // Handle image upload
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path; // Multer provides the path of the uploaded file
    }
    const newTicket = new Tickets({
      uniqueticketID,
      adminName,
      adminId,
      adminMailID,
      customerName,
      customerID,
      customerMailID,
      customerContactNumber,
      department,
      subModule,
      issueType,
      description,
      image: imagePath, // Store the image path in the DB
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignTickets = async (req, res) => {
  try {
    // Extract the admin's email from the request (assuming it's passed via JWT or session)
    const adminMailID = req.email || req.user?.email;
    // console.log("adminMailID",adminMailID)

    // Check if the ticket ID is provided in the request parameters
    if (!req.params.id) {
      return res.status(400).json({ message: 'Ticket ID is missing' });
    }

    // Find the ticket by its unique ID and admin's email (if needed)
    const ticket = await Tickets.findOne({ uniqueticketID: req.params.id, adminMailID: adminMailID });
    
    // If the ticket is not found, return a 404 response
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if the agent ID is provided in the request body
    const agentId = req.body.agentId || req.user?.agentId; // Assuming agentId is passed in the body
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is missing' });
    }

    const { plannedCost, actualCost, actualHrs, wricef, assignAgents, accountstatus, endDateAdnTime, status,adminDescription } = req.body;

    // Assign the ticket to the agent (update ticket with the agent ID and mark as assigned)
    ticket.adminAssigned.isAssigned = true;
    ticket.adminAssigned.assignedTo = agentId; // Assign ticket to agent
    ticket.adminAssigned.plannedCost = plannedCost || 0;  // Assign ticket to agent (default to 0 if missing)
    ticket.adminAssigned.plannedHrs = plannedCost || 0;  // Assign ticket to agent (default to 0 if missing)
    ticket.adminAssigned.actualCost = actualCost || 0;  // Assign ticket to agent
    ticket.adminAssigned.actualHrs = actualHrs || 0;  // Assign ticket to agent
    ticket.adminAssigned.wricef = wricef || '';  // Assign ticket to agent
    ticket.adminAssigned.assignAgents = assignAgents || '';  // Assign ticket to agent
    ticket.adminAssigned.accountstatus = accountstatus || '';  // Assign ticket to agent
    ticket.adminAssigned.endDateAdnTime = endDateAdnTime || '';  // Assign ticket to agent
    ticket.adminAssigned.adminDescription = adminDescription || '';  // Assign ticket to agent
    ticket.status = status 

    // Save the updated ticket to the database
    await ticket.save();

    // Send a successful response
    res.status(200).json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Error assigning ticket', error });
  }
};

module.exports={createTicket,assignTickets}