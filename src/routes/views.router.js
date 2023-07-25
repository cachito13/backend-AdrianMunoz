import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'
import productModel from '../dao/models/product.model.js'
import messageModel from '../dao/models/chat.model.js'
import cartModel from '../dao/models/cart.model.js'

const viewsRouter = Router()

//validaciones de logueo
const auth = (req, res, next) => {
  if(req.session?.user && req.session.user.email === 'adminCoder@coder.com' && req.session.user.role === "Administrador/a") {
      return next()
  }
  return res.render('userError', {
      statusCode: 403,
      error: 'Only avaiable for Administrators.',
      user: req.session.user ? true : false
  })
}
//validaciones de logueo
const auth2 = (req, res, next) => {
  if(req.session.user) {
      return next()
  }
  return res.render('userError', {
      statusCode: 403,
      error: 'You must create a user or login.',
      user: req.session.user ? true : false
  })
}


viewsRouter.get('/',auth2,  async (req, res) => res.render('index'))

viewsRouter.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - Iniciar sesión'
    })
})

viewsRouter.get('/register', (req, res) => {
    res.render('register', {
        title: 'Registrarse'
    })
})

viewsRouter.get('/userError', (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'An error has ocurred. Do not enter this link.',
        user: req.session.user ? true : false
    })
})
// viewsRouter.get('/products', async (req, res) => {
//     try{
//         const result = await productModel.paginate({}, { page:1, limit: 5, lean: true})
//         res.render('products',  result )
       
//     } catch(err) {
//         res.status(500).json({ status: 'error', error: err.message})
//     }
    
// })

viewsRouter.get('/products', auth2, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === 'desc' ? -1 : 1;
      const query = req.query.query || {};
  
      const filter = {};
  
      if (query.category) {
        filter.category = query.category;
      }
  
      if (query.availability) {
        filter.availability = query.availability;
      }
  
      const options = {
        page,
        limit,
        sort: { price: sort },
        lean: true,
      };
  
      const result = await productModel.paginate(filter, options);
  
      const totalCount = result.totalDocs;
      const totalPages = result.totalPages;
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevPage = hasPrevPage ? page - 1 : null;
      const prevLink = hasPrevPage
        ? `http://localhost:8080/products?page=${prevPage}&limit=${limit}`
        : null;
      const nextLink = hasNextPage
        ? `http://localhost:8080/products?page=${nextPage}&limit=${limit}`
        : null;
        const userInformation = {
          name: req.session.user ? req.session.user.name : null,
          role: req.session.user ? req.session.user.role : null,
          checkingRole: req.session.user?.role === 'Administrador/a', // Puedes simplificar la comprobación usando el operador "?." (opcional chaining)
        };
      res.status(200).render('products', {
        status: 'success',
        payload: result.docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
        user: userInformation,
      });

    } catch (err) {
      
      res.status(500).json({ status: 'error', error: err.message });
    }
  });
  


viewsRouter.get('/realTimeProducts', auth, auth2, async (req, res) => {
    try{
        const products = await productModel.find().lean().exec()
        res.render('realTimeProducts', { products })
        
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message})
    }
})

viewsRouter.get("/chat", async (req, res) => {
    try {
      const messages = await messageModel.find().lean().exec();
      res.render("chat", { messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });
  viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
      // const cid = '64b31942025c38e724fadff9' 
      const cid = req.params.cid
    
        const result = await cartModel.findById(cid).populate('products.product').lean().exec()
      
        res.render('carts', { cid: result._id, products: result.products })
       
    } catch (error) {
        console.error(error);
        res.status(404).send('Carrito no encontrado');
    }
  })
  
export default viewsRouter