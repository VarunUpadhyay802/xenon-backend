const connectToMongo = require('./db');
const express = require('express');
const cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

// Allow specific origins
const corsOptions = {
  origin: ['https://xenon-frontend-5j94p6vjb-varunupadhyay802s-projects.vercel.app', 'http://localhost:3000'], // replace with your specific URLs
  optionsSuccessStatus: 200
}

// Use CORS with specific options
app.use(cors(corsOptions));
app.use(express.json());

// Route for user authentication
app.use('/api/auth', require('./routes/auth'));

// Route for fetching properties
app.use('/api', require('./routes/property')); // <- Include this line to add the new properties route

// Start the server
app.listen(port, () => {
  console.log(`backend listening on port ${port}`);
});
