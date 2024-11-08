const { default: mongoose } = require("mongoose");
const { Employee } = require("../models/emp.model");
const { options, generateAccessAndRefereshTokens } = require("../constants");

const fetchEmployeeData = async (req, res) => {
  const { role, id } = req.body;

  if (!role) {
    return res.status(402).json({ message: "Role type is required" });
  }

  try {
    let query = {};
    if (role === "user" && id) {
      query = { _id: new mongoose.Types.ObjectId(id) };
    } else if (role === "superAdmin") {
      query = {};
    } else if (role === "dev" || role === "cust support") {
      query = { userType: "user" };
    } else {
      return res.status(402).json({ message: "invalid role type" });
    }
    const data = await Employee.find(query);
    return res.status(200).json({ userData: data, message: "ok!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const login = async (req, res) => {
  const { empUsername, password } = req.body;
  try {
    const loginUser = await Employee.findOne({ empUsername });
    if (loginUser && loginUser.validPassword(password)) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(loginUser._id);
      return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json({
          message: "ok!",
          accessToken,
          refreshToken,
          menuItems: loginUser.empPerms,
        });
    }
    return res
      .status(401)
      .json({ message: "user not found or invalid password" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = { fetchEmployeeData, login };
