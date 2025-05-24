const { StatusCodes }=require("http-status-codes");

class AppError extends Error{
    constructor(
        name="AppError",
        message="Something Went Wrong",
        explanation="Please Try Again",
        statusCode=StatusCodes.INTERNAL_SERVER_ERROR
    ){
        super();
        this.name=name;
        this.message=message;
        this.explanation=explanation;
        this.statusCode=statusCode;
    }
}
module.exports=AppError;