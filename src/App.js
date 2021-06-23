import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePageComponent from "./Components/HomePageComponent";
import FreshiesMainComponents from "./Components/FreshiesMainComponents/FreshiesMainComponents";
import ClassifiedHomePageComponent from "./Components/Classified/ClassifiedHomePageComponent";
import Login from "./Components/Login And Logout/Login";
import SignUp from "./Components/Login And Logout/SignUp";

import "./App.css";

function App() {
	document.title = "Abundance"
	return (
		<div className="App">
			<Router>
				<div style={{ width: "100%", marginRight: "auto" }}>
					<div  className="router__div">
					<nav >
						{/* Home Exams* Homeworks* Notes* Classified* Contact */}
						<ul className="ul__list">
							<li>
								<Link to="/"  style={{ color: "white"}} >Home</Link>
							</li>
							<li>
								<Link to="/Freshies"  style={{ color: "white"}}>Freshies</Link>
							</li>
							<li>
								<Link to="/Exams"  style={{ color: "white"}}>Exams</Link>
							</li>
							<li>
								<Link to="/Homeworks" style={{ color: "white"}}>Assignments</Link>
							</li>
							{/* <li>
								<Link to="/Notes" style={{ color: "white"}}>Notes</Link>
							</li> */}
							<li>
								<Link to="/Classified" style={{ color: "white"}}>Classified</Link>
							</li>
						</ul>
						</nav>
						</div>

					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
