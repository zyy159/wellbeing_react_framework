import React, {useCallback, useEffect,useRef } from "react";
import { Link as RouterLink } from 'react-router-dom';
import history from "../Tool/history";
// import logo from '../Picture/HSBC-LOGO.png';
import background_pic from '../Picture/Signup Background.png';

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
import PasswordIcon from '@mui/icons-material/Password';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import cookie from "react-cookies";
// import md5 from 'js-md5';
import emailjs from '@emailjs/browser';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function SignUp() {
    const [values, setValues] = React.useState({
        username: '',
        email: '',
        email_security_code: '',
        password: '',
        password_verfy: '',
        verification_code: '',
    });
    const [captcha, setCaptcha] = React.useState("");
    const [checked, setChecked] = React.useState(false);
    const [topage, setTopage] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    const [inviteCode, setInviteCode] = React.useState(""); // 邀请码
    const [inviteCodeStatus, setInviteCodeStatus] = React.useState(null); // 邀请码状态

    const handleChange = (prop) => (event) =>{
        setValues({ ...values, [prop]: event.target.value });
    };
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
    const SignUp_Button = () => {
        if (values.password === "" || values.password_verfy === "" || values.verification_code === "") {
            alert("Please input the required textfield.");
            handleRefresh();
        } else if (checked === false) {
            alert("Please read and agree to Wellbeing Gallery Privacy and Security Policy and Terms of Use.");
            handleRefresh();
        } else if (/^.*(?=.{8,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(values.password) === false) {
            if(values.password.length < 8){
                alert("The password is too short. Please input new password.");
            } else if(values.password.length > 16){
                alert("The password is too long. Please input new password.")
            } else if (values.password === values.username){
                alert("The password should be different from the username. Please input new password.")
            } else if (! /[a-zA-Z]/.test(values.password)) {
                alert("The password should contain the uppercase and lowercase letters. Please input new password.")
            } else if (! /\d/.test(values.password)){
                alert("The password should contain the digit. Please input new Password.")
            }
            handleRefresh();
        } else if (values.password !== values.password_verfy){
            alert("The passwords you input don't match.");
            handleRefresh();
        } else if(captcha !== values.verification_code){
            alert("Please input the correct Verification Code");
            handleRefresh();
        }
//        let data = new FormData();
//        data.append("username",values.username);
//        data.append("email",values.email);
//        data.append("password1",values.password);
//        data.append("password2",values.password_verfy);
        const data = {
          username: values.username,
          email: values.email,
          password1: values.password,
          password2: values.password_verfy,
        };
        axios.post(server+"rest-auth/registration/",JSON.stringify(data),{headers:{"Content-Type":'application/json'}}).then(function (response) {
            cookie.save("user_id",values.username, { maxAge: 60*60*24*365 });
            cookie.save("token",response.data.key, { maxAge: 60*60*24*365 });
            history.push({pathname:"/",state:{}});
            setTopage("Home");
        }).catch(err => {
               if (err.response && err.response.data) {
                    const { username, email } = err.response.data;
                    let errorMsg = "";
                    if (username) errorMsg += `Username: ${username}\n`;
                    if (email) errorMsg += `Email: ${email}\n`;

                    // 在这里你可以设置一个状态来保存这个错误信息，
                    // 然后在你的组件中显示它。
                    alert(errorMsg);
            } else {
                alert("Fail to register! Please retry!");
            }
            handleRefresh();
        })
    }
    const SignUp_Verify_Email = () => {
        setVerified(true)
        if (values.username === "" || values.email === ""){
            alert("Please input the Username and Email.");
            handleRefresh();
        } else if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(values.email) === false) {
            alert("Please input the correct Email.");
            handleRefresh();
        }
// Comment the verification code.
//        var code = '' + (parseInt(Math.random()*1000000)+1000000);
//        code = code.substring(1, 7);
//        cookie.save("security_code",code);
//        emailjs.send("service_89efw7f","template_qu1hm1r", {
//            to_name: values.username,
//            to_email: values.email,
//            code: code,
//        },"NwUcEIZUuGjkuoiEf").then((result) => {
//            console.log('SUCCESS!', result.text);
//        }, (error) => {
//            alert("The verification mail fail to be sent!")
//            setVerified(false)
//            console.log('FAILED...', error.text);
//            handleRefresh();
//        });
    }
    //Verify the invitecode
    const verifyInviteCode = async () => {
        try {
            // 在这里调用您的API来验证邀请码
            const response = await axios.get(server + "exercise/profile/" + inviteCode + "/");

            console.log("verifyInviteCode",response);
            // 根据响应设置邀请码状态

            if (response.status === 200) { // 如果状态码是200，邀请码有效
                setInviteCodeStatus("valid");
            } else { // 如果状态码不是200，邀请码无效
                setInviteCodeStatus("invalid");
            }
        } catch (error) {
            console.error("Error verifying invite code: ", error);
            setInviteCodeStatus("invalid");
        }
    };

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
                        <Grid container item justifyContent="center" alignItems="center" xs="auto" sx={{ mt: 2 }}>
                            <Typography variant="h3" color="#EE270C" sx={{ m:3, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                Wellbeing Gallery
                            </Typography>
                            <Grid container item justifyContent="center" alignItems="center" direction="column">
                                <TextField label="Username" className="Text_Username"
                                     sx = {{ width:"73ch", m:3, fontFamily: 'MSYH' }} variant={"outlined"} color="error" required
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
                                <TextField label="Email" className="Text_Email"
                                     sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="email" required
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
                                <TextField
                                    label="Invite Code (optional)"
                                    className="Text_InviteCode"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    onBlur={verifyInviteCode} // 当焦点移出输入框时验证邀请码
                                    sx={{ width: "73ch", m: 2, fontFamily: 'MSYH' }}
                                    variant={"outlined"}
                                    color="error"
                                    helperText={
                                        inviteCodeStatus === "invalid"
                                        ? "The invite code is invalid."
                                        : "If you have an invite code, please enter it here."
                                    }
                                    error={inviteCodeStatus === "invalid"} // 如果邀请码无效，则显示错误样式
                                />
                                <TextField label="Password" className="Text_Password"
                                     sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="password" required
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
                                     sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="password" required
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
                                         sx = {{ width:"61ch", mt:2, mb:2, mr: 3 }} variant={"outlined"} color="error" required
                                         onChange={handleChange('verification_code')}
                                         InputProps={{
                                             startAdornment: (
                                                 <InputAdornment position="start" >
                                                     <VerifiedIcon />
                                                 </InputAdornment>
                                             ),
                                         }}
                                         onKeyDown={(e) => {
                                             if(e.code === 'Enter'){
                                                 {SignUp_Button()}
                                             }
                                         }}
                                    />
                                    <Captcha charNum={4} onChange={handleClick} ref={captchaRef}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
                            <Button className="Button_Signup"
                                variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch", fontFamily: 'MSYH'}}
                                onClick={SignUp_Button}
                            >
                                Sign Up
                            </Button>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color={'error'}
                                        onChange={handleCheck}
                                        checked={checked}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                }
                                label="I have read and agreed the statement below: "
                            />
                            <Link
                                component={RouterLink}
                                to="/PrivacyPolicy"
                                underline="hover"
                                sx={{ color: 'inherit', display: 'inline-block', ml: 1 }}
                            >
                                Wellbeing Gallery Privacy and Security Policy and Terms of Use.
                            </Link>
                            <Link component="button" underline="always" sx={{ fontFamily: 'MSYH' }}
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
    }else if(topage==="Home"){
        return <Navigate to="/" replace={true} />
    }
}

export default SignUp;
