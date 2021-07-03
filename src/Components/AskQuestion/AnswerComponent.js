import { Avatar, IconButton, ListItemAvatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Button from "@material-ui/core/Button";
import { db } from "../../Firebase/Firebase";
import Skeleton from "@material-ui/lab/Skeleton";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase";
import { useParams } from "react-router-dom";
import SnackBarComponent from "../SnackBar/SnackBarComponent";
import { Link } from "react-router-dom";

import "./AnswerComponent.css";

const AnswerComponent = () => {
    const [user, setUser] = useState(undefined);
    const [questionAnswerFromFB, setquestionAnswerFromFB] = useState(undefined);
    const [answerListsOfQuestions, setanswerListsOfQuestions] =
        useState(undefined);
    const [stateAfterAnswerSubmit, setstateAfterAnswerSubmit] = useState(false);
    const [stateAfterVote, setstateAfterVote] = useState(false);
    const [openSnackbarProps, setopenSnackbarProps] = useState(false);
    const [seeMoreState, setSeeMoreState] = useState(false); //too see all answer when clicke on see more
    const { id } = useParams();
    useEffect(() => {
        firebase.analytics().logEvent("User is in Answer Component")
        // the below  function to retreive questions
        db.collection("questions")
            .doc(id)
            .get()
            .then((snapshot) => {
                setquestionAnswerFromFB(snapshot.data());
            })
            .catch((error) => console.log("error in fetching data from FB, ", error));

        // the below function to get  inner answer collection in question collection
        db.collection("questions")
            .doc(id)
            .collection("answersList")
            .get()
            .then((snapshot) => {
                setanswerListsOfQuestions(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                );
            })
            .catch((error) => console.log("error in fetching data from FB, ", error));

        // checking if user is logged in
        firebase.auth().onAuthStateChanged((userState) => {
            if (userState) {
                setUser(userState);
            } else {
                setUser(undefined);
            }
        });
        return () => { };
    }, [stateAfterAnswerSubmit, stateAfterVote]);

    // all setup for Form Dialog Box
    const [open, setOpen] = React.useState(false);
    const [answer, setanswer] = useState(undefined);
    const handleClickOpen = () => {
        setanswer(undefined);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setanswer(undefined);
    };

    // send form to firebase
    const sendAnswerToFirebase = () => {
        if (user) {
            const idInnerCollection = uuidv4();
            db.collection("questions")
                .doc(id)
                .collection("answersList")
                .doc(idInnerCollection)
                .set({
                    answer: answer,
                    date: new Date(),
                    id: idInnerCollection,
                    vote: 0,
                    replies: ["No replies"],
                    peopleWhoDownVoted: ["none"],
                    peopleWhoUpVoted: ["None"],
                })
                .then((data) => {
                    console.log("Answer sent to firebase");
                    setOpen(false);
                    setanswer(undefined);
                    setstateAfterAnswerSubmit(!stateAfterAnswerSubmit);
                })
                .catch((error) =>
                    console.log("Error  while sending answer to firebase")
                );
        } else {
            console.log("PLease log in");
            setopenSnackbarProps(true);
            setTimeout(() => {
                setopenSnackbarProps(false);
            }, 1000);
        }
    };

    // adding upvote/downvote to answers
    const voteAnswer = (answerId, voteCount) => {
        console.log("asnwid", answerId, voteCount);
        console.log("vote answer methid being called");

        if (user) {
            db.collection("questions")
                .doc(id)
                .collection("answersList")
                .doc(answerId)
                .get()
                .then((snapshot) => {
                    console.log("**", snapshot.data().vote);
                    const hasUserUpVoted = snapshot
                        .data()
                        ?.peopleWhoUpVoted.includes(user?.email);
                    const hasUserDownVoted = snapshot
                        .data()
                        ?.peopleWhoDownVoted.includes(user?.email);
                    if (!hasUserUpVoted && !hasUserDownVoted) {
                        if (voteCount === 1) {
                            db.collection("questions")
                                .doc(id)
                                .collection("answersList")
                                .doc(answerId)
                                .update({
                                    vote: snapshot.data().vote + voteCount,
                                    peopleWhoUpVoted: firebase.firestore.FieldValue.arrayUnion(
                                        user?.email
                                            ? user?.email
                                            : "Something wrong with firebase apis"
                                    ),
                                })
                                .then((resp) => console.log("success in vote fucntion1"))
                                .catch((error) => console.log("error in vote function"));
                        } else if (voteCount === -1) {
                            db.collection("questions")
                                .doc(id)
                                .collection("answersList")
                                .doc(answerId)
                                .update({
                                    vote: snapshot.data().vote + voteCount,
                                    peopleWhoDownVoted: firebase.firestore.FieldValue.arrayUnion(
                                        user?.email
                                            ? user?.email
                                            : "Something wrong with firebase apis"
                                    ),
                                })
                                .then((resp) => console.log("success in vote fucntion2"))
                                .catch((error) => console.log("error in vote function"));
                        }
                        setstateAfterVote(!stateAfterVote);
                    } else if (hasUserUpVoted && !hasUserDownVoted) {
                        if (voteCount === 1) {
                            console.log("You cant vote twice.");
                        } else if (voteCount === -1) {
                            // checking for edge case when vote is 0 and you want user to be nowher in array
                            if (snapshot.data().vote === 1) {
                                db.collection("questions")
                                    .doc(id)
                                    .collection("answersList")
                                    .doc(answerId)
                                    .update({
                                        vote: snapshot.data().vote + voteCount,
                                        peopleWhoUpVoted: firebase.firestore.FieldValue.arrayRemove(
                                            user?.email
                                        ),
                                    })
                                    .then((resp) => console.log("success in vote fucntion3"))
                                    .catch((error) => console.log("error in vote function"));
                            } else {
                                db.collection("questions")
                                    .doc(id)
                                    .collection("answersList")
                                    .doc(answerId)
                                    .update({
                                        vote: snapshot.data().vote + voteCount,
                                        peopleWhoDownVoted:
                                            firebase.firestore.FieldValue.arrayUnion(
                                                user?.email
                                                    ? user?.email
                                                    : "Something wrong with firebase apis"
                                            ),
                                        peopleWhoUpVoted: firebase.firestore.FieldValue.arrayRemove(
                                            user?.email
                                        ),
                                    })
                                    .then((resp) => console.log("success in vote fucntion3"))
                                    .catch((error) => console.log("error in vote function"));
                            }
                        }
                        setstateAfterVote(!stateAfterVote);
                    } else if (!hasUserUpVoted && hasUserDownVoted) {
                        if (voteCount === -1) {
                            console.log("You can't downvote twice");
                        } else if (voteCount === 1) {
                            // check for edge case when vote is -1
                            if (snapshot.data().vote === -1) {
                                db.collection("questions")
                                    .doc(id)
                                    .collection("answersList")
                                    .doc(answerId)
                                    .update({
                                        vote: snapshot.data().vote + voteCount,
                                        peopleWhoDownVoted:
                                            firebase.firestore.FieldValue.arrayRemove(user?.email),
                                    })
                                    .then((resp) => console.log("success in vote fucntion"))
                                    .catch((error) => console.log("error in vote function"));
                            } else {
                                db.collection("questions")
                                    .doc(id)
                                    .collection("answersList")
                                    .doc(answerId)
                                    .update({
                                        vote: snapshot.data().vote + voteCount,
                                        peopleWhoUpVoted: firebase.firestore.FieldValue.arrayUnion(
                                            user?.email
                                                ? user?.email
                                                : "Something wrong with firebase apis"
                                        ),
                                        peopleWhoDownVoted:
                                            firebase.firestore.FieldValue.arrayRemove(user?.email),
                                    })
                                    .then((resp) => console.log("success in vote fucntion"))
                                    .catch((error) => console.log("error in vote function"));
                            }
                        }
                        setstateAfterVote(!stateAfterVote);
                    }


                })
                .catch((error) => console.log("Error in getting vote count."));
        } else {
            console.log("Please log in");
            setopenSnackbarProps(true);
            setTimeout(() => {
                setopenSnackbarProps(false);
            }, 1000);
        }
    };
    console.log("the user is, ", user);

    return (
        <div className="answerComponetn__topMainDiv">
            <div className="dark_greyBox"></div>
            {questionAnswerFromFB ? (
                <div id="QA__main">
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <h3>{questionAnswerFromFB?.question}</h3>
                            <div className="icons__QA">
                                <IconButton aria-label="share" onClick={handleClickOpen}>
                                    <BorderColorIcon fontSize="large" />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <MoreHorizIcon fontSize="large" />
                                </IconButton>
                            </div>
                            <div className="dark_greyBox">
                                <span className="noOfAns">
                                    {answerListsOfQuestions?.length
                                        ? answerListsOfQuestions?.length + " Answers"
                                        : "Be the first to reply.🖊"}
                                </span>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            {answerListsOfQuestions?.map((docData, i) => (
                                <div className="qa__mainDiv" key={i}>
                                    <div className="avatarAndids">
                                        <ListItemAvatar>
                                            <Avatar alt="Profile Picture" src={""} />
                                        </ListItemAvatar>
                                        <div className="avatarAndids__innner">
                                            <strong>
                                                {docData?.data?.email
                                                    ? docData?.data?.email
                                                    : "Anonymous"}
                                            </strong>
                                            <span>
                                                {docData?.data?.date.toDate().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {!seeMoreState && (
                                        <div className="inner__answer">
                                            {docData?.data?.answer &&
                                                docData?.data?.answer.length >= 200 && (
                                                    <div className="answer__seeMore">
                                                        <p>{docData?.data?.answer.slice(0, 200) + "..."}</p>{" "}
                                                        <span
                                                            className="seeMoreAnswer__span"
                                                            onClick={(e) => setSeeMoreState(!seeMoreState)}
                                                        >
                                                            see more
                                                        </span>
                                                    </div>
                                                )}
                                            {docData?.data?.answer &&
                                                docData?.data?.answer.length < 200 && (
                                                    <p>{docData?.data?.answer.slice(0, 200)} </p>
                                                )}
                                        </div>
                                    )}
                                    {seeMoreState && (
                                        <div className="inner__answer">
                                            {docData?.data?.answer && (
                                                <div div className="answer__seeMore">
                                                    <p>{docData?.data?.answer} </p>{" "}
                                                    <span
                                                        className="seeMoreAnswer__span"
                                                        onClick={(e) => setSeeMoreState(!seeMoreState)}
                                                    >
                                                        see less
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="qa__footer">
                                        <div id="oneIcon__collection">
                                            <IconButton
                                                onClick={(e) => voteAnswer(docData?.data.id, 1)}
                                                aria-label="share"
                                            >
                                                <ArrowUpwardIcon
                                                    color={
                                                        docData?.data?.vote > 0 ? "secondary" : "inherit"
                                                    }
                                                />{" "}
                                                {docData?.data?.vote >= 0 && (
                                                    <span className="icon__p">
                                                        {docData?.data?.vote ? docData?.data?.vote : 0}
                                                    </span>
                                                )}
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => voteAnswer(docData?.data.id, -1)}
                                                aria-label="share"
                                            >
                                                <ArrowDownwardIcon
                                                    color={
                                                        docData?.data?.vote < 0 ? "secondary" : "inherit"
                                                    }
                                                />{" "}
                                                {docData?.data?.vote < 0 && (
                                                    <span className="icon__p">{docData?.data.vote} </span>
                                                )}
                                            </IconButton>
                                        </div>
                                        <Button size="small" color="secondary">
                                            Reply.
                                        </Button>
                                    </div>
                                    <div className="dark_greyBox"></div>
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                </div>
            ) : (
                <div className="skeleton__div">
                    <Skeleton variant="rect" width="80vw" height="30vh" />
                </div>
            )}

            {/* Form  Popup for a Question */}
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    {/* <DialogTitle id="form-dialog-title">Ask me a question and I will answer it in a thread below.</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText>Answer it only if you know.</DialogContentText>
                        <TextField
                            multiline
                            rows={7}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Answer =>"
                            type="text"
                            fullWidth
                            value={answer}
                            onChange={(e) => setanswer(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        {
                            <Button
                                onClick={sendAnswerToFirebase}
                                color="primary"
                                disabled={!answer}
                                type="submit"
                            >
                                Submit
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
            </div>
            <SnackBarComponent open={openSnackbarProps} />
        </div>
    );
};

export default AnswerComponent;
