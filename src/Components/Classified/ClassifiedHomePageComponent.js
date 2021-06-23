import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { db } from "../../Firebase/Firebase";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { auth } from "../../Firebase/Firebase";
import firebase from "firebase";

import "./ClassifiedHomePageComponent.css";
import { useHistory } from "react-router-dom";

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
    avatar: {
        backgroundColor: red[500],
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ClassifiedHomePageComponent = () => {
    // raw data
    const [productFromFirebase, setproductFromFirebase] = useState([])
    console.log("productFromFirebase", productFromFirebase);
    const [nameofProduct, setnameofProduct] = useState("")
    const [producttype, setproducttype] = React.useState('');
    const [productCondition, setproductCondition] = useState("")
    const [productImage, setproductImage] = useState("")
    const [productPrice, setproductPrice] = useState("")
    const [productDescription, setproductDescription] = useState("")
    const [errorMessgae, seterrorMessgae] = useState(false)
    const history = useHistory()
    // firebase setups
    const submitToFirebase = () => {

        if (nameofProduct && producttype && productCondition && productPrice) {
            db.collection("products").add(
                {
                    id: Math.random(),
                    date: new Date(),
                    name: nameofProduct,
                    price: productPrice,
                    category: producttype,
                    productDetails: productCondition,
                    productDescription: productDescription
                },
            ).then(e => {
                setOpen(false);
                seterrorMessgae(false)
            }).catch(error => console.log("Error while sendig items to Firebase"))
        } else {
            seterrorMessgae(true)
        }

    }

    useEffect(() => {
        db.collection("products").onSnapshot(snapshot => {
            setproductFromFirebase(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    key: doc.id,
                    data: doc.data()
                }
                ))
            )
        })
        return () => {

        }
    }, [])



    // setup from Material-UI for Grid container and card
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // setup for Input dailog box from Material UI
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {

        firebase.auth().onAuthStateChanged(User => {
            if (User) {
                setOpen(true);
                console.log("user found");
            }
            else {
                console.log("User not found");
                history.push("/Login")
            }
        })


    };

    const handleClose = () => {
        setOpen(false);
        seterrorMessgae(false)
    };

    const handleChange = (event) => {
        setproducttype(event.target.value);
    };


    return (
        <div className="test">
            {/* <div className="Advertisement">
        <img
        src="https://i.kym-cdn.com/,photos/images/newsfeed/000/000/130/disaster-girl.jpg"
        alt="homepagepic"
        className="imagehomepage"
        />
        <div>
        <h1>A big board to write</h1>
        </div>
    </div> */}

            <div className="button">
                <div style={{margin:"20px"}}>
                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                        Add items.
                    </Button>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            {!errorMessgae && <DialogContentText DialogContentText>
                                Please fill in the details to add your item to the store.
                            </DialogContentText>}
                            {errorMessgae && <DialogContentText style={{color:"red"}}>
                                Please fill in the required.
                            </DialogContentText>}
                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name of product"
                                type="text"
                                fullWidth
                                value={nameofProduct}
                                onChange={e => setnameofProduct(e.target.value)}
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={producttype}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Automotive, Motorcycle & Industrial"}>Automotive, Motorcycle & Industrial</MenuItem>
                                    <MenuItem value={"Apparel, Shoes & Watches"}>Apparel, Shoes & Watches</MenuItem>
                                    <MenuItem value={"Apparel, Shoes & Watches"}>Beauty & Health</MenuItem>
                                </Select>
                            </FormControl>
                            <br></br>
                            <FormControl className={classes.formControl}>
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
                            <TextField
                                autoFocus
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

                            <label for="fname">Product Image</label>
                            <input type="file" id="fname" name="fname"
                                onChange={e => setproductImage(e.target.value)} ></input>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Price"
                                type="Number"
                                fullWidth
                                value={productPrice}
                                onChange={e => setproductPrice(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={submitToFirebase} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div>

            <div className="cards__main">
                <Grid container spacing={2}>
                    {productFromFirebase.map((item) => (
                        <Grid className="grid__main" item xs={12} sm={6} md={4} lg={4} key={Math.random()}>
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar}>
                                            {item?.contactDetails?.name.slice(0, 1).toUpperCase()}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={item.data.name}
                                    subheader={item.data.date.nanoseconds}
                                />

                                <CardMedia
                                    className={classes.media}
                                    image="https://i.pinimg.com/474x/a8/65/58/a86558def3340a5fd8f4fe647e351a37.jpg"
                                    title="Paella dish"
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {item?.data.category ? item?.data.category : "NA"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {item?.data.productDetails ? item?.data.productDetails : "NA"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {item?.data.productDescription ? item?.data.productDescription : "NA"}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Method:</Typography>
                                        <Typography paragraph>
                                            Heat 1/2 cup of the broth in a pot until simmering, add
                                            saffron and set aside for 10 minutes.
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default ClassifiedHomePageComponent;
