## Proyecto de Clase: Sistema de Bienes Ríces

---

<p align="justify">
En este proyecto se prondan en ejemplo práctico la creacíon de API´s propias así como el consumo de API´s de Terceros (Gestión de Mapas, Envio de Correos, Autentificación por Redes Sociales, Gestión de Bases de Datos, Gestión de Archivos, Seguridad, Control de Sesiones y validación). En el contexto real de la compra, venta o renta de propiedades.
</p>

---

## Consideracione: 
<p align="justify">
El proyecto estará basado en una Arquitectura SOA (Service Oriented Architecture), el Patrón de Diseño MVC (Model, View Controler) y servicios API REST, deberá gestionarse debidamente en el uso del contro de versiones y ramas progresivas del desarrollo del mismo.</p> 

---
### Tabla de Fases

|No.|Descripción|Potenciador|Estatus|
|---|---|---|---|
|1.| Configuración incial del Proyecto (NodeJS) | 2 |Finalizado ✅|
|2.| Routing y Request (Peticiones) | 5 |Finalizado ✅|
|3.| Layouts, Template Engines y Tailwind CSS (Frontend) | 5 |Finalizado ✅ |
|4.| Creación de páginas de Login y Creación de Usuarios | 6 |Finalizado ✅ |
|5.| ORM´s y Bases de Datos | 7 |Finalizado ✅ |
|6.| Insertando Registros en la Tabla Usuarios | 20 | ✅Finalizado  |
|7.| Implementación de la Funcionalidad (Feature) Recuperación de Contraseña (Password Recovery) | ❌ | ✅Finalizado |
|8.| Autentificación de Usuarios (Auth) | ❌ | ❌ |
|9.| Definición de Clase Propiedades (Property) |❌| ❌ |
|10.| Operaciones CRUD (Create, Read, Update, Delete) de las Propiedades |❌| ❌ |
|11.| Protección de Rutas y Validación de Tokens de Sesión (JWT) |❌ |❌ |
|12.| Añadir Imágenes a la Propiedad (Gestión de Archivos) |❌| ❌ |
|13.| Elaboración Panel de Administración (Dashboard)| ❌ |❌ |
|14.| Formulario de Edición de Propiedades |❌| ❌ |
|15.| Formulario de Eliminación de Propiedades |❌| ❌ |
|16.| Página de Consulta de la Propiedad |❌| ❌ |
|17.| Implementación del Paginador |❌ | ❌ |
|18.| Creando la Página Inicial (Index) |❌ | ❌ |
|19.| Creando las Páginas de Categorías y Páginas de Error (404)| ❌ | ❌ |
|20.| Envío de Email por un formulario de Contacto | ❌ | ❌ |
|21.| Cambiar el Estatus de una Propiedad |❌ | ❌ |
|22.| Barras de Navegación y Cierre de Sesión |❌  | ❌ |
|23.| Publicación del API y el Frontend |❌ |❌ |

## Resultados Obtenidos


## Proyecto de Clase: Sistema de Bienes Raíces

---

<p align="justify">
En este proyecto se ponen en práctica la creación de APIs propias así como el consumo de APIs de terceros (Gestión de Mapas, Envío de Correos, Autenticación por Redes Sociales, Gestión de Bases de Datos, Gestión de Archivos, Seguridad, Control de Sesiones y Validación). Todo en el contexto real de la compra, venta o renta de propiedades.
</p>

---

## Resultados Obtenidos (Evidencias del Sistema)

### 1. Autenticación y Registro de Usuarios
El sistema permite el registro de nuevos usuarios con validaciones de lado del servidor y la integración de OAuth2 para agilizar el acceso.

| Formulario de Registro | Registro Exitoso | Login Principal |
|---|---|---|
| ![Registro](./images/regist.png) | ![Cuenta Creada](./images/conf.png) | ![Login](./images/log.png) |

---

### 2. Integración con Redes Sociales (OAuth2)
Se implementó con éxito el inicio de sesión mediante **Discord** para facilitar la experiencia del usuario.

| Login con Discord | Panel de Propiedades |
|---|---|
| ![Login Discord](./images/discLog.png) | ![Propiedades](./images/prop.png) |

---

### 3. Recuperación de Acceso y Seguridad
El sistema cuenta con un flujo completo de recuperación de contraseña mediante tokens por correo electrónico y medidas de seguridad contra ataques de fuerza bruta.

| Recuperar Contraseña | Cambio de Password | Cuenta Bloqueada |
|---|---|---|
| ![Recuperar](./images/recup.png) | ![Nueva Contraseña](./images/passw.png) | ![Bloqueo](./images/block.png) |

---

### 4. Gestión de Errores y Validaciones
Se implementaron mensajes informativos para el usuario en caso de errores comunes, como tokens inválidos o registros duplicados.

| Error en Registro | Token Inválido / Expirado | Usuario Duplicado |
|---|---|---|
| ![Error Registro](./images/errorReg.png) | ![Token Inválido](./images/tokenInv.png) | ![Duplicado](./images/duplicado.png) |

---

## Creado por:
**Jonhy Neri Hernández** Matrícula: 240558