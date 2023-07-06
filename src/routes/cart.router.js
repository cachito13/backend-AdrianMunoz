// import { Router } from 'express'

// import CartManager from '../dao/fsManager/CartManager.js'

// const CartRouter = Router()
// const cartManager = new CartManager("./src/models/carts.json")

// // Obtener todos los carritos
// CartRouter.get('/', async(req, res) => {
//     res.send(await cartManager.getCarts())
// })

// // Obtener un carrito por su ID
// CartRouter.get('/:cid', async(req, res) => {
//     let id = req.params.cid
//     let cartById = await cartManager.getCartsById(id)
//     if (!cartById) {
//         return res.status(404).json({ error: `Error! No existe el id(${id}) en esta lista de carritos.` })
//     }
//     return res.status(200).json({ cart: cartById })
// })

// // Agregar un nuevo carrito
// CartRouter.post('/', async(req, res) => {
//     await cartManager.addCarts()
//     return res.status(200).json({ message: 'Carrito Agregado!' })
// })

// // Agregar un producto a un carrito
// CartRouter.post('/:cid/product/:pid', async(req, res) => {
//     let cartId = req.params.cid
//     let productId = req.params.pid
//     let result = await cartManager.addProductInCart(cartId, productId)
//     if (result == "Carrito no encontrado") {
//         return res.status(404).json({ message: 'Carrito no encontrado.' })
//     }
//     if (result == "Producto no encontrado") {
//         return res.status(404).json({ message: 'Producto no encontrado.' })
//     }
//     if (result == "Producto sumado al carrito.") {
//         return res.status(200).json({ message: "Producto sumado al carrito." })
//     }
//     return res.status(200).json({ message: "Producto agregado al carrito." })
// })

// export default CartRouter


import { Router } from "express"
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";

const router = Router()

router.post("/", async (req, res) => {
    try {
      const cart = req.body;
      const addCart = await cartModel.create(cart);
      res.json({ status: "success", payload: addCart })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", error: error.message })
    }
  })
  
  router.post("/:cid/product/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await productModel.findById(pid)
      if (!product) {
        return res.status(404).json({ status: "error", error: error.message })
      }
      const cid = req.params.cid;
      const cart = await cartModel.findById(cid)
      if (!cart) {
        return res.status(404).json({ status: "error", error: error.message })
      }
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      )
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1
      } else {
        const newProduct = {
          product: pid,
          quantity: 1,
        }
        cart.products.push(newProduct);
      }
      const result = await cart.save();
      res.json({ status: "success", payload: result })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: "error", error: error.message })
    }
  })
  
  router.get("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", error: error.message })
      }
      res.send(cart)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
    }
  })
  
  export default router