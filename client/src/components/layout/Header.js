import React from 'react';
import { useStateValue } from '../../context/StateProvider';
import '../../style/Header.css';

function Header() {
    const [{isAuthenticated, account, details}] = useStateValue();

    return (
        <div className="header">
            <div className="main-header">
                <div className="header-title">
                    <a href="/" className="app-name">REST<span>aurant</span></a>
                </div>
                <div className="header-bar">
                    <div className="header-options">
                        <div className="header-option header-my_account">
                            <a href="/account">
                                Hello, {details.name?details.name.split(' ')[0]:'Guest'}
                            </a>
                        </div>
                        {
                            (!isAuthenticated || account.type === 'user') &&
                            <div className="header-option header-orders">
                                <a href="/my_orders">
                                    My orders
                                </a>
                            </div>
                        }
                        {
                            isAuthenticated && account.type === 'restaurant' &&
                            <div className="header-option header-view_orders">
                                <a href="/view_orders">
                                    View Orders
                                </a>
                            </div>
                        }
                        {
                            isAuthenticated && account.type === 'restaurant' &&
                            <div className="header-option header-edit_item">
                                <a href="/add_item">
                                    <i className="fa fa-pencil-square"></i>
                                    Add Item
                                </a>
                            </div>
                        }
                        {
                            (!isAuthenticated || account.type === 'user') &&
                            <div className="header-option header-cart">
                                <a href="/cart">
                                    <div className="cart-count">
                                        {details.cart?details.cart.length:'0'}
                                    </div>
                                    <i className="fa fa-shopping-basket"></i>
                                    <div className="cart-total">₹{details.cart?details.cart.reduce((a, b) => a + b.itemCost, 0):'0'}</div>
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
