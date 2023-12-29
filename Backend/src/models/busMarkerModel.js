// src/models/busMarkerModel.js
const mongoose = require('mongoose');

const busMarkerSchema = new mongoose.Schema({
    TUIO: Number,
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true }
});

module.exports = mongoose.model('BusMarker', busMarkerSchema);
