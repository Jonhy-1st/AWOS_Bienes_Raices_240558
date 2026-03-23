import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarToken } from '../lib/token.js';
import { emailRegistro, emailResetearPassword, emailCuentaBloqueada } from '../lib/emails.js';

// --- VISTAS ---

const formularioLogin = (req, res) => {
    res.render('auth/login', { 
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken()
    });
}
const formularioLogin2 = (req, res) => {
    res.render('auth/login2', { 
        pagina: "Iniciar Sesión (V2)",
        csrfToken: req.csrfToken()
    });
}
// Test 1: Interacción Rotativa (Vistas de acceso)
const formularioRegistro = (req, res) => {
    res.render('auth/registro', { 
        pagina: "Crea tu cuenta",
        csrfToken: req.csrfToken()
    });
}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', { 
        pagina: "Recupera tu acceso",
        csrfToken: req.csrfToken()
    });
}

// --- LÓGICA DE AUTENTICACIÓN (LOGIN) ---

const autenticarUsuario = async (req, res) => {
    // Validación de Datos Backend
    await check('emailUsuario').isEmail().withMessage('El email es obligatorio').run(req);
    await check('passwordUsuario').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array() // Semaforización: Errores de formulario (Rojo)
        });
    }

    const { emailUsuario: email, passwordUsuario: password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }]
        });
    }

    // Test 10: Bloqueo de cuenta por exceso de intentos fallidos (5 intentos)
    if (usuario.intentos >= 5) {
        return res.render('auth/login', {
            pagina: 'Cuenta Bloqueada',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta está bloqueada por seguridad. Revisa tu correo para desbloquearla.' }]
        });
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada' }]
        });
    }

    // Revisar el password
    if (!usuario.verificarPassword(password)) {
        // Incrementar intentos fallidos
        usuario.intentos++;
        await usuario.save();

        // Lógica de Bloqueo
        if (usuario.intentos >= 5) {
            usuario.tokenDesbloqueo = generarToken();
            await usuario.save();
            
            // Enviar correo de bloqueo (Requerimiento Estilización)
            emailCuentaBloqueada({
                nombre: usuario.nombre,
                email: usuario.email,
                token: usuario.tokenDesbloqueo
            });

            return res.render('auth/login', {
                pagina: 'Cuenta Bloqueada',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'Has superado el límite de intentos. Cuenta bloqueada.' }]
            });
        }

        // Semaforización: Advertencia naranja (Menos de 5 intentos)
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{ msg: `Contraseña incorrecta. Te quedan ${5 - usuario.intentos} intentos.` }]
        });
    }

    // Test 9: Logeo Exitoso - Resetear intentos y entrar
    usuario.intentos = 0;
    usuario.ultimoAcceso = new Date();
    await usuario.save();

    // Aquí iría la redirección a "Mis Propiedades"
    res.redirect('/auth/mis-propiedades');
}

// --- REGISTRO Y VALIDACIÓN ---

const registrarUsuario = async (req, res) => {
    const { nombreUsuario: name, emailUsuario: email, passwordUsuario: password } = req.body;

    // Validación Datos Backend
    await check('nombreUsuario').notEmpty().withMessage("El nombre no puede ir vacío").run(req);
    await check('emailUsuario').isEmail().withMessage("Eso no parece un email").run(req);
    await check('passwordUsuario').isLength({ min: 8 }).withMessage("Mínimo 8 caracteres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Las contraseñas no coinciden").run(req);

    let resultado = validationResult(req);

    // Test 3: Registro Fallido (Formulario mal llenado)
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crea tu cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    // Test 4: Registro Fallido (Correo duplicado)
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Registrate con nosotros',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya está registrado' }],
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    // Test 2: Registro Exitoso
    const usuario = await Usuario.create({
        nombre: name,
        email,
        password,
        token: generarToken()
    });

    // Estilización: Envío de correo de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    res.render("templates/mensaje", {
        pagina: "Cuenta Creada",
        msg: `Hemos enviado un email de confirmación a: ${email}`
    });
}

// Test 5: Validación de Usuario por Email
const paginaConfirmacion = async (req, res) => {
    const { token } = req.params;
    const usuarioToken = await Usuario.findOne({ where: { token } });

    if (!usuarioToken) {
        return res.render("templates/mensaje", {
            pagina: "Error",
            msg: `Código de verificación no válido.`
        });
    }

    usuarioToken.token = null;
    usuarioToken.confirmado = true;
    await usuarioToken.save();

    res.render("templates/mensaje", {
        pagina: "Cuenta Confirmada",
        msg: `Felicidades ${usuarioToken.nombre}, ya puedes iniciar sesión.`,
        buttonVisibility: true,
        buttonText: "Ingresar",
        buttonURL: "/auth/login"
    });
}

// --- RECUPERACIÓN Y ACTUALIZACIÓN ---

const resetearPassword = async (req, res) => {
    const { emailUsuario: email } = req.body;
    await check('emailUsuario').isEmail().withMessage("Formato de correo no válido").run(req);
    
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.render("auth/recuperar", { 
            pagina: "Recuperar Acceso", 
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.confirmado) {
        return res.render("templates/mensaje", {
            pagina: "Atención",
            msg: `Si el correo existe y está confirmado, recibirás instrucciones.`
        });
    }

    usuario.token = generarToken();
    await usuario.save();

    emailResetearPassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    res.render("templates/mensaje", {
        pagina: "Email Enviado",
        msg: "Instrucciones enviadas a tu correo."
    });
}

// Test 6, 7 y 8: Actualización de Password
const actualizarPassword = async (req, res) => {
    const { token } = req.params;
    const { passwordUsuario: password, confirmacionUsuario } = req.body;

    await check('passwordUsuario').isLength({ min: 8 }).withMessage("Mínimo 8 caracteres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Las contraseñas no coinciden").run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Reestablecer Password",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    const usuario = await Usuario.findOne({ where: { token } });

    // Test 8: Token inválido
    if(!usuario) {
        return res.render("templates/mensaje", {
            pagina: "Error",
            msg: "El token ha expirado o no es válido."
        });
    }

    usuario.token = null;
    usuario.password = password;
    await usuario.save();

    res.render("templates/mensaje", {
        pagina: "Éxito",
        msg: "Tu contraseña ha sido actualizada.",
        buttonVisibility: true,
        buttonText: "Login",
        buttonURL: "/auth/login"
    });
}

// EXTRA: Desbloqueo de Cuenta
const desbloquearCuenta = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { tokenDesbloqueo: token } });

    if(!usuario) {
        return res.render("templates/mensaje", { pagina: "Error", msg: "Token de desbloqueo inválido." });
    }

    usuario.intentos = 0;
    usuario.tokenDesbloqueo = null;
    await usuario.save();

    res.render("templates/mensaje", {
        pagina: "Cuenta Desbloqueada",
        msg: "Tu cuenta ha sido reactivada.",
        buttonVisibility: true,
        buttonText: "Ir al Login",
        buttonURL: "/auth/login"
    });
}
// Mostrar el formulario para cambiar el password
const formularioActualizacionPassword = async (req, res) => {
    const { token } = req.params;

    // Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("templates/mensaje", {
            pagina: "Token no válido",
            msg: "Hubo un error al validar tu información o el token ha expirado. Intenta de nuevo.",
            buttonVisibility: true,
            buttonText: "Recuperar cuenta",
            buttonURL: "/auth/recuperar"
        });
    }

    // Si el token existe, mostrar el formulario
    res.render("auth/resetearPassword", {
        pagina: "Reestablece tu Contraseña",
        csrfToken: req.csrfToken()
    });
}
export {
    formularioLogin,
    formularioLogin2,
    autenticarUsuario,
    formularioRegistro,
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword,
    actualizarPassword,
    desbloquearCuenta
}