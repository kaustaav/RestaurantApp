const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateUserRegisterInput = require('../../validation/UserRegister');
const validateLoginInput = require('../../validation/login');
const validateForgetPasswordInput = require('../../validation/forgetPassword');
const User = require('../../models/User');
const Restaurant = require('../../models/Restaurant');
const msgs = require('../../email/msgs');
const sendEmail = require('../../email/send');
const templates = require('../../email/templates');
const VerifyToken = require('../../validation/VerifyToken');
const { restart } = require('nodemon');

// Route for users
// all apis connected to users are in this file

// for registration of restaurants

router.post('/register', (req,res) => {
    const {errors, isValid} = validateUserRegisterInput(req.body);

    // shows error if input not valid

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            // if new account then tries to register account

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                preference: req.body.preference
            });

            // generates encrypted password

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            // sends confirmation email

                            sendEmail(user.email, templates.confirm(user._id, 'users'));
                            res.json({msg: msgs.confirm});
                        })
                        .catch(err => console.log(err));
                });
            });
        }
        else if(user && user.verified) {
            // if user already exists and verified 
            // shows account exists

            return res.status(400).json({ email: 'Email already exists' });
        }
        else if(user && !user.verified) {
            // if user exists but not verified
            // resend confirmation mail

            sendEmail(user.email, templates.confirm(user._id, 'users'))
                .then(() => res.json({ msg: msgs.resend }))
                .catch(err => console.log(err));
        }
    });
});

// when user hits login

router.post('/login', (req,res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    // shows error if login data invalid

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user => {
        if(!user) {
            // if user not found then shows error

            return res.status(400).json({ emailnotfound: 'Email not found' });
        } else if(!user.verified) {
            // if user not verified asks for confirmation

            return res.status(400).json({ email: 'Account not verified. Confirm email' })
        }

        // if verified user exists ...
        // compares password with encrypted password 

        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    id: user.id,
                    type: 'user'
                };

                // if password matched then generates
                // jwt token valid for 1 year

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                );
            } else {
                // if password doesn't match shows error

                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});

// when users confirms email

router.get('/confirm/:id', (req,res) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if(!user) {
                // if account not found shows error

                res.json({msg: msgs.couldNotFind});
            }
            else if (user && !user.verified) {
                // if account found & not verifed
                // already then verifies account

                User.findByIdAndUpdate(id, {verified: true})
                    .then(() => res.json({msg: msgs.confirmed}))
                    .catch(err => console.log(err))
            }
            else {
                // if account already verified
                // shows corresponding message

                res.json({msg: msgs.alreadyConfirmed});
            }
        })
        .catch(err => console.log(err))
})

// proteced api to fetch user details
// excludes password
// access denied if user not logged in

router.get('/accountinfo', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'user') res.status(401).send('Access Denied');
    
    User.findById(account.id, '-password')
        .then(user => {
            if(!user) {
                return res.status(400).send('Account does not exist.')
            } else {
                return res.json(user);
            }
        })
})

// protected api to oreder item
// access denied if user not logged in

router.post('/order', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'user') res.status(401).send('Access Denied');

    let restaurantid = req.body.restaurantid;
    let itemid = req.body.itemid;
    let itemname;
    let itemimg;
    let itemcost;
    let itemtype;
    let restaurantName;
    let restaurantEmail;
    let username;
    let useremail;

    User.findById(account.id)
        .then(user => {
            if(!user) {
                // if user doesn't exist shows error

                return res.status(400).send('User not found');
            } else {
                username = user.name;
                useremail = user.email;
                Restaurant.findById(restaurantid)
                    .then(restaurant => {
                        if(!restaurant) {
                            // if restaurant doesn't exist shows error

                            return res.status(400).send('Restaurant not found');
                        } else {
                            // if food item doesn't exist shows error

                            item = restaurant.items.find(item => item._id == itemid);
                            if(!item) return res.status(400).send('Item not found');

                            restaurantName = restaurant.name;
                            restaurantEmail = restaurant.email;
                            itemname = item.name;
                            itemimg = item.img;
                            itemcost = item.cost;
                            itemtype = item.type;
                            
                            // add order in restaurant database
                            // sorts by order time

                            Restaurant.findByIdAndUpdate(restaurantid,
                                {$push:
                                    {orders: 
                                        {$each: [{
                                            itemname: itemname,
                                            itemimg: itemimg,
                                            itemcost: itemcost,
                                            itemtype: itemtype,
                                            orderedByName: username,
                                            orderedByEmail: useremail
                                        }],
                                        $sort: { orderDate: -1 }
                                }}})
                                .then(() => {
                                    // add order in user database
                                    // sorts by order time

                                    User.findByIdAndUpdate(account.id,
                                        {$push:
                                            {orders:
                                                {$each: [{
                                                    ordername: itemname,
                                                    orderimg: itemimg,
                                                    ordercost: itemcost,
                                                    ordertype: itemtype,
                                                    restaurantName: restaurantName,
                                                    restaurantEmail: restaurantEmail
                                                }],
                                                $sort: { date: -1 }
                                        }}})
                                        .then(() => res.json({msg: 'Order Placed Successfully'}))
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        }
                    })
            }
        })
        .catch(err => console.log(err));
})

//  protected API to add item in cart
// access denied if user not logged in

router.post('/cart/add', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'user') res.status(401).send('Access Denied');

    let restaurantId = req.body.restaurantId;
    let itemId = req.body.itemId;
    let restaurantName;
    let restaurantEmail;
    let itemName;
    let itemCost;
    let itemImg;
    let itemType;

    User.findById(account.id)
        .then(user => {
            if(!user) {
                // if user not found shows error

                return res.status(400).send('User not found');
            } else {
                // if item already exists in cart,
                // doesn't add it again

                cart_exists = user.cart.find(item => item.itemId == itemId);
                if(cart_exists) return res.status(400).json({error: 'Item already exists in cart'}).end();
                
                Restaurant.findById(restaurantId)
                    .then(restaurant => {
                        if(!restaurant) {
                            // if restaurant not found shows error

                            return res.status(400).send('Restaurant not found');
                        } else {
                            // if food item not found shows error

                            item = restaurant.items.find(item => item._id == itemId);
                            if(!item) return res.status(400).send('Item not found');

                            restaurantName = restaurant.name;
                            restaurantEmail = restaurant.email;
                            itemName = item.name;
                            itemImg = item.img;
                            itemCost = item.cost;
                            itemType = item.type;

                            // pushes in user cart database 
                            // and returns current cart items

                            User.findByIdAndUpdate(account.id,
                                {$push: 
                                    {cart:
                                        {$each: [{
                                            itemId: itemId,
                                            restaurantId: restaurantId,
                                            restaurantName: restaurantName,
                                            restaurantEmail: restaurantEmail,
                                            itemName: itemName,
                                            itemImg: itemImg,
                                            itemCost: itemCost,
                                            itemType: itemType
                                        }],
                                        $sort: { date: -1 }
                                }}},
                                {new: true})
                                .then(data => res.json({success: data.cart}))
                                .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

// protected api to remove item from cart
// access denied if user not logged in

router.post('/cart/remove', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'user') res.status(401).send('Access Denied');

    let restaurantId = req.body.restaurantId;
    let itemId = req.body.itemId;

    User.findById(account.id)
        .then(user => {
            if(!user) {
                // if user not found shows error

                return res.status(400).send('User not found');
            } else {
                Restaurant.findById(restaurantId)
                    .then(restaurant => {
                        if(!restaurant) {
                            // if restaurant not found shows error

                            return res.status(400).send('Restaurant not found');
                        } else {
                            // if item not found shows error

                            item = restaurant.items.find(item => item._id == itemId);
                            if(!item) return res.status(400).send('Item not found');

                            // removes from cart
                            // & return current cart items

                            User.findByIdAndUpdate(account.id,
                                {$pull:
                                    {cart: {
                                        restaurantId: restaurantId,
                                        itemId: itemId
                                }}},
                                {new: true})
                                .then(data => res.json({success: data.cart}))
                                .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
        .then(err => console.log(err))
})

// router.post('/forget_password', (req,res) => {
//     const {errors, isValid} = validateForgetPasswordInput(req.body);

//     if(!isValid) {
//         return res.status(400).json(errors);
//     }

//     User.findOne({ email: req.body.email }).then(user => {
//         if(user && user.verified) {
//             const token = crypto.randomBytes(20).toString('hex');
//             User.findOneAndUpdate(
//                     {email: req.body.email},
//                     {passwordResetToken: token, passwordResetExpiry: Date.now()+600000}
//                 )
//                 .then(() => res.json({msg: 'Sending email'}))
//                 .then(() => sendEmail(req.body.email, templates.forget_pass(user._id, token)))
//                 .catch(err => console.log(err));
//         }
//         else if(!user) {
//             return res.status(400).json({ emailnotfound: 'Email not found' });
//         }
//         else {
//             res.json({msg: msgs.confirmToProceed});
//         }
//     })
// })

// router.get('/reset_password', (req,res) => {
//     const id = req.query.id;
//     const token = req.query.token;
//     User.findById(id)
//         .then(user => {
//             if(!user) {
//                 return res.status(400).json({ msg: 'id not found' })
//             }
//             else if(user && user.passwordResetToken !== token) {
//                 return res.status(400).json({ msg: 'Invalid token' })
//             }
//             else if(user && user.passwordResetToken === token && user.passwordResetExpiry.getTime() >= Date.now()) {
//                 return res.status(200).json({ success: true })
//             }
//             else if(user && user.passwordResetToken === token && user.passwordResetExpiry.getTime() < Date.now()) {
//                 return res.status(400).json({ msg: 'Token expired' })
//             }
//         })
//         .catch(err => console.log(err));
// })

module.exports = router;