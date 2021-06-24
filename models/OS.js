const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OS = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "customers", required: true },
    technic: { type: Schema.Types.ObjectId, ref: "users", required: true },
    equipament: { type: String, requered: true },
    defect: { type: String, requered: true },
    assistence: { type: String, requered: true },
    payment: { type: Number, requered: true, default: 0 },
    deadline: { type: Number, required: true, default: 15 },
    description: { type: String },
    created_at: { type: Date, default: Date.now() }
})

mongoose.model("os", OS)