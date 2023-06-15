// Importaciones de módulos
import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './classes/ProductManager.js'

// Creación de la aplicación y configuración del puerto
const app = express()
const PORT = 8080

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
app.use(express.json())

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

// Conexión con Socket.IO
io.on("connection", socket => {
    console.log('Nuevo Cliente')

    // Evento para recibir la lista de productos y emitir los productos actualizados a todos los clientes
    socket.on('productList', async (data) => {
        let products = await productManager.addProducts(data)
        io.emit('updatedProducts', products)
    })
})