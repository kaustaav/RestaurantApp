import axios from 'axios';

export const addFoodItem = (foodData, dispatch) => {
    axios
        .post('/api/restaurants/add_item', foodData)
        .then(res => {
            const { msg } = res.data;
            window.location.reload(false);
        })
        .catch(err => {
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            })
        })
}

export const orderFoodItem = (foodData, dispatch) => {
    axios
        .post('/api/users/order', foodData)
        .then(res => {
            const { msg } = res.data;
            window.location.reload(false);
        })
        .catch(err => {
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            })
        })
}

export const addToCart = (foodData, dispatch) => {
    axios
        .post('/api/users/cart/add', foodData)
        .then(res => {
            const { success } = res.data;
            dispatch({
                type: 'UPDATE_CART',
                payload: success
            })
        })
        .catch(err => {
            console.log(err);
        })
}

export const removeFromCart = (foodData, dispatch) => {
    axios
        .post('/api/users/cart/remove', foodData)
        .then(res => {
            const { success } = res.data;
            dispatch({
                type: 'UPDATE_CART',
                payload: success
            })
        })
        .catch(err => console.log(err));
}