import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import './ClassifiedProductView.css';
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase/Firebase';
import { Avatar, CardMedia, IconButton } from '@material-ui/core';


const ClassifiedProductView = ({ }) => {
    const { id } = useParams();
    const [productDataFromFirebase, setproductDataFromFirebase] = useState([])
    console.log(id);

    useEffect(() => {

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

        // const getProductData = async () => {
        //     const docRef = await db.collection("products").doc("SByCM5FOv2TW5g6OdeOFZkcs3Bp2")
        //     docRef.get().then(doc => {
        //         console.log("data:", doc.data());
        //     }).catch(error => {
        //         console.log("error,", error);
        //     })
        // }
        // getProductData();
        return () => {

        }
    }, [])

    return (
        <div >
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    {productDataFromFirebase.imageURL && <CardMedia
                        className="image__product"
                        image={productDataFromFirebase.imageURL ? productDataFromFirebase.imageURL : "https://data.whicdn.com/images/326864042/original.jpg"}
                        title="Paella dish"
                    />}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <p>hjee</p>
                    <p>jn</p>

                </Grid>

            </Grid>
        </div>
    )
}

export default ClassifiedProductView
