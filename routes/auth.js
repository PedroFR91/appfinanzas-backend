const express = require("express");
const passport = require("passport");
const router = express.Router();

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

// 1) Inicia flujo de Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2) Callback
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${FRONTEND_URL}/error`, // o la ruta que quieras
    }),
    (req, res) => {
        // Si el usuario se autenticó bien, ya lo tenemos en req.user
        // Redirige a tu frontend
        return res.redirect(`${FRONTEND_URL}/dashboard`);
    }
);

// Ejemplo: obtener usuario logueado
router.get("/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
});

module.exports = router;
