const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models"); // tu modelo de Sequelize, por ejemplo

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Debe coincidir con lo que pusiste en la consola de Google
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Ejemplo: obtener email, googleId
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // Buscar/crear usuario en tu BD
                let user = await User.findOne({ where: { email } });
                if (!user) {
                    // si no existe, créalo
                    user = await User.create({
                        email,
                        name: profile.displayName || "No Name",
                        googleId,
                        // lo que necesites guardar
                    });
                } else {
                    // si ya existe, opcionalmente actualizar googleId si no está
                    if (!user.googleId) {
                        user.googleId = googleId;
                        await user.save();
                    }
                }
                return done(null, user);
            } catch (error) {
                console.error("Error Passport Google:", error);
                return done(error);
            }
        }
    )
);

// Serializar/Deserializar (básico con ID)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
});

module.exports = passport;
