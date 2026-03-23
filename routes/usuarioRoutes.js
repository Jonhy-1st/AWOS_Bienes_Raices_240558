import express from "express"
// Importamos todas las funciones necesarias desde el controlador
import { 
    formularioLogin, 
    autenticarUsuario,      // Procesar el login (Test 9 y 10)
    formularioLogin2, 
    registrarUsuario, 
    formularioRegistro, 
    formualrioRecuperar,
    paginaConfirmacion, 
    resetearPassword,
    formularioActualizacionPassword,
    actualizarPassword,
    desbloquearCuenta       // Función para el Extra de desbloqueo
} from '../controllers/usuarioController.js';

const router = express.Router();

// ==========================================
//        RUTAS DE AUTENTICACIÓN (WEB)
// ==========================================

// --- LOGIN ---
router.get("/login", formularioLogin);
router.post("/login", autenticarUsuario); 

// Vista alternativa (V2)
router.get("/login2", formularioLogin2); 

// --- REGISTRO ---
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario); 

// --- RECUPERACIÓN DE PASSWORD ---
router.get("/recuperarPassword", formualrioRecuperar);
router.post("/recuperarPassword", resetearPassword);

// --- CONFIRMACIÓN Y ACTUALIZACIÓN ---
router.get("/confirma/:token", paginaConfirmacion);
router.get("/actualizarPassword/:token", formularioActualizacionPassword);
router.post("/actualizarPassword/:token", actualizarPassword);

// --- EXTRA: SEGURIDAD Y BLOQUEO ---
router.get("/desbloquear/:token", desbloquearCuenta);

// ==========================================
//      PANEL DE ADMINISTRACIÓN (DASHBOARD)
// ==========================================

// Muestra la vista que creamos: main/mis-propiedades.pug
router.get("/mis-propiedades", (req, res) => {
    res.render('auth/main/mis-propiedades', {
        pagina: 'Mis Propiedades',
        barra: true 
    });
});

// Ruta para cerrar sesión (Limpia la cookie y redirige)
router.post('/cerrar-sesion', (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login');
});


// ==========================================
//        EJEMPLOS DE ENDPOINTS (API)
// ==========================================

router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices - Jonhy Neri Hernandez (240558)")
    res.json({
        status: 200, 
        message: "Solicitud recibida a través del método GET por Jonhy Neri Hernandez"
    })
})

router.post("/", (req, res) => {
    res.json({
        status: 200, 
        message: "Lo sentimos, no se aceptan peticiones POST en la raíz"
    })
})

router.post("/createUser", (req, res) => {
    const nuevoUsuario = {
        nombre: "Jonhy Neri Hernández",
        correo: "240558@utxicotepec.edu.mx",
        matricula: "240558"
    }
    res.json({
        status: 200,
        message: `Se ha solicitado la creación de un usuario con nombre: ${nuevoUsuario.nombre}, matrícula: ${nuevoUsuario.matricula} y correo: ${nuevoUsuario.correo}`,
    })
})

router.put("/updateUser", (req, res) => {
    res.json ({
        status: 200,
        message: "Se ha solicitado la actualización de los datos del usuario: Jonhy Neri Hernandez (240558)"
    })
})

router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    const { nuevoPassword } = req.params;
    res.json ({
        status: 200,
        message: `Se ha solicitado la actualización parcial de la contraseña a: ${nuevoPassword} para el alumno Jonhy Neri Hernandez (240558)`
    })
})

router.delete("/deleteProperty/:id", (req, res) => {
    const { id } = req.params;
    res.json({
        status: 200,
        message: `Se ha solicitado eliminar la propiedad con el id ${id} por el administrador Jonhy Neri (240558)`
    })
})

router.get("/saludo/:nombre", (req, res) => {
    const { nombre } = req.params;
    res.status(200).send(`<p>Bienvenido <b>${nombre}</b> al sistema de Jonhy Neri (240558)</p>`)       
})

export default router;