const bookingRepository= require("../repository/booking-repository");

class BookingService{
    constructor(){
        this.repository=new bookingRepository();
    }
}