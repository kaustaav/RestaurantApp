import React, {useEffect} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useStateValue } from '../../context/StateProvider';
import Footer from './Footer';
import Header from './Header';

function ViewOrders() {
    let history = useHistory();
    const [{isAuthenticated, account, loading, loadingDetails, details}] = useStateValue();

    useEffect(() => {
        console.log(isAuthenticated, loading, account);
        if(!loading && !isAuthenticated) {
        <Redirect to="/login"/>
        } else if(!loading && isAuthenticated && account.type !== 'restaurant') {
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
                                                <div className="order-date">Placed on {new Date(order.orderDate).toLocaleString()}</div>
                                            </div>
                                            <div className="order-product-wrapper">
                                                <div className="order-product-details">
                                                    <div>
                                                        <div className="order-product-image">
                                                            <img alt="ordered product" src={order.itemimg}/>
                                                        </div>
                                                        <div className="order-product-summary">
                                                            <span className="order-product-name">{order.itemname}</span>
                                                            <span className="order-product-type">{order.itemtype}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="order-product-cost">₹{order.itemcost}</div>
                                                <div className="order-product-from">
                                                    <span className="order-restaurant-name">{order.orderedByName}</span>
                                                    <span className="order-restaurant-mail">
                                                        <a href={`mailto:${order.orderedByEmail}`}>{order.orderedByEmail}</a>
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

export default ViewOrders
