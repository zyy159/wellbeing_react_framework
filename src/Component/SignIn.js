import React, {useCallback, useEffect,useRef } from "react";
import history from "../Tool/history";
import logo from '../Picture/HSBC-LOGO.png';
import background_pic from '../Picture/Signup Background.png';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import AppHeader from '../Tool/App_Header';
import Captcha from 'react-captcha-code';
import {Navigate} from "react-router";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import VerifiedIcon from '@mui/icons-material/Verified';

import cookie from 'react-cookies';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://127.0.0.1:8000';

function SignIn() {
  const  [values, setValues] = React.useState({
    username: '',
    password: '',
    verification_code: '',
  });
  const [captcha, setCaptcha] = React.useState("")
  const [checked, setChecked] = React.useState(true);
  const [topage, setTopage] = React.useState("");

  const handleChange = (prop) => (event) =>{
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClick = useCallback((code) => {
    setCaptcha(code)
  }, []);
  const captchaRef = useRef(null);
  const handleRefresh = () => {
    captchaRef.current.refresh();
  };
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };
  const SignIn_Button = () => {
    if(values.password==="" || values.username==="" || values.verification_code===""){
      alert("Please input the required textfield.")
      handleRefresh();
    } else if(captcha !== values.verification_code){
      handleRefresh();
      alert("Please input the correct Verification Code")
    }
    let data = new FormData();
    data.append("Username",values.username);
    data.append("Password",values.password);
    cookie.save("user_id",values.username);
    history.push({pathname:"/Home",state:{}});
    setTopage("Home");
    // axios.post(server+"/SignIn/",data,{headers:{"Content-Type":'multipart/form-data'}}).then(function (response) {
    //   console.log("response: ",response);
    //     if(response.status===200){
    //       cookie.save("user_id",values.username);
    //       history.push({pathname:"/Home",state:{}});
    //       setTopage("Home");
    //     }else{
    //       console.log("Fail");
    //     }
    // })
  }
  useEffect(()=>{
    if(cookie.load('user_id')){
      history.push({pathname:"/Home",state:{}});
      setTopage("Home")
    }
  })
  if(topage===""){
    return (
      <div className="Signup">
        <AppHeader />
        <div className="Main">
          <Grid container direction="column" justifyContent="center" alignItems="center" xs="auto" sx={{ mb: 2 }}>
            <img src={background_pic} className="background_pic" alt="" width="100%"/>
            <Grid container item justifyContent="center" alignItems="center" xs="auto" sx={{ mt: 2 }}>
              <img src={logo} className="App_Logo" alt="logo" />
              <Typography variant="h4" color="#EE270C" sx={{ m:3, fontWeight: 'bold', lineHeight: 1.5 }}>
                Wellbeing Gallery
              </Typography>
              <Grid container item justifyContent="center" alignItems="center" direction="column">
                <TextField label="Username" className="Text_Username"
                   sx = {{ width:"73ch", m:3 }}  variant={"outlined"} color="error" required
                   onChange={handleChange('username')}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start" >
                         <AccountCircle />
                       </InputAdornment>
                     ),
                   }}
                />
                <TextField label="Password" className="Text_Password"
                   sx = {{ width:"73ch", m:2 }}  variant={"outlined"} color="error" type="password" required
                   onChange={handleChange('password')}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start" >
                         <PasswordIcon />
                       </InputAdornment>
                     ),
                   }}
                />
                <Grid container item justifyContent="center" alignItems="center" direction="row">
                  <TextField label="Verfication Code" className="Text_Verfication_code"
                    sx = {{ width:"61ch", m:2 }}  variant={"outlined"} color="error" required
                    onChange={handleChange('verification_code')}
                    InputProps={{
                     startAdornment: (
                       <InputAdornment position="start" >
                         <VerifiedIcon />
                       </InputAdornment>
                     ),
                    }}
                  />
                  <Captcha charNum={4} onChange={handleClick} ref={captchaRef}/>
                </Grid>
              </Grid>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
              <Button className="Button_Signup"
                variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch"}}
                onClick={SignIn_Button}
              >
                Sign In
              </Button>
              <FormControlLabel control={
                <Checkbox color={'error'} onChange={handleCheck} checked={checked}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                } label="Keep me signed in for the next 7 days."
              />
              <Link component="button" underline="always"
                onClick={() => {
                  history.push({pathname:"/SignUp",state:{}});
                  setTopage("SignUp")
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }else if(topage==="SignUp"){
    return <Navigate to="/SignUp" replace={true} />
  }else if(topage==="Home"){
    return <Navigate to="/Home" replace={true} />
  }
}

export default SignIn;