import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'

import { cartViewController,
         chatViewController, 
         realViewController, 
         productViewController, 
         errorViewController, 
         registerViewController, 
         loginViewController, 
         indexViewController } from '../controller/views.controller.js'
import { auth, auth2 } from '../utils.js'

const viewsRouter = Router()

//vista de inicio
viewsRouter.get('/', indexViewController)  
//vista de login
viewsRouter.get('/login', loginViewController)
//vista para registrar usuarios
viewsRouter.get('/register', registerViewController)
// vista para registrar errores
viewsRouter.get('/userError', errorViewController)
//vista de productos
viewsRouter.get('/products', auth2, productViewController)
//vista de realTime
viewsRouter.get('/realTimeProducts', auth, auth2, realViewController)
//vista del chat
viewsRouter.get("/chat", chatViewController)
//vista del carrito
viewsRouter.get('/carts/:cid', cartViewController)
  
export default viewsRouter