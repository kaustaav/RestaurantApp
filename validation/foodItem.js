const Validator = require('validator');
const isEmpty = require('is-empty');

// check validity of input food items and corresponding datas

module.exports = function validateFoodItem(data) {
    let errors = {};

    data.name = !isEmpty(data.name)?data.name:'';
    data.cost = !isEmpty(data.cost)?data.cost:'';
    data.type = !isEmpty(data.type)?data.type:'';
    data.img = !isEmpty(data.img)?data.img:'';

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.cost)) {
        errors.cost = 'Cost field is required';
    } else if (!Validator.isInt(data.cost)) {
        errors.cost = 'Cost field must be a number';
    }

    if(Validator.isEmpty(data.type)) {
        errors.type = 'Type field is required';
    } else if(data.type !== 'veg' && data.type !== 'non-veg') {
        errors.type = 'Invalid type field';
    }

    if(Validator.isEmpty(data.img)) {
        errors.img = 'Image field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}