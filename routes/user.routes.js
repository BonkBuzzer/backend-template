const express = require("express");
const { fetchEmployeeData } = require("../controllers/auth.controller");
const { creatUser } = require("../controllers/superAdmin.controller");
const router = express.Router();

router.post("/userData", fetchEmployeeData);
router.post("/createUser", creatUser);

module.exports = router;
