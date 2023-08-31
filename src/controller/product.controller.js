import {ProductService} from "../services/index.js";



export const getAllProdController = async (req, res) => {
  try {
    const limit = req.query.limit || 0;
    const products = await ProductService.getAllProducts();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getOneProductController = async(req, res) => {
  try{
      let id = req.params.id
      let productById = await ProductService.getOneProductController(id)
      if(productById === null){
          return res.status(404).json({ status: 'error', error: 'Not Found'})
      }
      return res.status(201).json({ status: 'success', payload: productById })
  } catch(err){
      res.status(500).json({ status: 'error', error: err.message })
  }
}
export const postOneProductController = async (req, res) => {
  const productNew = req.body;
  try {
    const productGenerate = await ProductService.createProduct(productNew);
    res.status(200).json({ status: 'success', payload: productGenerate.payload });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

export const putOneProductController = async (req, res) => {
  try {
    const productId = req.params.pid;
    const data = req.body;
    const result = await ProductService.updateProduct(productId, data);
    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const delOneProductController = async (req, res) => {
  try {
    const id = req.params.pid;
    const result = await ProductService.deleteProduct(id);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    res.status(200).json({ status: 'success', payload: result });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};
