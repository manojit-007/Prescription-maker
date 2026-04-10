const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { sendResponse, sendError };