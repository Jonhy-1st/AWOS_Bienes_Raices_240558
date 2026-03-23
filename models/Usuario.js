import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define("Usuario", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, // El tipo de dato es un entero sin signo, lo que significa que solo puede contener valores positivos. Útil para identificadores (ID).
        primaryKey: true, // El campo id es la clave primaria de la tabla, garantiza que cada registro sea único y no nulo.
        autoIncrement: true, // El campo id se incrementará automáticamente cada vez que se inserte un nuevo registro.
        allowNull: false // El campo id no puede ser nulo para garantizar la integridad de los datos.
    },

    nombre: {
        type: DataTypes.STRING (100), // Cadena de texto con longitud máxima de 100 caracteres para nombres de usuarios.
        allowNull: false, // El campo nombre es obligatorio.
        validate: {
            notEmpty: { // Asegura que el campo nombre no esté vacío.
                msg: 'El nombre no puede estar vacío' 
            }
        }
    },

    email : { 
        type: DataTypes.STRING (100), // Cadena de texto para direcciones de correo electrónico.
        allowNull: false,
        unique: {
           msg: 'El email ya está registrado'
        },
        validate: {
            isEmail: { // Valida que el formato sea una dirección de correo electrónico correcta.
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacío'
            }
        }
    },

    password: { 
        type: DataTypes.STRING (100), // Almacena la contraseña (que será hasheada mediante bcrypt).
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [8, 100], // Longitud mínima de 8 caracteres para garantizar seguridad.
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },

    confirmado: { // Indica si el usuario ha confirmado su cuenta mediante el enlace enviado por correo.
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "confirmado"
    },

    token: { // Almacena el token de recuperación o confirmación para verificar la identidad del usuario.
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "token_recuperacion"
    },

    tokenExpiracion: { // Almacena la fecha y hora en que expira el token para mejorar la seguridad.
        type: DataTypes.DATE,
        allowNull: true,
        field: "token_expiracion"
    },

    // --- NUEVOS CAMPOS PARA REQUERIMIENTOS DEL MÓDULO DE LOGIN (TEST 10 Y EXTRA) ---
    
    intentos: { 
        type: DataTypes.INTEGER, // Contador de intentos fallidos de inicio de sesión.
        defaultValue: 0,
        field: "intentos_fallidos" // Se utiliza para bloquear la cuenta al llegar al límite de 5 intentos (Test 10).
    },

    bloqueadoHasta: { 
        type: DataTypes.DATE, // Almacena la fecha y hora hasta la cual el usuario permanecerá bloqueado o el momento del bloqueo.
        allowNull: true,
        field: "bloqueado_hasta"
    },

    tokenDesbloqueo: {
        type: DataTypes.STRING(255), // Token generado específicamente para la funcionalidad de desbloqueo de cuenta (Extra!).
        allowNull: true,
        field: "token_desbloqueo"
    },

    // -------------------------------------------------------------------------------

    regStatus: { // Indica el estado de registro (activo/inactivo) para gestionar el acceso a la aplicación.
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "reg_status"
    },

    ultimoAcceso: { // Almacena la fecha y hora del último acceso exitoso del usuario para auditoría y seguridad.
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_acceso"
    }
}, {
    tableName: 'tb_usuarios', // Especifica que la tabla en la DB se llamará "tb_usuarios".
    timestamps: true, // Agrega automáticamente los campos created_at y updated_at.
    underscored: true, // Utiliza guiones bajos (snake_case) para los nombres de los campos en la base de datos.
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    hooks: {
        beforeCreate: async (usuario) => { // Cifra la contraseña antes de crear el registro en la base de datos.
            if (usuario.password) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },

        beforeUpdate: async (usuario) => { // Cifra la contraseña antes de actualizar si el campo ha sido modificado.
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// Método personalizado para verificar password de forma segura y limpia en el controlador.
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;