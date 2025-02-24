const {
  Department,
  Submodule,
  TypeOfIssue,
} = require("../model/dropdonwModle");

const department = async (req, res) => {
  try {
    const departments = await Department.find();
    // console.log("department>>",departments)
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subModule = async (req, res) => {
    const { departmentId } = req.params; 
    // console.log("department>>",departmentId)
  try {
    const submodules = await Submodule.find({
        department: departmentId,
    });
    // console.log("submodules>>",submodules);
    res.json(submodules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const typeOfIssues = async (req, res) => {
    const { submoduleId } = req.params; 
  try {
    const issues = await TypeOfIssue.find({
        submodule: submoduleId,
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { department, subModule, typeOfIssues };
