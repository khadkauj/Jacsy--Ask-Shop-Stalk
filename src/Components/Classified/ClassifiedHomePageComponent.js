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
import firebase from "firebase";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';
import Resizer from "react-image-file-resizer";
import { useHistory } from "react-router-dom";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";

import "./ClassifiedHomePageComponent.css";

// image file resizer
const resizeFile = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            480,
            320,
            "JPEG",
            80,
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
        );
    });

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
    const [productFromFirebase, setproductFromFirebase] = useState("")
    const [nameofProduct, setnameofProduct] = useState("")
    const [producttype, setproducttype] = React.useState('');
    const [productCondition, setproductCondition] = useState("")
    const [productImage, setproductImage] = useState([])
    const [productPrice, setproductPrice] = useState("")
    const [productDescription, setproductDescription] = useState("")
    const [errorMessgae, seterrorMessgae] = useState(false)
    const history = useHistory()
    const [userDetailsFirebase, setuserDetailsFirebase] = useState("")
    const [paymentOptions, setpaymentOptions] = useState([])
    const [popUpText, setpopUpText] = useState("")
    const [stateAfterSubmit, setstateAfterSubmit] = useState(true)
    // console.log("use", productFromFirebase[0]?.data?.date.tol);

    useEffect(() => {
        firebase.analytics().logEvent("User is in Main Classified shop Component")
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


    // Image change handel
    const imagehandleChange = async (e) => {
        console.log(e.target.files.length);
        // if (e.target.files[0]) {


        if (e.target.files) {
            // const files = []
            for (let index = 0; index < e.target.files.length && index < 5; index++) {
                console.log("image is,", e.target.files[0]);
                // setproductImage(e.target.files[0])
                // resize
                try {
                    const file = e.target.files[index];
                    const image = await resizeFile(file);
                    console.log("imag from resizer", image);
                    setproductImage(img => [...img, image])
                } catch (err) {
                    console.log("Error in resizing image, ", err);
                }
            }
        }        // }
    }


    const uploadFileAndGetDownloadURL = async (ref, file) => {
        const snap = await ref.put(file);
        const downloadURL = await snap.ref.getDownloadURL();

        return downloadURL;
    };

    const sendImageToFirebase = async (e) => {
        setstateAfterSubmit(!stateAfterSubmit)
        if (nameofProduct && producttype && productCondition && productPrice && productImage) {
            console.log("Trying to send image to firebase");

            const promises = []
            productImage.forEach((image, i) => {
                var storageRef = firebase.storage().ref();
                var ref = storageRef.child(`${userDetailsFirebase.uid}/` + Math.random())
                promises.push(uploadFileAndGetDownloadURL(ref, image));
            })
            const res = await Promise.all(promises).then(urlsArray => {
                // send details from form
                console.log("rlrurl", urlsArray);
                if (nameofProduct && producttype && productCondition && productPrice) {
                    console.log("urls, ", urlsArray);
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
                            imageURL: urlsArray,
                            userEmail: userDetailsFirebase.email,
                            userEmailVerified: userDetailsFirebase.emailVerified,
                            userDisplayName: userDetailsFirebase.displayName,
                            paymentOptions: paymentOptions,
                            like: 0,
                            peopleWhoLiked: ["ds@gmial.com", "djs.com"],
                            disLike: 0
                        },
                    ).then(e => {
                        // res-setting everything
                        setOpen(false);
                        seterrorMessgae(false)
                        setstateAfterSubmit(true)
                        setnameofProduct('')
                        setproducttype("")
                        setproductCondition("")
                        setproductImage([])
                        setproductPrice("")
                        setproductDescription("")
                        setpaymentOptions([])
                    }).catch(error => console.log("Error while sendig items to Firebase"))
                } else {
                    seterrorMessgae(true)
                }
            })

        }
    }

    // ading like/dis-like in each products
    const addLikeToFirebase = (data, numToAdd) => {
        console.log("id in funciton, ", data, numToAdd);
        if (userDetailsFirebase) {
            console.log("user found", userDetailsFirebase);
            db.collection("products").doc(data?.id).get().then(doc => {
                console.log("chcking array, ", doc.data().peopleWhoLiked?.includes(userDetailsFirebase?.email));
                if (!doc.data().peopleWhoLiked?.includes(userDetailsFirebase?.email)) {
                    db.collection("products").doc(data?.id).update({
                        like: ++doc.data().like,
                        peopleWhoLiked: firebase.firestore.FieldValue.arrayUnion(userDetailsFirebase?.email ? userDetailsFirebase?.email : "joke")
                    }, { merge: true }).catch(error => console.log("error in updating insideLike toFirebase Funciton, ", error))
                } else {
                    db.collection("products").doc(data?.id).update({
                        like: --doc.data().like,
                        peopleWhoLiked: firebase.firestore.FieldValue.arrayRemove(userDetailsFirebase?.email)
                    }, { merge: true }).catch(error => console.log("error in updating insideLike in -else statement- toFirebase Funciton, ", error))
                }
            }).catch(error => console.log("error in addLiketoFirebase Function, ", error))
        }
        else {
            console.log("User not found while trying to send Like");
            setpopUpText("Please Login.")
            handleClickSnackbar()
            // history.push("/Login")
        }

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
        if (userDetailsFirebase) {
            setOpen(true);
            console.log("user found", userDetailsFirebase);
        }
        else {
            handleClickSnackbar()
            setTimeout(() => {
                history.push("/Login")
            }, 500);
        }

    };
    const handleClose = () => {
        setOpen(false);
        seterrorMessgae(false)
        setpaymentOptions([])
    };
    const handleChange = (event) => {
        setproducttype(event.target.value);
    };


    // Snackbar setups
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleClickSnackbar = () => {
        setOpenSnackbar(true);
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    console.log("the logedinuser is, ", userDetailsFirebase);
    return (
        <div className="test" id="testinLocalCSSusingId">
            <div className="button">
                <div style={{ margin: "20px" }}>
                    <Button id="addButton" variant="contained" color="secondary" onClick={e => handleClickOpen(e)}>
                        Add to Market.
                    </Button>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            {!errorMessgae && <DialogContentText >
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
                            <form style={{ color: "rgb(112 103 103 / 87%)" }}>
                                <label id="fname" style={{ color: "rgb(112 103 103 / 87%)" }}>Product Image(up to 5 images)</label><br></br>
                                <input type="file" style={{ color: "rgb(112 103 103 / 87%)" }} accept="image/*" multiple
                                    onChange={e => imagehandleChange(e)} ></input>
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
                            <Button onClick={e => handleClose(e)} color="primary">
                                Cancel
                            </Button>
                            {stateAfterSubmit && <Button onClick={e => sendImageToFirebase(e)} color="primary"
                                disabled={!productImage || !nameofProduct || !nameofProduct || !producttype || !productCondition || !productPrice || !productImage}
                            >
                                Submit
                            </Button>}
                        </DialogActions>
                    </Dialog>
                </div>

            </div>

            {productFromFirebase ? <div className="cards__main">
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
                                        image={item.data.imageURL ? item.data.imageURL[0] : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
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
                                        <div className="already__sold">
                                            <Typography
                                                variant="body2"
                                                color="error"
                                                component="p"
                                            >
                                                {item?.data.productDetails ? item?.data?.productDetails + " €" + item?.data?.price : "NA"}

                                            </Typography>
                                            <span
                                            >
                                                {item?.data?.markedAsSold && <p>Already Sold😪</p>}
                                            </span>
                                        </div>

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
                                    {item.data?.peopleWhoLiked?.includes(userDetailsFirebase?.email) && <IconButton onClick={e => addLikeToFirebase(item?.data, -1)} aria-label="add to favorites" style={{ color: "#ed4956" }}>
                                        <FavoriteIcon />
                                    </IconButton>}
                                    {!item.data?.peopleWhoLiked?.includes(userDetailsFirebase?.email) && <IconButton aria-label="add to favorites" onClick={e => addLikeToFirebase(item?.data, 1)}>
                                        <FavoriteBorderOutlined />
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
                                        onClick={e => handleExpandClick(e)}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </CardActions>
                                <p className="like">{item?.data?.like + " likes"}</p>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Description:</Typography>
                                        <Typography paragraph>
                                            {item?.data?.productDescription ? item?.data?.productDescription : "NA"}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div> : <div className="skeleton__div"  ><Skeleton variant="rect" width="80vw" height="60vh" /></div>
            }


            {/* Snackbar sub-component */}

            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message="Please Login"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={e => handleCloseSnackbar(e)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        </div >
    );
};

export default ClassifiedHomePageComponent;
