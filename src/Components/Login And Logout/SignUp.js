import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase"


import "./Login.css";

const SignUp = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    const history = useHistory();

    const sendFromToFirbase = (e) => {
        e.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(email, password).then(userCredentails => {
            console.log("user credtenial returned after creating, " , userCredentails);
        }).catch(error => {
            console.log("error while creating user in firebase, ", error);
        })
    }


    return (
        <div className="main">
            <h1>Sign Up</h1>
            <hr />
            <h3>Welcome to SignUp page</h3>

                <input
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    type="text"
                    placeholder="Name"
                    required
                />
                <input
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    required
                />
                <button onClick={sendFromToFirbase} type="submit">
                    Sign Up
                </button>
 
        </div>
    );
};

export default SignUp;