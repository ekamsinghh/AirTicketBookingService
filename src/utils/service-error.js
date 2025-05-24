const { StatusCodes }=require("http-status-codes");

class ServiceError extends Error{
    constructor(
        message="Service Layer Error",
        explanation="Please Try Again",
        statusCode=StatusCodes.INTERNAL_SERVER_ERROR
    ){
        super();
        this.name="ServiceError";
        this.message=message;
        this.explanation=explanation;
        this.statusCode=statusCode;
    }
}
module.exports=ServiceError;