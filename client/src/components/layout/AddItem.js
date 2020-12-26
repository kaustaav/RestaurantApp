import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import classnames from "classnames";
import { useStateValue } from '../../context/StateProvider';
import Footer from './Footer';
import Header from './Header';
import { addFoodItem } from '../../context/util';

function AddItem() {
    let history = useHistory();
    const [{isAuthenticated, account, errors, loading}, dispatch] = useStateValue();
    const [name,setName] = useState('');
    const [img,setImg] = useState('');
    const [cost,setCost] = useState();
    const [type,setType] = useState('');

    useEffect(() => {
        console.log(isAuthenticated, loading, account);
        if(!loading && !isAuthenticated) {
        <Redirect to="/login"/>
        } else if(!loading && isAuthenticated && account.type !== 'restaurant') {
        history.push('/');
        }
    }, [isAuthenticated, loading])

    const onSubmit = e => {
        e.preventDefault();
        const newItem = {
            name: name,
            img: img,
            cost: cost,
            type: type
        };
        console.log(newItem);
        addFoodItem(newItem, dispatch);
    }

    return (
        <div>
            <Header/>
            <div className="primary-content-area">
                <div className="primary-content-wrap">
                    <div className="add-item-wrap">
                        <form noValidate onSubmit={onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={e => setName(e.target.value)}
                                    error={errors.name}
                                    id="name"
                                    type="text"
                                    className={classnames("", {
                                        inValid: errors.name
                                    })}
                                />
                                <label htmlFor="name">Name</label>
                                <span className="red-text">{errors.name}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={e => setImg(e.target.value)}
                                    error={errors.img}
                                    id="img"
                                    type="text"
                                    className={classnames("", {
                                        inValid: errors.img
                                    })}
                                />
                                <label htmlFor="img">Image URL</label>
                                <span className="red-text">{errors.img}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={e => setCost(e.target.value)}
                                    error={errors.cost}
                                    id="cost"
                                    type="text"
                                    className={classnames("", {
                                        inValid: errors.cost
                                    })}
                                />
                                <label htmlFor="cost">Cost</label>
                                <span className="red-text">{errors.cost}</span>
                            </div>
                            <div className="col s12">
                                <span style={{marginRight: '10px'}} className="grey-text text-darken-1">Food type:</span>
                                <input 
                                    type="radio" 
                                    id="veg" 
                                    name="type" 
                                    value="veg" 
                                    onChange={e => {setType(e.target.value)}}
                                />
                                <label style={{marginRight: '10px', marginLeft: '3px'}} for="type">Veg</label>
                                <input 
                                    type="radio" 
                                    id="non-veg" 
                                    name="type" 
                                    value="non-veg"
                                    onChange={e => {setType(e.target.value)}}
                                />
                                <label style={{marginRight: '10px', marginLeft: '3px'}} for="type">Non-veg</label>
                                <span className="red-text">{errors.type}</span>
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
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default AddItem
