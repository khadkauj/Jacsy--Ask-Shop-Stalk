import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BookIcon from '@material-ui/icons/Book';
import InfoIcon from '@material-ui/icons/Info';
import firebase from "firebase"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useHistory } from 'react-router-dom';

import "./ButtonWithLogoutFunc.css"
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function CustomizedMenus({ user }) {
    // setup for menus
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // sign out of Firebase
    const history = useHistory()
    const signOutOfFirebase = (e) => {
        e.preventDefault()
        firebase.auth().signOut().then(user => {
            console.log("user signed out");
            history.push("/Login")
            // setuserStatus(false)
        }).catch(error => {
            console.log("user signed out");
        })
        handleClose()
    }

    const takeToLogInPage = (e) => {
        history.push("/Login")
        handleClose()
    }

    return (
        <div>
            <IconButton onClick={handleClick}>
                {user ?
                    <SettingsIcon
                        fontSize="large"
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="contained"


                    >
                        Open Menu
                    </SettingsIcon>
                    :
                    <PersonAddIcon
                        fontSize="large"
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="contained"


                    >
                        Open Menu
                    </PersonAddIcon>

                }
            </IconButton>

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {user && <div className="signedAs__main">
                    <span className="signedAs__span">Signed-in as</span>
                    <p className="signedAs__email"> {user.email}</p>
                </div>}
                {user ? <StyledMenuItem onClick={e => signOutOfFirebase(e)} >
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </StyledMenuItem> :
                    <StyledMenuItem onClick={e => takeToLogInPage(e)} >
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Log In" />
                    </StyledMenuItem>
                }
                <StyledMenuItem>
                    <ListItemIcon>
                        <BookIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Documentation" />
                </StyledMenuItem>
                <StyledMenuItem>
                    <ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Terms and Condition" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
}