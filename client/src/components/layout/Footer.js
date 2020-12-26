import React from 'react';
import '../../style/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div>
                <div className="footer-left">
                    <h3>REST<span>aurant</span></h3>
                    <p className="footer-links">
                        <a href="/">Home</a>
                        ·
                        <a href="/">About</a>
                        ·
                        <a href="/">FAQ</a>
                        ·
                        <a href="/">Contact</a>
                    </p>
                </div>
                <div className="footer-center">
                    <div>
                        <i className="fa fa-map-marker"></i>
                        <p>
                            <span>St. Address</span>
                            City, Country
                        </p>
                    </div>
                    <div>
                        <i className="fa fa-phone"></i>
                        <p>0123456789</p>
                    </div>
                    <div>
                        <i className="fa fa-envelope"></i>
                        <p>
                            <a href="mailto:kaustavbhattacharya101@gmail.com">kaustavbhattacharya101@gmail.com</a>
                        </p>
                    </div>
                </div>
                <div className="footer-right">
                    <p className="footer-company-about">
                        <span>About the company</span>
                        
					    Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
                    </p>
                    <div className="footer-icons">
                        <a href="/"><i className="fa fa-facebook"></i></a>
                        <a href="/"><i className="fa fa-twitter"></i></a>
                        <a href="/"><i className="fa fa-linkedin"></i></a>
                        <a href="/"><i className="fa fa-github"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
