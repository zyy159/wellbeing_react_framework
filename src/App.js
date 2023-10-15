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
const Working_Yoga = asyncComponent(() => import("./Component/Working_Yoga"));
const MakeSchedule = asyncComponent(() => import("./Component/MakeSchedule"));
const ResetPassword = asyncComponent(() => import("./Component/ResetPassword"));
const PromotionSignUp = asyncComponent(() => import("./Component/PromotionSignUp"));
const PrivacyPolicy = asyncComponent(() => import("./Component/PrivacyPolicy"));



class App extends React.Component{
  render() {
        return(
            <Router history={history}>
                <Routes>
                    <Route path="/SignUp" element={<SignUp/>} />
                    <Route path="/Promotionsignup" element={<PromotionSignUp/>} />
                    <Route path="/Privacypolicy" element={<PrivacyPolicy />} />
                    <Route path="/SignIn" element={<SignIn/>} />
                    <Route path="/Yoga" element={<Yoga/>} />
                    <Route path="/ExerciseOption" element={<ExerciseOption/>} />
                    <Route path="/MakeSchedule" element={<MakeSchedule/>} />
                    <Route path="/ResetPassword" element={<ResetPassword/>} />
                    <Route path="/Working_Yoga" element={<Working_Yoga/>} />
                    <Route path="/" element={<Home/>} />
                </Routes>
            </Router>
        );
  }
}

export default App;
