import React, {useEffect} from "react";
import history from "../Tool/history";
import Yoga from '../Picture/Home_Yoga.png';
import Running from  '../Picture/Home_Running.png';
import Scheme from '../Picture/Home_Scheme.png';
import Plan_1 from '../Picture/Home_Plan_1.png'
import Footer from '../Tool/Footer';
import AppHeader from '../Tool/App_Header';
import PicList from "../Tool/Home_PicList";
import './Home.css';

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
    const [exerciseId, setExerciseId] = React.useState(null);
    const [wellbeing_level, setWellbeing_level] = React.useState(0);
    const [total_time, setTotal_time] = React.useState("");
    const [total_score, setTotal_score] = React.useState(0);
    const [upcomingPlans, setUpcomingPlans] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!cookie.load('user_id')) {
                history.push({ pathname: "/SignIn", state: {} });
                setTopage("SignIn");
            } else {
                const token = cookie.load("token");

                try {
                    const summaryResponse = await axios.get(server + "exercise/usersummary/", {
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + token
                        }
                    });

                    if (summaryResponse.status === 200) {
                        cookie.save("email", summaryResponse.data["email"], { maxAge: 60 * 60 * 24 * 365 });
                        setWellbeing_level(summaryResponse.data["wellbeing_level"]);
                        setTotal_score(summaryResponse.data["total_score"]);
                        setTotal_time(summaryResponse.data["total_time"]);
                        console.log("wellbeing_level", wellbeing_level);
                    } else {
                        console.log("Failed to fetch user summary");
                    }

                    const schedulesResponse = await axios.get(server + "exercise/schedules/", {
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + token
                        }
                    });

                    const allPlans = schedulesResponse.data.results;  // 注意这里从 response.data 中取出了 results 字段
//                    console.log("allPlans",allPlans);
//                    console.log("cookie.load('user_id'",cookie.load('user_id'));
                    const ownerPlans = allPlans.filter(plan => plan.owner === cookie.load('user_id'));
                    console.log("ownerPlans",ownerPlans);
                    const fetchExerciseDetails = async (exerciseUrl) => {
                        try {
                            const response = await axios.get(exerciseUrl);
                            console.log("exercise/schedules/", response.data);
                            return response.data;
                        } catch (error) {
                            console.error("Failed to fetch exercise details:", error);
                            throw error;
                        }
                    };

                    const fetchAllPlansDetails = async () => {
                        return await Promise.all(ownerPlans.map(async (plan) => {
                            try {
                                const exerciseDetails = await fetchExerciseDetails(plan.exercises[0]);

                                // Parse sub_schedules to JSON
                                const subSchedulesParsed = JSON.parse(plan.sub_schedules);
                                console.log("subSchedulesParsed",subSchedulesParsed);
                                const convertToMMDDHHMM = (isoString) => {
                                  const date = new Date(isoString);
                                  const optionsDate = { month: '2-digit', day: '2-digit' };
                                  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };

                                  const localDate = date.toLocaleDateString('en-US', optionsDate).replace(/\//g, '-');
                                  const localTime = date.toLocaleTimeString('en-US', optionsTime).replace(/:/g, ':');

                                  return `${localDate} ${localTime}`;
                                };
                                 // Update each sub_schedule
                                const updatedSubSchedules = subSchedulesParsed.map(subSchedule => {
                                    return {
                                      ...subSchedule,
                                      start_time: convertToMMDDHHMM(subSchedule.start_time),
                                      end_time: convertToMMDDHHMM(subSchedule.end_time)
                                    };
                                });

                                // Construct the GO button URL
                                console.log("plan.exercises",plan.exercises)
                                console.log("plan.exercises[0",plan.exercises[0])
                                const exerciseId = plan.exercises[0].replace(/\/$/, '').split('/').pop();
                                console.log("exerciseId",exerciseId);
                                //setExerciseId(exerciseId);  // Set the exerciseId state
                                const hostname = window.location.hostname;
                                const protocol = window.location.protocol;
                                const port = window.location.port

                                let baseUrl =""
                                if (hostname === "localhost" || hostname === "127.0.0.1") {
                                     baseUrl = `${protocol}//${hostname}:${port}`;
                                }else{
                                     baseUrl = `${protocol}//${hostname}`;
                                }
                                const goButtonUrl = `${baseUrl}/Working_Yoga?exercise=${exerciseId}`;
                                console.log("goButtonUrl",goButtonUrl)


                                return {
                                    ...plan,
                                    exerciseDetails,
                                    sub_schedules: updatedSubSchedules, // Replace the original string with the parsed
                                    goButtonUrl
                                };
                            } catch (error) {
                                console.error("Failed to fetch plan details:", error);
                                throw error;
                            }
                        }));
                    };

                    try {
                        const detailedPlans = await fetchAllPlansDetails();
                        console.log("detailedPlans", detailedPlans);
                        setUpcomingPlans(detailedPlans);
                    } catch (error) {
                        console.error("Failed to fetch all plan details:", error);
                    }

                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            }
        };

        fetchData();
    }, []);


    if(topage==="Home") {
        return (
            <div className="HomePage">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <div className="main">
                    <Grid container direction="column" alignItems="center" justifyContent="center" xs="auto"  item
                    xs={12}  sx={{ml: 2, mt: 2, mr: 2, mb: 4}}>
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
                                            <div className="plan-list">
                                                {upcomingPlans.map((plan, index) => (
                                                    <Grid container item direction="row" justifyContent="flex-start"
                                                          alignItems="center" xs="auto" sx={{ml: 2, mt: 2, mb: 1}} key={index}>
                                                        {/* 这里可以根据 plan 对象的具体结构来渲染不同的内容 */}
                                                        <Grid item>
                                                            <img src={Plan_1} alt=""/>
                                                        </Grid>
                                                        <Grid container item xs={6} direction="column" alignItems="flex-start"
                                                              justifyContent="center" xs="auto" sx={{ml: 2}}>
                                                            <Typography variant="h7" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                                {plan.name}
                                                            </Typography>
                                                            <Typography variant="h7" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                                {plan.exerciseDetails.name}  {/* 使用运动的名称 */}
                                                            </Typography>

                                                            <Typography variant="body1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                                                                {plan.sub_schedules[0].start_time}  {/* 使用 sub_schedules 的时间 */}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid container item direction="row" className="plan-list-row"
                                                        alignItems="center" xs="auto" sx={{ml: 12}} style={{ paddingRight: '16px' }}>
                                                            <Button variant="contained" sx={{fontSize: 'h6.fontSize', fontFamily: 'MSYH'}} color="error"
                                                                    onClick={() => {
                                                                        window.location.href = plan.goButtonUrl;
                                                                    }}>
                                                                Go
                                                                <BoltIcon variant="small"/>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </div>
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
