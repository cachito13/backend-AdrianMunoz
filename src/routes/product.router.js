import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'
import productModel from '../dao/models/product.model.js'
import ProductManager from '../dao/MongoManager/ProductM.js'
const router = Router()


// router.get('/', async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 0; // Parsea el límite a un número entero
//     const totalProducts = await productModel.countDocuments(); // Obtiene la cantidad total de productos
    
//     if (limit > totalProducts) {
//       throw new Error('El límite especificado es mayor que la cantidad de productos.');
//     }
    
//     const result = await productModel.find().limit(limit).exec();
//     res.status(200).json({ status: 'success', payload: result });
//   } catch (err) {
//     res.status(400).json({ status: 'error', message: err.message });
//   }
  
// })

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 0
    const productManager = new ProductManager()
    const products = await productManager.getProducts()
    res.status(200).json({products})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



// Obtener un producto por ID

// router.get('/:pid', async (req, res) => {
//   try {
//     const id = req.params.pid;
    
//     const result = await productModel.findOne({_id: id}).lean().exec();

//     if (result === null) {
//       return res.status(404).json({ status: 'error', message: 'Not found' });
//     }

//     res.status(200).json({ status: 'success', payload: result });
//   } catch (err) {
//     res.status(500).json({ status: 'error', error: err.message });
//   }

// })
router.get('/:pid', async (req, res) => {
  try {
    const id = req.params.pid;
    
    const result = await productModel.findOne({_id: id}).lean().exec();

    if (result === null) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    res.status(200).json({ status: 'success', payload: result });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }

})


// Agregar un nuevo producto
// router.post('/', async (req, res) => {
//   const productNew = req.body
//   const productGenerate = new productModel(productNew)
//   try{
//     await productGenerate.save()
//     res.status(200).json({ status: 'succes', payload: productGenerate})
//   }catch(err) {
//     res.status(500).json({ status: 'error', error: err.message})
//   }
// })

router.post('/', async (req, res) => {
  const productNew = req.body;
  try {
    const productGenerate = await ProductManager.createProduct(productNew);
    res.status(200).json({ status: 'success', payload: productGenerate.payload });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});



// Actualizar un producto por ID
// router.put('/:pid', async (req, res) => {
// try{
//     const id = req.params.pid
//     const data = req.body
//     const result = await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after'})
//     if (result === null) {
//       return res.status(404).json({ status: 'error', message: 'Not found' });
//     }
//     const products = await productModel.find().lean().exec()
//     req.io.emit('updateProducts', products)
//     res.status(200).json({ status: 'succes', payload: result})
// } catch(err) {
//   res.status(500).json({ status: 'error', error: err.message})
// }
// })

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const data = req.body
    const result = await ProductManager.updateProduct(productId, data)
    const products = await productModel.find().lean().exec()
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
})



// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try{
    const id = req.params.pid
    const result = await productModel.findByIdAndDelete(id)
    if (result === null) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    res.status(200).json({ status: 'succes', payload: result})
  } catch(err) {
    res.status(500).json({ status: 'error', error: err.message})
  }
})
  
export default router