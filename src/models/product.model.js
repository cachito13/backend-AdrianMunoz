import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products";

const productschema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: {type: String, required: true },
    price: {type: Number, required: true },
    code: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true},
    category: {type: String, required: true},
    thumbnail: { type: [String], default: []},
})
productschema.plugin(mongoosePaginate)
mongoose.set('strictQuery', false)
const productModel = mongoose.model(productsCollection, productschema)

export default productModel
