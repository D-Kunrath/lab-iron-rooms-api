const mongoose = require('mongoose');

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB: ${connection.connections[0].name}`);
  } catch (error) {
    console.log('Error connecting to DB');
  }
}

module.exports = connect;