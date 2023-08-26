import CartController from "../controller/carts.controller.js";
import { Router } from "express"


const router = Router()
const cc = new CartController();

//rutas con controller
router.get('/', cc.get);
router.get('/:cid', cc.getOne);

router.post('/', cc.post);
router.post('/:cid/product/:pid', cc.postProduct);



router.put('/:cid', cc.put);
router.put('/:cid/product/:pid', cc.putProduct);

router.delete('/:cid/product/:pid', cc.deleteProduct);
router.delete('/:cid', cc.delete);



export default router