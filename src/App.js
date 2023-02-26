import './App.css';
import React from "react";
import history from "./Component/history";
import asyncComponent from "./Component/AsyncComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const SignUp = asyncComponent(() => import("./Page/SignUp"));
const SignIn = asyncComponent(() => import("./Page/SignIn"));

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
