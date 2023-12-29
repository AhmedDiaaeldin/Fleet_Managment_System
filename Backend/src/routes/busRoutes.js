const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Create a new bus
router.post('/', busController.createBus);

// Get all buses
router.get('/', busController.getAllBuses);

// Get a single bus by id
router.get('/:id', busController.getBus);

// Update a bus by id
router.put('/:id', busController.updateBus);

// Delete a bus by id
router.delete('/:id', busController.deleteBus);

module.exports = router;
