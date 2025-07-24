const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);

        console.log("Database connected successfully:", connect.connection.host, connect.connection.name);
    }
    catch(error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};


module.exports = connectDB; 