const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Status = new Schema({
    os: { type: Schema.Types.ObjectId, ref: "os", required: true },
    description: { type: String, requered: true },
    created_at: { type: Date, default: Date.now() }
})

mongoose.model("status", Status)