const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userAdminSchema = new mongoose.Schema({
  user_unique_ID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // enum: ["user", "admin", "customer"],
    default: "admin",
  },
});

// Hash the password before saving
userAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token
userAdminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    // { _id: this._id, role: this.role },
    { _id: this._id, role: this.role, email: this.email }, 
    process.env.JWT_SECRET_KEY,
    // {
    //   expiresIn: "1h",
    // }
  );
  return token;
};

// Compare the password
userAdminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const userAdmin = mongoose.model("admin_user", userAdminSchema);
module.exports = userAdmin;
