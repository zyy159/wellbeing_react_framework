import React, {useCallback, useEffect,useRef } from "react";
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
import md5 from 'js-md5';
import emailjs from '@emailjs/browser';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api';

function ResetPassword() {
    const  [values, setValues] = React.useState({
        email: '',
        email_security_code: '',
        password: '',
        password_verfy: ''
    });
    const [topage, setTopage] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);


    const handleChange = (prop) => (event) =>{
        setValues({ ...values, [prop]: event.target.value });
    };
    const Reset_Button = () => {
        if (values.email_security_code === "" || values.password === "" || values.password_verfy === "") {
            alert("Please input the required textfield.");
        } else if (values.email_security_code !== cookie.load('security_code')) {
            alert("The Email Security Code is incorrect!");
            setVerified(false)
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
        } else if (values.password !== values.password_verfy){
            alert("The passwords you input don't match.");
        }
        let encrypt_pwd = values.password;
        let data = new FormData();
        data.append("email",values.email);

        // 1. 获取token和uid
        axios.post(server + "/exercise/password_reset/",data).then(function (response) {
          if (response.status === 200) {
            const { token, uid } = response.data;

            // 2. 设置新密码和构建数据
            const data = new FormData();
            data.append("new_password1", encrypt_pwd);
            data.append("new_password2", encrypt_pwd); // 与new_password1相同
            data.append("uid", uid);
            data.append("token", token);

            // 3. 调用密码重置API
            axios
              .post(server + "/rest-auth/password/reset/confirm/", data, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then(function (response) {
                if (response.status === 200) {
                  alert("Password reset successful.");
                  history.push({pathname:"/",state:{}});
                  setTopage("Home");
                } else {
                  console.log("Password reset failed.");
                  // 执行失败后的操作
                }
              })
              .catch(function (error) {
                if (error.response && error.response.data && error.response.data.new_password2) {
                  const errorMessage = error.response.data.new_password2.join(", ");
                  alert(errorMessage);
                  // 在页面上显示错误消息，例如使用setState来更新组件的状态以显示错误信息
                } else {
                  console.log("Unknown error.");
                }
              });
          } else {
            console.log("Failed to get token and uid.");
            // 处理获取token和uid失败的情况
          }
        });

    }
    const Reset_Verify_Email = () => {
        setVerified(true)
        if (values.username === "" || values.email === ""){
            alert("Please input the Username and Email.");
        } else if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(values.email) === false) {
            alert("Please input the correct Email.");
        }
        var username = cookie.load('user_id')
        var code = '' + (parseInt(Math.random()*1000000)+1000000);
        code = code.substring(1, 7);
        cookie.save("security_code",code);
        emailjs.send("service_89efw7f","template_mhjmx5k", {
            to_name: username,
            to_email: values.email,
            code: code,
        },"NwUcEIZUuGjkuoiEf").then((result) => {
            console.log('SUCCESS!', result.text);
            setShowSuccessMessage(true);
        }, (error) => {
            alert("The verification mail fail to be sent!")
            setVerified(false)
            console.log('FAILED...', error.text);
        });
    }
    useEffect(()=>{
        if(cookie.load('user_id')){
            history.push({pathname:"/",state:{}});
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
                            <Typography variant="h3" color="#EE270C" sx={{ m:3, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                Wellbeing Gallery
                            </Typography>
                            <Grid container item justifyContent="center" alignItems="center" direction="column">
                                <TextField label="Email" className="Text_Email"
                                    sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="email" required onChange={handleChange('email')} InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" >
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Grid container item justifyContent="center" alignItems="flex-start" direction="row" sx = {{ m:2 }}>
                                    <TextField label="Email Security Code" className="Text_Email_Security_Code" sx = {{ width:"48ch", fontFamily: 'MSYH' }} variant={"outlined"} color="error" required
                                        helperText="Please check the coming mail in your mailbox and then fill in."
                                        onChange={handleChange('email_security_code')}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" >
                                                    <VerifiedUserIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button className="Button_Verify_Email"
                                        variant="contained" color="error" sx={{ fontSize: "h6.fontSize",width:"18ch", ml:3, mt:0.5, fontFamily: 'MSYH'}}
                                        onClick={Reset_Verify_Email} disabled={verified}
                                    >
                                        {showSuccessMessage ? 'Email Sent' : 'Verify Email'}
                                    </Button>
                                </Grid>
                                <TextField label="Reset your Password" className="Text_Password"
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
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
                            <Button className="Button_Signup"
                                variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch", fontFamily: 'MSYH'}}
                                onClick={Reset_Button}
                            >
                                Reset
                              </Button>
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

export default ResetPassword;
