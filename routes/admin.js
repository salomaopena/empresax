const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
require("../models/Customer")
const Customer = mongoose.model("customers")
require("../models/OS")
const OS = mongoose.model("os")
require("../models/Status")
const Status = mongoose.model("status")
const bcrypt = require("bcryptjs")
const { isAdmin } = require("../helpers/isAdmin")


/**
 * CONFIGURAÇÃO DE ROTAS
 */
router.get("/", isAdmin,(req, res) => {
    res.render("admin/index")
})

/**
 * CONFIGURAÇÃO DE ROTAS PARA STATUS DE ORDEM DE SERVIÇO
 */

router.post("/status/edit", isAdmin, (req, res) => {
    var errors = []
    if (req.body.os == 0) {
        errors.push({ text: "Ordem de Serviço inválida talvez não tenha registo! " })
    }
    if (errors.length > 0) {
        res.render("admin/status/update_status", { errors: errors })
    } else {
        Status.findOne({ _id: req.body.id }).then((status) => {
            status.os = req.body.os
            status.description = req.body.description
            status.save().then(() => {
                req.flash("success_msg", "Estado alterado com sucesso")
                res.redirect("/admin/status/list")
                console.log("Estado alterado com sucesso: ")
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro ao alterar ao alterar estado de OS " + error)
                console.log("Ocorreu um erro ao alterar estado de OS: " + error)
            })
        }).catch((error) => {
            console.log("OS nao encontrada: " + error)
            req.flash("error_msg", "Houve um erro ao encontrar esatdo de  OS " + error)
            res.redirect("/admin/status/list")
        })
    }
})

router.get("/status/update/:id", isAdmin, (req, res) => {
    Status.findOne({ _id: req.params.id }).then((status) => {
        OS.find().populate("customer").then((os) => {
            res.render("admin/status/update_status", { os: os, status: status })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao encontrar OS")
            console.log("OS não encontrado: " + error)
            res.redirect("/admin")
        })

    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro")
        console.log("Ocorreu um erro " + error)
        res.render("admin/os/list_os")
    })
})

router.post("/status/new", isAdmin, (req, res) => {

    var errors = []
    if (req.body.os == 0) {
        errors.push({ text: "OS inválida talvez não tenha registo! " })
    }
    if (errors.length > 0) {
        res.render("admin/status/add_status", { errors: errors })
    } else {
        const newStatus = {
            os: req.body.os,
            description: req.body.description,
        }
        new Status(newStatus).save().then(() => {
            req.flash("success_msg", "Novo estado criado com sucesso!")
            console.log("Novo estado criado com sucesso!")
            res.redirect("/admin/status/list")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao criar estado " + error)
            res.redirect("/admin")
            console.log("Ocorreu um erro ao criar estado: " + error)
        })
    }
})


router.get("/status/add", isAdmin, (req, res) => {
    OS.find().populate("customer").then((os) => {
        res.render("admin/status/add_status", { os: os })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao encontrar OS")
        console.log("OS não encontrada: " + error)
        res.redirect("/admin")
    })
})


router.get("/status/list", isAdmin, (req, res) => {
    Status.find().populate("os").populate("customer").then((status) => {
        res.render("admin/status/list_status", { status: status })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar técnicos")
        res.redirect("/admin")
    })

})

router.post("/status/delete/", isAdmin, (req, res) => {
    Status.deleteOne({ _id: req.body.id }).then(() => {
        res.redirect("/admin/status/list")
        req.flash("success_msg", "estado de OS removida com sucesso!")
        console.log("estado de OS removida com sucesso!")
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao remover estado de OS")
        console.log("Ocorreu um erro ao remover estado de OS" + error)
        res.render("admin/status/list_os")
    })
})


/***
 * 
 * CONFIGURAÇÃO DE ROTASS E ORDEM DE SERVIÇO
 */

router.get("/os/update/:id", isAdmin, (req, res) => {
    OS.findOne({ _id: req.params.id }).then((os) => {
        User.find().then((users) => {
            Customer.find().then((customers) => {
                res.render("admin/os/update_os", { os: os, customers: customers, users: users })
            }).catch((error) => {
                req.flash("error_msg", "Erro ao encontrar Cliente")
                console.log("Cliente não encontrado: " + error)
                res.redirect("/admin")
            })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao encontrar Utilizador")
            console.log("Utilizador não encontrado: " + error)
            res.redirect("/admin")
        })

    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro")
        console.log("Ocorreu um erro " + error)
        res.render("admin/os/list_os")
    })
})

router.post("/os/edit", isAdmin, (req, res) => {
    var errors = []
    if (req.body.user == 0) {
        errors.push({ text: "Utilizador inválido cadasrte um utilizador! " })
    }
    if (req.body.customer == 0) {
        errors.push({ text: "Cliente inválido cadasrte um utilizador!" })
    }
    if (req.body.technic == 0) {
        errors.push({ text: "Técnico inválido cadasrte um utilizador!" })
    }
    if (errors.length > 0) {
        res.render("admin/os/update_os", { errors: errors })
    } else {
        OS.findOne({ _id: req.body.id }).then((os) => {
            os.user = req.body.user
            os.customer = req.body.customer
            os.technic = req.body.technic
            os.equipament = req.body.equipament
            os.defect = req.body.defect
            os.assistence = req.body.assistence
            os.payment = req.body.payment
            os.deadline = req.body.deadline
            os.description = req.body.description
            os.save().then(() => {
                req.flash("success_msg", "Os alterada com sucesso")
                res.redirect("/admin/os/list")
                console.log("Os alterado com sucesso: ")
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro ao alterar ao alterar OS " + error)
                console.log("Ocorreu um erro ao alterar OS: " + error)
            })
        }).catch((error) => {
            console.log("OS nao encontrada: " + error)
            req.flash("error_msg", "Houve um erro ao encontrar OS " + error)
            res.redirect("/admin/os/list")
        })
    }
})

router.get("/os/add", isAdmin, (req, res) => {
    User.find().then((users) => {
        Customer.find().then((customers) => {
            res.render("admin/os/add_os", { customers: customers, users: users })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao encontrar Cliente")
            console.log("Cliente não encontrado: " + error)
            res.redirect("/admin")
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao encontrar Utilizador")
        console.log("Utilizador não encontrado: " + error)
        res.redirect("/admin")
    })
})


router.post("/os/new", isAdmin, (req, res) => {

    var errors = []
    if (req.body.user == 0) {
        errors.push({ text: "Utilizador inválido cadasrte um utilizador! " })
    }
    if (req.body.customer == 0) {
        errors.push({ text: "Cliente inválido cadasrte um utilizador!" })
    }
    if (req.body.technic == 0) {
        errors.push({ text: "Técnico inválido cadasrte um utilizador!" })
    }
    if (errors.length > 0) {
        res.render("admin/os/add_os", { errors: errors })
    } else {
        const newOS = {
            user: req.body.user,
            customer: req.body.customer,
            technic: req.body.technic,
            equipament: req.body.equipament,
            defect: req.body.defect,
            assistence: req.body.assistence,
            payment: req.body.payment,
            deadline: req.body.deadline,
            description: req.body.description,
        }
        new OS(newOS).save().then(() => {
            req.flash("success_msg", "OS criada com sucesso!")
            console.log("Os criada com sucesso!")
            res.redirect("/admin/os/list")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao criar OS " + error)
            res.redirect("/admin")
            console.log("Ocorreu um erro ao criar OS: " + error)
        })
    }
})


router.get("/os/list", isAdmin, (req, res) => {
    OS.find().populate("user").populate("customer").then((os) => {
        res.render("admin/os/list_os", { os: os })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar técnicos")
        res.redirect("/admin")
    })

})

router.post("/os/delete/", isAdmin, (req, res) => {
    OS.deleteOne({ _id: req.body.id }).then(() => {
        res.redirect("/admin/os/list")
        req.flash("success_msg", "OS removida com sucesso!")
        console.log("OS removida com sucesso!")
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao remover OS")
        console.log("Ocorreu um erro ao remover OS" + error)
        res.render("admin/os/list_os")
    })
})




/**
 * 
 * CONFIGURAÇÃO DE ROTAS DO CLIENTE
 */

router.get("/cliente/add", isAdmin, (req, res) => {
    res.render("admin/cliente/add_cliente")
})

router.post("/cliente/new", isAdmin, (req, res) => {
    var errors = []
    if (!req.body.customer_name || typeof req.body.customer_name == undefined || req.body.customer_name == null) {
        errors.push({ text: "Nome inválido!" })
    }
    if (!req.body.phone_number || typeof req.body.phone_number == undefined || req.body.phone_number == null) {
        errors.push({ text: "Telefone inválido!" })
    }
    if (req.body.customer_name.length < 3) {
        errors.push({ text: "Nome muito curto!" })
    }
    if (errors.length > 0) {
        res.render("admin/cliente/add_cliente", { errors: errors })
    }
    else {
        const newCustomer = {
            customer_name: req.body.customer_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            information: req.body.information
        }
        new Customer(newCustomer).save().then(() => {
            req.flash("success_msg", "Cliente criado com sucesso!")
            console.log("Cliente criado com sucesso!")
            res.redirect("/admin/cliente/list")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao criar cliente " + error)
            res.redirect("/admin")
            console.log("Ocorreu um erro ao criar cliente: " + error)
        })
    }
})

router.get("/cliente/list", isAdmin, (req, res) => {
    Customer.find().then((customers) => {
        res.render("admin/cliente/list_cliente", { customers: customers })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar clientes")
        res.redirect("/admin")
    })

})

router.post("/cliente/delete/", isAdmin, (req, res) => {
    Customer.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Cliente removida com sucesso!")
        res.redirect("/admin/cliente/list")
        console.log("Cliente removida com sucesso!")
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao remover cliente")
        console.log("Ocorreu um erro ao remover cliente" + error)
        res.render("admin/cliente/list_cliente")
    })
})

router.get("/cliente/update/:id", isAdmin, (req, res) => {
    Customer.findOne({ _id: req.params.id }).then((customer) => {
        res.render("admin/cliente/update_cliente", { customer: customer })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro")
        console.log("Ocorreu um erro " + error)
        res.render("admin/cliente/list_cliente")
    })
})

router.post("/cliente/edit", isAdmin, (req, res) => {
    Customer.findOne({ _id: req.body.id }).then((customer) => {
        customer.customer_name = req.body.customer_name
        customer.email = req.body.email
        customer.phone_number = req.body.phone_number
        customer.information = req.body.information
        customer.save().then(() => {
            req.flash("success_msg", "Cliente alterado com sucesso")
            res.redirect("/admin/cliente/list")
            console.log("Alterado com sucesso: ")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao alterar " + error)
            console.log("Ocorreu um erro ao alterar cliente: " + error)
        })
    }).catch((error) => {
        console.log("Cliente nao encontrada: " + error)
        req.flash("error_msg", "Houve um erro ao encontrar cliente " + error)
        res.redirect("/admin/cliente/list")
    })
})

/**
 * 
 * CONFIGURAÇÃO DE ROTAS DE UTILIZADORES
 */

router.get("/user/add", (req, res) => {
    res.render("admin/user/add_user")
})

router.get("/user/list", (req, res) => {
    User.find().then((users) => {
        res.render("admin/user/list_user", { users: users })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar utilizadores")
        res.redirect("/admin")
    })

})

router.post("/user/delete/", isAdmin, (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {
        user.is_active = req.body.is_active
        user.is_superuser = req.body.is_superuser
        user.is_staff = req.body.is_staff
        user.save().then(() => {
            req.logout()
            res.redirect("/")
            req.flash("success_msg", "Utilizador desativado com sucesso!")
            console.log("Utilizador desativado com sucesso!")
        }).catch((error) => {
            res.redirect("/admin/user/list")
            req.flash("error_msg", "Houve um erro " + error)
            console.log("Houve um erro " + error)
        })
    }).catch((error) => {
        res.redirect("/admin/user/list")
        req.flash("error_msg", "Houve um erro " + error)
        console.log("Houve um erro " + error)
    })
})

router.get("/user/update/:id", isAdmin, (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render("admin/user/update_user", { user: user })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ")
        console.log("Ocorreu um erro " + error)
        res.render("admin/user/list_user")
    })
})

router.get("/user/show/:id", isAdmin, (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.render("admin/user/list_user", { user: user })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ")
        console.log("Ocorreu um erro " + error)
        res.render("admin/user/list_user")
    })
})

router.post("/user/new", (req, res) => {

    var errors = []
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ text: "Senha inválido!" })
    }
    if (!req.body.first_name || typeof req.body.first_name == undefined || req.body.first_name == null) {
        errors.push({ text: "Nome inválido!" })
    }
    if (!req.body.last_name || typeof req.body.last_name == undefined || req.body.last_name == null) {
        errors.push({ text: "Sobenome inválido!" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ text: "Email inválido!" })
    }

    if (req.body.password.length < 8) {
        errors.push({ text: "A palavra-pase deve ter 8 caracteres no mínino!" })
    }

    if (req.body.birthday >= Date.now()) {
        errors.push({ text: "Data de nascimento invalida!" })
    }
    if (req.body.password != req.body.password2) {
        errors.push({ text: "As palavras-passe não conferem, tente novamente!" })
    }
    if (errors.length > 0) {
        res.render("admin/user/add_user", { errors: errors })
    } else {

        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash("error_msg", "Já existe uma conta com este email ")
                console.log("Já existe uma conta com este email ")
                res.render("admin/user/add_user")
            } else {
                const newUser = {
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    birthday: req.body.birthday,
                    is_superuser: req.body.is_superuser,
                    is_staff: req.is_staff,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    biography: req.body.biography,
                }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        if (err) {
                            req.flash("error_msg", "Ocorreu um erro ao guardar utilizador...")
                            console.log("Ocorreu um erro ao guardar utilizado...")
                            res.redirect("/admin")
                        }

                        newUser.password = hash

                        new User(newUser).save().then(() => {
                            req.flash("success_msg", "Utilizador criado com sucesso!")
                            console.log("Utilizador criado com sucesso!")
                            res.redirect("/admin/user/list")
                        }).catch((error) => {
                            req.flash("error_msg", "Houve um erro " + error)
                            res.redirect("/admin")
                            console.log("Ocorreu um erro ao criar utilizador: " + error)
                        })
                    });
                });



            }

        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno " + error)
            console.log("Houve um erro interno " + error)
            res.redirect("/admin/user/list")
        })
    }

})


router.post("/user/edit", isAdmin, (req, res) => {
    User.findOne({ _id: req.body.id }).then((user) => {
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.birthday = req.body.birthday
        user.is_superuser = req.body.is_superuser
        user.is_staff = req.is_staff
        user.email = req.body.email
        user.phone_number = req.body.phone_number
        user.biography = req.body.biography,
            user.save().then(() => {
                req.flash("success_msg", "Utilizador alterado com sucesso")
                res.redirect("/admin/user/list")
                console.log("Alterado com sucesso: ")
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro ao alterar " + error)
                console.log("Ocorreu um erro ao alterar categoria: " + error)
            })
    }).catch((error) => {
        console.log("Utilizador nao encontrada: " + error)
        req.flash("error_msg", "Houve um erro ao encontrar categoria " + error)
        res.redirect("/admin/user/list")
    })
})

module.exports = router