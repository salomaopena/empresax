//Importando módulos
const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const admin = require("./routes/admin")
const user = require("./routes/user")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")
 
//Configurações
//Session
app.use(session({
    secret: "programacaoavancada",
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

//Template Engine
app.engine("handlebars", handlebars({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))

app.set("view engine", "handlebars")

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//Mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("MondoDD conectado...")
}).catch((error) => {
    console.log("Erro ao se conectar ao MongoDB! " + error)
})

//Routes
app.use("/admin", admin)
app.use("/user",user)



//static files
app.use(express.static(path.join(__dirname, "public")))


app.get("/", function (req, res) {
    res.render("index")
})


app.get("/user/add", function (req, res) {
    res.render("user_add")
})
app.post("/user/save", function (req, res) {
    User.create({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: req.body.birthday,
        is_superuser: req.body.is_superuser,
        is_staff: req.body.is_staff,
        email: req.body.email,
        phone_number: req.body.phone_number
    }).then(function () {
        res.redirect("/user/list")
    }).catch(function (error) {
        res.send("Ocorreu um erro inesperado! " + error)
    })
})

app.get("/user/list", function (req, res) {
    User.findAll().then(function (users) {
        res.render("user_list", {
            users: users,
        })
    })
})

app.get("/user/delete/:id", function (req, res) {
    User.destroy({ where: { "id": req.params.id } }).then(function () {
        res.send("Utilizador removido com sucesso!")
    }).catch(function (error) {
        res.send("Utilizador não existe: " + error)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servido rodando em http://localhost:3000 ...")
})