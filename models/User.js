const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema({
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, default: Date.now() },
    is_active: { type: Boolean, default: true },
    is_superuser: { type: Boolean, default: false },
    is_staff: { type: Boolean, default: true },
    email: { type: String, requerid: true },
    phone_number: { type: String, required: true },
    biography: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    created_at: { type: Date, default: Date.now() }
})

mongoose.model("users", User)