import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
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

function App() {
	useEffect(() => {
		firebase.analytics().logEvent("User is in App Componen");
		return () => { };
	}, []);

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
