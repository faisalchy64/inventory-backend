const express = require("express");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyAdmin = require("../middlewares/verifyAdmin");
const { getUsers, deleteUser } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", verifyJWT, verifyAdmin, getUsers);

router.delete("/users/:id", verifyJWT, verifyAdmin, deleteUser);

module.exports = router;
