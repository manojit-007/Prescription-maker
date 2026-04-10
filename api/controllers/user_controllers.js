const User = require("../model/user_model");
const catchAsyncError = require("../utils/Catch_async_error");
const { sendError, sendResponse } = require("../utils/Response_handler");

const newUser = catchAsyncError(async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return sendError(res, 400, "Name, email and password are required");
    }

    const existingUser = await User.findByEmail(email);
    if(existingUser) {
        return sendError(res, 400, "Email is already registered");
    }

    const user = new User({ name, email, password });
    await user.save();
    sendResponse(res, 201, { user: user.toSafeObject() });
});

module.exports = { newUser };