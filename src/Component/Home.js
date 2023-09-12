import React, {useEffect} from "react";
import history from "../Tool/history";
import Yoga from '../Picture/Home_Yoga.png';
import Running from  '../Picture/Home_Running.png';
import Scheme from '../Picture/Home_Scheme.png';
import Plan_1 from '../Picture/Home_Plan_1.png'
import Footer from '../Tool/Footer';
import AppHeader from '../Tool/App_Header';
import PicList from "../Tool/Home_PicList";

import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Paper  from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import Typography from "@mui/material/Typography";
import CardContent from '@mui/material/CardContent';
import FastForwardSharpIcon from '@mui/icons-material/FastForwardSharp';
import Diversity3SharpIcon from '@mui/icons-material/Diversity3Sharp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import {Navigate} from "react-router";

import cookie from 'react-cookies';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function Home() {
    const [topage, setTopage] = React.useState("Home");
    const [wellbeing_level, setWellbeing_level] = React.useState(0);
    const [total_time, setTotal_time] = React.useState("");
    const [total_score, setTotal_score] = React.useState(0);

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            axios.get(server+"exercise/usersummary/",{headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
                if(response.status===200){
                    cookie.save("email",response.data["email"], { maxAge: 60*60*24*365 });
                    setWellbeing_level(response.data["wellbeing_level"])
                    setTotal_score(response.data["total_score"])
                    setTotal_time(response.data["total_time"])
                    console.log(wellbeing_level)
                }else{
                    console.log("Fail");
                }
            })
        }
    },[])

    if(topage==="Home") {
        return (
            <div className="HomePage">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <div className="main">
                    <Grid container direction="column" alignItems="center" justifyContent="center" xs="auto"  sx={{ml: 2, mt: 2, mr: 2, mb: 4}}>
                        <Grid container item direction="row" justifyContent="center" alignItems="flex-end"
                              sx={{mt: 2, width: 1300}}>
                            <Paper elevation={0}>
                                <Grid container direction="column" alignItems="flex-start" justifyContent="center"
                                      xs="auto">
                                    <Grid container item direction="row" justifyContent="center" alignItems="center"
                                          xs="auto" sx={{mb: 1}}>
                                        <Avatar sx={{bgcolor: red[500], width: 56, height: 56}} alt="Stanven"/>
                                        <Typography variant="h5" sx={{ml: 2, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                            Hi {cookie.load('user_id')}! Get started now?
                                        </Typography>
                                    </Grid>
                                    <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{mt: 1}}>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}
                                        >
                                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                {total_time}
                                            </Typography>
                                            <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Exercise Time
                                            </Typography>
                                        </Grid>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}>
                                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                {total_score}
                                            </Typography>
                                            <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Total Score Points
                                            </Typography>
                                        </Grid>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}>
                                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Lv.{wellbeing_level}
                                            </Typography>
                                            <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Wellbeing Level
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="column" alignItems="center" justifyContent="center"
                                          sx={{mt: 1}}>
                                        <Card sx={{width: 500, height: 330}}>
                                            <Typography variant="h5" sx={{m: 2, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Upcoming Plans
                                            </Typography>
                                            <Grid container item direction="row" justifyContent="flex-start"
                                                  alignItems="center" xs="auto" sx={{ml: 2, mt: 2, mb: 1}}>
                                                <Grid item>
                                                    <img src={Plan_1} alt=""/>
                                                </Grid>
                                                <Grid container item xs={6} direction="column" alignItems="flex-start"
                                                      justifyContent="center" xs="auto" sx={{ml: 2}}>
                                                    <Typography variant="h7" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                        Stand Up for a While
                                                    </Typography>
                                                    <Typography variant="body1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                                                        The 2nd/5 days 5 mins
                                                    </Typography>
                                                </Grid>
                                                <Grid item sx={{ml: 12}}>
                                                    <Button variant="contained" sx={{fontSize: 'h6.fontSize', fontFamily: 'MSYH'}} color="error"
                                                        onClick={() => {
                                                            history.push({pathname: "/Working_Yoga", state: {}});
                                                            setTopage("Working_Yoga")
                                                        }}
                                                    >
                                                        Go
                                                        <BoltIcon variant="small"/>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Divider variant="middle"/>
                                            <Grid container item direction="row" justifyContent="flex-start"
                                                  alignItems="center" xs="auto" sx={{ml: 2, mt: 2, mb: 1}}>
                                                <Grid item>
                                                    <img src={Plan_1} alt=""/>
                                                </Grid>
                                                <Grid container item xs={6} direction="column" alignItems="flex-start"
                                                      justifyContent="center" xs="auto" sx={{ml: 2}}>
                                                    <Typography variant="h7" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                        One Week Yoga
                                                    </Typography>
                                                    <Typography variant="body1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                                                        The 2nd/5 days 5 mins
                                                    </Typography>
                                                </Grid>
                                                <Grid item sx={{ml: 12}}>
                                                    <Button variant="contained" sx={{fontSize: 'h6.fontSize', fontFamily: 'MSYH'}} color="error"
                                                        onClick={() => {
                                                            history.push({pathname: "/Working_Yoga", state: {}});
                                                            setTopage("Working_Yoga")
                                                        }}
                                                    >
                                                        Go
                                                        <BoltIcon variant="small"/>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Divider variant="middle"/>
                                            <Grid container item direction="row" justifyContent="center"
                                                  alignItems="center" xs="auto" sx={{m: 2}}>
                                                <Button color={"error"} sx={{fontWeight: 'bold', fontFamily: 'MSYH'}}
                                                    onClick={() => {
                                                        history.push({pathname: "/ExerciseOption", state: {}});
                                                        setTopage("ExerciseOption")
                                                    }}
                                                >
                                                    <AddCircleIcon color="error" sx={{mr: 1}}/>
                                                    Join a new plan
                                                </Button>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Card sx={{ml: 4, width: 700, height: 500}}>
                                <PicList/>
                            </Card>
                        </Grid>
                        <Grid container item direction="row" alignItems="center" justifyContent="center"
                              sx={{mt: 4, width: 1300}} className="Block">
                            <Card>
                                <img src={Yoga} className="Yoga"/>
                                <CardContent>
                                    <Button variant={"text"} color="error"
                                            onClick={() => {
                                                history.push({pathname: "/Yoga", state: {}});
                                                setTopage("Yoga")
                                            }}
                                    >
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center"
                                              xs="auto">
                                            <FastForwardSharpIcon/>
                                            <Typography variant="h6" sx={{ml: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Quick Start
                                            </Typography>
                                        </Grid>
                                    </Button>
                                    <Typography variant="subtitle1" sx={{mt: 1, ml: 1, fontFamily: 'MSYH'}}>
                                        Start your journey with a 2 mins Yoga!!!
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ml: 2}}>
                                <img src={Scheme} className="Scheme"/>
                                <CardContent>
                                    <Button variant={"text"} color="error">
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center"
                                              xs="auto">
                                            <EventAvailableIcon/>
                                            <Typography variant="h6" sx={{ml: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                               Join our Scheme
                                            </Typography>
                                        </Grid>
                                    </Button>
                                    <Typography variant="subtitle1" sx={{mt: 1, ml: 1, fontFamily: 'MSYH'}}>
                                        Join us with a Scheme!!!
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ml: 2}}>
                                <img src={Running} className="Running"/>
                                <CardContent>
                                    <Button variant={"text"} color="error">
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center"
                                              xs="auto">
                                            <Diversity3SharpIcon/>
                                            <Typography variant="h6" sx={{ml: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                               Join our Scheme
                                            </Typography>
                                        </Grid>
                                    </Button>
                                    <Typography variant="subtitle1" sx={{mt: 1, ml: 1, fontFamily: 'MSYH'}}>
                                        Find your friends and get started together!!!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }else if(topage==="Yoga"){
        return <Navigate to="/Yoga" replace={true} />
    }else if(topage==="ExerciseOption"){
        return <Navigate to="/ExerciseOption" replace={true} />
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Working_Yoga"){
        return <Navigate to="/Working_Yoga" replace={true} />
    }
}

export default Home;
