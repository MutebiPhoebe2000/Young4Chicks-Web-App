const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect(process.env.MONGODB_URI);

  mongoose.connection
    .once('open', () => {
      console.log('Mongoose Connection Open!');
    })
    .on('error', (error) => {
      console.error(`Connection Error: ${error.message}`);
    });
}

module.exports = connectDB;
