import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
    role: {type: String, default: 'user'}
    })

mongoose.set('strictQuery', false)
const userModel = mongoose.model(usersCollection, userSchema)

export default userModel