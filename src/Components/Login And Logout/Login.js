import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { provider, microSoftAuthProvider } from "../../Firebase/Firebase"
import "./Login.css";
import { Button } from "@material-ui/core";
// import { Log_in } from "./features/user/userSlice";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [wrongCredentialsInLogin, setwrongCredentialsInLogin] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)
    const [linkVerificationEmail, setLinkVerificationEmail] = useState(false)
    const history = useHistory();
    // const loginToFirebase = (e) => {
    //     e.preventDefault()
    //     firebase.auth().signInWithEmailAndPassword(email, password).then(userCredntials => {
    //         console.log("User found on firebase, ", userCredntials);
    //         setwrongCredentialsInLogin(false)
    //         history.push("/")
    //     }).catch(error => {
    //         console.log("user not found");
    //         setwrongCredentialsInLogin(true)
    //     })
    // }

    // google sign-in authentication
    const signInWithGoogleAuth = (e) => {
        e.preventDefault()
        firebase.auth().signInWithRedirect(provider)
            .then(result => {
                console.log("credentials from google auth, ", result.credential)
                setwrongCredentialsInLogin(false)
            })
            .catch(error => {
                console.log("Error in google sign-in authentication", error)
                setwrongCredentialsInLogin(true)
            })
    }
    // microsoft
    const signInWithMicrosoftAuth = (e) => {
        e.preventDefault()
        firebase.auth().signInWithRedirect(microSoftAuthProvider)
            .then(result => {
                console.log("credentials from Microsft auth, ", result.credential)
                setwrongCredentialsInLogin(false)
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
                history.go(-2)
            } else {
                console.log("No user logged in.");
            }
        })
        return () => {

        }
    }, [])

    const sendEmailVerificationLink = () => {

        var actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'http://localhost:3000/',
            // This must be true.
            handleCodeInApp: true,
            // iOS: {
            //     bundleId: 'com.example.ios'
            // },
            // android: {
            //     packageName: 'com.example.android',
            //     installApp: true,
            //     minimumVersion: '12'
            // },
            // dynamicLinkDomain: 'http://localhost:3000/'
        };

        if (email.slice(email.length - 20, email.length) !== "@jacobs-university.com") {
            setButtonDisable(true)
            setwrongCredentialsInLogin(false)
            firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    console.log("email sent");
                    setLinkVerificationEmail(!linkVerificationEmail)
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem('emailForSignIn', email);
                    // ...
                })
                .catch((error) => {
                    setButtonDisable(false)
                    setwrongCredentialsInLogin(true)
                    setLinkVerificationEmail(false)
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    console.log("error email link send", error);
                });
        } else {
            setwrongCredentialsInLogin(true)
        }


    }

    // document.getElementById("idOfButton").onClick = function () {
    //     //disable
    //     this.disabled = true;
    //     //do some validation stuff
    // }
    // document.getElementById("idOfButton").disabled = true



    return (
        <div className="main_div__grid" >

            <div className="main123">
                {/* <h1 className="header1">Login</h1>
                <hr className="hr__tag" /> */}
                {!linkVerificationEmail && <>  <h3 className="header3">Welcome to Login page</h3>

                    <input className="inp" value={email} autoFocus
                        onChange={(e) => setemail(e.target.value)} type="email"
                        placeholder="u.khadka@jacobs-university.com" />
                    {/* <input
                    className="inp"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                /> */}
                    {wrongCredentialsInLogin && <p style={{ color: "#bb2124" }} >Wrong credentials!!!</p>}
                    <p className="para">
                        Password-less SignIn With College Email Address{" "}
                        {/* <Link to="/SignUp">
                        <span className="span1">
                            <u>Register</u>
                        </span>
                    </Link> */}
                    </p>
                    <Button style={{ marginTop: "32px" }} variant="contained" disabled={email.slice(email.length - 20, email.length) !== "jacobs-university.de" || buttonDisable}
                        onClick={e => sendEmailVerificationLink(e)}>
                        Login/Get-Link
                    </Button> </>}
                {linkVerificationEmail &&
                    <p className="confirmation-link" >An email with confirmation link has been sent to {email}.Please click on the link to safely login.</p>}
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
        </div >
    );
};

export default Login;