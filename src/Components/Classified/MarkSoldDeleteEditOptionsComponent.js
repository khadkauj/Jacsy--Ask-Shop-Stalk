import React, { useContext, useEffect, useState } from 'react';
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
import { useHistory, useParams } from 'react-router-dom';
import { userContext } from '../ContextComponent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, Select } from "@material-ui/core";
import EuroIcon from '@material-ui/icons/Euro';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: "56.25%", // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function SplitButton({ emailOfProductOwner, idOfProduct, soldOrNot }) {
    const classes = useStyles();
    const { statusOfItemMarkedAsSold, setStatusOfItemMarkedAsSold,
        productEditedInMArkSoldComponent, setProductEditedInMArkSoldComponent } = useContext(userContext)


    const options = [soldOrNot ? "Marked as Not-Sold" : "Marked as Sold", 'Edit the details', 'Delete'];
    const history = useHistory()


    // setup for the Button-Group toogle
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
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
                setStatusOfItemMarkedAsSold(!statusOfItemMarkedAsSold)
            }).catch(error => {
                console.log("Error in marking field as Updated", error);
            })
        } else if (index === 1) {
            setopenDialog(true)
            getDateForFormFromFB()
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

    // everything borrwed from different file
    const [stateAfterSubmitClick, setStateAfterSubmitClick] = useState(false)
    const [nameofProduct, setnameofProduct] = useState("")
    const [producttype, setproducttype] = React.useState('');
    const [productCondition, setproductCondition] = useState("")
    const [productPrice, setproductPrice] = useState("")
    const [productDescription, setproductDescription] = useState("")
    const [errorMessgae, seterrorMessgae] = useState(false)
    const [paymentOptions, setpaymentOptions] = useState([])
    const [openDialog, setopenDialog] = useState(false)
    const handleCloseDialog = () => {
        setopenDialog(false);
        seterrorMessgae(false)
        setpaymentOptions([])
    };

    const { id } = useParams()
    const getDateForFormFromFB = () => {
        db.collection("products").doc(id).get().then(snapshot => {
            const data = snapshot.data()
            setnameofProduct(data.name)
            setproducttype(data.category)
            setproductCondition(data.productDetails)
            setproductDescription(data.productDescription)
            setproductPrice(data.price)
            setpaymentOptions(data.paymentOptions)
        })
    }

    const editFormAndSendToFirebase = (e) => {
        setStateAfterSubmitClick(true)
        db.collection("products").doc(id).update({
            date: new Date(),
            name: nameofProduct,
            price: productPrice,
            category: producttype,
            productDetails: productCondition,
            productDescription: productDescription,
            paymentOptions: paymentOptions,
            uid: user.uid
        }).then(res => {
            console.log("product details updated")
            setopenDialog(false)
            setproductPrice(null)
            setProductEditedInMArkSoldComponent(!productEditedInMArkSoldComponent)
            setStateAfterSubmitClick(false)
        }).catch(error => console.log("error while uploading product, ", error))
    }


    // use effect hook
    // checking user state
    const [user, setUser] = useState(undefined)
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

            <div>
                <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        {!errorMessgae && <DialogContentText >
                            Please fill in the details and submit.
                        </DialogContentText>}
                        {errorMessgae && <DialogContentText style={{ color: "red" }}>
                            Please fill in the required.
                        </DialogContentText>}
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            label="Product name"
                            type="text"
                            fullWidth
                            value={nameofProduct}
                            placeholder="Big black Ikea Drawer"
                            onChange={e => setnameofProduct(e.target.value)}
                        />
                        <FormControl className={classes.formControl} style={{ margin: 0 }} >
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={producttype}
                                onChange={e => setproducttype(e.target.value)}
                            >
                                <MenuItem value={"Automotive, Motorcycle & Industrial"}>Automotive, Motorcycle & Industrial</MenuItem>
                                <MenuItem value={"Furniture"}>Furniture</MenuItem>
                                <MenuItem value={"Apparel, Shoes & Watches"}>Apparel, Shoes & Watches</MenuItem>
                                <MenuItem value={"Apparel, Shoes & Watches"}>Beauty & Health</MenuItem>
                                <MenuItem value={"Books & Audible"}>Books & Audible</MenuItem>
                                <MenuItem value={"Electronics & Computers"}>Electronics & Computers</MenuItem>
                                <MenuItem value={"Grocery/Food"}>Grocery/Food</MenuItem>
                                <MenuItem value={"Home, Garden, Pets & DIY"}>Home, Garden, Pets & DIY</MenuItem>
                                <MenuItem value={"Movies, TV, Music & Games"}>Movies, TV, Music & Games</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>

                            </Select>
                        </FormControl>
                        <br></br>
                        <FormControl className={classes.formControl} style={{ margin: 0 }}>
                            <InputLabel id="demo-simple-select-label">Condition</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={productCondition}
                                onChange={e => setproductCondition(e.target.value)}
                            >
                                <MenuItem value={"New"}>New</MenuItem>
                                <MenuItem value={"Used only once"}>Used only once</MenuItem>
                                <MenuItem value={"Used and all parts fine"}>Used and all parts fine</MenuItem>
                                <MenuItem value={"Used but few parts not working"}>Used but few parts not working</MenuItem>
                            </Select>
                        </FormControl>
                        <br></br>
                        <FormControl className={classes.formControl} style={{ margin: 0 }}>
                            <InputLabel id="demo-simple-select-label">Payment</InputLabel>
                            <Select
                                multiple
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={paymentOptions}
                                onChange={e => setpaymentOptions(e.target.value)}
                            >
                                <MenuItem value={"Cash"}>Cash</MenuItem>
                                <MenuItem value={"Sparkasse"}>Sparkasse</MenuItem>
                                <MenuItem value={"Paypal"}>Paypal</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            multiline
                            rows={3}
                            fullWidth
                            value={productDescription}
                            onChange={e => setproductDescription(e.target.value)}
                        />
                        <div id="price__icon">
                            <EuroIcon id="price__icon__euro" />
                            <TextField

                                margin="dense"
                                id="name"
                                label="&nbsp; &nbsp; &nbsp; Price"
                                type="text"
                                fullWidth
                                value={productPrice}
                                onChange={e => setproductPrice(e.target.value)}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={e => handleCloseDialog(e)} color="primary">
                            Cancel
                        </Button>
                        {!stateAfterSubmitClick && <Button onClick={e => editFormAndSendToFirebase(e)} color="primary"
                            disabled={!nameofProduct || !nameofProduct || !producttype || !productCondition || !productPrice}
                        >
                            Submit
                        </Button>}
                    </DialogActions>
                </Dialog>
            </div>
        </div>

    );
}
