import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePageComponent from "./Components/HomePageComponent";
import FreshiesMainComponents from "./Components/FreshiesMainComponents/FreshiesMainComponents";
import ClassifiedHomePageComponent from "./Components/Classified/ClassifiedHomePageComponent";
import Login from "./Components/Login And Logout/Login";
import SignUp from "./Components/Login And Logout/SignUp";

import "./App.css";
import HeaderComponent from "./Components/HeaderComponent";

function App() {
	document.title = "Abundance"
	return (
		<div className="App">
			<Router>
				<div style={{ width: "100%", marginRight: "auto" }}>


					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<HeaderComponent />
					<Switch>
						<Route exact path="/">
							<HomePageComponent />
						</Route>
						<Route exact path="/Freshies">
							<FreshiesMainComponents />
						</Route>
						<Route exact path="/Classified">
							<ClassifiedHomePageComponent />
						</Route>
						<Route exact path="/Login">
							<Login />
						</Route>
						<Route exact path="/SignUp">
							<SignUp />
						</Route>
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;
