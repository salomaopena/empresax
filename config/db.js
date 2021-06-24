if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb+srv://empresax:1234567890@cluster0.kspjs.mongodb.net/empresax?retryWrites=true&w=majority" }
} else {
    module.exports = { mongoURI: "mongodb://localhost/empresax" }
   
}
