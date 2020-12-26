import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "../../context/StateProvider";
import classnames from "classnames";
import { loginRestaurant, loginUser } from "./authActions";


function Login() {
  let history = useHistory();
  const [{isAuthenticated, errors}, dispatch] = useStateValue();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [type,setType] = useState('user');

  useEffect(() => {
    if(isAuthenticated) history.push('/');
  }, [isAuthenticated])
  
  const onSubmit = e => {
    e.preventDefault();
    const AccountLogin = {
      email: email,
      password: password
    }

    if(type === 'user') {
      loginUser(AccountLogin, dispatch);
    } else if(type === 'restaurant') {
      loginRestaurant(AccountLogin, dispatch);
    }
  };
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={onSubmit}>
              <div className="col s12">
                <span style={{marginRight: '10px'}} className="grey-text text-darken-1">Login as:</span>
                <input 
                  defaultChecked
                  type="radio" 
                  id="user" 
                  name="type" 
                  value="user" 
                  onChange={e => {setType(e.target.value)}}
                />
                <label style={{marginRight: '10px', marginLeft: '3px'}} for="type">User</label>
                <input 
                  type="radio" 
                  id="restaurant" 
                  name="type" 
                  value="restaurant"
                  onChange={e => {setType(e.target.value)}}
                />
                <label style={{marginRight: '10px', marginLeft: '3px'}} for="type">Restaurant</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={e => setEmail(e.target.value)}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound || errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}
export default Login;