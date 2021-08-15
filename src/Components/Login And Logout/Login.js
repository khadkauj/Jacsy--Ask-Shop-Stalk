import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { provider, microSoftAuthProvider } from "../../Firebase/Firebase"
import "./Login.css";
import { Button } from "@material-ui/core";
// import { Log_in } from "./features/user/userSlice";

const Login = () => {
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    const [wrongCredentialsInLogin, setwrongCredentialsInLogin] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)
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

    const sendEmailVerificationLink = () => {

        var actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'http://localhost:3000/Login',
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

        if (email.slice(email.length - 20, email.length)) {
            setButtonDisable(true)
            setwrongCredentialsInLogin(false)
            firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    console.log("email sent");
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem('emailForSignIn', email);
                    // ...
                })
                .catch((error) => {
                    setButtonDisable(false)
                    setwrongCredentialsInLogin(true)
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

    const emailVerification = async () => {
        // Confirm the link is a sign-in with email link.
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            console.log("runnin");
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            var email = localStorage.getItem('emailForSignIn');
            console.log(email);
            // if (!email) {
            // 	// User opened the link on a different device. To prevent session fixation
            // 	// attacks, ask the user to provide the associated email again. For example:
            // 	email = window.prompt('Please provide your email for confirmation');
            // }
            // The client SDK will parse the code from the link for you.
            await firebase.auth().signInWithEmailLink(email, window.location.href)
                .then((result) => {
                    console.log("runnin2");
                    // Clear email from storage.
                    localStorage.removeItem('emailForSignIn');
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                })
                .catch((error) => {
                    console.log("error in email send link verificatio", error);
                    window.prompt("The link has expired, please try again later.")
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                });
        }
    }

    emailVerification()

    return (
        <div className="main_div__grid" >

            <div className="main123">
                {/* <h1 className="header1">Login</h1>
                <hr className="hr__tag" /> */}
                <h3 className="header3">Welcome to Login page</h3>

                <input className="inp" value={email} autoFocus
                    onChange={(e) => setemail(e.target.value)} type="email"
                    placeholder="SignIn With College Email Address" />
                {/* <input
                    className="inp"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                /> */}
                {wrongCredentialsInLogin && <p style={{ color: "#bb2124" }} >Wrong credentials!!!</p>}<br />
                <p className="para">
                    Not a member?{" "}
                    <Link to="/SignUp">
                        <span className="span1">
                            <u>Register</u>
                        </span>
                    </Link>
                </p>
                <Button variant="contained" disabled={email.slice(email.length - 20, email.length) !== "jacobs-university.de" || buttonDisable}
                    onClick={e => sendEmailVerificationLink(e)}>
                    Log In
                </Button>
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