import React, { useState } from 'react'
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));
const StalkComponent = () => {
    const classes = useStyles();

    const [userName, setUserName] = useState("ukhadka")
    const [jacobsUserProfile, setJacobsUserProfile] = useState([])
    const submitUserName = (e) => {
        axios.get(`https://jacobsapigetallpeopledetails.herokuapp.com/api/${userName}`)
            .then(response => response.data)
            .then(data => {
                console.log(Object.entries(data))
                setJacobsUserProfile(Object.entries(data))
            })
            .catch(error => console.log("error in data , ", error))
    }

    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" label="username" value={userName} onChange={e => setUserName(e.target.value)} />
                <Button variant="contained" color="secondary" onClick={e => submitUserName(e)} type="Submit" >
                    Submit
                </Button>
            </form>
            <div style={{ display: "grid", placeItems: "center" }}>
                {jacobsUserProfile?.map(object =>
                    <div style={{ display: "flex" }} >
                        <p> {object[0] + "  :   "} </p> <p> {"  " + object[1]} </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StalkComponent