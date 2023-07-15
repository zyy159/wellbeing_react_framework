import React,{Component, useEffect} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
import chair from "../Picture/Pose/chair.png";
import dog from "../Picture/Pose/dog.png";
import mountain from "../Picture/Pose/mountain.png";
import tree from "../Picture/Pose/tree.png";
import warrior1 from "../Picture/Pose/warrior1.png";
import Calories from '../Picture/Calories_Chart.png';
import sport_video from '../Tool/Sport_video.js';
import history from "../Tool/history";
import './Working_Yoga.css';

import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import cookie from "react-cookies";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://47.97.104.79/';

const imgs = [
    {
        label: "Chair",
        imgPath: chair,
    },
    {
        label: "Dog",
        imgPath: dog ,
    },
    {
        label: "Mountain",
        imgPath: mountain ,
    },
    {
        label: "Tree",
        imgPath: tree,
    },
    {
        label: "Warrior",
        imgPath: warrior1,
    }
]

function Working_Yoga(){
    const [topage, setTopage] = React.useState("")
    const [showIndex, setShowIndex] = React.useState(imgs.length)
    const [timer, setTimer] = React.useState(null)
    const [status, setStatus] = React.useState("Not Start")
    const counterValid = showIndex < imgs.length-1;

    const stop = () => {
        setShowIndex(0)
        clearInterval(timer);
    }
    const start = () => {
        setShowIndex(0)
        setStatus("In Progress")
    }
    const change = (index) => {
        setShowIndex(index)
    }
    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }
    },[])
    useEffect(()=>{
        const intervalId = counterValid && setInterval(() =>
            setShowIndex(si=>si+1), 3000
        );
        return () => clearInterval(intervalId)
    },[counterValid])

    if (topage === "") {
        return (
            <div className="Working_Yoga">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="row" alignItems="flex-start" justifyContent="center" sx={{mt: 5, mb: 4}}>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center"
                          sx={{width: 700, mr: 5, ml: 1}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <VideoCameraFrontIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'HWE'}}>
                                LIVE Camera
                            </Typography>
                        </Grid>
                        <Card sx={{width: 680, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="center">
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start"
                                      sx={{mt: 2, mb: 1}}>
                                    <Box sx={{position: 'relative', display: 'inline-flex', ml: 3}}>
                                        <CircularProgress variant="determinate"
                                                          value={status === "Not Start" ? 0 : (showIndex + 1) * 20}
                                                          color={"error"}/>
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="caption" component="div" color="text.secondary">
                                                {status === "Not Start" ? 0 : (showIndex + 1) * 20} %
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5"
                                                sx={{fontWeight: 'bold', lineHeight: 1.5, m: 2, fontFamily: 'HWE'}}>
                                        {showIndex <= imgs.length - 1 ? imgs[showIndex].label : imgs[0].label}
                                    </Typography>
                                    {showIndex < imgs.length - 1
                                        ? <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, ml: 45, fontFamily: 'HWE'}}> >> Next: {imgs[showIndex + 1].label} </Typography>
                                        : <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, ml: 45, fontFamily: 'HWE'}}> </Typography>
                                    }
                                </Grid>
                                <Box>
                                    <iframe
                                        title="sport_video"
                                        srcDoc={sport_video}
                                        style={{border: '0px', height: 565, width: 650}}
                                        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation allow-downloads"
                                        scrolling="auto"
                                    />
                                </Box>
                                <Grid container item direction="row" alignItems="center" justifyContent="center"
                                      sx={{mt: 2, mb: 3}}>
                                    <Button variant={"outlined"} color={'error'} size="large"
                                            sx={{fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={start}
                                    >
                                        Start
                                    </Button>
                                    <Button variant={"outlined"} color={'error'} size="large"
                                            sx={{ml: 4, fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={stop}
                                    >
                                        Pause
                                    </Button>
                                    <Button variant={"outlined"} color={"error"} size="large"
                                            sx={{ml: 4, fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={stop}
                                    >
                                        Stop
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center"
                          sx={{width: 550}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <SelfImprovementIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'HWE'}}>
                                AI Coach
                            </Typography>
                        </Grid>
                        <Card sx={{width: 500, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="center">
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start"
                                      sx={{mt: 2, mb: 1, ml: 2}}>
                                    <Box sx={{position: 'relative', display: 'inline-flex'}}>
                                        <CircularProgress variant="determinate"
                                                          value={status === "Not Start" ? 0 : (showIndex + 1) * 20}
                                                          color={"error"}/>
                                        <Box sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography variant="caption" component="div" color="text.secondary">
                                                {status === "Not Start" ? 0 : (showIndex + 1) * 20} %
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5"
                                                sx={{fontWeight: 'bold', lineHeight: 1.5, m: 2, fontFamily: 'HWE'}}>
                                        {showIndex <= imgs.length - 1 ? imgs[showIndex].label : imgs[0].label}
                                    </Typography>
                                    {showIndex < imgs.length - 1
                                        ? <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            lineHeight: 1.5,
                                            ml: 23,
                                            fontFamily: 'HWE'
                                        }}> >> Next: {imgs[showIndex + 1].label} </Typography>
                                        : <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            lineHeight: 1.5,
                                            ml: 23,
                                            fontFamily: 'HWE'
                                        }}> </Typography>
                                    }
                                </Grid>
                                <Grid item sx={{mt: 1}}>
                                    <div className="ReactCarousel">
                                        <div className="contain">
                                            {showIndex===imgs.length
                                            ? <ul className="ul"> <li className= 'show' key={0}><img src={imgs[0].imgPath}/></li></ul>
                                            : <ul className="ul">
                                                {imgs.map((value, index) => {
                                                    return (
                                                        <li className={index === showIndex ? 'show' : ''}
                                                            key={index}>
                                                            <img src={value.imgPath}/>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            }
                                            {showIndex===imgs.length
                                            ? <ul className="dots" style={{width: imgs.length * 20 + 'px'}}> <li className= 'active' key={0} onClick={() => {change(0)}}> <img src={imgs[0].imgPath}/> </li></ul>
                                            : <ul className="dots" style={{width: imgs.length * 20 + 'px'}}>
                                                {imgs.map((value, index) => {
                                                    return (
                                                        <li key={index}
                                                            className={index === showIndex ? 'active' : ''}
                                                            onClick={() => {
                                                                change(index)
                                                            }}></li>
                                                    )
                                                })}
                                            </ul>
                                            }
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                        <Card sx={{width: 500, mt: 2.5}}>
                            <Grid item sx={{mt: 1, ml: 4}}>
                                <img src={Calories} alt={""} width={450}/>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    } else if (topage === "SignIn") {
        return (<Navigate to="/SignIn" replace={true}/>)
    } else if (topage === "Home") {
        return (<Navigate to="/Home" replace={true}/>)
    }
};

export default Working_Yoga;
