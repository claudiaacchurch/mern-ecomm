export const globalErrHandler = (err, req, res, next)=>{
    //stack - what line of code effects error
    const stack = err?.stack;
    //provide message
    const message = err?.message;
    //change status
    const statusCode = err?.statusCode ? err?.statusCode : 500;

    res.status(statusCode).
    json({
        stack,
        message,
    });
};

// 404 not found error handler

export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    //next, goes to global error handler after route set up in app.js
    next(err);
};