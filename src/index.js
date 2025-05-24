const express = require("express");
const { PORT , DB_SYNC , FLIGHT_SERVICE_PATH } = require("./config/server-config");
const apiRoutes = require("./routes/index");
const db=require("./models/index");
const app = express();

const startingAndSettingServer= ()=>{
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use("/api",apiRoutes);

    app.listen(PORT,()=>{
        console.log("server started at",PORT);
    });
    if(DB_SYNC){
        db.sequelize.sync({alter:true});
    }


}

startingAndSettingServer();