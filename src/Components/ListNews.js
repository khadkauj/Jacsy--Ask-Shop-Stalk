import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { db } from "../Firebase/Firebase"

import "./ListNews.css"
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 300,
    },
    media: {
        height: 140,
    },
});

const ListNews = () => {
    const classes = useStyles();

    const listOfNews = [
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        },
        {
            imageSource: "https://img.huffingtonpost.com/asset/59de61522d00007e08309cc9.jpg?ops=scalefit_820_noupscale",
            heading: "Fmr. Manager of DOD Aerospace Threat Program: 'UFOs are Real'",
            news: "Something extraordinary was revealed today. Former high-level officials and scientists with deep black experience who have always remained in the shadows came forward on one platform. "
        }

    ]
    const [questionAndAnswerFromFB, setquestionAndAnswerFromFB] = useState([])

    // fetching questions and answers
    useEffect(() => {
        db.collection("questions").get().then(snapshot => {
            // console.log("ques snap, ", snapshot.docs);
            setquestionAndAnswerFromFB(snapshot.docs.map(doc => ({
                id: doc.id,
                key: doc.id,
                data: doc.data()
            })))
        }).catch(error => console.log("error in fetching data from FB, ", error))

        return () => {
        }
    }, [])

    return (
        <div >
            <Grid container spacing={1} id="newsList__main" >
                {questionAndAnswerFromFB.map(item => (
                    <Grid item xs={6} sm={4} md={4} lg={3} key={Math.random()}   >
                        <Card className={classes.root}>
                            <CardActionArea>
                                {/* <CardMedia
                                    className={classes.media}
                                    image="https://data.whicdn.com/images/167909674/original.jpg"
                                    title="Contemplative Reptile"
                                /> */}
                                <CardContent className="cardContent">
                                    <p >
                                        {item?.data?.question}
                                    </p>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                {/* <Button size="small" color="primary">
                                Share
                            </Button> */}
                                <Button size="small" color="primary">
                                    Reply.
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid >
        </div>


    )
}

export default ListNews
