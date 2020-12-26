import isEmpty from "is-empty";

export const initialState = {
    loading: true,
    isAuthenticated: false,
    account: {},
    details: {},
    loadingDetails: false,
    errors: {}
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                loading: false,
                isAuthenticated: !isEmpty(action.payload),
                account: action.payload,
                errors: {}
            }

        case 'GET_ERRORS':
            return {
                ...state,
                loading: false,
                errors: action.payload
            }

        case 'UPDATE_CART':
            let newCart = action.payload;
            state.details.cart = newCart;
            return {
                ...state,
            }

        case 'ACCOUNT_DETAILS_LOADING':
            return {
                ...state,
                loadingDetails: true
            }

        case 'SET_ACCOUNT_DETAILS':
            return {
                ...state,
                loadingDetails: false,
                details: action.payload
            }
        
        case 'LOGOUT_ACCOUNT':
            return {
                ...state,
                loadingDetails: false,
                details: {},
                account: {},
                loading: false,
                errors: {},
                isAuthenticated: false
            }

        default:
            return state;
    }
}

export default reducer;