const express = require('express');
const router = express.Router();
const { department, subModule, typeOfIssues } = require('../controllers/dropdownConstroller');

// Define routes
router.get('/departments', department);
router.get('/submodules/:departmentId', subModule);
router.get('/issues/:submoduleId', typeOfIssues);

module.exports = router;
