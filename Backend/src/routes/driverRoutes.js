const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

// Create a new driver
router.post('/', driverController.createDriver);

// Get all drivers
router.get('/', driverController.getAllDrivers);

// Get a single driver by id
router.get('/:id', driverController.getDriver);

// Update a driver by id
router.put('/:id', driverController.updateDriver);

// Delete a driver by id
router.delete('/:id', driverController.deleteDriver);

// Route to find a driver by email
router.get('/email/:email', driverController.findDriverByEmail);

module.exports = router;
