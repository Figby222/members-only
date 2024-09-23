function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/log-in");
    }
}

export default { checkLoggedIn };