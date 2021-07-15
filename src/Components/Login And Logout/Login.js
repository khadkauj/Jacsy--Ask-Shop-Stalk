import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { provider, microSoftAuthProvider } from "../../Firebase/Firebase"
import "./Login.css";
// import { Log_in } from "./features/user/userSlice";

const Login = () => {
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    const [wrongCredentialsInLogin, setwrongCredentialsInLogin] = useState(false)
    const history = useHistory();
    const loginToFirebase = (e) => {
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(email, password).then(userCredntials => {
            console.log("User found on firebase, ", userCredntials);
            setwrongCredentialsInLogin(false)
            history.push("/")
        }).catch(error => {
            console.log("user not found");
            setwrongCredentialsInLogin(true)
        })
    }

    // google sign-in authentication
    const signInWithGoogleAuth = (e) => {
        e.preventDefault()
        firebase.auth().signInWithRedirect(provider)
            .then(result => {
                console.log("credentials from google auth, ", result.credential)
                setwrongCredentialsInLogin(false)
                history.push("/")
            })
            .catch(error => {
                console.log("Error in google sign-in authentication", error)
                setwrongCredentialsInLogin(true)
            })
    }

    const signInWithMicrosoftAuth = (e) => {
        e.preventDefault()
        firebase.auth().signInWithRedirect(microSoftAuthProvider)
            .then(result => {
                console.log("credentials from Microsft auth, ", result.credential)
                setwrongCredentialsInLogin(false)
                history.push("/")
            })
            .catch(error => {
                console.log("Error in Microsft sign-in authentication", error)
                setwrongCredentialsInLogin(true)
            })
    }

    useEffect(() => {
        firebase.analytics().logEvent("User is in Login Componen")
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                history.goBack()
            } else {

            }
        })
        return () => {

        }
    }, [])

    return (
        <div className="main_div__grid" >

            <div className="main123">
                <h1 className="header1">Login</h1>
                <hr className="hr__tag" />
                <h3 className="header3">Welcome to Login page</h3>

                <input className="inp" value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="Email" />
                <input
                    className="inp"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                {wrongCredentialsInLogin && <p style={{ color: "#bb2124" }} >Wrong credentials!!!</p>}<br />
                <p className="para">
                    Not a member?{" "}
                    <Link to="/SignUp">
                        <span className="span1">
                            <u>Register</u>
                        </span>
                    </Link>
                </p>
                <button onClick={loginToFirebase} type="submit" className="butt" >
                    Log In
                </button>

                <div className="hrs">
                    <hr className="hr_line" /> <p>or</p> <hr className="hr_right" />
                </div>
                <button onClick={e => signInWithGoogleAuth(e)} className="coninueGoogle_butt">
                    <img src={process.env.PUBLIC_URL + '/google-logo.ico'} alt="logo" />
                    Continue With Google
                </button>
                <div className="smallBreakbetweenAuth" ></div>
                <button onClick={e => signInWithMicrosoftAuth(e)} className="coninueGoogle_butt">
                    <img src={process.env.PUBLIC_URL + '/m.png'} alt="logo" />
                    Continue With Outlook
                </button>
            </div>
        </div>
    );
};

export default Login;