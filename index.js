import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db, { connectDB } from "./config/db.js"; // Importamos db para el sync
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

// 1. PRIMERO DECLARAR LA APP
const app = express(); 
const PORT = process.env.PORT ?? 3000; 

// 2. CONFIGURACIÓN DE VISTAS
app.set('view engine', 'pug'); 
app.set('views', './views'); 

// 3. CARPETA PÚBLICA
app.use(express.static('public')); 

// 4. MIDDLEWARES DE DATOS (Debe ir antes de las rutas)
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// 5. COOKIES Y SESIONES
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

// 6. PROTECCIÓN CSRF
app.use(csurf());

// 7. PASAR TOKEN A LAS VISTAS
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// 8. RUTAS (Ahora sí, después de definir 'app')
app.use("/auth", usuarioRoutes); 

// 9. CONEXIÓN Y ACTUALIZACIÓN DE BASE DE DATOS
try {
    await connectDB();
    // alter: true creará las columnas de intentos y bloqueo que te faltan
    await db.sync({ alter: true }); 
    console.log('✅ Base de Datos Conectada y Columnas Sincronizadas');
} catch (error) {
    console.log('❌ Error en DB:', error);
}

// 10. GESTIÓN DE ERRORES CSRF
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

// 11. INICIO DEL SERVIDOR
app.listen(PORT, () => { 
    console.log(`🚀 El servidor está iniciado en el puerto ${PORT}`);
});