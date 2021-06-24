const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Customer = new Schema({
    customer_name: { type: String, requered: true },
    email: { type: String },
    phone_number: { type: String, requered: true },
    information: { type: String },
    created_at: { type: Date, default: Date.now() }
})

mongoose.model("customers", Customer)