export default class CartRepository {
    constructor(dao){
        this.dao = dao
    }
    getCarts = async() => await this.dao.getCarts()
    createCart = async(data) => await this.dao.createCart(data)
    getCartById = async(id) => await this.dao.getCartById(id)
    getCartByIdMongooseObj = async(id) => await this.dao.getCartByIdMongooseObj(id)
    addProductToCart = async(cart, pid) => await this.dao.addProductToCart(cart, pid)
    getProductsFromCart = async(req, res) => await this.dao.getProductsFromCart(req, res)
    updateCart = async(cid, pid) => await this.dao.updateCart(cid, pid)
    removeProductFromCart = async(cid, pid) => await this.dao.removeProductFromCart(cid, pid)
    productsPopulated = async(cartId) => await this.dao.productsPopulated(cartId)
}