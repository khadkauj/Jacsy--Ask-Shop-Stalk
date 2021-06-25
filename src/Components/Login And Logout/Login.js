import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase";

import "./Login.css";
// import { Log_in } from "./features/user/userSlice";

const Login = () => {
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    const [wrongCredentialsInLogin, setwrongCredentialsInLogin] = useState(false)
    //   const dispatch = useDispatch();
    const history = useHistory();
    const loginToFirebase = (e) => {
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(email, password).then(userCredntials => {
            console.log("User found on firebase, ", userCredntials);
            setwrongCredentialsInLogin(false)
            history.push("/Classified")
            // console.log("history detials, ", history.goBack());

        }).catch(error => {
            console.log("user not found");
            setwrongCredentialsInLogin(true)
        })
    }

    return (
        <div className="main123">
            <h1 className="header1">Login</h1>
            <hr />
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
                Not a member?
                <Link to="/SignUp">
                    <span className="span1">
                        <u>Register</u>
                    </span>
                </Link>
            </p>
            <button onClick={loginToFirebase} type="submit" className="butt" >
                Log In
            </button>

        </div>
    );
};

export default Login;