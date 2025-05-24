const { StatusCodes }=require("http-status-codes");

class ValidationError extends Error{
    //* Validation error=> Means BAD_REQUEST, so no need to take the paramet of statusCode in the constructor
    constructor(error){
        let explanation=[];
        error.errors.forEach((err)=>{
            explanation.push(err.message);
        });
        super();
        this.name="VlidationError";
        this.message="Not able to validate your request";
        this.explanation=explanation;
        this.statusCode=StatusCodes.BAD_REQUEST;
    }
}

module.exports=ValidationError;