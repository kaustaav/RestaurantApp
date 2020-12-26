const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRestaurantRegisterInput = require('../../validation/RestaurantRegister');
const validateLoginInput = require('../../validation/login');
const validateFoodItem = require('../../validation/foodItem');
// const validateForgetPasswordInput = require('../../validation/forgetPassword');
const Restaurant = require('../../models/Restaurant');
const msgs = require('../../email/msgs');
const sendEmail = require('../../email/send');
const templates = require('../../email/templates');
// const crypto = require('crypto');
const User = require('../../models/User');
const VerifyToken = require('../../validation/VerifyToken');

router.post('/register', (req,res) => {
    const {errors, isValid} = validateRestaurantRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    
    Restaurant.findOne({ email: req.body.email }).then(restaurant => {
        if(!restaurant) {
            const newRestaurant = new Restaurant({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                location: req.body.location,
                contact_no: req.body.contact_no
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newRestaurant.password, salt, (err,hash) => {
                    if(err) throw err;
                    newRestaurant.password = hash;
                    newRestaurant
                        .save()
                        .then(restaurant => {
                            sendEmail(restaurant.email, templates.confirm(restaurant._id, 'restaurants'));
                            res.json({msg: msgs.confirm});
                        })
                        .catch(err => console.log(err));
                });
            });
        }
        else if(restaurant && restaurant.verified) {
            return res.status(400).json({ msg: msgs.alreadyConfirmed });
        }
        else if(restaurant && !restaurant.verified) {
            sendEmail(restaurant.email, templates.confirm(restaurant._id, 'restaurants'))
                .then(() => res.json({ msg: msgs.resend }))
                .catch(err => console.log(err));
        }
    })
})

router.post('/login', (req,res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Restaurant.findOne({email}).then(restaurant => {
        if(!restaurant) {
            return res.status(400).json({ emailnotfound: 'Email not found' });
        } else if(!restaurant.verified) {
            return res.status(400).json({ email: 'Account not verified. Confirm email' })
        }

        bcrypt.compare(password, restaurant.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    id: restaurant.id,
                    type: 'restaurant'
                };

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
                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});

router.get('/confirm/:id', (req,res) => {
    const { id } = req.params;
    console.log(account);

    Restaurant.findById(id)
        .then(restaurant => {
            if(!restaurant) {
                res.json({ msg: msgs.couldNotFind });
            }
            else if(restaurant && !restaurant.verified) {
                Restaurant.findByIdAndUpdate(id, {verified: true})
                    .then(() => res.json({ msg: msgs.confirmed }))
                    .catch(err => console.log(err))
            }
            else {
                res.json({ msg: msgs.alreadyConfirmed });
            }
        })
})

router.get('/accountinfo', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'restaurant') res.status(401).send('Access Denied');
    
    Restaurant.findById(account.id, '-password')
        .then(restaurant => {
            if(!restaurant) {
                return res.status(400).send('Account does not exist.')
            } else {
                return res.json(restaurant);
            }
        })
})

router.post('/add_item', VerifyToken, (req,res) => {
    const account = req.account;
    if(account.type !== 'restaurant') res.status(401).send('Access Denied');

    const { errors, isValid } = validateFoodItem(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const name = req.body.name;
    const img = req.body.img;
    const cost = req.body.cost;
    const type = req.body.type;

    Restaurant.findById(account.id)
        .then(restaurant => {
            if(!restaurant) {
                return res.status(400).send('Account was not found')
            } else {
                Restaurant.findByIdAndUpdate(account.id,
                    {$push:
                        {items:
                            {
                                name: name, 
                                img: img,
                                cost: cost,
                                type: type
                    }}})
                    .then(() => res.json({msg: 'Successfully updated'}))
                    .catch(err => console.log(err));
            }
        })
})

router.get('/restaurantlist', (req,res) => {
    Restaurant.find({}, '-password', (err,restaurants) => {
        res.json(restaurants);
    })
})

module.exports = router;