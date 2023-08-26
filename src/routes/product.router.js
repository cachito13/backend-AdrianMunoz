import { Router } from 'express'
import { getAllProdController,
         getOneProductController,
         postOneProductController,
        putOneProductController,
      delOneProductController } from '../controller/product.controller.js'

const router = Router()



//todos los productos
router.get("/", getAllProdController)

// Obtener un producto por ID
router.get('/:pid', getOneProductController)

// Agregar un nuevo producto
router.post('/', postOneProductController )

// Actualizar un producto por ID
router.put("/:pid", putOneProductController)

// Eliminar un producto por ID
router.delete('/:pid', delOneProductController)
  
export default router