import nodemailer from 'nodemailer'

// Configuración del transporte
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;
    // SEGURO: Si BACKEND_URL es undefined, usa localhost
    const url = `${process.env.BACKEND_URL || 'http://localhost'}:${process.env.PORT || 3000}`;

    await transport.sendMail({
        from: 'BienesRaices-240558.com',
        to: email,
        subject: 'Bienvenid@ a Bienes Raíces - Confirma tu cuenta',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #7c3aed; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Bienes <span style="font-weight: normal;">Raíces</span></h1>
                </div>
                <div style="padding: 30px; color: #1a202c;">
                    <h2 style="color: #7c3aed;">¡Hola, ${nombre}!</h2>
                    <p>Gracias por registrarte. Tu cuenta ya está casi lista, solo debes confirmarla haciendo clic en el siguiente botón:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}/auth/confirma/${token}" 
                           style="background-color: #7c3aed; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                           Confirmar Cuenta
                        </a>
                    </div>
                    <p style="font-size: 0.8rem; color: #718096;">Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
                </div>
                <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">© 2026 Jonhy Neri Hernández - 240558</p>
                </div>
            </div>
        `
    });
}

const emailResetearPassword = async (datos) => {
    const { email, nombre, token } = datos;
    const url = `${process.env.BACKEND_URL || 'http://localhost'}:${process.env.PORT || 3000}`;

    await transport.sendMail({
        from: 'BienesRaices-240558.com',
        to: email,
        subject: 'Restablece tu contraseña en Bienes Raíces',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Bienes <span style="font-weight: normal;">Raíces</span></h1>
                </div>
                <div style="padding: 30px; color: #1a202c;">
                    <h2 style="color: #4f46e5;">Restablecer Contraseña</h2>
                    <p>Hola ${nombre}, recibimos una solicitud para cambiar tu contraseña. Haz clic en el botón de abajo para continuar:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}/auth/actualizarPassword/${token}" 
                           style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                           Cambiar Contraseña
                        </a>
                    </div>
                    <p style="font-size: 0.8rem; color: #718096;">Si no solicitaste este cambio, ignora este correo.</p>
                </div>
                <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">© 2026 Jonhy Neri Hernández - 240558</p>
                </div>
            </div>
        `
    });
}

const emailCuentaBloqueada = async (datos) => {
    const { email, nombre, token } = datos;
    const url = `${process.env.BACKEND_URL || 'http://localhost'}:${process.env.PORT || 3000}`;

    await transport.sendMail({
        from: 'Seguridad-BienesRaices-240558.com',
        to: email,
        subject: '¡AVISO! Cuenta bloqueada por seguridad',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #feb2b2; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #e53e3e; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Cuenta Bloqueada</h1>
                </div>
                <div style="padding: 30px; color: #1a202c;">
                    <h2 style="color: #e53e3e;">Hola ${nombre},</h2>
                    <p>Tu cuenta ha sido bloqueada temporalmente tras <strong>5 intentos fallidos</strong> de inicio de sesión.</p>
                    <p>Si fuiste tú y deseas recuperar el acceso, haz clic en el siguiente enlace:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}/auth/desbloquear/${token}" 
                           style="background-color: #e53e3e; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                           Desbloquear mi Cuenta
                        </a>
                    </div>
                    <p style="font-size: 0.8rem; color: #718096;">Si no intentaste iniciar sesión, te recomendamos cambiar tu contraseña inmediatamente.</p>
                </div>
                <div style="background-color: #fff5f5; padding: 15px; text-align: center; border-top: 1px solid #feb2b2;">
                    <p style="margin: 0; font-size: 0.7rem; color: #a0aec0;">Seguridad - Jonhy Neri Hernández - 240558</p>
                </div>
            </div>
        `
    });
}

export { 
    emailRegistro, 
    emailResetearPassword, 
    emailCuentaBloqueada 
}