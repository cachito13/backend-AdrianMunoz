import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'
import productModel from '../dao/models/product.model.js'

const viewsRouter = Router()
// const productManager = new ProductManager('./src/models/products.json')
// const readProducts = await productManager.readProducts()

// viewsRouter.get('/', (req, res) => {
//     res.render('home', {
//         title: "Programación backEnd | Handlebars",
//         products: readProducts
//     })
// })

// viewsRouter.get('/realTimeProducts', (req, res) => {
//     res.render('realTimeProducts', {
//         title: "Handlebars | Websocket",
//         products: readProducts
//     })
// })

viewsRouter.get('/', async (req, res) => {
    try{
        const products = await productModel.find().lean().exec()
        res.render('home', { products })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message})
    }
    
})

viewsRouter.get('/realTimeProducts', async (req, res) => {
    try{
        const products = await productModel.find().lean().exec()
        res.render('home', { products })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message})
    }
})

export default viewsRouter