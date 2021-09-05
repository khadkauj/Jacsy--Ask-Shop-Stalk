import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { db } from "../../Firebase/Firebase";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase";
import SnackBarComponent from "../SnackBar/SnackBarComponent";
import { Link } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { HomePageComponentsToSync } from "../ContextComponent";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';


import "./AskMeAQuestionComponent.css";

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: "auto",
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const AskMeAQuestionComponent = ({ user }) => {

    // const [user, setUser] = useState(state);
    // console.log("state in ask me", user);
    const classes = useStyles();
    // use-context stuffs
    const {
        stateForHomePageTwoNestedCompToSync,
        setStateForHomePageTwoNestedCompToSync,
    } = useContext(HomePageComponentsToSync);
    const [FilterTag, setFilterTag] = React.useState("Miscellaneous"); //checkbox
    // extra state to not allow double clicking of submit
    const [noDoubleSUbmitCLick, setnoDoubleSUbmitCLick] = useState(false);
    const [questionAnswerFromFB, setquestionAnswerFromFB] = useState([
        {
            id: 1,
            data: {
                question: "What are the three Guṇas(elements)?",
                answer:
                    "The three gunas are called: sattva (goodness, calmness, harmonious), rajas (passion, activity, movement), and tamas (ignorance, inertia, laziness). ",
            },
        },
    ]);
    const [stateAfterQuestionSubmit, setstateAfterQuestionSubmit] =
        useState(false);
    const [firebaseSeachQuery, setFirebaseSeachQuery] = useState("")
    const [clickResetFilter, setClickResetFilter] = useState(false)
    const [orderAnswerBy, setOrderAnswerBy] = useState("Date:Latest");
    const [filterAnswerByType, setfilterAnswerByType] = useState("");
    // const [widthScreen, setWidthScreen] = useState(document.body.clientWidth)
    var widthScreen = window.innerWidth

    // all setup for Form Dialog Box
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setquestion("");
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setquestion("");
    };

    // send question to firebase
    const [useSnackBarState, setUseSnackBarState] = useState(false);
    const sendQuestionToFirebase = () => {
        setstateAfterQuestionSubmit(true);
        if (user) {
            setnoDoubleSUbmitCLick(!noDoubleSUbmitCLick);
            db.collection("questions")
                .add({
                    question: question,
                    date: new Date(),
                    answered: false,
                    id: uuidv4(),
                    questionPostedby: user?.email,
                    vote: 0,
                    tag: FilterTag,
                    noOfAnswers: 0,
                    emailUsedToAnswerSavedForSecurityPurpose: user?.email,
                    answeredBy: user?.email,
                    peopleWhoVoted: ["ds@gmial.com", "djs.com"],
                    unVote: 0,
                    userEmailVerified: user.emailVerified,
                    userDisplayName: user?.displayName,
                    uid: user.uid
                })
                .then((doc) => {
                    setStateForHomePageTwoNestedCompToSync(
                        !stateForHomePageTwoNestedCompToSync
                    );
                    setOpen(false);
                    setquestion("");
                })
                .catch((error) => {
                    console.log("Error while sending question to FB", error);
                    setOpen(false);
                });
        } else {
            setUseSnackBarState(!useSnackBarState);
            setTimeout(() => {
                setUseSnackBarState(false);
            }, 1000);
        }
    };


    const [noOfQuestionToShow, setNoOfQuestionToShow] = useState(25)

    const [lastVisible, setLastVisible] = useState("")
    // fetching questions and answers + checking user state
    useEffect(() => {
        if (orderAnswerBy === "Date:Oldest") {
            var type = "date"
            var order = "asc"
        } else if (orderAnswerBy === "Date:Latest") {
            type = "date"
            order = "desc"
        } else if (orderAnswerBy === "Votes:Highest") {
            type = "vote"
            order = "desc"
        } else if (orderAnswerBy === "Votes:Lowest") {
            type = "vote"
            order = "asc"
        } else if (orderAnswerBy === "Replies:Max") {
            type = "Vote"
            order = "asc"
        }

        db.collection("questions")
            .orderBy(type, order)
            .limit(noOfQuestionToShow)
            .get()
            .then((snapshot) => {
                const vis = snapshot.docs[snapshot.docs.length - 1]
                setLastVisible(vis)
                setquestionAnswerFromFB(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                );
            })
            .catch((error) => console.log("error in fetching data from FB, ", error));


        // scroll to bottom of question if noOfQuestionToShow is more than 25
        if (noOfQuestionToShow > 25) {
            window.scrollTo(0, document.body.scrollHeight)
        }


        // firebase.auth().onAuthStateChanged((userState) => {
        //     if (userState) {
        //         setUser(userState);
        //     } else {
        //         setUser(undefined);
        //     }
        // });

        return () => { };
    }, [stateForHomePageTwoNestedCompToSync, clickResetFilter, orderAnswerBy]);



    // setting question checking for more than 120 chars
    const [question, setquestion] = useState("");
    const [ErrorForMaxCharInput, setErrorForMaxCharInput] = useState(false);
    const handlesetErrorForMaxCharInput = (e) => {
        setquestion(e.target.value);

    };

    // setup for  filter
    const clearFilter = () => {
        setOrderAnswerBy("");
        setfilterAnswerByType("");
        setFirebaseSeachQuery("")
        // setClickResetFilter(!clickResetFilter)

    };

    const changeTypeFilter = (e) => {
        setfilterAnswerByType(e.target.value);
        if (e.target.value) {
            db.collection("questions")
                .where("tag", "==", e.target.value)
                .orderBy("date", 'desc')
                .limit(noOfQuestionToShow)
                .get()
                .then((snapshot) => {
                    console.log(filterAnswerByType);
                    setquestionAnswerFromFB(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            key: doc.id,
                            data: doc.data(),
                        }))
                    );
                })
                .catch((error) => console.log("error in fetching data from FB, ", error));


            // scroll to bottom of question if noOfQuestionToShow is more than 25
            if (noOfQuestionToShow > 25) {
                window.scrollTo(0, document.body.scrollHeight)
            }

        }
    };
    const changeOrderAnswer = (e) => {
        setOrderAnswerBy(e.target.value);
    };

    // get more question after clicking on see more
    const seeMore = (e) => {
        setNoOfQuestionToShow(noOfQuestionToShow + 25)

        if (orderAnswerBy === "Date:Oldest") {
            var type = "date"
            var order = "asc"
        } else if (orderAnswerBy === "Date:Latest") {
            type = "date"
            order = "desc"
        } else if (orderAnswerBy === "Votes:Highest") {
            type = "vote"
            order = "desc"
        } else if (orderAnswerBy === "Votes:Lowest") {
            type = "vote"
            order = "asc"
        } else if (orderAnswerBy === "Replies:Max") {
            type = "Vote"
            order = "asc"
        }

        if (lastVisible) {
            db.collection("questions")
                .orderBy(type, order)
                .startAfter(lastVisible)
                .limit(noOfQuestionToShow)
                .get()
                .then((snapshot) => {
                    var lastVis = snapshot.docs[snapshot.docs.length - 1]
                    setLastVisible(lastVis)
                    setquestionAnswerFromFB(prev => [...prev, ...snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))]

                    );
                })
                .catch((error) => console.log("error in fetching data from FB, ", error));
        }



        // scroll to bottom of question if noOfQuestionToShow is more than 25
        if (noOfQuestionToShow > 25) {
            window.scrollTo(0, document.body.scrollHeight)
        }


    }

    // firebase Full text search
    const firebaseFulltextSearch = (e) => {
        setFirebaseSeachQuery(e.target.value)

        db.collection("questions")
            .orderBy("question")
            .startAt(firebaseSeachQuery.toUpperCase())
            .endAt(firebaseSeachQuery.toLowerCase() + "~")
            .limit(25)
            .get()
            .then((snapshot) => {
                // snapshot.docs.map(docs => {
                //     console.log("ujjwal sanpshot, ", docs.data());
                // })
                setquestionAnswerFromFB(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                );
            })
            .catch((error) => console.log("error in fetching data from FB, ", error));
    }

    return (
        <div id="main__appbar">
            <div id="filter__search">
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Tags</InputLabel>
                        <Select

                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterAnswerByType}
                            onChange={(e) => {
                                changeTypeFilter(e)
                            }}
                        >
                            <MenuItem value={"CS/RIS"}>CS/RIS</MenuItem>
                            <MenuItem value={"Course"}>Course</MenuItem>
                            <MenuItem value={"Housing"}>Housing</MenuItem>
                            <MenuItem value={"Admission"}>Admission</MenuItem>
                            <MenuItem value={"Faculty"}>Faculty</MenuItem>
                            <MenuItem value={"Job/Internship"}>Job/Internship</MenuItem>
                            <MenuItem value={"Party/Holiday"}>Party/Holiday</MenuItem>
                            <MenuItem value={"Krupp"}>Krupp</MenuItem>
                            <MenuItem value={"Nordmetall"}>Nordmetall</MenuItem>
                            <MenuItem value={"College3"}>College3</MenuItem>
                            <MenuItem value={"Mercator"}>Mercator</MenuItem>
                            <MenuItem value={"Miscellaneous"}>Miscellaneous</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Order By</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={orderAnswerBy}
                            onChange={(e) => changeOrderAnswer(e)}
                        >
                            <MenuItem value={"Votes:Highest"}>Votes:Highest</MenuItem>
                            <MenuItem value={"Votes:Lowest"}>Votes:Lowest</MenuItem>
                            <MenuItem value={"Date:Latest"}>Date:Latest</MenuItem>
                            <MenuItem value={"Date:Oldest"}>Date:Oldest</MenuItem>
                            <MenuItem value={"Replies:Max"}>No of replies:Max</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="text-search-firebase" >
                    <form className="text-search-firebase-form" >
                        <TextField style={{ flex: "1" }} id="text-search-firebase-form-textfield" label="Search questions"
                            value={firebaseSeachQuery} onChange={e => firebaseFulltextSearch(e)} />
                        <Button
                            disabled={true}
                            className="text-search-firebase-form-button"
                            startIcon={<RotateLeftIcon />}
                            onClick={e => clearFilter(e)}
                        >
                            reset
                        </Button>
                    </form>

                </div>

            </div>
            <div className="appBAr">
                <Paper square className={classes.paper}>
                    <Typography className={classes.text} variant="h6">
                        Ask a Question.
                    </Typography>

                    <List className={classes.list}>
                        {questionAnswerFromFB.map((query) => (
                            <React.Fragment key={query.id}>
                                <Link
                                    to={"/Answers/" + query.id}
                                    className="link__newsDecoration"
                                >
                                    <ListItem button>
                                        {/* <ListItemAvatar>
                                            <Avatar alt="Profile Picture" src={""} />
                                        </ListItemAvatar> */}

                                        {/* smaller screen */}
                                        {!query.data?.answered && widthScreen < 800 && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.length < 200
                                                        ? query.data?.question
                                                        : query.data?.question.slice(0, 200) + "....."
                                                }
                                                secondary={<> "No answer available at the moment." 💓<sup>{query.data?.vote} </sup>  </>}
                                            />
                                        )}
                                        {query.data?.answered && widthScreen < 800 && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.length < 200
                                                        ? query.data?.question
                                                        : query.data?.question.slice(0, 200) + "....."
                                                }
                                                secondary={<span>"Click to view replies." 💓<sup>{query.data?.vote}</sup></span>}
                                            />
                                        )}

                                        {/* larger screen */}
                                        {!query.data?.answered && widthScreen > 800 && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.slice(0, 500)
                                                }
                                                secondary={<p> "No answer available at the moment." 💓<sup>{query.data?.vote} </sup>  </p>}
                                            />
                                        )}
                                        {query.data?.answered && widthScreen > 800 && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.slice(0, 500)
                                                }
                                                secondary={<span>"Click to view replies." 💓<sup>{query.data?.vote}</sup></span>}
                                            />
                                        )}
                                    </ListItem>
                                </Link>
                            </React.Fragment>
                        ))}
                        {questionAnswerFromFB.length % 25 === 0 && questionAnswerFromFB.length !== 0 ?
                            <div id='seemoreQuestions'>
                                <p onClick={e => seeMore(e)} >Load more</p>
                            </div> : <></>
                        }

                    </List>

                    <br />
                    <br />
                </Paper>
            </div>
            <div>
                <div className="plus-fav" >
                    <Fab
                        color="secondary"
                        aria-label="add"
                        className={classes.fabButton}
                        onClick={(e) => handleClickOpen()}
                    >
                        <AddIcon />
                    </Fab>
                </div>
            </div>

            {/* Form  Popup for a Question */}
            <div>
                <Dialog
                    open={open}
                    onClose={(e) => handleClose()}
                    aria-labelledby="form-dialog-title"
                >
                    {/* <DialogTitle id="form-dialog-title">Ask me a question and I will answer it in a thread below.</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText>
                            Ask us a question and we will answer it in a thread below.
                        </DialogContentText>
                        <TextField
                            multiline
                            rows={7}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Question?(20-500 characters)*"
                            type="text"
                            fullWidth
                            value={question}
                            onChange={(e) => handlesetErrorForMaxCharInput(e)}
                            inputProps={{
                                maxLength: 500,
                                minLength: 100,
                                required: true,
                                placeholder: "Put your question here.",
                            }}
                        />
                        {/* checkbox div for filtering */}
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">#Tag</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={FilterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                            >
                                <MenuItem value={"CS/RIS"}>CS/RIS</MenuItem>
                                <MenuItem value={"Course"}>Course</MenuItem>
                                <MenuItem value={"Housing"}>Housing</MenuItem>
                                <MenuItem value={"Admission"}>Admission</MenuItem>
                                <MenuItem value={"Faculty"}>Faculty</MenuItem>
                                <MenuItem value={"Job/Internship"}>Job/Internship</MenuItem>
                                <MenuItem value={"Party/Holiday"}>Party/Holiday</MenuItem>
                                <MenuItem value={"Miscellaneous"}>Miscellaneous</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    {/* {ErrorForMaxCharInput && <p>No more than 200 chars allowed</p>} */}
                    <DialogActions>
                        <Button onClick={(e) => handleClose()} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) => sendQuestionToFirebase(e)}
                            color="primary"
                            disabled={
                                stateAfterQuestionSubmit || question?.length < 20 || !FilterTag
                            }
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <SnackBarComponent open={useSnackBarState} />
        </div>
    );
};

export default AskMeAQuestionComponent;
