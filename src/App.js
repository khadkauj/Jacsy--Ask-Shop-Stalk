import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, HashRouter } from "react-router-dom";
import HomePageComponent from "./Components/HomePageComponent";
import FreshiesMainComponents from "./Components/FreshiesMainComponents/FreshiesMainComponents";
import ClassifiedHomePageComponent from "./Components/Classified/ClassifiedHomePageComponent";
import Login from "./Components/Login And Logout/Login";
import SignUp from "./Components/Login And Logout/SignUp";
import ListNews from './Components/ListNews'
import HeaderComponent from "./Components/HeaderComponent";
import ClassifiedProductView from "./Components/Classified/ClassifiedProductView";
import FooterComponent from "./Components/Footer/FooterComponent";
import AnswerComponent from "./Components/AskQuestion/AnswerComponent";
// import firebase from "firebas?e"
import { analytics } from "./Firebase/Firebase"
import "./App.css";

function App() {
	document.title = "Jwerk Abundance"
	useEffect(() => {
		analytics().logEvent("User is in App Componen")
		return () => {
		}
	}, [])

	return (
		<div className="App">
			<Router>
				<div style={{ width: "100%", marginRight: "auto" }}>


					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

					<HashRouter>

						<Route exact path="/Freshies">
							<FreshiesMainComponents />
							<FooterComponent />
						</Route>
						<Route exact path="/Classified">
							<HeaderComponent />
							<ClassifiedHomePageComponent />
							<FooterComponent />
						</Route>
						<Route exact path="/Login">
							<HeaderComponent />
							<Login />
							<FooterComponent />
						</Route>
						<Route exact path="/SignUp">
							<HeaderComponent />
							<SignUp />
							<FooterComponent />
						</Route>
						<Route exact path="/Classified/Products/:id">
							<HeaderComponent />
							<ClassifiedProductView />
						</Route>
						<Route exact path="/Answers/:id">
							<HeaderComponent />
							<AnswerComponent />
							<FooterComponent />
						</Route>
						<Route exact path="/">
							<HeaderComponent />
							<HomePageComponent />
							<FooterComponent />
						</Route>
					</HashRouter>
				</div>
			</Router>
		</div>
	);
}

export default App;
