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
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${FRONTEND_URL}/error`,
    }),
    (req, res) => {
        const { name, email, image } = req.user;
        console.log("¡Callback de Google completado!", req.user);

        // Redirige al dashboard con los datos del usuario como query params
        const redirectUrl = `${FRONTEND_URL}/dashboard?name=${encodeURIComponent(
            name
        )}&email=${encodeURIComponent(email)}`;
        return res.redirect(redirectUrl);
    }
);
// /auth/logout
router.get("/logout", (req, res) => {
    req.logout?.();    // Para Passport < v0.6
    req.logOut?.();    // Para Passport >= v0.6

    // Opcional: destruir la sesión en el store
    req.session?.destroy((err) => {
        // Limpia la cookie si quieres
        res.clearCookie("connect.sid");
        // Redirige o responde con un JSON
        return res.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000");
    });
});


// Ejemplo: obtener usuario logueado
router.get("/me", (req, res) => {
    console.log("Cookies:", req.cookies); // Verifica las cookies
    console.log("Session:", req.session); // Verifica si la sesión existe
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }
    res.json(req.user);
});


module.exports = router;
