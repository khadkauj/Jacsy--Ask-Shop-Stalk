import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
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

import "./AskMeAQuestionComponent.css";
const messages = [
    {
        id: 1,
        primary: "Brunch this week?",
        secondary:
            "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: "/static/images/avatar/5.jpg",
    },
];

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

const AskMeAQuestionComponent = () => {
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
                })
                .then((doc) => {
                    console.log("snap while sending question to FB", doc);
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

    const [user, setUser] = useState(undefined);
    const [noOfQuestionToShow, setNoOfQuestionToShow] = useState(25)
    const [dateRefOfLastObject, setDateRefOfLastObject] = useState(null)
    // fetching questions and answers + checking user state
    useEffect(() => {
        db.collection("questions")
            .orderBy("date", "desc")
            .limit(noOfQuestionToShow)
            .get()
            .then((snapshot) => {
                // console.log("ques snap, ", snapshot.docs);
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


        firebase.auth().onAuthStateChanged((userState) => {
            if (userState) {
                setUser(userState);
            } else {
                setUser(undefined);
            }
        });

        return () => { };
    }, [stateForHomePageTwoNestedCompToSync, noOfQuestionToShow]);

    // setting question checking for more than 120 chars
    const [question, setquestion] = useState("");
    const [ErrorForMaxCharInput, setErrorForMaxCharInput] = useState(false);
    const handlesetErrorForMaxCharInput = (e) => {
        setquestion(e.target.value);
        // if (question?.length === 200) {
        //     console.log("elmgth is, ", question?.length);
        //     setErrorForMaxCharInput(true)
        // } else {
        //     setErrorForMaxCharInput(false)
        // }
    };

    // setup for  filter
    const [filterAnswerByType, setfilterAnswerByType] = useState("");
    const [orderAnswerBy, setOrderAnswerBy] = useState("");

    const clearFilter = () => {
        setOrderAnswerBy("");
        setfilterAnswerByType("");
    };

    const changeTypeFilter = (e) => {
        setfilterAnswerByType(e.target.value);
        if (e.target.value) {
            setquestionAnswerFromFB((obj) => [
                ...questionAnswerFromFB.filter((a) => a.data.tag === e.target.value),
                ...questionAnswerFromFB.filter((a) => a.data.tag !== e.target.value),
            ]);
        }
    };
    const changeOrderAnswer = (e) => {
        setOrderAnswerBy(e.target.value);

        if (e.target.value === "Date:Oldest") {
            console.log("ans, ", questionAnswerFromFB);
            questionAnswerFromFB.sort((a, b) => a.data.date - b.data.date);
        } else if (e.target.value === "Date:Latest") {
            questionAnswerFromFB.sort((a, b) => b.data.date - a.data.date);
        } else if (e.target.value === "Votes:Highest") {
            questionAnswerFromFB.sort((a, b) => b.data.vote - a.data.vote);
        } else if (e.target.value === "Votes:Lowest") {
            questionAnswerFromFB.sort((a, b) => a.data.vote - b.data.vote);
        }
    };

    // get more question after clicking on see more
    const seeMore = (e) => {
        console.log(noOfQuestionToShow);
        setNoOfQuestionToShow(noOfQuestionToShow + 25)
    }

    return (
        <div id="main__appbar">
            <div id="filter__search">
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterAnswerByType}
                            onChange={(e) => changeTypeFilter(e)}
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
                <span onClick={(e) => clearFilter(e)}>Clear Filters</span>
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
                                        <ListItemAvatar>
                                            <Avatar alt="Profile Picture" src={""} />
                                        </ListItemAvatar>
                                        {!query.data?.answered && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.length < 120
                                                        ? query.data?.question
                                                        : query.data?.question.slice(0, 112) + "...?"
                                                }
                                                secondary={"No answer available at the moment."}
                                            />
                                        )}
                                        {query.data?.answered && (
                                            <ListItemText
                                                primary={
                                                    query.data?.question.length < 120
                                                        ? query.data?.question
                                                        : query.data?.question.slice(0, 112) + "...?"
                                                }
                                                secondary={"Click to view replies."}
                                            />
                                        )}
                                    </ListItem>
                                </Link>
                            </React.Fragment>
                        ))}
                        {questionAnswerFromFB.length >= 25 && <p id='seemoreQuestions' onClick={e => seeMore(e)} >Load more</p>}

                    </List>

                    <br />
                    <br />
                </Paper>
            </div>
            <div>
                <AppBar
                    id="appbar__bottom__div"
                    position="fixed"
                    color="primary"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                        <Fab
                            color="secondary"
                            aria-label="add"
                            className={classes.fabButton}
                            onClick={(e) => handleClickOpen()}
                        >
                            <AddIcon />
                        </Fab>
                        <div className={classes.grow} />
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton edge="end" color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
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
                            label="Question?(20 to 200 words)*"
                            type="text"
                            fullWidth
                            value={question}
                            onChange={(e) => handlesetErrorForMaxCharInput(e)}
                            inputProps={{
                                maxLength: 200,
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
