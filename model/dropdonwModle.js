const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  department: { type: String, required: true },
});

const submoduleSchema = new mongoose.Schema({
  submodule: { type: String, required: true },
  department: { type: String, required: true },
});

const typeOfIssueSchema = new mongoose.Schema({
  typeOfIssue: { type: String, required: true },
  submodule: { type: String, required: true },
});

// Adding indexes for optimization
// submoduleSchema.index({ department: 1 });
// typeOfIssueSchema.index({ submodule: 1 });

const Department = mongoose.model("Department", departmentSchema);
const Submodule = mongoose.model("sub_module", submoduleSchema);
const TypeOfIssue = mongoose.model("type_of_issue", typeOfIssueSchema);

module.exports = { Department, Submodule, TypeOfIssue };
