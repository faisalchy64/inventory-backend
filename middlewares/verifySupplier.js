const verifySupplier = (req, res, next) => {
  const { role } = req.decoded;

  if (role === "supplier") {
    return next();
  }

  next({ status: 403, message: "Forbidden user access." });
};

module.exports = verifySupplier;
