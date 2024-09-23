function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/log-in");
    }
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isadmin) {
        next();
    } else {
        res.status(401).redirect("/");
    }
}

export default { checkLoggedIn, checkAdmin };