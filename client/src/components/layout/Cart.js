import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import { removeFromCart } from '../../context/util';
import Footer from './Footer';
import Header from './Header';

function Cart() {
    let history = useHistory();
    const [{isAuthenticated, account, loading, details, loadingDetails}, dispatch] = useStateValue();

    useEffect(() => {
        console.log(isAuthenticated, loading, account);
        if(!loading && !isAuthenticated) {
        <Redirect to="/login"/>
        } else if(!loading && isAuthenticated && account.type !== 'user') {
        history.push('/');
        }
    }, [isAuthenticated, loading])

    // console.log(account);

    const RemoveCartClickHandler = (e, restaurantId, itemId) => {
        if(!isAuthenticated) {
            history.push('/login');
        } else {
            const foodData = {
                restaurantId: restaurantId,
                itemId: itemId
            }
            console.log(foodData);
            removeFromCart(foodData, dispatch);
        }
    }

    return (
        <div>
            <Header/>
            <div className="primary-content-area">
                <div className="primary-content-wrap">
                    {
                        loadingDetails && <div>Loading...</div> 
                    }
                    {
                        !loadingDetails && details.orders &&
                        <div className="account-section">
                            <div className="order-page">
                                <div className="order-title">
                                    <span>My Cart ({details.cart.length} Items)</span>
                                    <div className="subtotal-div">
                                        <span className="subtotal">Subtotal:</span>
                                        <span>₹{details.cart.reduce((a, b) => a + b.itemCost, 0)}</span>
                                    </div>
                                </div>
                                {
                                    details.cart.map(cart =>
                                        <div className="order-food">
                                            <div className="order-date-wrapper">
                                                <div className="order-date">Placed on {new Date(cart.date).toLocaleString()}</div>
                                                <button onClick={e => RemoveCartClickHandler(e, cart.restaurantId, cart.itemId)} className="cart-button btn waves-effect waves-light hoverable orange accent-3">Remove</button>
                                            </div>
                                            <div className="order-product-wrapper">
                                                <div className="order-product-details">
                                                    <div>
                                                        <div className="order-product-image">
                                                            <img alt="ordered product" src={cart.itemImg}/>
                                                        </div>
                                                        <div className="order-product-summary">
                                                            <span className="order-product-name">{cart.itemName}</span>
                                                            <span className="order-product-type">{cart.itemType}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-product-cost">₹{cart.itemCost}</div>
                                                <div className="order-product-from">
                                                    <span className="order-restaurant-name">{cart.restaurantName}</span>
                                                    <span className="order-restaurant-mail">
                                                        <a href={`mailto:${cart.restaurantEmail}`}>{cart.restaurantEmail}</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>    
                                    )
                                }
                            </div>
                        </div>
                    }
                    {
                        !loadingDetails && details.cart && details.cart.length === 0 && <div>No Items yet</div>
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Cart
