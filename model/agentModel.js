const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const agentSchema = new mongoose.Schema({
  user_unique_ID: {
    type: String,
    required: true,
    unique: true,
  },
  accountStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "agent",
  },
  agentAdminIT: {
    type: Boolean,
    default: false,
  },
  agentAdminSAP: {
    type: Boolean,
    default: false,
  },
  adminDetails: {
    // Add this field to the schema
    _id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String },
    email: { type: String },
  },
});

// Create a compound index to ensure email is unique per admin
agentSchema.index({ email: 1, createdByAdmin: 1 }, { unique: true });

// Pre-save hook to hash password before saving the user
agentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

// Generate JWT token
agentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      // { _id: this._id, role: this.role },
      { _id: this._id, role: this.role, email: this.email },
      process.env.JWT_SECRET_KEY
      // {
      //   expiresIn: "1h",
      // }
    );
    return token;
  };
  
// Compare the password
agentSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

// Create the User model
const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
