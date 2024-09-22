function indexRouteGet(req, res) {
    res.render("index", { title: "Node Template" });
}

function signUpFormGet(req, res) {
    res.render("sign-up-form", { user: {} });
}

export { indexRouteGet, signUpFormGet };