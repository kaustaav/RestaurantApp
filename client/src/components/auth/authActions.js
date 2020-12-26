import axios from 'axios';
import setAuthToken from './setAuthToken';
import jwt_decode from 'jwt-decode';

export const registerUser = (userData, history, dispatch) => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            }))
};

export const registerRestaurant = (restaurantData, history, dispatch) => {
    axios
        .post('/api/restaurants/register', restaurantData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            }))
};

export const loginUser = (userData, dispatch) => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            setCurrentUser(decoded, dispatch);
        })
        .catch(err =>
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            })
        );
};

export const loginRestaurant = (restaurantData, dispatch) => {
    axios
        .post('/api/restaurants/login', restaurantData)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            setCurrentUser(decoded, dispatch);
        })
        .catch(err =>
            dispatch({
                type: 'GET_ERRORS',
                payload: err.response.data
            })
        );
};

export const setCurrentUser = (decoded, dispatch) => {
    dispatch({
        type: 'SET_CURRENT_USER',
        payload: decoded
    });
};

export const setAccountDetails = (account, dispatch) => {
    axios
        .get(`/api/${account.type === 'user'?'users':'restaurants'}/accountinfo`)
        .then(res => {
            dispatch({
                type: 'SET_ACCOUNT_DETAILS',
                payload: res.data
            })
        })
}

export const setUserLoading = (dispatch) => {
    dispatch({
        type: 'USER_LOADING'
    })
}

export const logoutUser = (dispatch, history) => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch({
        type: 'LOGOUT_ACCOUNT'
    })
} 