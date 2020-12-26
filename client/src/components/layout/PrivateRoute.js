import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useStateValue } from "../../context/StateProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [{ isAuthenticated, loading }] = useStateValue();
    
    if(loading) return <div>Loading...</div>

    return (
        <Route
            {...rest}
        >
            {
                isAuthenticated?<Component/>:<Redirect to='/login'/>
            }
        </Route>
    )
}

export default PrivateRoute;