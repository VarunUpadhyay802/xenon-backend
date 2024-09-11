const mongoose = require('mongoose');

const URI=`mongodb+srv://varun802vu:aWngidOGGdMKYY0b@cluster0.1mtmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


async function connectToMongoose() {
    try {
      await mongoose.connect(URI);
      console.log(`Connected to MongoDB`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

module.exports =connectToMongoose;

