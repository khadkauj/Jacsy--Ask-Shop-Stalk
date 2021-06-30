import { Avatar, IconButton, ListItemAvatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import BorderColorIcon from '@material-ui/icons/BorderColor';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Button from '@material-ui/core/Button';
import { db } from "../../Firebase/Firebase"
import Skeleton from '@material-ui/lab/Skeleton';
import { Grid } from '@material-ui/core';

import "./AnswerComponent.css"
import { useParams } from 'react-router-dom';
const AnswerComponent = () => {
    const text = "After reading all sorts of comments. The main difference between Europeans and Americans is that in Europe everyone is a smart-ass. We are so proud of our correctness and think highly of our “liberal” values when we are just the opposite. We had such a violent history no American could capture in one movie. I saw here Irish and Swedish people responding that you carry weapons and we don’t. How silly to hear that. Not 20 years ago, Ireland was a synonym for violence. Dutch troops are one of the most responsible for the greatest genocide in Europe after WW2 - Srebrenica, Vukovar, etc… Let’s deconstruct this myth of European “values”: There are no universal European values. Europe is a continent of many ancient civilizations (Hittites, Phoenicians, Greeks, Persians, Sarmatians, Vikings, Ottoman Turks, Basks, Celts, Germans, Slavs, Illyrians, etc…). Following our history, there are no universalities in our society that came before globalization and the internet. There is however one common characteristic and that is Christianity and its values. Although today young Europeans are proud to say they are atheists, Christianity is the core of their value system, the same as it is the core in yours. Free healthcare - this is maybe the only thing that is true. However, there are countries where it is normal that you don’t treat each patient equally. There are lots of things that could ruin the health care system, corruption for example. And it is widespread through half of Europe, specifically Eastern parts. Guns. This is again a matter of perception. Do you perceive only half of Europe as Europe and its eastern parts are not? I know people in my very street that have rocket launchers inside their houses…. Nudity? How strange to say that. But judging from the above comments it would seem that you can walk naked almost everywhere…That is of course not true at all. Nudity in arts, yes… But who doesn’t have it? There is a reason that we have separate nudist beaches… No patriotism? Saying people who live in Europe??? Are you serious? The smallest continent with most countries in the world! No discrimination? Blacks in Saint Dennis would agree with that for sure, as would gipsies… Russians in Baltics, Jews almost everywhere, Polish people in GB, Turkish in Germany in the 90ties, Serbs in Croatia, Croats in Serbia, Bosnia, Turks in Armenia, Armenians in Turkey, Basks and Catalans in Spain… and migrants? No, there is no discrimination at all. Okay, drinking in the street is allowed. However, we have strict policies on the ways how liquor can be both. You can’t buy it after midnight in some countries for example."

    const [questionAnswerFromFB, setquestionAnswerFromFB] = useState(undefined)

    const { id } = useParams()
    useEffect(() => {
        db.collection("questions").doc(id).get().then(snapshot => {
            // console.log("ques snap, ", snapshot.docs);
            setquestionAnswerFromFB(snapshot.data());
            // console.log(" doc", snapshot.data());
            // return snapshot
        }).catch(error => console.log("error in fetching data from FB, ", error))

        return () => {
        }
    }, [id])
    console.log("*", questionAnswerFromFB, id);

    return (

        <div className="answerComponetn__topMainDiv">
            <div className="dark_greyBox">

            </div>
            {questionAnswerFromFB ? <div id="QA__main">


                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        <h3>{questionAnswerFromFB?.question}</h3>
                        <div className="icons__QA">
                            <IconButton aria-label="share">
                                <BorderColorIcon fontSize="large" />
                            </IconButton>
                            <IconButton aria-label="share">
                                <MoreHorizIcon fontSize="large" />
                            </IconButton>
                        </div>
                        <div className="dark_greyBox">
                            <span className="noOfAns">{questionAnswerFromFB?.answer?.length ? questionAnswerFromFB?.answer?.length + " Answers" : "Be the first to reply.🖊"}</span>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        {questionAnswerFromFB.answer.map(answer => (
                            <div className="qa__mainDiv" >
                                <div className="avatarAndids" >
                                    <ListItemAvatar>
                                        <Avatar alt="Profile Picture" src={""} />
                                    </ListItemAvatar>
                                    <div className="avatarAndids__innner">
                                        <strong>{questionAnswerFromFB?.email ? questionAnswerFromFB?.email : "Anonymous"}</strong>
                                        <span>{questionAnswerFromFB?.date.toDate().toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="inner__answer">
                                    {answer && answer.length >= 200 && <p>{answer.slice(0, 200) + "..."}</p>}
                                    {answer && answer.length < 200 && <p>{answer.slice(0, 100) + "***"} </p>}
                                </div>


                                <div className="qa__footer">
                                    <div>
                                        <IconButton aria-label="share">
                                            <ArrowUpwardIcon /> <span className="icon__p">7</span>
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ArrowDownwardIcon /> <span className="icon__p"></span>
                                        </IconButton>
                                    </div>
                                    <Button size="small" color="secondary" >
                                        Reply.
                                    </Button>
                                </div>
                                <div className="dark_greyBox">

                                </div>
                            </div>
                        ))}
                    </Grid>


                </Grid>
            </div> : <div className="skeleton__div"  ><Skeleton variant="rect" width="80vw" height="30vh" /></div>}
        </div>

    )
}

export default AnswerComponent
