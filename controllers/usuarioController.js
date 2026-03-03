import { generarToken } from '../lib/token.js';
import Usuario from '../models/Usuario.js';
import { check, validationResult } from 'express-validator';
import { emailRegistro } from '../lib/emails.js';



const formularioLogin = (req, res) => {
    res.render('auth/login', { 
        pagina: "Iniciar Sesión" 
    });
}

// --- NUEVA FUNCIÓN PARA LOGIN2 ---
const formularioLogin2 = (req, res) => {
    res.render('auth/login2', { // Asegúrate de tener el archivo views/auth/login2.pug
        pagina: "Iniciar Sesión (V2)" 
    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', { 
        pagina: "Crea tu cuenta" 
    });
}


const registrarUsuario = async (req, res) => {
    console.log("Intentando registrar a un usuario Nuevo con los datos del formulario:");
    
    // 1. Validaciones
    await check('nombreUsuario').notEmpty().withMessage("El nombre no puede ir vacío").run(req);
    await check('emailUsuario').isEmail().withMessage("Eso no parece un email").run(req);
    await check('passwordUsuario').isLength({ min: 8 }).withMessage("La contraseña debe ser de al menos 8 caracteres").run(req);
    await check('confirmUsuario').equals(req.body.passwordUsuario).withMessage("Las contraseñas no coinciden").run(req);

    let resultado = validationResult(req);

    // 2. Verificar errores de validación inicial
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crea tu cuenta',
            errores: resultado.array(),
            usuario: {
                nombreUsuario: req.body.nombreUsuario,
                emailUsuario: req.body.emailUsuario
            }
        });
    }

    // 3. Extraer datos del body
    const { nombreUsuario:name, emailUsuario:email, passwordUsuario:password } = req.body;

    // 4. Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: {email} });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Registrate con nosotros',
            errores: [{ msg: 'El usuario ya está registrado' }],
            usuario: { 
                nombreUsuario: name, // Corregido para usar la variable 'name' extraída arriba
                emailUsuario: email   // Corregido para usar la variable 'email' extraída arriba
            }
        });
    }

    // CORRECCIÓN: Se cambió 'resultadoValidacion' por 'resultado' para que coincida con tu variable
    if (resultado.isEmpty()) { 
        const data = {
            nombre: name, // Asegúrate que tu modelo use 'nombre' o cámbialo a 'name' según tu DB
            email,
            password,
            token: generarToken()
        }
        const usuario = await Usuario.create(data);

        //Enviar correo electronico
        emailRegistro({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        })


        
        // CORRECCIÓN: Se arregló el paréntesis de res.render y el nombre de la variable de resultado
        res.render("templates/mensaje", {
            pagina :"Bienvenido al sistema de Bienes Raíces",
            msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu cuenta atraves de tu correo electronico que te hemos enviado`
        });

    } else {
        res.render('auth/registro', {
            pagina: "Error al intentar crear una cuenta", 
            errores: resultado.array(), // Corregido de resultadoValidacion a resultado
            usuario: { 
                nombreUsuario: name,
                emailUsuario: email 
            }
        });
    }
}
const paginaConfirmacion = async (req,res) =>
{
    const {token: tokenCuenta} = req.params
    console.log("Confirmando la cuenta asociada al token: ", tokenCuenta)

    //Confirmar soi el token existe
    const usuarioToken = await(Usuario.findOne({where:{token:tokenCuenta}}))
    console.log(usuarioToken);
if(!usuarioToken)
{
    return res.render("templates/mensaje",{ // 'return' para detener la ejecución
        pagina: "Error al confirmar la cuenta",
        msg: `El código de verificación no es válido, por favor inténtalo de nuevo.`
    });
}

    //Actualizar los datos del usuario.
    usuarioToken.token=null;
    usuarioToken.confirmed=true;
    usuarioToken.save();

    res.render("templates/mensaje",{
            title: "Confirmacion exitosa",
            msg: `La cuenta de: ${usuarioToken.name}, asociada al correo electronico: ${usuarioToken.email}
                se ha confirmado, ahora ya puedes ingresar a la plataforma`
        });

}

const formualrioRecuperar = (req, res) => {
    res.render('auth/recuperar', { 
        pagina: "Recupera tu acceso a Bienes Raíces" 
    });
}

export {
    formularioLogin,
    formularioLogin2,
    formularioRegistro,
    formualrioRecuperar,
    registrarUsuario,
    paginaConfirmacion
}