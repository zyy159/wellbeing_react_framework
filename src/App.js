import './App.css';
import React from "react";
import history from "./Tool/history";
import asyncComponent from "./Tool/AsyncComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const SignUp = asyncComponent(() => import("./Component/SignUp"));
const SignIn = asyncComponent(() => import("./Component/SignIn"));
const Home = asyncComponent(() => import("./Component/Home"));
const Yoga = asyncComponent(() => import("./Component/QuickStart_Yoga"));
const ExerciseOption = asyncComponent(() => import("./Component/ExerciseOption"));

class App extends React.Component{
  render() {
    return(
      <Router history={history}>
        <Routes>
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Yoga" element={<Yoga/>} />
          <Route path="/ExerciseOption" element={<ExerciseOption/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
