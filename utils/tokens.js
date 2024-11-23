const jwt = require("jsonwebtoken");

const generateToken = (_id, expiresIn) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn });
};

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return null;
    }

    return decoded;
  });
};

module.exports = { generateToken, generateTokens, verifyToken };
