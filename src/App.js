import './App.css';
import React from "react";
import history from "./Tool/history";
import asyncComponent from "./Tool/AsyncComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const SignUp = asyncComponent(() => import("./Component/SignUp"));
const SignIn = asyncComponent(() => import("./Component/SignIn"));

class App extends React.Component{
  render() {
    return(
      <Router history={history}>
        <Routes>
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/SignIn" element={<SignIn/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
