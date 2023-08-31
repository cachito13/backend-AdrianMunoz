
export default class ProductRepository {
  constructor(dao) {
    this.dao = dao
  }

  async getAllProducts(req) {
    return await this.dao.getAllProducts(req);
  }

  async getProductById(id) {
    return await this.dao.getProductById(id);
  }

  async createProduct(data) {
    return await this.dao.createProduct(data);
  }

  async updateProduct(id, data) {
    return await this.dao.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return await this.dao.deleteProduct(id);
  }

  async getProducts() {
    return await this.dao.getProducts();
  }
}
