const Driver = require('../models/driverModel');

// Create a new driver
exports.createDriver = async (req, res) => {
    try {
        const newDriver = new Driver(req.body);
        const savedDriver = await newDriver.save();
        res.status(201).json(savedDriver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single driver by id
exports.getDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find a driver by email
exports.findDriverByEmail = async (req, res) => {
    try {
        const email = req.params.email; // Or req.query.email, depending on how you want to pass it
        const driver = await Driver.findOne({ email: email });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a driver by id
exports.updateDriver = async (req, res) => {
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(400).json({ message: error.message });
    }
};


// Delete a driver by id
exports.deleteDriver = async (req, res) => {
    try {
        const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
        if (!deletedDriver) return res.status(404).json({ message: 'Driver not found' });
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
