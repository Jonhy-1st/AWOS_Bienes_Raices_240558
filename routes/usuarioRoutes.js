import express from "express"
// Importamos todas las funciones necesarias desde el controlador en una sola línea
import { 
    formularioLogin, 
    formularioLogin2, 
    registrarUsuario, 
    formularioRegistro, 
    formualrioRecuperar,
    paginaConfirmacion, 
    resetearPassword,
    formularioActualizacionPassword
} from '../controllers/usuarioController.js';

const router = express.Router();

// --- RUTAS DE AUTENTICACIÓN ---

// Ruta original
router.get("/login", formularioLogin)

// NUEVA RUTA: Ahora puedes acceder a login2
router.get("/login2", formularioLogin2) 

router.get("/registro", formularioRegistro)
router.post("/registro", registrarUsuario) 
router.get("/recuperar", formualrioRecuperar)
router.get("/confirma/:token", paginaConfirmacion)
router.get("/actualizarPassword/:token", formularioActualizacionPassword)

router.post("/registro", registrarUsuario)
router.post("/recuperar", resetearPassword)
// --- EJEMPLOS DE ENDPOINTS API ---

router.get("/", (req, res) => {
    console.log("Bienvenid@ al sistema de Bienes Raices")
    res.json({
        status: 200, 
        message: "Solicitud recibida através del metodo GET"
    })
})

router.post("/", (req, res) => {
    res.json({
        status: 200, 
        message: "Lo sentimos, no se aceptan peticiones POST"
    })
})

router.post("/createUser", (req, res) => {
    const nuevoUsuario = {
        nombre: "Jonhy Neri Hernández",
        correo: "240558@utxicotepec.edu.mx"
    }
    res.json({
        status: 200,
        message: `Se he solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo ${nuevoUsuario.correo}`,
    })
})

router.put("/updateUser", (req, res) => {
    res.json ({
        status: 200,
        message: "Se ha solicitado la actualización de los datos del usuario"
    })
})

router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    res.json ({
        status: 200,
        message: "Se ha solicitado la actualización parcial de la contraseña"
    })
})

router.delete("/deleteProperty/:id", (req, res) => {
    const {id} = req.params;
    res.json({
        status: 200,
        message: `Se ha solicitado eliminar la propiedad con el id ${id}`
    })
})

router.get("/saludo/:nombre", (req, res) => {
    const {nombre} = req.params;
    res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p>`)       
})

export default router;