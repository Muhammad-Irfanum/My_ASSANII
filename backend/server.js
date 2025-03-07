const express = require('express');
require('dotenv').config();  // Load environment variables from a .env file into process.env
const cors = require('cors');
const routes = require('./routes/extractcnicroute.js');  // Import routes
const cnicRoutes = require('./routes/cnicroutes.js');  // Import routes
const app = express();
const port = 5000;

// Increase payload size limit
app.use(express.json({ limit: '50mb' })); // Adjust limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data



app.use(cors());
app.use(express.json());  // To parse JSON bodies
app.use('/', routes);     // Use the routes defined in routes.js
app.use('/api', cnicRoutes); 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
