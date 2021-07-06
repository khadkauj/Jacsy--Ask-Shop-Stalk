import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { db } from "../Firebase/Firebase"
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from "react-router-dom"
import { Grid } from '@material-ui/core';
import { HomePageComponentsToSync } from "./ContextComponent"

import "./ListNews.css"
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
    const [questionAndAnswerFromFB, setquestionAndAnswerFromFB] = useState(undefined)
    // usecontect-stuffs for sync
    const { stateForHomePageTwoNestedCompToSync, setStateForHomePageTwoNestedCompToSync } = useContext(HomePageComponentsToSync)
    // fetching questions and answers
    useEffect(() => {
        db.collection("questions").orderBy("date", "desc").get().then(snapshot => {
            // console.log("ques snap, ", snapshot.docs);
            setquestionAndAnswerFromFB(snapshot.docs.map(doc => ({
                id: doc.id,
                key: doc.id,
                data: doc.data()
            })))
        }).catch(error => console.log("error in fetching data from FB, ", error))

        return () => {
        }
    }, [stateForHomePageTwoNestedCompToSync])

    return (
        <div >
            {
                questionAndAnswerFromFB ? <Grid container spacing={1} id="newsList__main" >
                    {questionAndAnswerFromFB.map(item => (
                        <Grid item xs={6} sm={4} md={4} lg={3} key={Math.random()}   >
                            <Link to={"/Answers/" + item.id} className="link__newsDecoration" >
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
                            </Link>
                        </Grid>
                    ))}

                </Grid > : <div className="skeleton__div"  ><Skeleton variant="rect" width="80vw" height="30vh" /></div>

            }

        </div>


    )
}

export default ListNews
