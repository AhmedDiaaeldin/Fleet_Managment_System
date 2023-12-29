const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Create a new route
router.post('/', routeController.createRoute);

// Get all routes
router.get('/', routeController.getAllRoutes);

// Get a single route by id
router.get('/:id', routeController.getRoute);

// Update a route by id
router.put('/:id', routeController.updateRoute);

// Delete a route by id
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
