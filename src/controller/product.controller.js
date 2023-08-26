import ProductManager from "../dao/MongoManager/ProductM.js"
import productModel from "../dao/models/product.model.js"



export const getAllProdController = async (req, res) => {
    try {
      const limit = req.query.limit || 0
      const productManager = new ProductManager()
      const products = await productManager.getProducts()
      res.status(200).json({products})
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

export const getOneProductController = async (req, res) => {
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
  
  }

  export const postOneProductController = async (req, res) => {
    const productNew = req.body;
    try {
      const productGenerate = await ProductManager.createProduct(productNew);
      res.status(200).json({ status: 'success', payload: productGenerate.payload });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  }

  export const putOneProductController =  async (req, res) => {
    try {
      const productId = req.params.pid
      const data = req.body
      const result = await ProductManager.updateProduct(productId, data)
      const products = await productModel.find().lean().exec()
      res.status(200).json({status: "success", payload: result})
    } catch (err) {
      res.status(500).json({ status: "error", error: err.message })
    }
  }

  export const delOneProductController =  async (req, res) => {
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
  }