import { CartService } from "../services/index.js";



export default class CartController {
    get = async (req, res) => {
        try {
          const carts = await CartService .getCarts()
          res.status(200).json({status: "success", payload: carts});
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
      }

   getOne = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await CartService.getCartById(cid);
      res.send(cart);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  }

    post = async (req, res) => {
        try {
          const cart = req.body
          const addCart = await CartService.createCart(cart)
          res.json({ status: "success", payload: addCart })
        } catch (error) {
          console.log(error)
          return res.status(500).json({ status: "error", error: error.message })
        }
    }

    
    put = async (req, res) => {
        try {
          const cid = req.params.cid
          const updatedProducts = req.body.products;
          const result = await CartService.updateCart(cid, updatedProducts)
          res.json({ status: "success", payload: result })
        } catch (error) {
          console.log(error)
          return res.status(500).json({ status: "error", error: error.message })
        }
    }

    putProduct =  async (req, res) => {
        try {
          const cid = req.params.cid
          const pid = req.params.pid
          const cart = await CartService.getCartById(cid, pid)
          if (!cart) {
            return res.status(404).json({ status: "error", error: "Cart not found" })
          }
      
          const updatedProducts = req.body.products;
      
          const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === pid
          );
          
          if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = updatedProducts.quantity;
          } else {
            return res.status(404).json({ status: "error", error: "Product not found in cart" })
          }
      
          const result = await CartService .updateCart(cid, cart.products)
          res.json({ status: "success", payload: result })
        } catch (error) {
          console.log(error)
          return res.status(500).json({ status: "error", error: error.message })
        }
    }

    
    postProduct = async (req, res) => {
        try {
          const pid = req.params.pid
          const cid = req.user.cart
          console.log(pid)
          console.log(cid)
          const result = await CartService.addProductToCart(cid, pid)
          res.json({ status: "success", payload: result })
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
    }

    deleteProduct = async (req, res) => {
        try {
          const cid = req.params.cid;
          const pid = req.params.pid;
          const result = await CartService.removeProductFromCart(cid, pid);
          res.json({ status: "success", payload: result });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
          const cid = req.params.cid;
          
          const result = await CartService.removeCart(cid);
          res.json({ status: "success", payload: result });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
    }
}