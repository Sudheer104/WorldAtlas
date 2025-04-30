const express = require('express');

const app = express();

app.use(express.json);

const userRoute = require("../routes/userRoute");
const staticRoute = require("../routes/static")

app.use('/user',userRoute);
app.use('/',);

const port = 4040;;

app.listen(port,function(){
    console.log("Server is listening on port:"+port); 
})