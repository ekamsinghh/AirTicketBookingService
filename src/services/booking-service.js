const axios = require("axios");
const { FLIGHT_SERVICE_PATH }= require("../config/server-config");
const { BookingRepository }= require("../repository/index");
const { ServiceError }= require("../utils/index");
const {createChannel,publishMessage}= require("../utils/messageQueues");
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
            // const channel=await createChannel();
            // const payload = {
            //     data:{
            //         subject: 'Booking Confirmation',
            //         content: 'Hey! hope you are doing well.This is a confirmation mail for your booking.\nThanks for using our service.',
            //         recepientEmail: ,
            //         notificationTime: 
            //     },
            //     service: 'CREATE_TICKET'
            // }
            // publishMessage(channel,REMINDER_BINDING_KEY, JSON.stringify(payload));
            return updatedBooking;
        }
        catch(error){
            if(error.name=="RepositoryError" || error.name=="ValidationError"){
                throw error;
            }
            throw new ServiceError();
        }
    }

    async updateBooking(bookingId,data){
        try{
            const newSeats=data.noOfSeats;
            const booking=await this.bookingrepository.getById(bookingId);
            const prevBookedSeats=booking.noOfSeats;
            const flightId=booking.flightid;
            if(newSeats>prevBookedSeats){
                const reqSeats=newSeats-prevBookedSeats;
                let getFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const flight=await axios.get(getFlightRequestUrl);
                let flightData=flight.data.data;
                let priceOfFlight= flightData.price;
                if(reqSeats > flightData.totalSeats){
                    throw new ServiceError('Something Went wrong',
                        'Not enough seats available on this flight');
                }
                let newTotalCost=booking.totalCost+(reqSeats*priceOfFlight);
                await this.bookingrepository.updating(bookingId,{noOfSeats:newSeats,totalCost:newTotalCost});
                let updateFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                await axios.patch(updateFlightRequestUrl,{totalSeats : flightData.totalSeats - reqSeats});
            }
            else{
                const reqSeats=prevBookedSeats-newSeats;
                let getFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const flight=await axios.get(getFlightRequestUrl);
                let flightData=flight.data.data;
                let priceOfFlight= flightData.price;
                let newTotalCost=booking.totalCost-(reqSeats*priceOfFlight);
                if(newSeats==0){
                    await this.bookingrepository.updating(bookingId,{status:"Cancelled"});
                    let updateFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                    await axios.patch(updateFlightRequestUrl,{totalSeats : flightData.totalSeats + reqSeats});
                }
                else{
                    await this.bookingrepository.updating(bookingId,{noOfSeats:newSeats,totalCost:newTotalCost});
                    let updateFlightRequestUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                    await axios.patch(updateFlightRequestUrl,{totalSeats : flightData.totalSeats + reqSeats});
                }
            }
            return true;
        }
        catch(error){
            console.log(error);
            if(error.name=="RepositoryError" || error.name=="ValidationError"){
                throw error;
            }
            throw new ServiceError();
        }
    }

}

module.exports = BookingService;