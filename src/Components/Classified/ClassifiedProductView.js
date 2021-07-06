import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase/Firebase';
import { Avatar, CardMedia, IconButton } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import firebase from "firebase"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SplitButton from "./MarkSoldDeleteEditOptionsComponent"
import { userContext } from "../ContextComponent"

import './ClassifiedProductView.css';
const ClassifiedProductView = () => {
    const { id } = useParams();
    const [productDataFromFirebase, setproductDataFromFirebase] = useState([])
    const [statusOfItemMarkedAsSold, setStatusOfItemMarkedAsSold] = useState(false) //

    const [user, setUser] = useState(undefined)
    useEffect(() => {
        // firebase analytics
        firebase.analytics().logEvent("User is in Main Classified shop Component")
        // getting document from store and storage
        var docRef = db.collection("products").doc(`${id}`);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setproductDataFromFirebase(doc.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        // checking for auth state


        return () => {
        }
    }, [id, statusOfItemMarkedAsSold])

    return (
        <userContext.Provider value={{ statusOfItemMarkedAsSold, setStatusOfItemMarkedAsSold }}>
            <div>

                {productDataFromFirebase?.id ? <div>
                    <div id="Edit__options">
                        <SplitButton emailOfProductOwner={productDataFromFirebase?.userEmail}
                            idOfProduct={productDataFromFirebase?.id} soldOrNot={productDataFromFirebase?.markedAsSold} />
                    </div>
                    {/* id="testinLocalCSSusingId__inProductview" */}
                    <div className="div__main__grid__productview  " >
                        <div className="productViewMain" id="testinLocalCSSusingId__inProductview">
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12} md={6} lg={6} className="GiveWidth" >
                                    {/* imageURL is an array of images */}
                                    {productDataFromFirebase.imageURL && <><CardMedia
                                        className="image__product GiveWidth"
                                        image={productDataFromFirebase.imageURL ? productDataFromFirebase.imageURL[0] : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                                        title="Paella dish"
                                    />{productDataFromFirebase?.markedAsSold && <p className="alreadySold">Already Sold.</p>}</>}
                                    <div>
                                        {/* four image grids */}
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <div className="secondDivInGrid GiveWidth alignCenterForSecondGridwhihhchisInforGrid">
                                        <div className="tophead">
                                            <div>
                                                <h2 className="productViewDetailsFont">{productDataFromFirebase?.name}</h2>
                                                <span className="prodPricedet" >{"€" + productDataFromFirebase?.price}</span>
                                            </div>
                                            <div className="avatarContainer leftAuto">
                                                <Avatar aria-label="recipe">
                                                    {productDataFromFirebase?.userEmail?.slice(0, 1).toUpperCase()}
                                                </Avatar>
                                                <div className="avatarContainer__div">
                                                    <h4 style={{ color: "#06201b" }}>owner</h4>
                                                    <h4><b style={{ color: "#004180" }}>{productDataFromFirebase?.userEmail}</b><sub>{productDataFromFirebase?.userEmailVerified}</sub></h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="productDetails">
                                            <h2 className="productViewDetailsh2">Product Details:</h2>
                                            <div className="productViewDetails">
                                                {productDataFromFirebase?.category && <h4> Category: {productDataFromFirebase?.category} </h4>}
                                                {productDataFromFirebase?.productDetails && <h4> Condition: {productDataFromFirebase?.productDetails} </h4>}
                                                {productDataFromFirebase?.category && <h4> Product: {productDataFromFirebase?.category} </h4>}
                                            </div>
                                        </div>
                                        <div className="Payment" >
                                            {productDataFromFirebase?.paymentOptions?.map((option, i) => (
                                                <button key={i} >{option}</button>
                                            ))}
                                        </div>
                                        <div>
                                            <h3 className="endtext">{productDataFromFirebase?.productDescription}</h3>
                                        </div>
                                    </div>
                                </Grid>

                            </Grid>

                        </div>
                    </div>
                </div> : <div className="skeleton__div"  ><Skeleton variant="rect" width="80vw" height="60vh" /></div>
                }

            </div>
        </userContext.Provider>

    )
}

export default ClassifiedProductView
