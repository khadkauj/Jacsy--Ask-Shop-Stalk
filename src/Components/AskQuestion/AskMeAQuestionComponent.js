import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { db } from "../../Firebase/Firebase"
import { v4 as uuidv4 } from 'uuid';
import firebase from "firebase"
import SnackBarComponent from "../SnackBar/SnackBarComponent"
import "./AskMeAQuestionComponent.css"
const messages = [
    {
        id: 1,
        primary: 'Brunch this week?',
        secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
        person: '/static/images/avatar/5.jpg',
    }]


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
}));
const AskMeAQuestionComponent = () => {
    const classes = useStyles();

    const [question, setquestion] = useState(undefined)
    // extra state to not allow double clicking of submit
    const [noDoubleSUbmitCLick, setnoDoubleSUbmitCLick] = useState(false)
    const [questionAnswerFromFB, setquestionAnswerFromFB] = useState([{
        id: 1,
        data: {
            question: 'What are the three Guṇas(elements)?',
            answer: "The three gunas are called: sattva (goodness, calmness, harmonious), rajas (passion, activity, movement), and tamas (ignorance, inertia, laziness). "
        }
    }])
    const [stateAfterQuestionSubmit, setstateAfterQuestionSubmit] = useState(false)

    // all setup for Form Dialog Box
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setquestion(undefined)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setquestion(undefined)
    };

    // send question to firebase
    const [useSnackBarState, setUseSnackBarState] = useState(false)
    const sendQuestionToFirebase = () => {
        if (user) {
            setnoDoubleSUbmitCLick(!noDoubleSUbmitCLick)
            setstateAfterQuestionSubmit(true)
            setquestion(undefined)
            db.collection("questions").add({
                question: question,
                date: new Date(),
                answered: false,
                id: uuidv4(),
            }).then(doc => {
                console.log("snap while sending question to FB", doc)
                setOpen(false)
            })
                .catch(error => {
                    console.log("Error while sending question to FB", error)
                    setOpen(false)
                })
        } else {
            setUseSnackBarState(!useSnackBarState)
            setTimeout(() => {
                setUseSnackBarState(false)
            }, 1000);
        }

    }

    const [user, setUser] = useState(undefined)
    // fetching questions and answers
    useEffect(() => {
        db.collection("questions").orderBy("date", "desc").get().then(snapshot => {
            // console.log("ques snap, ", snapshot.docs);
            setquestionAnswerFromFB(snapshot.docs.map(doc => ({
                id: doc.id,
                key: doc.id,
                data: doc.data()
            })))
        }).catch(error => console.log("error in fetching data from FB, ", error))

        firebase.auth().onAuthStateChanged(userState => {
            if (userState) {
                setUser(userState)
            } else {
                setUser(undefined)
            }
        })

        return () => {
        }
    }, [stateAfterQuestionSubmit])
    console.log("useeffect:", questionAnswerFromFB);
    return (
        <div id="main__appbar">
            <div className="appBAr">
                <Paper square className={classes.paper}>
                    <Typography className={classes.text} variant="h6" >
                        Ask a Question.
                    </Typography>
                    <List className={classes.list}>
                        {questionAnswerFromFB.map(query => (
                            <React.Fragment key={query.id} >
                                <ListItem button>
                                    <ListItemAvatar>
                                        <Avatar alt="Profile Picture" src={""} />
                                    </ListItemAvatar>
                                    {!query.data?.answered && < ListItemText primary={query.data?.question} secondary={"No answer available at the moment."} />}
                                    {query.data?.answered && < ListItemText primary={query.data?.question} secondary={"Click to view replies."} />}
                                    {/* {query.data?.answered && query.data?.answered[0] <= 80 && <ListItemText primary={query.data?.question} secondary={query.data?.answered[0]} />} */}
                                    {/* {query.data?.answer?. > 80 && <ListItemText primary={query.data?.question} secondary={query.data?.answer?.slice(0, 80)} /> + "..."} */}
                                </ListItem>
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </div>

            <div className="appbar__add" id="fab__id" >
                <Fab color="secondary" aria-label="add" className="fab__icon">
                    <AddIcon onClick={handleClickOpen} >A</AddIcon>
                </Fab>
            </div>

            {/* Form  Popup for a Question */}
            <div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
                            label="Question?"
                            type="text"
                            fullWidth
                            value={question}
                            onChange={e => setquestion(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        {<Button onClick={sendQuestionToFirebase} color="primary" disabled={!question}  >
                            Submit
                        </Button>}
                    </DialogActions>
                </Dialog>
            </div>
            {/* Signed in as Component */}
            {/* {user?.email && <div className="signedAs">
                signed in as {user.email}
            </div>} */}
            <SnackBarComponent open={useSnackBarState} />
        </div>
    )
}

export default AskMeAQuestionComponent
