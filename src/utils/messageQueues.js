const amqplib = require('amqplib');
const {  MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/server-config');

//* Message broker also distributes the messages among different queues
const createChannel= async () => {
    try{
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel= await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME , "direct",false);//* checks to which queue the message is to be sent(Acts as a DISTRIBUTOR)
        return channel;
    }
    catch(error){
        throw error;
    }
}

const subscribeMessage =async (channel,service,binding_key) => {
    try{
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');

        channel.bindQueue(applicationQueue,EXCHANGE_NAME,binding_key);//* binding key tells to which queue the message is to be sent

        channel.consume(applicationQueue.queue,msg => {
            console.log("Recieved Data");
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    }
    catch(error){
        throw error;
    }
}

const publishMessage= async (channel,binding_key,message) => {
    try{
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key,Buffer.from(message));
    }
    catch(error){
        throw error;
    }
}

module.exports={
    createChannel,
    subscribeMessage,
    publishMessage
}