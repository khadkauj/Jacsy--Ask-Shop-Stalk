import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import firebase from "firebase"
import { db } from '../../Firebase/Firebase';
import { useHistory } from 'react-router-dom';


export default function SplitButton({ emailOfProductOwner, idOfProduct, soldOrNot }) {
    const options = [soldOrNot ? "Marked as Not-Sold" : "Marked as Sold", 'Edit the details', 'Delete'];

    const history = useHistory()
    // checking user state
    const [user, setUser] = useState(undefined)
    const [statusOfItemMarkedAsSold, setStatusOfItemMarkedAsSold] = useState(false)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(userstate => {
            if (userstate) {
                setUser(userstate)
            } else {
                setUser(undefined)
            }
        })
        return () => {

        }
    }, [])

    // setup for the Button-Group toogle
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };
    const handleMenuItemClick = (event, index) => {
        console.log(index);
        setSelectedIndex(index);
        setOpen(false);
        // Deleting the product
        if (index === 2) {
            db.collection("products").doc(idOfProduct).delete().then(response => {
                console.log("Item deleted");
                history.push("/Classified")
            }).catch(error => {
                console.log("error in deleting product", error);
            })
        } else if (index === 0) {
            db.collection("products").doc(idOfProduct).update({
                markedAsSold: !soldOrNot
            }, { merge: true }).then(response => {
                console.log("Marked as sold field updated");
            }).catch(error => {
                console.log("Error in marking field as Updated", error);
            })
            setStatusOfItemMarkedAsSold(true)
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            {user?.email === emailOfProductOwner && <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">

                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            <ArrowDropUpIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    // disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>}
        </div>

    );
}
