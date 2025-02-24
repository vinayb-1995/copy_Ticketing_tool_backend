const mongoose = require("mongoose");

const ticketIDCounterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

// Ensure each (email, prefix) combination is unique
ticketIDCounterSchema.index({ email: 1, prefix: 1 }, { unique: true });

module.exports = mongoose.model("TicketIDCounter", ticketIDCounterSchema);
