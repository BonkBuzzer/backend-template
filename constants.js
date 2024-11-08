const { Employee } = require("./models/emp.model");

const options = {
  httpOnly: true,
  secure: false,
  expires: new Date(Date.now() + 86400 * 1000),
  sameSite: "Lax",
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Employee.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return console.error(
      "Something went wrong while generating referesh and access token"
    );
  }
};

module.exports = { options, generateAccessAndRefereshTokens };
