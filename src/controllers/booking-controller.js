const { BookingService } = require('../services/index');
const { AppError } = require('../utils/index');
const { StatusCodes } = require('http-status-codes');
const bookingService=new BookingService();

const create = async (req,res)=>{
    try{
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully Booked the flight',
            status: true,
            data: response,
            err:{}
        });
    }
    catch(error){
        return res.status(error.statusCode).json({
            message: error.message,
            status: false,
            data: {},
            err: error.explanation
        });
    }
}

module.exports={
    create
}