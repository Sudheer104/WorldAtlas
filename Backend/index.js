const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const app = express();

const mongoose = require('mongoose');
app.use(cors());
app.use(express.json());

//Database connection
mongoose.connect('mongodb://127.0.0.1:27017/restful-auth-api')
.then(()=>{
console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Somethig is wrong"+err);
})

//EJS(Embedded JavaScript Templates)
app.set('view engine','ejs'); //tells Express to use EJS as the template engine.
app.set('views','./views');  //specifies the directory where EJS templates are located.

const userRoute = require('./routes/userRoute');
app.use('/api',userRoute);

const authRoute = require('./routes/authRoute');
app.use('/',authRoute);


// Serve images statically in fronted
// app.use('/images', express.static(path.join(__dirname, 'public/images'))); 
app.use(express.static('public'));  //or

const port =  process.env.SERVER_PORT || 5000; // Assign a valid port number



app.listen(port, () => { //  () => or function() both are same 
    console.log(`Server is running on port ${port}`);
});