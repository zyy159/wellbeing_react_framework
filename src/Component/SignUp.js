import logo from '../Picture/HSBC-LOGO.png';
import background_pic from '../Picture/Signup Background.png';
import history from "../Tool/history";
import React, {useCallback} from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import AppHeader from '../Tool/App_Header';
import Captcha from 'react-captcha-code';
import {Navigate} from 'react-router-dom';

import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';

function SignUp() {
  const  [values, setValues] = React.useState({
    username: '',
    staffid: '',
    email: '',
    password: '',
    password_verfy: '',
    verification_code: '',
  });
  const [captcha, setCaptcha] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [topage, setTopage] = React.useState("")

  const handleChange = (prop) => (event) =>{
    setValues({ ...values, [prop]: event.target.value })
  };
  const handleClick = useCallback((code) => {
    setCaptcha(code)
  }, []);
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };
  const SignUp_Button = () => {
    // check if the form is valid
    if (values.username === "" || values.email === "" || values.password === "" || values.password_verfy === "" || values.verification_code === "") {
      alert("Please input the required textfield.")
    } else if (checked===false){
      alert("Please read and agree to Wellbeing Gallery Privacy and Security Policy and Terms of Use.")
    } else if (/^\d+$/.test(values.staffid) === false) {
      alert("Please input the correct Staff ID.")
    } else if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(values.email) === false) {
       alert("Please input the correct Email.")
    } else if (/^.*(?=.{8,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(values.password) === false) {
      if(values.password.length < 8){
        alert("The password is too short. Please input new password.")
      } else if(values.password.length > 16){
        alert("The password is too long. Please input new password.")
      } else if (values.password === values.username){
        alert("The password should be different from the username. Please input new password.")
      } else if (/[a-zA-Z]/.test(values.password)) {
        alert("The password should contain the uppercase and lowercase letters. Please input new password.")
      } else if (/\d/.test(values.password)){
        alert("The password should contain the digit. Please input new Password.")
      }
    } else if (values.password !== values.password_verfy){
      alert("The passwords you input don't match.")
    }else if(captcha !== values.verification_code){
      alert("Please input the correct Verification Code")
    }
  }

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
                           helperText="Recommend to use your outlook name in company email"
                           onChange={handleChange('username')}
                           InputProps={{
                             startAdornment: (
                               <InputAdornment position="start" >
                                 <AccountCircle />
                               </InputAdornment>
                             ),
                           }}
                />
                <TextField label="Staff ID" className="Text_Staffid"
                           sx = {{ width:"73ch", m:2 }}  variant={"outlined"} color="error"
                           helperText="Your HSBC staff ID, leave it empty if you are an external user"
                           onChange={handleChange('staffid')}
                           InputProps={{
                             startAdornment: (
                               <InputAdornment position="start" >
                                 <BadgeIcon />
                               </InputAdornment>
                             ),
                           }}
                />
                <TextField label="Email" className="Text_Email"
                           sx = {{ width:"73ch", m:2 }}  variant={"outlined"} color="error" type="email" required
                           helperText="Recommend to use company email which could receive external emails, otherwise personal mailbox is acceptable"
                           onChange={handleChange('email')}
                           InputProps={{
                             startAdornment: (
                               <InputAdornment position="start" >
                                 <EmailIcon />
                               </InputAdornment>
                             ),
                           }}
                />
                <TextField label="Password" className="Text_Password"
                           sx = {{ width:"73ch", m:2 }}  variant={"outlined"} color="error" type="password" required
                           helperText="The password should contain 8 - 16 characters, which is a combination of digit, uppercase letters and lowercase letters."
                           onChange={handleChange('password')}
                           InputProps={{
                             startAdornment: (
                               <InputAdornment position="start" >
                                 <PasswordIcon />
                               </InputAdornment>
                             ),
                           }}
                />
                <TextField label="Verify Password" className="Text_Password_Verify"
                           sx = {{ width:"73ch", m:2 }}  variant={"outlined"} color="error" type="password" required
                           helperText="Input the password again."
                           onChange={handleChange('password_verfy')}
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
                  <Captcha charNum={4} onChange={handleClick} />
                </Grid>
              </Grid>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
              <Button className="Button_Signup"
                      variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch"}}
                      onClick={SignUp_Button}>
                Sign Up
              </Button>
              <FormControlLabel control={
                <Checkbox color={'error'} onChange={handleCheck} checked={checked}
                          inputProps={{ 'aria-label': 'controlled' }}
                />
                } label="I have read and agreed to Wellbeing Gallery Privacy and Security Policy and Terms of Use."
              />
              <Link component="button" underline="always"
                    onClick={() => {
                      history.push({pathname:"/SignIn",state:{}});
                      setTopage("SignIn")
                    }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }else if(topage==="SignIn"){
    return <Navigate to="/SignIn" replace={true} />
  }
}

export default SignUp;