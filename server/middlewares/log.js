const logRequest = (req, res, next) => {
    console.log("==== Incoming Request ====");
    console.log("API Route:", req.method, req.originalUrl);
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    console.log("Params : ",req.params)
    console.log("Query Params :",req.queryparams)
    console.log("cookie token : ",req.cookies.token)
    console.log("==========================");
    next();
};
 
module.exports = logRequest;