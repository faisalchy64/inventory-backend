const verifyAdmin = (req, res, next) => {
  const { role } = req.decoded;

  if (role === "admin") {
    return next();
  }

  next({ status: 403, message: "Forbidden user access." });
};

module.exports = verifyAdmin;
