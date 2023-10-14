import React, {useCallback, useEffect,useRef } from "react";
import history from "../Tool/history";
// import logo from '../Picture/HSBC-LOGO.png';
import background_pic from '../Picture/Signup Background.png';

import InputAdornment from '@mui/material/InputAdornment';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import VerifiedIcon from '@mui/icons-material/Verified';

import cookie from 'react-cookies';
import md5 from 'js-md5';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function SignIn() {
    const [values, setValues] = React.useState({
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
    const Reset_Button = () => {
        history.push({pathname:"/ResetPassword",state:{}});
        setTopage("ResetPassword");
    }
    const clearSiteCookies = () => {
        // 获取当前网站所有的 cookie
        const allCookies = cookie.loadAll();

        // 清除所有获取到的 cookie
        for (const [key] of Object.entries(allCookies)) {
            cookie.remove(key);
        }
    }

    const SignIn_Button = () => {
        clearSiteCookies();
        const csrftoken = cookie.load('csrftoken');
        if(values.password==="" || values.username==="" || values.verification_code===""){
            alert("Please input the required textfield.")
            handleRefresh();
        } else if(captcha !== values.verification_code){
            alert("Please input the correct Verification Code")
            handleRefresh();
        } else{
            let data = new FormData();
            data.append("username",values.username);
            data.append("email","");
            data.append("password",values.password);
            axios.post(server+"rest-auth/login/",data,{headers:{"Content-Type":'application/json'},"X-CSRFToken": csrftoken }).then(function
            (response) {
                cookie.save("user_id",values.username, { maxAge: 60*60*24*365 });
                cookie.save("token",response.data.key, { maxAge: 60*60*24*365 });
                history.push({pathname:"/",state:{}});
                setTopage("Home");
            }).catch(err => {
                console.log(err)
                alert("Fail to login! Please retry!");
                handleRefresh();
            })
        }
    }
    useEffect(()=>{
        if(cookie.load('user_id')){
            history.push({pathname:"/",state:{}});
            setTopage("Home")
        }
    },[])
    if(topage===""){
        return (
            <div className="Signup">
                <AppHeader />
                <div className="Main">
                    <Grid container direction="column" justifyContent="center" alignItems="center" xs="auto" sx={{ mb: 2 }}>
                        <img src={background_pic} className="background_pic" alt="" width="100%"/>
                        <Grid container item justifyContent="center" alignItems="center" xs="auto">
                            <Typography variant="h3" color="#EE270C" sx={{ m:3, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                Wellbeing Gallery
                            </Typography>
                            <Grid container item justifyContent="center" alignItems="center" direction="column">
                                <TextField label="Username" className="Text_Username"
                                     sx = {{ width:"73ch", m:3, fontFamily: 'MSYH' }} variant={"outlined"} color="error" required
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
                                     sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="password" required
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
                                        sx = {{ width:"61ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" required
                                        onChange={handleChange('verification_code')}
                                        InputProps={{
                                         startAdornment: (
                                             <InputAdornment position="start" >
                                                 <VerifiedIcon />
                                             </InputAdornment>
                                         ),
                                        }}
//                                        onKeyDown={(e) => {
//                                            if(e.code === 'Enter'){
//                                                {SignIn_Button()}
//                                            }
//                                        }}
                                    />
                                    <Captcha charNum={4} onChange={handleClick} ref={captchaRef}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
                            <Button className="Button_Signup"
                                variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch", fontFamily: 'MSYH'}}
                                onClick={SignIn_Button}
                            >
                                Sign In
                            </Button>
                            <FormControlLabel control={
                                <Checkbox color={'error'} onChange={handleCheck} checked={checked}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                } label="Keep me signed in."
                            />
                            <Link component="button" underline="always" sx={{fontFamily: 'MSYH'}}
                                onClick={() => {
                                    history.push({pathname:"/SignUp",state:{}});
                                    setTopage("SignUp")
                                }}
                            >
                                Don't have an account? Sign Up
                            </Link>
                            <Link component="button" underline="always" sx={{fontFamily: 'MSYH'}}
                                onClick={Reset_Button}
                            >
                                Forgot the password? Click here
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
    }else if(topage==="ResetPassword"){
        return <Navigate to="/ResetPassword" replace={true} />
    }
}

export default SignIn;
