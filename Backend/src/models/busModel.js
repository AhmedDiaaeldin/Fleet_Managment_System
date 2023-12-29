const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    type: String,
    status: Boolean,
    VIN: String,
    TUIO: { type: Number, min: 0, max: 215 },
    cap: Number,
    daily_km: Number,
    daily_students_ct: Number,
    bus_point: {
        type: { type: String }, // This is necessary for GeoJSON
        coordinates: [Number]
    },
    current_students_ct: Number,
    current_driver_id: Number,
    pin_color: String
});

// Ensure the GeoJSON is correctly indexed
busSchema.index({ bus_point: '2dsphere' });

module.exports = mongoose.model('Bus', busSchema);
