import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


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
    return (
        <div >
            <Grid container spacing={1} id="newsList__main" >
                {listOfNews.map(news => (
                    <Grid item xs={4} sm={4} md={4} lg={4} key={Math.random()}   >
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image="https://data.whicdn.com/images/167909674/original.jpg"
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <p gutterBottom variant="h5" component="h2">
                                        Wolf 🐺
                                    </p>
                                </CardContent>
                            </CardActionArea>
                            {/* <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                            <Button size="small" color="primary">
                                Learn More
                            </Button>
                        </CardActions> */}
                        </Card>
                    </Grid>
                ))}

            </Grid >
        </div>


    )
}

export default ListNews
