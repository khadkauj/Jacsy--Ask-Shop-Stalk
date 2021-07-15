import { IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import firebase from 'firebase';
import ButtonWithLogoutFunctionComponent from "./Login And Logout/ButtonWithLogoutFunctionComponent"
import Button from '@material-ui/core/Button';

import "./HeaderComponent.css"

const HeaderComponent = () => {

    const history = useHistory()
    const signToFirebase = () => {
        history.push("/LogIn")
    }


    const [userStatus, setuserStatus] = useState(undefined)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setuserStatus(user)
            } else {
                setuserStatus(undefined)
            }
        })
        return () => {

        }
    }, [])
    return (
        <div className="router__div stickyProp" id="gulla">
            <nav className="nav__bar" >
                {/* Home Exams* Homeworks* Notes* Classified* Contact */}
                <ul className="ul__list">
                    <li>
                        <Link to="/" className="linkText " style={{ color: "#06201b" }} >Home</Link>
                    </li>
                    {/* <li>
                        <Link to="/Freshies" className="linkText" style={{ color: "#06201b" }}>Freshies</Link>
                    </li>
                    <li>
                        <Link to="/Homeworks" className="linkText" style={{ color: "#06201b" }}>Assignments</Link>
                    </li> */}
                    {/* <li>
            <Link to="/Notes" style={{ color: "white"}}>Notes</Link>
        </li> */}
                    <li>
                        <Link to="/Classified" className="linkText" style={{ color: "#06201b" }}>Store</Link>
                    </li>
                    <li>
                        <Link to="/Classified" className="linkText" style={{ color: "#06201b" }}>Stalk</Link>
                    </li>
                </ul>
            </nav>
            <div className="header__Icons" id="singIn__button__homepage"  >
                {/* {!userStatus && <IconButton aria-label="Sign" onClick={signToFirebase}  >
                    <PersonAddIcon fontSize="large" />
                </IconButton>} */}
                {!userStatus &&

                    <Button
                        onClick={e => signToFirebase(e)}
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                    >
                        Log in
                    </Button>
                }
                {/* {userStatus && <IconButton aria-label="add to favorites" onClick={signOutOfFirebase} >
                    <ExitToAppIcon fontSize="large" />
                </IconButton>} */}
                {userStatus && <ButtonWithLogoutFunctionComponent />}
            </div>

        </div>
    )
}

export default HeaderComponent
