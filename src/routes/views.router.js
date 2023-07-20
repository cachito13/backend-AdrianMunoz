import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'
import productModel from '../dao/models/product.model.js'
import messageModel from '../dao/models/chat.model.js'
import cartModel from '../dao/models/cart.model.js'

const viewsRouter = Router()

viewsRouter.get('/', async (req, res) => res.render('index'))

// viewsRouter.get('/products', async (req, res) => {
//     try{
//         const result = await productModel.paginate({}, { page:1, limit: 5, lean: true})
//         res.render('products',  result )
       
//     } catch(err) {
//         res.status(500).json({ status: 'error', error: err.message})
//     }
    
// })

viewsRouter.get('/products', async (req, res) => {
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
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });
  


viewsRouter.get('/realTimeProducts', async (req, res) => {
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
      const cid = req.params.cid
    
        const result = await cartModel.findById(cid).populate('products.product').lean().exec()
      
        res.render('carts', { cid: result._id, products: result.products })
       
    } catch (error) {
        console.error(error);
        res.status(404).send('Carrito no encontrado');
    }
  })
  
export default viewsRouter