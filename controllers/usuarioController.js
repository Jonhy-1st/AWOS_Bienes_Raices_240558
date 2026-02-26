const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autentificado: false,
        nombre: '',
        titulo: 'Iniciar Sesión'
    });
    res.render('auth/login', {pagina: "Inicia Sesión"});
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        
    });
    res.render('auth/registro',  {pagina: "Registrate con nosotros"});
}

export {
    formularioLogin, formularioRegistro
}