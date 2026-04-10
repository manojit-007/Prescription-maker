const express = require("express");
const { newUser } = require("../controllers/user_controllers");
const userRouter = express.Router();



userRouter.post("/register", newUser);

module.exports = userRouter;