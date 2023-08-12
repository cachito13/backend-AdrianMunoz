// Importaciones de módulos
import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './dao/fsManager/ProductManager.js'
import  session  from 'express-session'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/session.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { passportCall, handlePolicies } from "./utils.js";
import cookieParser from 'cookie-parser'

// Creación de la aplicación y configuración del puerto
const app = express()
const PORT = 8080

app.use(cookieParser())
//flash

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: 'mongodb+srv://coder1:coder1@cluster0.lqfjhqe.mongodb.net/ecommerce',
    //     collectionName: 'sessions',
    //     mongoOptions: {
    //         useNewUrlPArser: true,
    //         useUnifiedTopology: true
    //     }
    // }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//mongoose conection
mongoose.set('strictQuery', false)
try {
    await mongoose.connect('mongodb+srv://coder1:coder1@cluster0.lqfjhqe.mongodb.net/ecommerce', {
        useUnifiedTopology: true,
    })
   
} catch(err) {
    console.log(err.message)
}


// Instancia del ProductManager y creación del servidor HTTP y Socket.IO
const productManager = new ProductManager('./src/models/products.json')
const httpServer = app.listen(PORT, () => console.log(`Server Puerto ${PORT}`))
const io = new Server(httpServer)


// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// Configuración de los archivos estáticos y el análisis del cuerpo de las solicitudes en formato JSON
app.use(express.static('./src/public'))
//para enviar los form por Tclient o PostMan
app.use(express.json())
//para poder enviar datos por formulario
app.use(express.urlencoded({ extended: true}))
// Middleware para agregar el objeto "io" a cada solicitud
app.use((req, res, next) => {
    req.io = io
    next()
})


// Rutas de productos y carritos de la API
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// Ruta de vistas
app.use('/', viewsRouter)
//jwt
app.use("/products", passportCall('jwt'), handlePolicies(['ADMIN']), viewsRouter)
app.use('/', sessionRouter)
// Conexión con Socket.IO
io.on("connection", socket => {
    console.log('Nuevo Cliente')

    // Evento para recibir la lista de productos y emitir los productos actualizados a todos los clientes
    socket.on('productList', async (data) => {
        let products = await productManager.addProducts(data)
        io.emit('updatedProducts', products)
    })
})
