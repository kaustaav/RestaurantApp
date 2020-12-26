import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import jwt_decode from 'jwt-decode';
import setAuthToken from './components/auth/setAuthToken';
import PrivateRoute from './components/layout/PrivateRoute';
import { useStateValue } from './context/StateProvider';
import { logoutUser, setAccountDetails, setCurrentUser } from './components/auth/authActions';
import Home from './components/layout/Home';
import Account from './components/layout/Account';
import Cart from './components/layout/Cart';
import MyOrders from './components/layout/MyOrders';
import ViewOrders from './components/layout/ViewOrders';
import AddItem from './components/layout/AddItem';
import RegisterRestaurant from './components/auth/RegisterRestaurant';

function Content() {
    const [{isAuthenticated, account, loading, details, loadingDetails}, dispatch] = useStateValue();

    if(localStorage.jwtToken && !isAuthenticated) {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        const decoded = jwt_decode(token);
        
        setCurrentUser(decoded, dispatch)

        if(decoded.exp < Date.now()/1000) {
            logoutUser(dispatch);
            window.location.href = './login';
        }
    } else if(!localStorage.jwtToken && loading) {
        setCurrentUser({}, dispatch);
    }

    if(!loading && isAuthenticated && !loadingDetails && !details.name) {
        dispatch({type: 'ACCOUNT_DETAILS_LOADING'});
        setAccountDetails(account, dispatch);
    }

    return (
        <div className="App">
            <Switch>
                <PrivateRoute exact path="/add_item" component={AddItem}/>
                <PrivateRoute exact path="/cart" component={Cart}/>
                <PrivateRoute exact path="/my_orders" component={MyOrders}/>
                <PrivateRoute exact path="/account" component={Account}/>
                <PrivateRoute exact path="/view_orders" component={ViewOrders}/>
                <Route exact path="/" component={Home} />
                <Route exact path="/register_restaurant" component={RegisterRestaurant} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
          </Switch>
        </div>
    )
}

export default Content
