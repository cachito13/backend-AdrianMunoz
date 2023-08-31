import CartDao from "../dao/MongoManager/Cart.mongo.dao.js";
import CartRepository from "../repositories/cart.repository.js";

import ProductDAO from '../dao/MongoManager/Product.mongo.dao.js'
import ProductRepository from '../repositories/product.repository.js'


export const CartService = new CartRepository(new CartDao())
export const ProductService = new ProductRepository(new ProductDAO())
