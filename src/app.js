/*Desafío N°4
Crear una vista llamada homehandlebars con todos los productos agregados hasta el momento.
Formato: Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.
*/


//*******IMPORTACIONES******************

// Importa el módulo Express para crear el servidor
import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import userRouter from './routes/userRoutes.js'
import upload from './utils.js'//.js es un archivo
import mongoose from 'mongoose'
import { __dirname } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io' //llaves es una dependencia

//console.log(__dirname)

//*******CONFIGURACIONES O DECLARACIONES******************

// Se crea una instancia de Express para configurar el servidor.
const app = express();
// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000


//----SERVER---------
// Se define el servidor utilizando la variable 'app'.
// El servidor escucha en el puerto definido por la variable 'PORT'.
// Cuando el servidor está activo, se ejecuta una función anónima para mostrar un mensaje de estado en la consola.
const SERVER = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
// Muestra un mensaje en la consola indicando que el servidor está activo y escuchando en el puerto especificado.

//declaro un nuevo servidor de sockets.io
const io = new Server(SERVER)

//----CONECTION DB---------
//contraseña que yo defino
mongoose.connect("mongodb+srv://karina:rosa@cluster0.m0y1rtl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//cuando esta conexion me devuelva un valor voy a mostrar este mensaje
.then(() => console.log ("DB is connected"))
//si hay error muestro el error
.catch(e => console.log (e))


//*******MIDDLEWARES******************

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))



//......CON ESTO CONFIGURO HANDLEBARS.....

app.engine('handlebars', engine())
//voy a trabajar con handlebars, esto implementa lo que me devuelve mi dependencia

app.set('view engine', 'handlebars')
//set es para setear un valor
//para las vistas de mi aplicacion voy a implementar handlebars

//CON ESTO INDICO DONDE SE ESTA UTILIZANDO
app.set('views', __dirname + '/views')
//las vistas de mi aplicacion se encuentran en __dirname es mi path →seria la carpeta src y lo concateno con la carpeta views



//...........SOCKET.IO..................
// Cuando se establece una conexión con Socket.io, se ejecuta esta función IO.ON. Esta conexion me devuelve un socket que seria mi listener, el cliente que esta escuchando "APRETON DE MANOS"
io.on('connection', (socket) => {
  //cuando tenga ese "apreton de manos" de distintos clientes agrego a la consola el mensaje
  console.log("Conexion con Socket.io")
  // Cuando el cliente envía un mensaje de 'movimiento', se ejecuta esta función
  socket.on('movimiento', info => {
    // Imprime en la consola del servidor la información recibida desde el cliente
    console.log(info)
  })

  // Cuando el cliente envía un mensaje de 'rendirse', se ejecuta esta función
  socket.on('rendirse', info => {
    // Imprime en la consola del servidor la información recibida desde el cliente
    console.log(info)
    // Envía un mensaje solo al cliente que ha enviado el mensaje de rendirse
    socket.emit('mensaje-jugador', "Te has rendido")
    })
   // Envía un mensaje a todos los clientes excepto al que envió el mensaje de rendirse
  socket.broadcast.emit('rendicion', "El jugador se rindio") //
})




//*******RUTAS******************
/*
//defino que la ruta products va a implementar la carpeta publica
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
//productsRouter va a importar las rutas de todos esos elementos. Divido mi aplicacion en pequeñas partes.
//Genero ruta donde subo las imagenes. El middleware se encuentra entre la ruta y el contenido de la ruta
*/





// Primero, configura el enrutador de productos
app.use('/api/products', productsRouter);

// Luego, configura Express para servir archivos estáticos desde la carpeta '/public'
app.use(express.static(__dirname + '/public'));

app.use('/api/cart', cartRouter)

//
app.use('/api/users', userRouter)

//PARA LA CARGA DE IMAGENES
app.post('/upload', upload.single('product'), (req, res) => {
  try {
    console.log(req.file)
    res.status(200).send("Imagen cargada correctamente")
  } catch (e) {
    res.status(500).send("Error al cargar imagen")
  }
})

//GENERAMOS UNA VISTA PARA LA IMPLEMENTACIÓN CON HANDLEBARS.
//en la ruta static, voy a renderizar una plantilla xeje: home
/*app.get('/static', (req, res) => {
  //para esta ruta renderizame productos y el css de productos de la carpeta public

  //necesito mostrar un listado de productos
  //los comento xq esto es para probar.
  const PRODS = [
    //img: con ruta interna
    { id: 1, title: "celular", price: 1500, img: "./img/src/public/img/1707780153245celu1.jpg" },
    { id: 2, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" },
    { id: 3, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" },
    { id: 4, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" }
  ];

})*/

//sabe lo que voy a enviar por la configuracion previa app.set....




/*
RESUMEN: Se implementó un CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar los productos utilizando el ProductManager.
Las operaciones incluyen:
- Obtener todos los productos y obtener un producto por su ID.
- Agregar un nuevo producto.
- Actualizar un producto existente.
- Eliminar un producto.
*/
