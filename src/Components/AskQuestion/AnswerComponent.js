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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from "@material-ui/core/CardActions";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";

import "./AnswerComponent.css";

const AnswerComponent = () => {
    const [user, setUser] = useState(undefined);
    const [questionAnswerFromFB, setquestionAnswerFromFB] = useState(undefined);
    const [answerListsOfQuestions, setanswerListsOfQuestions] = useState(undefined);
    const [stateAfterAnswerSubmit, setstateAfterAnswerSubmit] = useState(false);
    const [stateAfterQuestionSubmit, setstateAfterQuestionSubmit] = useState(false)
    const [stateAfterAnswerDelete, setStateAfterAnswerDelete] = useState(false)
    const [updateAfterSendingLike, setupdateAfterSendingLike] = useState(false)
    const [stateAfterVote, setstateAfterVote] = useState(false);
    const [openSnackbarProps, setopenSnackbarProps] = useState(false);
    const [seeMoreState, setSeeMoreState] = useState(false); //too see all answer when clicke on see more
    const [checkedBox, setCheckedBox] = React.useState(false); //checkbox
    const [questionId, setquestionId] = useState("")
    const [stateAfterVotingQuestion, setStateAfterVotingQuestion] = useState(false)
    const { id } = useParams();

    useEffect(() => {
        firebase.analytics().logEvent("User is in Answer Component")
        // the below  function to retreive questions
        db.collection("questions")
            .doc(id)
            .get()
            .then((snapshot) => {
                setquestionAnswerFromFB(snapshot.data());
                setquestionId(snapshot.id)
                setquestion(snapshot.data().question)
            })
            .catch((error) => console.log("error in fetching data from FB, ", error));

        // the below function to get  inner answer collection in question collection
        db.collection("questions")
            .doc(id)
            .collection("answersList")
            .orderBy("date", "desc")
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
    }, [stateAfterAnswerSubmit, stateAfterVote,
        stateAfterQuestionSubmit, stateAfterAnswerDelete,
        updateAfterSendingLike, stateAfterVotingQuestion, id]);

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
            // updating answers
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
                    emailUsedToAnswerSavedForSecurityPurpose: user?.email,
                    answeredBy: checkedBox ? "" : user?.email,
                    like: 0,
                    peopleWhoLiked: ["ds@gmial.com", "djs.com"],
                    disLike: 0,
                    userEmailVerified: user.emailVerified,
                    userDisplayName: user?.displayName,
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
            // updating answered field for the answer
            db.collection("questions")
                .doc(id)
                .update({
                    answered: true,
                })
                .then((data) => {
                    console.log("Answered filed updated");
                })
                .catch((error) =>
                    console.log("Error while Answered filed updated")
                );
        } else {
            console.log("PLease log in");
            setopenSnackbarProps(true);
            setTimeout(() => {
                setopenSnackbarProps(false);
            }, 1000);
        }
    };

    // adding love to answer // ading like/dis-like in each products
    // like-dislike answers
    const addLikeToFirebase = (data, numToAdd) => {
        console.log("id in funciton, ", data, numToAdd);
        if (user) {
            console.log("user found", user);
            db.collection("questions").doc(questionId).collection("answersList").doc(data?.id).get().then(doc => {
                console.log("chcking array, ", doc.data());
                if (!doc.data().peopleWhoLiked?.includes(user?.email)) {
                    db.collection("questions").doc(questionId).collection("answersList").doc(data?.id).update({
                        like: ++doc.data().like,
                        peopleWhoLiked: firebase.firestore.FieldValue.arrayUnion(user?.email ? user?.email : "joke")
                    }, { merge: true }).catch(error => console.log("error in updating insideLike toFirebase Funciton, ", error))
                } else {
                    db.collection("questions").doc(questionId).collection("answersList").doc(data?.id).update({
                        like: --doc.data().like,
                        peopleWhoLiked: firebase.firestore.FieldValue.arrayRemove(user?.email)
                    }, { merge: true }).catch(error => console.log("error in updating insideLike in -else statement- toFirebase Funciton, ", error))
                }
            }).catch(error => console.log("error in addLiketoFirebase Function, ", error))
            setupdateAfterSendingLike(!updateAfterSendingLike)
        }
        else {
            console.log("User not found while trying to send Like");
            // setpopUpText("Please Login.")
            // handleClickSnackbar()
            // history.push("/Login")
        }

    }

    // Edit answer -- many componets here are borowwwed from AskMeAquestionComponent
    // all setup for Form Dialog Box
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleEditAsnwer = () => {
        if (user?.email === questionAnswerFromFB?.questionPostedby) {
            setOpenDialog(true);
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setquestion("")
    };
    // send question to firebase
    const [noDoubleSUbmitCLick, setnoDoubleSUbmitCLick] = useState(false)
    const [useSnackBarState, setUseSnackBarState] = useState(false)
    const [question, setquestion] = useState("")
    const sendQuestionToFirebase = () => {
        // setstateAfterQuestionSubmit(true)
        if (user?.email === questionAnswerFromFB?.questionPostedby) {
            setnoDoubleSUbmitCLick(!noDoubleSUbmitCLick)
            db.collection("questions").doc(questionId).update({
                question: question,
                date: new Date(),
            }).then(doc => {
                console.log("snap while sending question to FB", doc)
                // setStateForHomePageTwoNestedCompToSync(!stateForHomePageTwoNestedCompToSync)
                setOpenDialog(false)
                setquestion("")
                setstateAfterQuestionSubmit(true)
            })
                .catch(error => {
                    console.log("Error while sending question to FB", error)
                    setOpen(false)
                })
        } else {
            setopenSnackbarProps(true);
            setTimeout(() => {
                setopenSnackbarProps(false);
            }, 1000);
        }
    }

    // delete answer
    const deleteAnswer = (idToDel, emailofAnswer) => {
        if (user?.email === emailofAnswer) {
            console.log("id to del", idToDel);
            db.collection("questions")
                .doc(id)
                .collection("answersList")
                .doc(idToDel)
                .delete()
                .then((snapshot) => {
                    console.log("Delete your reply");
                    setStateAfterAnswerDelete(!stateAfterAnswerDelete)
                })
                .catch((error) => console.log("Unable to delete reply ", error));
        }

    }
    // vote question
    const voteQuestion = (e) => {
        if (user) {
            console.log("user found", user);
            db.collection("questions").doc(questionId).get().then(doc => {
                console.log("chcking array, ", doc.data());
                if (!doc.data().peopleWhoVoted?.includes(user?.email)) {
                    db.collection("questions").doc(questionId).update({
                        vote: ++doc.data().vote,
                        peopleWhoVoted: firebase.firestore.FieldValue.arrayUnion(user?.email ? user?.email : "joke")
                    }, { merge: true }).catch(error => console.log("error in updating insideLike toFirebase Funciton, ", error))
                } else {
                    db.collection("questions").doc(questionId).update({
                        vote: --doc.data().vote,
                        peopleWhoVoted: firebase.firestore.FieldValue.arrayRemove(user?.email)
                    }, { merge: true }).catch(error => console.log("error in updating insideLike in -else statement- toFirebase Funciton, ", error))
                }
            })
                .then(nthg => setStateAfterVotingQuestion(!stateAfterVotingQuestion))
                .catch(error => console.log("error in addLiketoFirebase Function, ", error))

        } else {
            console.log("User not found while trying to send Like");
            setopenSnackbarProps(true);
            setTimeout(() => {
                setopenSnackbarProps(false);
            }, 1000);
        }

    }

    return (
        <div className="answerComponetn__topMainDiv">
            {questionAnswerFromFB ? (
                <div id="QA__main">
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <h3>{questionAnswerFromFB?.question}</h3>
                            <div className="icons__QA">
                                <IconButton aria-label="share" onClick={e => handleClickOpen(e)}>
                                    <BorderColorIcon fontSize="large" />
                                </IconButton>
                                {questionAnswerFromFB.peopleWhoVoted?.includes(user?.email) ?
                                    <IconButton aria-label="share" onClick={e => voteQuestion(1, -1)}>
                                        <div style={{ display: "flex", flexDirection: "column" }} >
                                            <FavoriteIcon fontSize="large" /> <span style={{ fontSize: "12px" }}>{questionAnswerFromFB.vote} Votes</span>
                                        </div>
                                    </IconButton> :
                                    <IconButton aria-label="share" onClick={e => voteQuestion(1, -1)} >
                                        <div style={{ display: "flex", flexDirection: "column" }} >
                                            <FavoriteBorderOutlined fontSize="large" /> <span style={{ fontSize: "12px" }}>{questionAnswerFromFB.vote} Votes</span>
                                        </div>
                                    </IconButton>}

                                {questionAnswerFromFB.questionPostedby === user?.email &&
                                    <IconButton aria-label="share" onClick={e => handleEditAsnwer(e)} >
                                        <MoreHorizIcon fontSize="large" />
                                    </IconButton>
                                }

                            </div>
                            <p id="question__Tag">#{questionAnswerFromFB.tag}</p>
                            <div className="dark_greyBox">
                                <span className="noOfAns">
                                    {answerListsOfQuestions?.length
                                        ? answerListsOfQuestions?.length + " Answers"
                                        : "Be the first to reply.🖊"}
                                </span>
                            </div>
                        </Grid>

                        {answerListsOfQuestions?.length > 0 ?
                            <Grid item xs={12} sm={12} md={8} lg={8}>
                                {answerListsOfQuestions?.map((docData, i) => (
                                    <div className="qa__mainDiv" key={i}>
                                        <div className="avatarAndids">
                                            <ListItemAvatar>
                                                <Avatar alt="Profile Picture" src={""} />
                                            </ListItemAvatar>
                                            <div className="avatarAndids__innner">
                                                <strong>
                                                    {docData?.data?.answeredBy
                                                        ? docData?.data?.answeredBy
                                                        : "Anonymous"}
                                                </strong>
                                                <span>
                                                    {docData?.data?.date.toDate().toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="inner__answer">
                                            {docData?.data?.answer &&
                                                docData?.data?.answer.length < 200 && (
                                                    <p>{docData?.data?.answer.slice(0, 200)} </p>
                                                )}
                                        </div>


                                        {!seeMoreState && (
                                            <div className="inner__answer">
                                                {docData?.data?.answer &&
                                                    docData?.data?.answer.length >= 200 && (
                                                        <div className="answer__seeMore">
                                                            <p>{docData?.data?.answer.slice(0, 200) + "..."}</p>{" "}
                                                            <span
                                                                style={{ cursor: "pointer" }}
                                                                className="seeMoreAnswer__span"
                                                                onClick={(e) => setSeeMoreState(!seeMoreState)}
                                                            >
                                                                see more
                                                            </span>
                                                        </div>
                                                    )}

                                            </div>
                                        )}
                                        {seeMoreState && (
                                            <div className="inner__answer">
                                                {docData?.data?.answer && docData?.data?.answer.length >= 200 && (
                                                    <div div className="answer__seeMore">
                                                        <p>{docData?.data?.answer} </p>{" "}
                                                        <span
                                                            style={{ cursor: "pointer" }}
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

                                                <CardActions disableSpacing>
                                                    {docData?.data.peopleWhoLiked?.includes(user?.email) && <IconButton onClick={e => addLikeToFirebase(docData?.data, -1)} aria-label="add to favorites" style={{ color: "#ed4956" }}>
                                                        <FavoriteIcon /><p className="like">{docData?.data?.like + " likes"}</p>
                                                    </IconButton>}
                                                    {!docData?.data?.peopleWhoLiked?.includes(user?.email) && <IconButton aria-label="add to favorites" onClick={e => addLikeToFirebase(docData?.data, 1)}>
                                                        <FavoriteBorderOutlined /><p className="like">{docData?.data?.like + " likes"}</p>
                                                    </IconButton>}
                                                    {/* <IconButton aria-label="add to favorites">
                                                                <FavoriteBorderOutlined onClick={e => addLikeToFirebase(item?.data)} />
                                                            </IconButton> */}

                                                </CardActions>
                                            </div>
                                            <div>
                                                {user?.email === docData.data.emailUsedToAnswerSavedForSecurityPurpose &&
                                                    <Button size="small" color="secondary" onClick={e => deleteAnswer(docData?.data?.id, docData?.data?.answeredBy)}  >
                                                        Delete.
                                                    </Button>
                                                }
                                                <Button size="small" color="secondary" disabled={true} >
                                                    Reply.
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="dark_greyBox"></div>
                                    </div>
                                ))}
                            </Grid> : <p className="no__answers">No Answers Available at the moment.</p>}
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
                        <FormControlLabel
                            control={<Checkbox checked={checkedBox} onChange={e => setCheckedBox(!checkedBox)} name="checkedA" />}
                            label="Anonymous"
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
            {/* Form  Popup for a Question */}
            <div>
                <Dialog open={openDialog} onClose={e => handleCloseDialog()} aria-labelledby="form-dialog-title">
                    {/* <DialogTitle id="form-dialog-title">Ask me a question and I will answer it in a thread below.</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText>
                            Ask me anything.
                        </DialogContentText>
                        <TextField
                            multiline
                            rows={7}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Question?(20 to 200 words)"
                            type="text"
                            fullWidth
                            value={question}
                            onChange={e => setquestion(e.target.value)}
                            inputProps={{ maxLength: 200, minLength: 100, required: true, placeholder: "Put your question here." }}
                        />
                    </DialogContent>
                    {/* {ErrorForMaxCharInput && <p>No more than 200 chars allowed</p>} */}
                    <DialogActions>
                        <Button onClick={e => handleCloseDialog()} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={e => sendQuestionToFirebase(e)} color="primary" disabled={question?.length < 20 || user?.email !== questionAnswerFromFB?.questionPostedby}  >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AnswerComponent;
