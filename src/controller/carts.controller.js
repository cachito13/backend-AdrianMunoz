import CartManager from "../dao/MongoManager/CartM.js" 


const cartManager = new CartManager();


export default class CartController {
    get = async (req, res) => {
        try {
          const carts = await cartManager.getCarts()
          res.status(200).json({status: "success", payload: carts});
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
      }

   getOne = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartManager.getCartById(cartId);
      res.send(cart);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  }

    post = async (req, res) => {
        try {
          const cart = req.body
          const addCart = await cartManager.createCart(cart)
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
          const result = await cartManager.updateCart(cid, updatedProducts)
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
          const cart = await cartManager.getCartById(cid)
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
      
          const result = await cartManager.updateCart(cid, cart.products)
          res.json({ status: "success", payload: result })
        } catch (error) {
          console.log(error)
          return res.status(500).json({ status: "error", error: error.message })
        }
    }

    postProduct = async (req, res) => {
        try {
          const pid = req.params.pid
          const cid = req.params.cid
          const result = await cartManager.addProductToCart(cid, pid)
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
          const result = await cartManager.removeProductFromCart(cid, pid);
          res.json({ status: "success", payload: result });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
    }

    delete = async (req, res) => {
        try {
          const cid = req.params.cid;
          
          const result = await cartManager.removeCart(cid);
          res.json({ status: "success", payload: result });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ status: "error", error: error.message });
        }
    }
}