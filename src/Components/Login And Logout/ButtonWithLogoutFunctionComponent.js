import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BookIcon from '@material-ui/icons/Book';
import InfoIcon from '@material-ui/icons/Info';
import firebase from "firebase"
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

export default function CustomizedMenus() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // sign out of Firebase

    const signOutOfFirebase = (e) => {
        e.preventDefault()
        console.log("hahah");
        firebase.auth().signOut().then(user => {
            console.log("user signed out");
            // setuserStatus(false)
        }).catch(error => {
            console.log("user signed out");
        })
    }

    return (
        <div>
            <IconButton>
                <SettingsIcon
                    fontSize="large"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"

                    onClick={handleClick}
                >
                    Open Menu
                </SettingsIcon>
            </IconButton>

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={e => signOutOfFirebase(e)} >
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </StyledMenuItem>
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