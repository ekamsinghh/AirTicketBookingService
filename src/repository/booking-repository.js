const { Booking }= require('../models/index');
const { ValidationError , AppError }=require('../utils/index');
const { StatusCodes }=require('http-status-codes');

class BookingRepository{

    async create(data){
        try{
            const booking = await Booking.create({
                flightid: data.flightId,
                userid: data.userId,
                noOfSeats: data.noOfSeats,
                totalCost: data.totalCost
            });
            return booking;
        }
        catch(error){
            if(error.name="SequelizeValidationError"){ 
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot Create The Booking',
                'There was some Issue creating the booking',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId, data) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status) {
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        }catch (error) {
            throw new AppError(
                'RepositoryError', 
                'Cannot update Booking', 
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updating(bookingId, data) {
        try {
            await Booking.update(data,
                {
                    where: {
                        id: bookingId
                    }
                }
            );
            return true;
        }catch (error) {
            throw new AppError(
                'RepositoryError', 
                'Cannot update Booking', 
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getById(bookingId){
        try{
            const booking=await Booking.findByPk(bookingId);
            return booking;
        }
        catch(error){
            throw new AppError(
                'RepositoryError', 
                `Cannot Get the Booking with bookingId: ${bookingId} `, 
                'There was some issue fetching the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports=BookingRepository;