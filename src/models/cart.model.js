// import mongoose from "mongoose";

// const cartSchema = mongoose.Schema({
//     products: {
//         type: [{
//             _id: false,
//             product:mongoose.ObjectId,
//             quantity: Number
//         }],
//         default: []
//     }

// })

// mongoose.set('strictQuery', false)
// const cartModel = mongoose.model('carts', cartSchema)

// export default cartModel

import mongoose from 'mongoose'

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({

    products: {

        type: [{

            _id: false,

            product: {

                type: mongoose.Schema.Types.ObjectId,

                ref: "products"

            },

            quantity: Number

        }],

        default: []

    }

})

 

mongoose.set('strictQuery', false)

const cartModel = mongoose.model(cartsCollection, cartSchema)

 

export default cartModel