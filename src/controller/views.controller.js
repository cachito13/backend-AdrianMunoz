import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";

import messageModel from '../dao/models/chat.model.js'


export const cartViewController = async (req, res) => {
    try {
      const cid = req.params.cid;
  
      console.log("req.user:", req.user); // Agregado para verificar el contenido de req.user
  
      const user = {
        name: req.user.name,
        surname: req.user.surname,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart,
      };
      console.log(user.cart)
      console.log("user:", user); // Agregado para verificar el contenido de user
  
      const result = await cartModel
        .findById(cid)
        .populate("products.product")
        .lean()
        .exec();
  
      console.log("result:", result); // Agregado para verificar el contenido de result
  
      res.render("carts", { cid: result._id, products: result.products, user });
    } catch (error) {
      console.error(error);
      res.status(404).send("Carrito no encontrado");
    }
  };

  export const chatViewController =   async (req, res) => {
    try {
      const messages = await messageModel.find().lean().exec();
      res.render("chat", { messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }

  export const realViewController =  async (req, res) => {
    try{
        const products = await productModel.find().lean().exec()
        res.render('realTimeProducts', { products })
        
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message})
    }
}

export const productViewController= async (req, res) => {
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
  }
  
  export const errorViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'An error has ocurred. Do not enter this link.',
        user: req.session.user ? true : false
    })
}

export const registerViewController =(req, res) => {
    res.render('register', {
        title: 'Registrarse'
    })
}

export const loginViewController =(req, res) => {
    res.render('login', {
        title: 'Login - Iniciar sesión'
    })
}

export const indexViewController = async (req, res) => res.render('index')