import React, { useState } from 'react'
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import "./StalkComponent.css";
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
    const [imgURL, setImgURL] = useState("")
    const [errorInFetchingDetails, setErrorInFetchingDetails] = useState("")
    const submitUserName = async (e) => {
        e.preventDefault()
        await axios.get(`https://jacobsapigetallpeopledetails.herokuapp.com/api/${userName}`)
            .then(response => response.data)
            .then(data => {
                setErrorInFetchingDetails("")
                console.log(Object.entries(data))
                setJacobsUserProfile(Object.entries(data))
            })
            .catch(error => {
                console.log("error in data , ", error);
                setErrorInFetchingDetails(error)
            })


        // await axios.get(`https://jacobsapigetallpeopledetails.herokuapp.com/api/${userName}/image`, {
        //     responseType: 'arraybuffer',
        //     headers: {
        //         'Access-Control-Allow-Origin': "*"
        //     }
        // })
        //     .then(response => response)
        //     .then(data => {
        //         console.log(data)
        //         // const ac = URL.createObjectURL(data.data)
        //         // setImgURL(ac)
        //     })
        //     .catch(error => {
        //         console.log("error in data , ", error);
        //         setErrorInFetchingDetails(error)
        //     })
    }

    return (
        <div className="stalkMain">
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" label="username" value={userName} onChange={e => setUserName(e.target.value)} />
                <Button variant="contained" color="secondary" onClick={e => submitUserName(e)} type="Submit" >
                    Submit
                </Button>
            </form>
            <code>Try putting your userid here. For example, if your email address is u.khadka@jacobs-university.de than than your username is ukhadka.
                Likewise, ssah for s.sah@jacobs-university.de and ronepal for ronepal for ro.nepal@jacobs-university.de.</code>
            <br /> <br />
            {errorInFetchingDetails && <p className="invalid-user" >Invalid User Id</p>}
            {!errorInFetchingDetails && <div style={{ display: "grid", placeItems: "center" }}>
                {jacobsUserProfile?.map(object =>
                    <div style={{ display: "flex" }} >
                        <p> {object[0] + "  :   "} </p> <p> {"  " + object[1]} </p>
                    </div>
                )}
            </div>}

            {/* <img scr={imgURL} alt="" /> */}
        </div>
    )
}

export default StalkComponent
