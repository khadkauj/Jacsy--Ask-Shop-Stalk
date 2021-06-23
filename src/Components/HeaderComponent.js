import { IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import firebase from 'firebase';
import "./HeaderComponent.css"

const HeaderComponent = () => {

    const history = useHistory()
    const signToFirebase = () => {
        history.push("/LogIn")
    }

    const signOutOfFirebase = (e) => {
        e.preventDefault()
        console.log("hahah");
        firebase.auth().signOut().then(user => {
            console.log("user signed out");
            setuserStatus(false)
        }).catch(error => {
            console.log("user signed out");
        })
    }

    const [userStatus, setuserStatus] = useState(false)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setuserStatus(true)
            } else {

            }
        })
        return () => {

        }
    }, [])
    return (
        <div className="router__div">
            <nav >
                {/* Home Exams* Homeworks* Notes* Classified* Contact */}
                <ul className="ul__list">
                    <li>
                        <Link to="/" style={{ color: "black" }} >Home</Link>
                    </li>
                    <li>
                        <Link to="/Freshies" style={{ color: "black" }}>Freshies</Link>
                    </li>
                    <li>
                        <Link to="/Homeworks" style={{ color: "black" }}>Assignments</Link>
                    </li>
                    {/* <li>
            <Link to="/Notes" style={{ color: "white"}}>Notes</Link>
        </li> */}
                    <li>
                        <Link to="/Classified" style={{ color: "black" }}>Classified</Link>
                    </li>
                </ul>
            </nav>
            <div className="header__Icons"  >
                {!userStatus && <IconButton aria-label="Sign" onClick={signToFirebase}  >
                    <PersonAddIcon />
                </IconButton>}
                {userStatus && <IconButton aria-label="add to favorites" size="medium" onClick={signOutOfFirebase} >
                    <ExitToAppIcon />
                </IconButton>}
            </div>
        </div>
    )
}

export default HeaderComponent
