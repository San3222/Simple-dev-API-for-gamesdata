require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// export module
const userData = require('./Router/route');
const connectDB = require('./db/connection');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT;

app.get('/', (req,res) =>{
    res.send("Hello word");
});

app.use('/api/user',userData);

const server_Start = async () => {
    try {
        await connectDB;
        app.listen(port, () =>{
            console.log(`Server is running at port ${port}`);
        })
    } catch (error) {
        console.log(error);   
    }
}
server_Start();
