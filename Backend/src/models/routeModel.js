const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    stop_points: {
        type: { type: String }, // This is necessary for GeoJSON
        coordinates: [Number]
    },
    name: String,
    date: Date,
    km_distance: Number
});

// Ensure the GeoJSON is correctly indexed
routeSchema.index({ stop_points: '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);
