const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose schema for user model

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
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
    preference: {
        type: String,
        required: true
    },
    orders: [{
        ordername: {
            type: String
        },
        orderimg: {
            type: String
        },
        ordercost: {
            type: Number
        },
        ordertype: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        restaurantName: {
            type: String
        },
        restaurantEmail: {
            type: String
        }
    }],
    cart: [{
        date: {
            type: Date,
            default: Date.now
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        restaurantName: {
            type: String
        },
        restaurantEmail: {
            type: String
        },
        itemName: {
            type: String
        },
        itemCost: {
            type: Number
        },
        itemType: {
            type: String
        },
        itemImg: {
            type: String
        }
    }],
    passwordResetToken: {
        type: String,
        required: false
    },
    passwordResetExpiry: {
        type: Date,
        required: false
    }
})

module.exports = User = mongoose.model("users", UserSchema);