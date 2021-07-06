
import { Typography } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import InstagramIcon from '@material-ui/icons/Instagram';
import "./FooterComponent.css";
const FooterComponent = () => {
    return (
        <div className="footer">
            <a href="https://www.instagram.com/infintyuj/" className="link__newsDecoration" >
                <div className="footer__icon12" >
                    <p className="footer__left">Infintyuj</p>
                    <IconButton >
                        <InstagramIcon color="error" />
                    </IconButton>
                </div>
            </a>
            <p className="footer_end">The world is Infinite.</p>
        </div>
    );
};

export default FooterComponent;