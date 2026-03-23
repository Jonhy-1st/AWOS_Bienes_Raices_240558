import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Usuario from '../models/Usuario.js';

// Serialización (Para mantener la sesión activa)
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

// ESTRATEGIA DISCORD
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    // CAMBIO: Se debe usar la URL completa (http://localhost:40196...)
    callbackURL: `${process.env.BACKEND_URL}/auth/discord/callback`,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // En Discord, el email viene dentro de profile
        const { email, username } = profile;
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            usuario = await Usuario.create({
                nombre: username,
                email: email,
                confirmado: true,
                password: 'SocialLogin_Discord_240558' 
            });
        }
        return done(null, usuario);
    } catch (error) { 
        return done(error, null); 
    }
}));

// ESTRATEGIA GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // CAMBIO: Se debe usar la URL completa
    callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const nombre = profile.displayName || profile.username;
        
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            usuario = await Usuario.create({
                nombre,
                email,
                confirmado: true,
                password: 'SocialLogin_GitHub_240558'
            });
        }
        return done(null, usuario);
    } catch (error) { 
        return done(error, null); 
    }
}));

export default passport;