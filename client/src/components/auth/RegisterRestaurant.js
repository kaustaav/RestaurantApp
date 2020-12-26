import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import classnames from "classnames";
import { useStateValue } from "../../context/StateProvider";
import { registerRestaurant } from './authActions';

function RegisterRestaurant() {
    let history = useHistory();
    const [{errors, isAuthenticated}, dispatch] = useStateValue();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [location,setLocation] = useState('');
    const [contact_no,setContact_no] = useState();
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');

    useEffect(() => {
        if(isAuthenticated) history.push('/');
    }, [isAuthenticated])

    const onSubmit = e => {
        e.preventDefault();
        const newRestaurant = {
            name: name,
            email: email,
            location: location,
            contact_no: contact_no,
            password: password,
            password2: password2
        }
        console.log(newRestaurant);
        registerRestaurant(newRestaurant, history, dispatch);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back to home
                    </Link>
                    <div className="col s12" style={{paddingLeft: '11.250px'}}>
                        <h4>
                            <b>Register</b> below
                        </h4>
                        <p className="grey-text text-darken-1">
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                        <Link to="/register">Register as user</Link>
                    </div>
                    <form noValidate onSubmit={onSubmit}>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setName(e.target.value)}
                                error={errors.name}
                                id="name"
                                type="text"
                                className={classnames("", {
                                    invalid: errors.name
                                })}
                            />
                            <label htmlFor="name">Restaurant Name</label>
                            <span className="red-text">{errors.name}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setEmail(e.target.value)}
                                error={errors.email}
                                id="email"
                                type="email"
                                className={classnames("", {
                                invalid: errors.email
                                })}
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">{errors.email}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setContact_no(e.target.value)}
                                error={errors.contact_no}
                                id="contact_no"
                                type="text"
                                className={classnames("", {
                                    invalid: errors.contact_no
                                })}
                            />
                            <label htmlFor="contact_no">Contact no.</label>
                            <span className="red-text">{errors.contact_no}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setLocation(e.target.value)}
                                error={errors.location}
                                id="location"
                                type="text"
                                className={classnames("", {
                                    invalid: errors.locaiton
                                })}
                            />
                            <label htmlFor="location">Location</label>
                            <span className="red-text">{errors.locaiton}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setPassword(e.target.value)}
                                error={errors.password}
                                id="password"
                                type="password"
                                className={classnames("", {
                                invalid: errors.password
                                })}
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">{errors.password}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={e => setPassword2(e.target.value)}
                                error={errors.password2}
                                id="password2"
                                type="password"
                                className={classnames("", {
                                invalid: errors.password2
                                })}
                            />
                            <label htmlFor="password2">Confirm Password</label>
                            <span className="red-text">{errors.password2}</span>
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
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterRestaurant
