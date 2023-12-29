const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    curr_bus_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus' // Reference to the Bus model
    },
    name: { type: String, required: true },
    phone: Number,
    email: { type: String, required: true },
    pass: Number,
    driverLicense: String
});

module.exports = mongoose.model('Driver', driverSchema);
