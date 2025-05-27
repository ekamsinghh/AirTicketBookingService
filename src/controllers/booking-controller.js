const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');
const bookingService=new BookingService();
const {REMINDER_BINDING_KEY} = require("../config/server-config");
const { createChannel, publishMessage }= require("../utils/messageQueues");

class BookingController{
    constructor(){
    }

    async sendMessageToQueue(req,res){
        const channel=await createChannel();
        const data = {message: 'Success'}
        publishMessage(channel,REMINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(200).json({
            message: 'Successfully Published message to the queue'
        })
    }

    async create (req,res){
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

    async update (req,res){
        try{
            const response = await bookingService.updateBooking(req.params.id,req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully updated the Booking',
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
}

module.exports= BookingController;