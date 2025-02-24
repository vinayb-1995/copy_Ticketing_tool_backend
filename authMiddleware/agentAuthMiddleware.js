const jwt = require("jsonwebtoken");
const agent = require("../model/agentModel");
/* middel ware for verify token for cutomer only */
const agentAuthMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }
  const jwtToken = token.replace("Bearer", "").trim();
  //   console.log("token from auth middlewate>>",jwtToken)
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // req.user = isVerified; // Storing the isVerified token in req.user
    const userData = await agent
      .findOne({ email: isVerified.email })
      .select({ password: 0 });
    // console.log("verified token", isVerified);
    // console.log("verified token", userData);
    req.user = userData;
    req.token = token;
    req.userID = userData._id;
    next(); // Proceed to the next middleware
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Invalid token" });
  }
};

module.exports = agentAuthMiddleware;
