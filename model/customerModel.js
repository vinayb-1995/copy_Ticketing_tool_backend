const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create user schema
const CustomerSchema = new mongoose.Schema({
  user_unique_ID: {
    type: String,
    required: true, // Mark as required if needed
    unique: true, // Ensure uniqueness
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  secondaryemail: { type: String },
  mobile: { type: String, required: true },
  alternativemobile: { type: String },
  password: { type: String, required: true },
  companyorgnizationname: { type: String },
  preferedcontactmethod: { type: String },
  accountstatus: { type: String, default: "active" },
  role: { type: String, default: "customer" }, // default role is customer
  createdByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Tracks the admin who created the account
  role: {
    type: String,
    // enum: ["user", "admin", "customer"],
    default: "customer",
  },
  adminDetails: {
    // Add this field to the schema
    _id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String },
    email: { type: String },
  },
});

// Create a compound index to ensure email is unique per admin
CustomerSchema.index({ email: 1, createdByAdmin: 1 }, { unique: true });

// Pre-save hook to hash password before saving the user
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token
CustomerSchema.methods.generateAuthToken = function () {
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
CustomerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
