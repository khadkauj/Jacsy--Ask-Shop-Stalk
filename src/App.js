import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	HashRouter,
} from "react-router-dom";
import HomePageComponent from "./Components/HomePageComponent";
import FreshiesMainComponents from "./Components/FreshiesMainComponents/FreshiesMainComponents";
import ClassifiedHomePageComponent from "./Components/Classified/ClassifiedHomePageComponent";
import Login from "./Components/Login And Logout/Login";
import SignUp from "./Components/Login And Logout/SignUp";
import ListNews from "./Components/ListNews";
import HeaderComponent from "./Components/HeaderComponent";
import ClassifiedProductView from "./Components/Classified/ClassifiedProductView";
import FooterComponent from "./Components/Footer/FooterComponent";
import AnswerComponent from "./Components/AskQuestion/AnswerComponent";
import firebase from "firebase";
import "./App.css";
import StalkComponent from "./Components/Stalk/StalkComponent";
import { useDispatch } from "react-redux";
import { setUsername } from "./features/counter/counterSlice";

function App() {
	useEffect(() => {
		firebase.analytics().logEvent("User is in App Componen");

		console.log("app.js loaded");
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

	}, []);

	const dispatch = useDispatch()
	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log("user", user);
				dispatch(setUsername({
					username: user.displayName,
					photourl: user.photoURL,
					email: user.email,
					uid: user.uid
				}))
			} else {
				console.log("no user", user);
			}
		})
	}, [])



	return (
		<div id="OutsideApp">
			<Router>
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

				<HashRouter>
					<HeaderComponent />
					<div className="App">
						<Route exact path="/Freshies">
							<FreshiesMainComponents />
							<FooterComponent />
						</Route>
						<Route exact path="/Classified">
							<ClassifiedHomePageComponent />
							<FooterComponent />
						</Route>
						<Route exact path="/Login">
							<Login />
							<FooterComponent />
						</Route>
						<Route exact path="/SignUp">
							<SignUp />
							<FooterComponent />
						</Route>
						<Route exact path="/Classified/Products/:id">
							<ClassifiedProductView />
						</Route>
						<Route exact path="/Answers/:id">
							<AnswerComponent />
							<FooterComponent />
						</Route>
						<Route exact path="/Stalk">
							<StalkComponent />
						</Route>
						<Route exact path="/">
							<HomePageComponent />
						</Route>
					</div>
				</HashRouter>
			</Router>
		</div>
	);
}

export default App;
