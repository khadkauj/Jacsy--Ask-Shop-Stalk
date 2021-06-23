import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import firebase from "firebase";

import "./Login.css";
// import { Log_in } from "./features/user/userSlice";

const Login = () => {
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    //   const dispatch = useDispatch();
      const history = useHistory();
    const loginToFirebase = (e) => {
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(email, password).then(userCredntials => {
            console.log("User found on firebase, ", userCredntials);
            console.log("history detials, ", history.goBack());
            
        }).catch(error => {
            console.log("user not found");
        })
    }

    return (
        <div className="main">
            <h1>Login</h1>
            <hr />
            <h3>Welcome to Login page</h3>
           
                <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="Email" />
                <input
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                <p>
                    Not a member?
                    <Link to="/SignUp">
                        <span className="span">
                            <u>Register</u>
                        </span>
                    </Link>
                </p>
                <button onClick={loginToFirebase} type="submit">
                    Log In
                </button>
            
        </div>
    );
};

export default Login;