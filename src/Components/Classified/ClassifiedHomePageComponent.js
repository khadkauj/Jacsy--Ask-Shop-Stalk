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
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Popover from '@material-ui/core/Popover';

import "./ClassifiedHomePageComponent.css";
import { useHistory } from "react-router-dom";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";

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
    typography: {
        padding: theme.spacing(2),
    },
}));

const ClassifiedHomePageComponent = () => {
    // initializations
    const [productFromFirebase, setproductFromFirebase] = useState([])
    const [nameofProduct, setnameofProduct] = useState("")
    const [producttype, setproducttype] = React.useState('');
    const [productCondition, setproductCondition] = useState("")
    const [productImage, setproductImage] = useState(null)
    const [productPrice, setproductPrice] = useState("")
    const [productDescription, setproductDescription] = useState("")
    const [errorMessgae, seterrorMessgae] = useState(false)
    const history = useHistory()
    const [userDetailsFirebase, setuserDetailsFirebase] = useState("")
    const [urlForImage, seturlForImage] = useState(null)
    const [paymentOptions, setpaymentOptions] = useState([])
    const [disableSUbmitButton, setDisableSUbmitButton] = useState(true)
    const [popUpText, setpopUpText] = useState("")
    // console.log("use", productFromFirebase[0]?.data?.date.tol);

    useEffect(() => {
        // fetching all public posts
        db.collection("products").orderBy("date", "desc").onSnapshot(snapshot => {
            setproductFromFirebase(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    key: doc.id,
                    data: doc.data()
                }
                ))
            )
        })
        // checking user and his stauts
        firebase.auth().onAuthStateChanged(User => {
            if (User) {
                setuserDetailsFirebase(User)
                console.log("user found", User);
            }
            else {
                console.log("User not found");
                // history.push("/Login")
            }
        })
        return () => {
        }
    }, [])


    // firebase setups
    const imagehandleChange = (e) => {
        console.log(e.target.files[0]);
        if (e.target.files[0]) {
            setproductImage(e.target.files[0])
        }
    }

    const sendImageToFirebase = (e) => {
        // console.log(e.target.files[0]);
        // if (e.target.files[0]) {
        //     setproductImage(e.target.files[0])
        // }
        if (productImage) {
            // setproductImage(e.target.files[0]);
            // send pictures
            // console.log("productImage", e.target.files[0])
            console.log("Trying to send image to firebase");
            var storageRef = firebase.storage().ref();
            var uploadTask = storageRef.child(`${userDetailsFirebase.uid}/` + Math.random()).put(productImage)
            uploadTask.on('state_changed',
                (snapshot) => {
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.log("error");
                },
                async () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    const downloadurl = await uploadTask.snapshot.ref.getDownloadURL()
                    console.log("rlrurl", downloadurl);

                    if (nameofProduct && producttype && productCondition && productPrice) {
                        // send details from form
                        const idGeneratedforProduct = userDetailsFirebase.uid + uuidv4()
                        db.collection("products").doc(idGeneratedforProduct).set(
                            {
                                id: idGeneratedforProduct,
                                date: new Date(),
                                name: nameofProduct,
                                price: productPrice,
                                category: producttype,
                                productDetails: productCondition,
                                productDescription: productDescription,
                                imageURL: downloadurl,
                                userEmail: userDetailsFirebase.email,
                                userEmailVerified: userDetailsFirebase.emailVerified,
                                userDisplayName: userDetailsFirebase.displayName,
                                paymentOptions: paymentOptions,
                                like: 0,
                                peopleWhoLiked: ["ds@gmial.com", "djs.com"],
                                disLike: 0
                            },
                        ).then(e => {
                            setOpen(false);
                            seterrorMessgae(false)
                        }).catch(error => console.log("Error while sendig items to Firebase"))
                    } else {
                        seterrorMessgae(true)
                    }
                }
            );
        }
    }

    const submitToFirebase = () => {
    }

    const addLikeToFirebase = (data, numToAdd) => {
        console.log("id in funciton, ", data, numToAdd);
        firebase.auth().onAuthStateChanged(User => {
            if (User) {
                console.log("user found", User);
                db.collection("products").doc(data?.id).get().then(doc => {
                    console.log("chcking array, ", doc.data().peopleWhoLiked?.includes(User?.email));
                    if (!doc.data().peopleWhoLiked?.includes(User?.email)) {
                        db.collection("products").doc(data?.id).update({
                            like: ++doc.data().like,
                            peopleWhoLiked: firebase.firestore.FieldValue.arrayUnion(User?.email ? User?.email : "joke")
                        }, { merge: true })
                    } else {
                        db.collection("products").doc(data?.id).update({
                            like: --doc.data().like,
                            peopleWhoLiked: firebase.firestore.FieldValue.arrayRemove(User?.email)
                        }, { merge: true })
                    }
                })

            }
            else {
                console.log("User not found while trying to send Like");
                setpopUpText("Please Login.")
                handleClickPopup()
                // history.push("/Login")
            }
        })
    }


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
                console.log("user found", User);
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
        setpaymentOptions([])
    };
    const handleChange = (event) => {
        setproducttype(event.target.value);
    };


    // popup setups
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickPopup = (event) => {
        setAnchorEl(true);
        setInterval(() => {
            setAnchorEl(false)
        }, 2000);
    };

    const handleClosePopup = () => {
        setAnchorEl(null);
        setpopUpText("")
    };

    const openPopup = Boolean(anchorEl);
    const id = openPopup ? 'simple-popover' : undefined;


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
                <div style={{ margin: "20px" }}>
                    <Button className="addButton" variant="outlined" color="primary" onClick={handleClickOpen}>
                        Add items.
                    </Button>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            {!errorMessgae && <DialogContentText DialogContentText>
                                Please fill in the details to add your item to the store.
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
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Automotive, Motorcycle & Industrial"}>Automotive, Motorcycle & Industrial</MenuItem>
                                    <MenuItem value={"Apparel, Shoes & Watches"}>Apparel, Shoes & Watches</MenuItem>
                                    <MenuItem value={"Apparel, Shoes & Watches"}>Beauty & Health</MenuItem>
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
                            <form style={{ color: "rgb(112 103 103 / 87%)" }}>
                                <label for="fname" style={{ color: "rgb(112 103 103 / 87%)" }}>Product Image</label>
                                <input type="file" style={{ color: "rgb(112 103 103 / 87%)" }}
                                    onChange={imagehandleChange} ></input>
                                {/* <button type="submit" onClick={sendImageToFirebase}>send image</button> */}
                            </form>

                            <TextField

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
                            <Button onClick={sendImageToFirebase} color="primary"
                                disabled={!productImage | !nameofProduct}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div>

            <div className="cards__main">
                <Grid container spacing={2} >
                    {productFromFirebase.map((item) => (
                        <Grid className="grid__main" item xs={12} sm={6} md={4} lg={4} key={Math.random()}>
                            <Card className={classes.root}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className={classes.avatar}>
                                            {item?.data?.userEmail.slice(0, 1).toUpperCase()}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={item.data.userEmail}
                                    subheader={"posted at " + item.data.date.toDate().toLocaleString()}
                                />
                                <Link to={"/Classified/Products/" + item.data.id} className="linkTextForCard" >
                                    <CardMedia
                                        className={classes.media}
                                        image={item.data.imageURL ? item.data.imageURL : "https://data.whicdn.com/images/326864042/original.jpg"}
                                        title="Paella dish"
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            color="textPrimary"
                                            component="p"
                                        >
                                            {item?.data.name ? item?.data.name : "NA"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="error"
                                            component="p"
                                        >
                                            {item?.data.productDetails ? item?.data?.productDetails + " €" + item?.data?.price : "NA"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            {item?.data.productDescription ? item?.data.productDescription?.slice(0, 100) : "NA"}
                                        </Typography>
                                    </CardContent>
                                </Link>
                                <CardActions disableSpacing>
                                    {item.data?.peopleWhoLiked?.includes(userDetailsFirebase?.email) && <IconButton aria-label="add to favorites" style={{ color: "#ed4956" }}>
                                        <FavoriteIcon onClick={e => addLikeToFirebase(item?.data, -1)} />
                                    </IconButton>}
                                    {!item.data?.peopleWhoLiked?.includes(userDetailsFirebase?.email) && <IconButton aria-label="add to favorites" >
                                        <FavoriteBorderOutlined onClick={e => addLikeToFirebase(item?.data, 1)} />
                                    </IconButton>}
                                    {/* <IconButton aria-label="add to favorites">
                                        <FavoriteBorderOutlined onClick={e => addLikeToFirebase(item?.data)} />
                                    </IconButton> */}
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
                                <p className="like">{item?.data?.like + " likes"}</p>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Method:</Typography>
                                        <Typography paragraph>
                                            {item?.data?.productDescription ? item?.data?.productDescription : "NA"}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* popup sub-component */}

            <div className="popup__div">
                <Popover
                    id={id}
                    open={openPopup}
                    anchorEl={anchorEl}
                    onClose={handleClosePopup}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <p className="popup__text" >{popUpText}</p>
                </Popover>
            </div>
        </div>
    );
};

export default ClassifiedHomePageComponent;
