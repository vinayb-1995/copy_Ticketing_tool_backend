// Import the Counter model
const Counter = require("../model/ticketIDCounterModel");


// Function to initialize or increment the counter for a given email and prefix
const incrementCounter = async (email, prefix) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { email: email, prefix: prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return `${prefix}${String(counter.seq).padStart(5, "0")}2024`;
  } catch (err) {
    console.error("Error incrementing counter:", err);
    throw err;
  }
};

// Function to decrement the counter for a given email and prefix, ensuring it doesn't go below 0
const decrementCounter = async (email, prefix) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { email: email, prefix: prefix, seq: { $gt: 0 } }, // Prevent seq from going negative
      { $inc: { seq: -1 } },
      { new: true }
    );

    if (!counter) {
      throw new Error("Counter not found or cannot be decremented below 0");
    }

    return `${prefix}${String(counter.seq).padStart(5, "0")}2024`;
  } catch (err) {
    console.error("Error decrementing counter:", err);
    throw err;
  }
};

// Route handler for generating IT ID for a specific email
const generateITID = async (req, res) => {
  const { email } = req.body;
  try {
    const itID = await incrementCounter(email, "IT");
    res.status(200).json({ itID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Route handler for generating SAP ID for a specific email
const generateSAPID = async (req, res) => {
  const { email } = req.body;
  try {
    const sapID = await incrementCounter(email, "SAP");
    res.status(200).json({ sapID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Decrement handlers
const decrementITID = async (req, res) => {
  const { email } = req.body;
  try {
    const itID = await decrementCounter(email, "IT");
    res.status(200).json({ itID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decrementSAPID = async (req, res) => {
  const { email } = req.body;
  try {
    const sapID = await decrementCounter(email, "SAP");
    res.status(200).json({ sapID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { generateITID,generateSAPID,decrementITID,decrementSAPID};