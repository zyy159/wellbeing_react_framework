import React, {useCallback, useEffect,useRef } from "react";
import { Link as RouterLink,useLocation } from 'react-router-dom';
import history from "../Tool/history";
// import logo from '../Picture/HSBC-LOGO.png';
import background_pic from '../Picture/Signup Background.png';

import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import AppHeader from '../Tool/App_Header';
import {Navigate} from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import PasswordIcon from '@mui/icons-material/Password';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Tooltip from '@mui/material/Tooltip';
import PrivacyPolicy from './PrivacyPolicy'; // 根据您的文件结构更新路径
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import cookie from "react-cookies";
// import md5 from 'js-md5';
import emailjs from '@emailjs/browser';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function Quick_SignUp() {
    const [values, setValues] = React.useState({
        username: '',
        email: '',
        email_security_code: '',
        password: '',
        password_verfy: '',
        verification_code: '',
    });
    const [checked, setChecked] = React.useState(false);
    const [topage, setTopage] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    const [inviteCode, setInviteCode] = React.useState(""); // 邀请码
    const [inviteCodeStatus, setInviteCodeStatus] = React.useState(null); // 邀请码状态
    const location = useLocation();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false); // 跟踪电子邮件错误
    const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
    // 使用主题和媒体查询钩子
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


 // 当电子邮件地址变化时自动生成用户名和密码
    useEffect(() => {
        if (email) {
            const emailPrefix = email.split('@')[0];
            const password = `WB_${emailPrefix.charAt(0).toUpperCase()}${emailPrefix.slice(1)}@${email.length}`;
//            console.log("username",email);
//            console.log("password",password);
            setUsername(email);
            setPassword(password);
        }
    }, [email]);

    const isValidEmail = email => {
      // 此正则表达式匹配"hsbc"后面跟随任何字符（代表不同国家的可能性），直到遇到"."，然后是两到四个字母的顶级域名
      return /\S+@hsbc\.\S{2,4}(\.\S{2})?$/.test(email);
    };

     // 电子邮件校验函数
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

      // 处理电子邮件输入变化的函数
    const handleChangeEmail = (event) => {
        const emailInput = event.target.value;
        setEmail(emailInput);
        setEmailError(!validateEmail(emailInput)); // 根据电子邮件的校验结果更新错误状态
    };

//    const handleChangeEmail = (event) => {
//            setEmail(event.target.value);
//    };

    const handleChange = (prop) => (event) =>{
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleCheck = (event) => {
        setChecked(event.target.checked);
    };
    const SignUp_Button = () => {
        if(emailError) {
          alert("Please enter a valid email address.");
          return;
        }
//        if (!isValidEmail(email)) {
//            alert('Please enter a valid HSBC email address.');
//            return;
//        }

        const data = {
          username: username,
          email: email,
          password1: password,
          password2: password,
        };
        axios.post(server+"rest-auth/registration/",JSON.stringify(data),{headers:{"Content-Type":'application/json'}}).then(function (response) {
            cookie.save("user_id",username, { maxAge: 60*60*24*365 });
            cookie.save("token",response.data.key, { maxAge: 60*60*24*365 });
            console.log("cookie",response.data.key);
            emailjs.send("service_89efw7f","template_qu1hm1r", {
                    to_name: values.username,
                    to_email: values.email,
                },"NwUcEIZUuGjkuoiEf").then((result) => {
                    console.log('SUCCESS!', result.text);
                }, (error) => {
                    console.log('The welcome mail fail to be sent!...', error.text);
            });
//            history.push({pathname:"/",state:{}});
//            setTopage("Home");
            // 显示密码对话框而不是直接跳转
            setShowPasswordDialog(true);
        }).catch(err => {
               console.log("err",err);
               if (err.response && err.response.data) {
                // Initialize an empty array to hold all the error messages
                let errorMessages = [];

                // Loop over each key in the response data object
                for (const key in err.response.data) {
                    // Check if the key is indeed a property of the object
                    if (err.response.data.hasOwnProperty(key)) {
                        // Add the messages to the errorMessages array
                        errorMessages = errorMessages.concat(err.response.data[key]);
                    }
                }

                // Join all error messages with a newline character to separate them
                const errorMsg = errorMessages.join('\n');

                // Display the concatenated error messages
                alert(errorMsg);
                setEmail(' ');
            } else {
                alert('Fail to register user!');
                setEmail(' ');
            }

        })
    }


    useEffect(()=>{
        if(cookie.load('user_id')){
            history.push({pathname:"/",state:{}});
            setTopage("Home")
        }
    },[])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const invitecodeParam = params.get('invitecode');
        if (invitecodeParam) {
          setInviteCode(invitecodeParam);
          //console.log("invitecodeParam",invitecodeParam);
        } else {
          console.log("Individual signup");
        }
  }, [location.search]);  // 依赖于 location.search

    if(topage===""){
        return (
            <div className="Quick_SignUp">
                <AppHeader />
                <div className="Main">
                    <Grid container direction="column" justifyContent="center" alignItems="center" xs="auto" sx={{ mb: 2 }}>
                        <img src={background_pic} className="background_pic" alt="" width="100%"/>
                        <Grid container item justifyContent="center" alignItems="center" xs="auto" sx={{ mt: 2 }}>
                            <Typography variant="h3" color="#EE270C" sx={{ m:3, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                Wellbeing Gallery
                            </Typography>
                            <Grid container item justifyContent="center" alignItems="center" direction="column">
                                <TextField label="Email" className="Text_Email"
                                     error={emailError} // 根据emailError决定是否显示错误状态
                                     helperText={emailError ? "Invalid email address." : ""}
                                     sx = {{ width:"73ch", m:2, fontFamily: 'MSYH' }} variant={"outlined"} color="error" type="email" required
                                     onChange={handleChangeEmail}
                                     placeholder="Please use your HSBC email address to register" //
                                     InputProps={{
                                         startAdornment: (
                                             <InputAdornment position="start" >
                                                 <EmailIcon />
                                             </InputAdornment>
                                         ),
                                     }}
                                />
                                <Box sx={{ mt: 0 }}>
                                        <Typography variant="caption" display="block">
                                            Auto Password Generation Rules  :  Your password will be generated based on
                                            your
                                            email
                                            prefix
                                            (the part before
                                             '@'):
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            0. Your password will begin with the prefix "WB_".
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            1. Capitalize the first letter of the prefix.
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            2. Keep the rest unchanged (in lowercase).
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            3. Add '@' followed by the total length of your email.
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Example: For 'example.user@example.com', the password is 'WB_Example.user@24'.
                                        </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container item justifyContent="center" alignItems="center" direction="column" xs="auto">
                            <Button className="Button_Signup"
                                variant="contained" color="error" sx={{ mt:3, fontSize: "h6.fontSize",width:"33ch", fontFamily: 'MSYH'}}
                                onClick={SignUp_Button}
                                disabled={!checked} // 这将确保只有在checked为true时按钮才可用
                            >
                                Sign Up with Auto Pwd
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
                            <Tooltip title={<PrivacyPolicy />} placement="top" interactive>
                                    Wellbeing Gallery Privacy and Security Policy and Terms of Use.
                            </Tooltip>
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
                <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
                  <DialogTitle>Your Password</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Click OK to copy your automatically generated password ({password}) to the clipboard.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(password).then(() => {
                          console.log('Password copied to clipboard');
                          setShowPasswordDialog(false);
                          history.push({pathname:"/",state:{}});
                          setTopage("Home");
                      }).catch(err => {
                        console.error('Failed to copy the password to clipboard', err);
                      });
                    }}>OK</Button>
                  </DialogActions>
                </Dialog>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/" replace={true} />
    }
}

export default Quick_SignUp;
