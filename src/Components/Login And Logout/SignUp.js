import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase"


import "./Login.css";

const SignUp = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("@gmail.com");
    const [password, setpassword] = useState("");
    const [userAlreadyExits, setuserAlreadyExits] = useState(false)
    const history = useHistory();

    const sendFromToFirbase = (e) => {
        e.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(email, password).then(userCredentails => {
            console.log("user credtenial returned after creating, ", userCredentails);
            setuserAlreadyExits(false)
            history.push("/Login")
        }).catch(error => {
            console.log("error while creating user in firebase, ", error);
            setuserAlreadyExits(true)
        })
    }


    return (
        <div className="main_div__grid">
            <div className="main123">
                <h1 className="header1" >Sign Up</h1>
                <hr />
                <h3 className="header3" >Welcome to SignUp page</h3>

                <input
                    className="inp"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    type="text"
                    placeholder="Name"
                    required
                />
                <input
                    className="inp"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    className="inp"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    required
                />
                {userAlreadyExits && <p style={{ color: "#bb2124" }}>Can't create duplicate/invalid user.</p>} <br />
                <button className="butt" onClick={sendFromToFirbase} type="submit">
                    Sign Up
                </button>

            </div >
        </div>
    );
};

export default SignUp;