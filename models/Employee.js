const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String },
    desination: { type: String },
    email: { type: String },
    phone: { type: String },
    age: { type: String },
}, {
    timestamps: true
})

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee