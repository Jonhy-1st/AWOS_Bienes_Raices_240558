const generarToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2) + "#JNH-26";

export{generarToken}