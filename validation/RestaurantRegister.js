const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRestaurantRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name)?data.name:'';
    data.email = !isEmpty(data.email)?data.email:'';
    data.password = !isEmpty(data.password)?data.password:'';
    data.password2 = !isEmpty(data.password2)?data.password2:'';
    data.location = !isEmpty(data.location)?data.location:'';
    data.contact_no = !isEmpty(data.contact_no)?data.contact_no:'';

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    } else if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    if(Validator.isEmpty(data.contact_no)) {
        errors.contact_no = 'Contact no. field is required';
    }

    if(!Validator.isLength(data.contact_no, {min: 10, max: 10})) {
        errors.contact_no = 'Contact no. must be of 10 digits';
    }

    // if(!Validator.isValid())

    return {
        errors,
        isValid: isEmpty(errors)
    }
}