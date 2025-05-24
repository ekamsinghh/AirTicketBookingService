const axios = require("axios");
const { FLIGHT_SERVICE_PATH }= require("../config/server-config");
const { BookingRepository }= require("../repository/index");
const { ServiceError }= require("../utils/index");

class BookingService{
    constructor(){
        this.bookingrepository=new BookingRepository();
    }

    async createBooking(data){
        try{
            const flightId=data.flightId;
            let getFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight=await axios.get(getFlightRequestUrl);
            let flightData=flight.data.data;
            let priceOfFlight= flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something Went wrong',
                    'Not enough seats available on this flight');
            }
            let totalCost=data.noOfSeats*priceOfFlight;
            const bookingPayload={
                ...data,
                totalCost:totalCost
            }
            const booking=await this.bookingrepository.create(bookingPayload);
            let updateFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightRequestUrl,{
                totalSeats : flightData.totalSeats - booking.noOfSeats
            })
            const updatedBooking=await this.bookingrepository.update(booking.id,{status:"Booked"});
            return updatedBooking;
        }
        catch(error){
            if(error.name=="RepositoryError" || error.name=="ValidationError"){
                throw error;
            }
            throw new ServiceError();
        }
    }

}

module.exports = BookingService;