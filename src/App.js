import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	HashRouter,
} from "react-router-dom";
import HomePageComponent from "./Components/HomePageComponent";
import ClassifiedHomePageComponent from "./Components/Classified/ClassifiedHomePageComponent";
import Login from "./Components/Login And Logout/Login";
import HeaderComponent from "./Components/HeaderComponent";
import ClassifiedProductView from "./Components/Classified/ClassifiedProductView";
import FooterComponent from "./Components/Footer/FooterComponent";
import AnswerComponent from "./Components/AskQuestion/AnswerComponent";
import firebase from "firebase";
import "./App.css";
import StalkComponent from "./Components/Stalk/StalkComponent";
import Documentation from "./Components/Miscellaneous/Documentation";
import TermsAndCondition from "./Components/Miscellaneous/TermsAndCondition";

function App() {

	const [state, setState] = useState({})
	useEffect(() => {
		firebase.analytics().logEvent("User is in App Componen");
		localStorage.setItem("version", 1)
		console.log("useeffect app.js loaded");
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

		firebase.auth().onAuthStateChanged(userObj => {
			console.log("useeffect app.js auth loaded");
			if (userObj) {
				setState({
					displayName: userObj.displayName,
					email: userObj.email,
					emailVerified: userObj.emailVerified,
					uid: userObj.uid,
					photoURL: userObj.photoURL
				})
				// user = {
				// 	displayName: userObj.displayName,
				// 	email: userObj.email,
				// 	emailVerified: userObj.emailVerified,
				// 	uid: userObj.uid,
				// 	photoURL: userObj.photoURL
				// }
				// console.log("user in app,js useeffect", user);
			} else {
				setState(undefined)
				console.log("no user in app,js useeffect userObj", userObj);
			}
		})

	}, []);



	return (
		<div id="OutsideApp">
			<Router>
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

				<HashRouter>
					<HeaderComponent userStatus={state} />
					<div className="App">
						<Route exact path="/Classified">
							<ClassifiedHomePageComponent userDetailsFirebase={state} />
							<FooterComponent />
						</Route>
						<Route exact path="/Login">
							<Login state={state} />
							<FooterComponent />
						</Route>
						{/* <Route exact path="/SignUp">
							<SignUp />
							<FooterComponent />
						</Route> */}
						<Route exact path="/Classified/Products/:id">
							<ClassifiedProductView state={state} />
						</Route>
						<Route exact path="/Answers/:id">
							<AnswerComponent state={state} />
							<FooterComponent />
						</Route>
						<Route exact path="/Stalk">
							<StalkComponent />
						</Route>
						<Route exact path="/Documentation">
							<Documentation />
							<FooterComponent />
						</Route>
						<Route exact path="/TermsAndCondition">
							<TermsAndCondition />
							<FooterComponent />
						</Route>
						<Route exact path="/">
							<HomePageComponent state={state} />
						</Route>
					</div>
				</HashRouter>
			</Router>
		</div>
	);
}

export default App;
