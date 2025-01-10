function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.user = req.user || req.session?.passport?.user;
        return next();
    }
    res.status(401).json({ error: "No autenticado" });
}

module.exports = isAuthenticated;
