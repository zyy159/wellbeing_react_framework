import React, {useEffect} from "react";
import history from "../Tool/history";
import Footer from '../Tool/Footer';
import AppHeader from '../Tool/App_Header';
import Mountain from "../Picture/Yoga_Mountain.png";
import PicList from "../Tool/ExerciseOption_PicList";

import Card from '@mui/material/Card';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Button from "@mui/material/Button";
import BoltIcon from '@mui/icons-material/Bolt';
import cookie from "react-cookies";
import {Navigate} from "react-router";

import axios from 'axios';
import dayjs from "dayjs";
import MakeSchedule from "./MakeSchedule";
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://47.97.104.79/';

function ExerciseOption() {
    const [topage, setTopage] = React.useState("");
    const [popular_exercises, setPopular_exercises] = React.useState([])
    const [yoga_exercises, setYoga_exercises] = React.useState([])

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            axios.get(server+"exercise/exercises/",{headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
                const exercise_num = response.data['count']
                const exercise_list = response.data['results']
                const yoga_exercises_Array = [...yoga_exercises];
                const popular_exercises_Array = [...popular_exercises];
                for(let i = 0; i < exercise_num; i++){
                    const exercise = exercise_list[i]
                    if(exercise['category'] === "yoga"){
                        let j = yoga_exercises_Array.length
                        yoga_exercises_Array[j] = exercise
                    }else{
                        let j = popular_exercises_Array.length
                        popular_exercises_Array[j] = exercise
                    }
                }
                setYoga_exercises(yoga_exercises_Array)
                setPopular_exercises(popular_exercises_Array)
            })
        }
    },[])
    const Moutain_Go_Button = () => {
        history.push({pathname:"/MakeSchedule",state:{}});
        setTopage("MakeSchedule");
    };
    if(topage===""){
        return(
            <div className="ExerciseOption">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 5, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, mb: 3, fontFamily: 'HWE'}}>
                            Most Popular
                        </Typography>
                        {popular_exercises.map((popular_exercise) => (
                            <Card sx={{width:1300 }}>
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                                    <img src={Mountain} alt={"Mountain"} width="200" />
                                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:500, fontFamily: 'HWE' }}>
                                            {popular_exercises['name']}
                                        </Typography>
                                        <Typography variant="h5" sx={{ mt:5, width:500, fontFamily: 'HWE' }}>
                                            {popular_exercises['duration']/60} mins
                                            <br/>
                                            {popular_exercises['popularity']} times a week
                                        </Typography>
                                    </Grid>
                                    <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                        <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 200, fontFamily: 'HWE', ml:3 }}>
                                            <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                            {popular_exercises['calories']}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt:1, width: 200, fontFamily: 'HWE' }}>
                                            CALORIES BURNT
                                        </Typography>
                                    </Grid>
                                    <Button variant="contained" sx={{ ml: 2, mr: 2, fontSize: 'h5.fontSize', fontFamily: 'HWE'}}
                                            size="large" color="error" onClick={Moutain_Go_Button}
                                    >
                                        Go
                                        <BoltIcon fontSize="large" />
                                    </Button>
                                </Grid>
                            </Card>
                        ))}
                    </Grid>
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 3, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, mb: 3, fontFamily: 'HWE'}}>
                            New Yoga
                        </Typography>
                        <PicList />
                    </Grid>
                </Grid>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="MakeSchedule"){
        return <Navigate to="/MakeSchedule" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/Home" replace={true} />
    }
}

export default ExerciseOption;
