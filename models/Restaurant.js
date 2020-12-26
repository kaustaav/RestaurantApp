const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        required: false
    },
    items: [
        {
            name: {
                type: String,
                required: true
            },
            img: {
                type: String,
                required: true
            },
            cost: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        },
    ],
    orders: [
        {
            itemname: {
                type: String
            },
            itemimg: {
                type: String,
            },
            itemcost: {
                type: Number
            },
            itemtype: {
                type: String
            },
            orderedByName: {
                type: String,
            },
            orderedByEmail: {
                type: String
            },
            orderDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    contact_no: {
        type: Number,
        min: 0000000000,
        max: 9999999999,
        required: false
    },
    passwordResetToken: {
        type: String,
        required: false
    },
    passwordResetExpiry: {
        type: Date,
        required: false
    }
})

module.exports = Restaurant = mongoose.model("restaurant", restaurantSchema);