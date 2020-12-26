import React, {useEffect} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import Header from './Header';
import Footer from './Footer';
import '../../style/MyOrders.css';

function MyOrders() {
    let history = useHistory();
    const [{isAuthenticated, account, loading, loadingDetails, details}] = useStateValue();

    useEffect(() => {
        console.log(isAuthenticated, loading, account);
        if(!loading && !isAuthenticated) {
        <Redirect to="/login"/>
        } else if(!loading && isAuthenticated && account.type !== 'user') {
        history.push('/');
        }
    }, [isAuthenticated, loading])

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
                                    <span>My Orders ({details.orders.length})</span>
                                </div>
                                {
                                    details.orders.map(order =>
                                        <div className="order-food">
                                            <div className="order-date-wrapper">
                                                <div className="order-date">Placed on {new Date(order.date).toLocaleString()}</div>
                                            </div>
                                            <div className="order-product-wrapper">
                                                <div className="order-product-details">
                                                    <div>
                                                        <div className="order-product-image">
                                                            <img alt="ordered product" src={order.orderimg}/>
                                                        </div>
                                                        <div className="order-product-summary">
                                                            <span className="order-product-name">{order.ordername}</span>
                                                            <span className="order-product-type">{order.ordertype}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-product-cost">₹{order.ordercost}</div>
                                                <div className="order-product-from">
                                                    <span className="order-restaurant-name">{order.restaurantName}</span>
                                                    <span className="order-restaurant-mail">
                                                        <a href={`mailto:${order.restaurantEmail}`}>{order.restaurantEmail}</a>
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
                        !loadingDetails && details.orders && details.orders.length === 0 && <div>No Orders yet</div>
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default MyOrders
