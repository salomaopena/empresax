module.exports = {
    isAdmin: function (req, res,next) {
        if (req.isAuthenticated() && (req.user.is_superuser || req.user.is_staff)) {
            return next()
        }
        req.flash("error_msg","Não tem permissões para aceder a este conteúdo!")
        res.redirect("/")
    }
}
