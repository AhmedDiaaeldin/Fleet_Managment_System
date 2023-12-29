const Bus = require('../models/busModel');
const BusMarker = require('../models/busMarkerModel');

// Create a new bus
exports.createBus = async (req, res) => {
    try {
        const newBus = new Bus(req.body);
        const savedBus = await newBus.save();

        // Create a corresponding BusMarker
        const newBusMarker = new BusMarker({ bus_id: savedBus._id, TUIO: savedBus.TUIO });
        await newBusMarker.save();

        res.status(201).json(savedBus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a bus by id
exports.updateBus = async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Update the corresponding BusMarker
        await BusMarker.findOneAndUpdate({ bus: updatedBus._id }, { TUIO: updatedBus.TUIO });

        res.status(200).json(updatedBus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a bus by id
exports.deleteBus = async (req, res) => {
    try {
        const deletedBus = await Bus.findByIdAndDelete(req.params.id);
        if (!deletedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Delete the corresponding BusMarker
        await BusMarker.findOneAndDelete({ bus: deletedBus._id });

        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single bus by id
exports.getBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
