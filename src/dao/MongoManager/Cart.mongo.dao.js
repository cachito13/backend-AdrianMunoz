import cartModel from "../../models/cart.model.js"
import productModel from "../../models/product.model.js"

  export default class CartDao {

    getCarts = async() => await cartModel.find().lean().exec()
    createCart = async(cartData) => await cartModel.create(cartData)
    getCartById = async(cartId) => await cartModel.findById(cartId).lean().exec()
    getCartByIdMongooseObj = async(id) => await cartModel.findById(id)
    addProductToCart = async(cartId, productId) => {
    let cartByIdInDB = await cartModel.findById(cartId)
    if(!cartByIdInDB) return 'Cart Not Found'
    let productByIdInDB = await productModel.findById(productId)
    if(!productByIdInDB) return 'Product Not Found'

    const productIndex = cartByIdInDB.products.findIndex(
        (item) => item.product.toString() === productId
    );
    if (productIndex !== -1) {
        cartByIdInDB.products[productIndex].quantity += 1;
    } else {
        cartByIdInDB.products.push({
        product: productId,
        quantity: 1,
        });
    }
    await cartByIdInDB.save()
    return cartByIdInDB
  }
    getProductsFromCart = async(req, res) => {
  try{
      const id = req.params.cid
      const result = await cartModel.findById(id).populate('products.product').lean().exec()
      if(result === null){
          return null
      }
      return result
  }catch(err){
      res.status(500).json({ status: 'error', error: err.message })
  }
}
    updateCart = async(cartId, updatedProducts) => await cartModel.findByIdAndUpdate(cartId, { updatedProducts }, { new: true })
    removeProductFromCart = async(cartId, productId) => {
    const cart = await cartModel.findById(cartId)
    if (!cart) {
        return 'Carrito no encontrado'
    }
    const productIndex = cart.products.findIndex(product => product.product == productId);
    if (productIndex === -1) {
        return 'Producto no encontrado en el carrito.'
    }
    cart.products.splice(productIndex, 1)
    await cart.save()
    return cart
}
    productsPopulated = async(cartId) => await cartModel.findById(cartId).populate('products.product').lean()





}

