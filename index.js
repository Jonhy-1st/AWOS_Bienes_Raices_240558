import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./config/db.js"; 
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

const app = express(); 
const PORT = process.env.PORT ?? 3000; 

// Habilitar Pug
app.set('view engine', 'pug'); 
app.set('views', './views'); 

// Carpeta pública
app.use(express.static('public')); 

// --- MIDDLEWARES ---

// 1. Habilitar lectura de datos de formularios (IMPORTANTE: Debe ir antes de las rutas y CSRF)
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// 2. Cookies y Sesiones
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "PC-BienesRaices_240558_csrf_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

// 3. Protección CSRF
app.use(csurf());

// 4. Middleware para pasar el token a las vistas (Corregido: csrfToken con 'f')
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// --- RUTAS ---
app.use("/auth", usuarioRoutes); 
// Conexión a la base de datos
await connectDB();

// Cachear el error
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).render("templates/mensaje", {
            pagina: "Error de seguridad",
            title: "Error CSRF",
            msg: "El formulario expiró o fue manipulado. Recarga la página."
        });
    }

    next(err);
});


// --- SERVIDOR ---
app.listen(PORT, () => { 
    console.log(`El servidor está iniciado en el puerto ${PORT}`);
});