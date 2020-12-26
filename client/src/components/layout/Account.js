import React from 'react';
import { useStateValue } from '../../context/StateProvider';
import { logoutUser } from '../auth/authActions';
import { useHistory } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import '../../style/Account.css';

function Account() {
  const history = useHistory();
  const [{ account, details }, dispatch] = useStateValue();

  const onLogoutClick = e => {
    e.preventDefault();
    logoutUser(dispatch, history);
  };

  return (
    <div>
      <Header/>
      <div className="primary-content-area">
        <div className="primary-content-wrap">
          <div style={{ height: "50vh" }} className="container valign-wrapper">
            <div className="row">
              <div className="col s12 center-align">
                {
                  account.type === 'restaurant'
                  ?(
                    <h4>
                      <b>Hey,</b> {details.name?details.name:'Restaurant'}
                      <p className="flow-text grey-text text-darken-1">
                        Location: <span style={{ fontFamily: "monospace" }}>{details.location?details.location:'Location'}</span>
                      </p>
                      <p className="flow-text grey-text text-darken-1">
                        Contact: <span style={{fontFamily: 'monospace'}}>{details.contact_no?details.contact_no:'Contact no'} </span>
                      </p>
                      <p className="flow-text grey-text text-darken-1">
                        Email: <span style={{fontFamily: 'monospace'}}>{details.email?details.email:'Email'} </span>
                      </p>
                    </h4>
                  )
                  :(
                    <h4>
                      <b>Hey,</b> {details.name?details.name:'User'}
                      <p className="flow-text grey-text text-darken-1">
                        Preference: <span style={{fontFamily: 'monospace'}}>{details.preference?details.preference:'Preference'} </span>
                      </p>
                      <p className="flow-text grey-text text-darken-1">
                        Email: <span style={{fontFamily: 'monospace'}}>{details.email?details.email:'Email'} </span>
                      </p>
                    </h4>
                  )
                }
                
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  onClick={onLogoutClick}
                  className="btn waves-effect waves-light hoverable blue accent-3"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          {
            account.type === 'restaurant' &&
            <div>
              <h4>Items Available:</h4>
              <div className="clear-border"></div>
              <ul className="food-content">
                {
                  details.items && 
                  details.items.map(item =>
                    <li className="listli">
                      <div className="food-item">
                        <div className="item-img">
                          <img
                            loading="lazy"
                            alt="food-item"
                            className="wooble"
                            src={item.img}
                          />
                        </div>
                        <div className="stats-container">
                          <div className="item-name">{item.name}</div>
                          <div className="item-cost-wrapper">
                            <span className="item-cost">₹{item.cost}</span>
                          </div>
                          <div className="item-type">({item.type})</div>
                        </div>
                      </div>
                    </li>
                )}
                {
                  !details.items && <div>Loading...</div>
                }
              </ul>
            </div>
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Account;