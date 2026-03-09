import nodemailer from 'nodemailer'

const emailRegistro = async (datos) =>{
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }

    })

    const{email,nombre, token}= datos

    await transport.sendMail({
        from: 'Bienes Raíces-240558',
        to: email,
        subject: 'Bienvenido a la Plataforma de Bienes Raíces - Confirma tu cuenta',

        html: `
            <p>Hola ${nombre}, comprueba tu cuebta de Bienes Raíces-240558.com</p>
            <hr>
            <p>Tu cuenta ya esta lista, solo dabes confirmarla en el siguiente enlace:
            <a href="localhost:${process.env.PORT}/auth/confirma/${token}">Confirmar Cuenta</a></p>
            <p>En caso de que no seas tú, quien creo la cuenta ignora este correo electronico
            </p>`
        
    });
}
export {emailRegistro};