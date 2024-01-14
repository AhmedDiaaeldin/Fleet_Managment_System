require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const driverRoutes = require('./src/routes/driverRoutes');
const busRoutes = require('./src/routes/busRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Initialize express app
const app = express();

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/drivers', driverRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js Express Server');
});

// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
