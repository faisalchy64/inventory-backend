const User = require("../models/userModel");

// get all users
const getUsers = async (req, res, next) => {
  try {
    const { page } = req.query;
    const skip = page > 1 ? (page - 1) * 6 : 0;

    const users = await User.find().limit(6).skip(skip);
    const total = await User.countDocuments();

    return res.send({ users, total });
  } catch (err) {
    next({ message: "Fetch users request failed." });
  }
};

// delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user && user.isVerified === false) {
      const response = await User.findByIdAndDelete(id);

      return res.send(response);
    }

    next({ status: 409, message: "Admin can only delete unverified users." });
  } catch (err) {
    next({ message: "Delete user request failed." });
  }
};

module.exports = { getUsers, deleteUser };
