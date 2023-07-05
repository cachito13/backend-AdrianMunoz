import { Router } from 'express'
// import ProductManager from '../classes/ProductManager.js'
import productModel from '../dao/models/product.model.js'

const router = Router()

// const productManager = new ProductManager('./src/models/products.json')
// const readProducts = productManager.readProducts()
// const getProducts = productManager.getProducts()

// Validar si un producto cumple con los requisitos
// const validateProduct = async (res, product) => {
//   let products = await readProducts
//   const found = products.find(prod => prod.code === product.code)
//   const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category']

//   for (const field of requiredFields) {
//     if (!product[field]) {
//       return res.status(404).json({ status: "error", error: `Está faltando ${field} del producto.` })
//     }
//   }

//   if (found) {
//     return res.status(404).json({ status: "error", error: `Este code: ${product.code} ya existe` })
//   }
  
//   return true
// }

// Obtener todos los productos o limitar por cantidad
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // Parsea el límite a un número entero
    const totalProducts = await productModel.countDocuments(); // Obtiene la cantidad total de productos
    
    if (limit > totalProducts) {
      throw new Error('El límite especificado es mayor que la cantidad de productos.');
    }
    
    const result = await productModel.find().limit(limit).exec();
    res.status(200).json({ status: 'success', payload: result });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }

  // let limit = parseInt(req.query.limit)
  // let products = await getProducts

  // if (!limit) {
  //   return res.status(200).json({ products })
  // }

  // if (limit > products.length) {
  //   return res.status(404).json({ status: "error", error: `Error! Solo existe hasta el límite: ${products.length}` })
  // }

  // let productLimit = products.slice(0, limit)
  // return res.status(200).json({ message: `productos desde el 0 hasta ${limit}`, products: productLimit })
})

// Obtener un producto por ID

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


  // let productById = await productManager.getProductById(id)

  // if (!productById) {
  //   return res.status(404).json({ status: "error", error: `Error! No existe el id(${id}) en esta lista.` })
  // }

  // return res.status(200).json({ product: productById })
// })

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const productNew = req.body
  const productGenerate = new productModel(productNew)
  try{
    await productGenerate.save()
    res.status(200).json({ status: 'succes', payload: productGenerate})
  }catch(err) {
    res.status(500).json({ status: 'error', error: err.message})
  }
})



  // let newProduct = req.body

  // if (await validateProduct(res, newProduct)) {
  //   const productoAgregado = await productManager.addProducts(newProduct)
  //   req.io.emit('updatedProducts', productoAgregado)
  //   return res.status(200).json({ status: "success", message: 'Producto Agregado' })
  // }
// })

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
try{
    const id = req.params.pid
    const data = req.body
    const result = await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after'})
    if (result === null) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    const products = await productModel.find().lean().exec()
    req.io.emit('updateProducts', products)
    res.status(200).json({ status: 'succes', payload: result})
} catch(err) {
  res.status(500).json({ status: 'error', error: err.message})
}
})



//   let id = req.params.id
//   let updateProduct = req.body
//   let productUpdated = await productManager.updateProducts(id, updateProduct)

//   if (!productUpdated) {
//     return res.status(404).json({ status: "error", error: 'Producto No Encontrado.' })
//   }

//   if (await validateProduct(res, updateProduct)) {
//     req.io.emit('updatedProducts', await readProducts)
//     return res.status(200).json({ status: "success", message: 'Producto Actualizado' })
//   }
// })

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
    // let id = req.params.id
    // let products = await readProducts
    // let productExists = products.some(prod => prod.id == id)
  
    // if (!productExists) {
    //   return res.status(404).json({ status: "error", error: `Producto a eliminar con id: ${id} no existe.` })
    // }
  
    // let productsUpdated = await productManager.deleteProducts(id)
    // req.io.emit('updatedProducts', productsUpdated)
    // return res.status(200).json({ status: "success", message: `El producto con id: ${id} ha sido eliminado.` })
  // })
  
export default router