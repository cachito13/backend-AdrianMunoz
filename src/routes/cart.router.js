import { Router } from 'express'
import CartManager from '../classes/CartManager.js'

const CartRouter = Router()
const cartManager = new CartManager("./src/models/carts.json")

// Obtener todos los carritos
CartRouter.get('/', async(req, res) => {
    res.send(await cartManager.getCarts())
})

// Obtener un carrito por su ID
CartRouter.get('/:cid', async(req, res) => {
    let id = req.params.cid
    let cartById = await cartManager.getCartsById(id)
    if (!cartById) {
        return res.status(404).json({ error: `Error! No existe el id(${id}) en esta lista de carritos.` })
    }
    return res.status(200).json({ cart: cartById })
})

// Agregar un nuevo carrito
CartRouter.post('/', async(req, res) => {
    await cartManager.addCarts()
    return res.status(200).json({ message: 'Carrito Agregado!' })
})

// Agregar un producto a un carrito
CartRouter.post('/:cid/product/:pid', async(req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    let result = await cartManager.addProductInCart(cartId, productId)
    if (result == "Carrito no encontrado") {
        return res.status(404).json({ message: 'Carrito no encontrado.' })
    }
    if (result == "Producto no encontrado") {
        return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    if (result == "Producto sumado al carrito.") {
        return res.status(200).json({ message: "Producto sumado al carrito." })
    }
    return res.status(200).json({ message: "Producto agregado al carrito." })
})

export default CartRouter
