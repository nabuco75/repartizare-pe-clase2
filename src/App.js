import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Landing from "./Landing";
import RegistrationPage from "./Auth/RegistrationPage";
import LoginPage from "./Auth/LoginPage";
import Navbar from "./Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Navbar />
        </header>
        <main>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="/register">
              <RegistrationPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
