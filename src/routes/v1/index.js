const express=require("express");
const router=express.Router();
const{ BookingController }= require("../../controllers/index");
// const { createChannel }= require("../../utils/messageQueues");

// const channel = await createChannel();
const bookingController=new BookingController();
router.post("/bookings",bookingController.create);
router.patch("/bookings/:id",bookingController.update);
router.post('/publish',bookingController.sendMessageToQueue);
module.exports = router;