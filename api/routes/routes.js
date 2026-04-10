const express = require("express");
const appRouter = express.Router();

const userRouter = require("./user_route");

appRouter.use("/users", userRouter);


module.exports = appRouter;