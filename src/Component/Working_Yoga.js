import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
//import React from "react";
import sport_video from './Sport_video.js';
import Calories from '../Picture/Calories_Chart.png';
import Mountain from '../Picture/Yoga_Ai.png'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import React, {useState, useEffect} from "react";

import cookie from "react-cookies";

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://localhost:80/';


function Working_Yoga(){
    const [topage, setTopage] = React.useState("");
    const location = useLocation();
    const motion = location.state
    console.log('motion:' + motion.url);
    const [workout, setWorkout] = React.useState("");
    const [practice, setPractice] = React.useState("");

    useEffect(()=>{
      console.log("------------------");
      console.log('workout:' + workout);
      console.log('practice:' + practice);
      const user_id=cookie.load('user_id');
      const token=cookie.load('token');
      console.log('token:' + token);
      if (workout===""){
          const workout_data = {
            label: user_id + "_" + new Date().toString()
          }
          axios.post(server+"exercise/workouts/",workout_data,{headers:{"Content-Type":'application/json','Authorization':'Token ' + token}}).then(function (response) {
          console.log("response: ",response);
          if(response.status===201){
              setWorkout(response.data.url);
              console.log('workout:' + response.data.url);
              console.log('workout:' + workout);
              if (practice===""){
                const practice_data = {
                    workout:response.data.url,
                    motion:motion.url
                  }
                 axios.post(server+"exercise/practices/",practice_data,{headers:{"Content-Type":'application/json','Authorization':'Token ' + token}}).then(function (response) {
                  console.log("response: ",response);
                  if(response.status===201){
                      setPractice(response.data.url);
                  }else{
                      console.log("Fail");
                  }
                  })
              }
          }else{
              console.log("Fail");
          }
          })
      } else{
         if (practice===""){
            const practice_data = {
                workout:workout,
                motion:motion.url
              }
             axios.post(server+"exercise/practices/",practice_data,{headers:{"Content-Type":'application/json','Authorization':'Token ' + token}}).then(function (response) {
              console.log("response: ",response);
              if(response.status===201){
                  setPractice(response.data.url);
              }else{
                  console.log("Fail");
              }
              })
          }
      }

    },[]);
    return(
        <div className="Working_Yoga">
            <AppHeader/>
            <Grid container direction="row" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ ml: 2, mt: 4, mr:2, mb: 4 }}>
                {/*<Grid container item direction="column" alignItems="flex-start" justifyContent="center" sx={{ width: 750 }}>
                    <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto">
                        <VideoCameraFrontIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5 }}>
                            LIVE Camera
                        </Typography>
                    </Grid>
                    <Card sx={{ width: 750, mt: 3, mb: 2 }}>
                        <Grid container item direction="column" alignItems="center" justifyContent="center" >
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" sx={{mt:2,mb:2}}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={80} color={"error"}/>
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
                                            80%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, m: 2 }} >
                                    {data.name}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.5, ml: 48 }} >
                                    >> Next: Triangle
                                </Typography>
                            </Grid>
                            <Box>
                                <iframe
                                    title="sport_video"
                                    srcDoc={sport_video}
                                    style={{  border: '0px', height: 500, width: 650 }}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    scrolling="auto"
                                />
                            </Box>
                            <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto" sx={{mt:2, mb:3}}>
                                <Button variant={"outlined"} color={'error'} size="large" sx={{fontWeight: 'bold'}}>
                                    Pause
                                </Button>
                                <Button variant={"outlined"} color={"error"} size="large" sx={{ml:8, fontWeight: 'bold'}}>
                                    Stop
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>*/}
                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 7, width: 750 }}>
                    <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto">
                        <SelfImprovementIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5 }}>
                            AI Coach
                        </Typography>
                    </Grid>
                    <Card sx={{ width: 750, mt: 3, mb: 2 }}>
                        <Grid container item direction="column" alignItems="center" justifyContent="center" >
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" sx={{ml: 2, mt: 2}}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={80} color={"error"}/>
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
                                            80%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, m: 2 }} >
                                    {motion.name}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.5, ml: 48 }} >
                                    >> Next: Triangle
                                </Typography>
                            </Grid>
                            <Grid item sx={{ml: 2, mt: 1}}>
                                <img src={motion.demo} alt={""} width={250}/>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card sx={{ width: 750, mt: 2.5 }}>
                        <Grid item sx={{ml: 20, mt: 1}}>
                            <img src={Calories} alt={""} width={450}/>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Working_Yoga;
