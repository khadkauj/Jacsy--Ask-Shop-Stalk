import React from "react";
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import "./FooterComponent.css";
const FooterComponent = () => {
    return (
        <div className="footer" id="footer__end">
            <div className="footer-socailLink">
                <a href="https://www.instagram.com/infintyuj/" className="link__newsDecoration" >
                    <div className="footer__icon12" >
                        {/* <p className="footer__left" style={{ marginRight: "5px" }}>Infintyuj</p> */}
                        {/* <IconButton > */}
                        <InstagramIcon color="error" />
                        {/* </IconButton> */}
                    </div>
                </a>
                <a href="https://www.linkedin.com/in/khadkauj/" className="link__newsDecoration" >
                    <div className="footer__icon12" >
                        {/* <p className="footer__left" style={{ marginRight: "5px" }}>Infintyuj</p> */}
                        {/* <IconButton > */}
                        <LinkedInIcon color="error" />
                        {/* </IconButton> */}
                    </div>
                </a>
            </div>
            <p className="footer_end">Infinty ist Infinite.</p>
        </div>
    );
};

export default FooterComponent;