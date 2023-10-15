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
// import md5 from 'js-md5';
import emailjs from '@emailjs/browser';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function PromotionSignUp() {
    const [topage, setTopage] = React.useState("");

    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        invitationCode: '' // 邀请码是可选的
    });
//    const history = useHistory();

//    const handleChange = (e) => {
//        setFormData({
//            ...formData,
//            [e.target.name]: e.target.value
//        });
//    };

    const handleChange = (prop) => (event) => {
        // 检查event和event.target是否定义
        if (event && event.target) {
            setFormData({ ...formData, [prop]: event.target.value });
        }
    };

    const validatePasswordUsername = (password, username) => {
        if (password == username) {
            return false;
        }else{
            return true;
        }

    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    const validateUsername = (username) => {
        const regex = /^[a-zA-Z0-9_]{3,15}$/;
        return regex.test(username);
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 将数据发送到服务器
            if (!validateUsername(formData.username)) {
                alert("Invalid username!");
                return;
            }

            if (!validateEmail(formData.email)) {
                alert("Invalid email!");
                return;
            }

            if (!validatePasswordUsername(formData.password, formData.username)) {
                alert("Invalid password! Password cannot be the same as username.");
                return;
            }

            if (!validatePassword(formData.password)) {
                alert("Invalid password!");
                return;
            }

            if(formData.password !== formData.passwordConfirm){
                alert("Passwords do not match!");
                return;
            }
            const response = await axios.post(
                "https://wellbeing.htcangelfund.com/api/rest-auth/registration/",
                {
                    username: formData.username,
                    email: formData.email,
                    password1: formData.password,
                    password2: formData.password,
                    // 如果后端API支持邀请码字段，请在此添加
                    // invitationCode: formData.invitationCode
                }
            );
            // 处理响应或重定向
            if (response.status === 201) {
                alert("User created successfully!");
                history.push({pathname:"/SignIn",state:{}});
                setTopage("SignIn");
            } else {
                    console("response",response);
                    alert("Fail to register! Please retry!");

            }
        } catch (error) {
            console.log("error",error);
            if (error.response.data) {
                        const { username, email } = error.response.data;
                        let errorMsg = "";
                        if (username) errorMsg += `Username: ${username}\n`;
                        if (email) errorMsg += `Email: ${email}\n`;

                        // 在这里你可以设置一个状态来保存这个错误信息，
                        // 然后在你的组件中显示它。
                        alert(errorMsg);
            } else {
                alert("Fail to register! Please retry!");
            }
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
                <div className="PromotionSignUp">
                  <AppHeader />
                  {/* 其他可能的头部组件 */}
                  <div className="Main">
                    <Grid container direction="column" justifyContent="center" alignItems="center" xs="auto" sx={{ mb: 2 }}>
                      <img src={background_pic} className="background_pic" alt="" width="100%"/>
                      <Grid container item justifyContent="center" alignItems="center" xs="auto" sx={{ mt: 2 }}>
                        <Typography variant="h3" color="#EE270C" sx={{ m: 3, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                          Wellbeing Gallery
                        </Typography>
                        <Grid container item justifyContent="center" alignItems="center" direction="column">
                          <TextField label="Username" className="Text_Username"
                            sx={{ width: "73ch", m: 3, fontFamily: 'MSYH' }} variant={"outlined"} color="error" required
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
                            sx={{ width: "73ch", m: 2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="email" required
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
                                sx={{ width: "73ch", m: 2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="password" required
                                helperText="At least one uppercase letter, one lowercase letter, one number, one special character, and a minimum length of 8 characters."
                                onChange={handleChange('password')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" >
                                            <PasswordIcon />
                                        </InputAdornment>
                                    ),
                                }}
                          />
                          <TextField
                                label="Confirm Password"
                                className="Text_Password_Confirm"
                                sx={{ width: "73ch", m: 2, fontFamily: 'MSYH' }}
                                variant={"outlined"}
                                color="error"
                                type="password"
                                required
                                helperText="Please re-enter your password."
                                onChange={handleChange('passwordConfirm')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" >
                                            <PasswordIcon />
                                        </InputAdornment>
                                    ),
                                }}
                          />
                          <TextField label="Invite Code (optional)" className="Text_InviteCode"
                            sx={{ width: "73ch", m: 2, fontFamily: 'MSYH' }} variant={"outlined"} color="error"
                            helperText="If you have an invite code, please enter it here."
                            onChange={handleChange('inviteCode')}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
                        <Button className="Button_Signup"
                          variant="contained" color="error" sx={{ mt: 3, fontSize: "h6.fontSize", width: "33ch", fontFamily: 'MSYH' }}
                          onClick={handleSubmit}
                        >
                          Sign Up
                        </Button>
                        {/* 其他可能的组件，例如阅读和同意政策的复选框等 */}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              );
         }else if(topage==="SignIn"){
            return <Navigate to="/SignIn" replace={true} />
        }else if(topage==="Home"){
            return <Navigate to="/Home" replace={true} />
        }
}

export default PromotionSignUp;