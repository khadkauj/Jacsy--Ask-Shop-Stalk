import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import firebase from 'firebase';
import ButtonWithLogoutFunctionComponent from "./Login And Logout/ButtonWithLogoutFunctionComponent"
import Button from '@material-ui/core/Button';

import "./HeaderComponent.css"

const HeaderComponent = () => {

    const [userStatus, setuserStatus] = useState(undefined)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user = { email: user.email }
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
                        <Link to="/" className="linkText " style={{ color: "#06201b" }} >Question</Link>
                    </li>
                    <li>
                        <Link to="/Classified" className="linkText" style={{ color: "#06201b" }}>Shop</Link>
                    </li>
                    <li>
                        <Link to="/Stalk" className="linkText" style={{ color: "#06201b" }}>Stalk</Link>
                    </li>
                </ul>
            </nav>
            <div className="header__Icons" id="singIn__button__homepage"  >
                {/* {!userStatus && <IconButton aria-label="Sign" onClick={signToFirebase}  >
                    <PersonAddIcon fontSize="large" />
                </IconButton>} */}
                {/* {!userStatus &&

                    <Button
                        onClick={e => signToFirebase(e)}
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                    >
                        LogIn
                    </Button>
                }
              
                {userStatus && <ButtonWithLogoutFunctionComponent />} */}

                <ButtonWithLogoutFunctionComponent user={userStatus} />
            </div>

        </div>
    )
}

export default HeaderComponent
