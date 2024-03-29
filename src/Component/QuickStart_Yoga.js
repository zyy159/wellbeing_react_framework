import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
import Chair from '../Picture/Yoga_Chair.png';
import Holdhand from '../Picture/Yoga_Holdhand.png';
import Mountain from '../Picture/Yoga_Mountain.png';
import Triangle from '../Picture/Yoga_Triangle.png';
import Tree from '../Picture/Yoga_Tree.png';
import React, {useEffect, useState} from "react";

import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import cookie from "react-cookies";
import history from "../Tool/history";
import {Navigate} from "react-router-dom";

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function Yoga(){
    const [topage, setTopage] = React.useState("");
    const [yoga_exercises, setYoga_exercises] = React.useState([])

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            const yoga_exercises_Array = [...yoga_exercises];
            axios.get(server+"exercise/exercises/",{headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
                const exercise_num = response.data['count']
                const exercise_list = response.data['results']
                console.log(exercise_list)
                for(let i = 0; i < exercise_num; i++){
                    const exercise = exercise_list[i];
                    const exercise_json = JSON.parse(JSON.stringify(exercise));
                    if(exercise['category'] === "yoga"){
                        let j = yoga_exercises_Array.length
                        yoga_exercises_Array[j] = exercise_json;
                    }
                }
                setYoga_exercises(yoga_exercises_Array)
            })
        }
    },[])

    if(topage===""){
        return (
            <div className="Yoga_Page">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ ml: 2, mt: 6, mr:2, mb: 4 }}>
                    {yoga_exercises.map((popular_exercise) => (
                        <Card sx={{ width: 900, mb:3}}>
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                                <img src={Mountain} alt={"Mountain"} width="200" />
                                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:300, fontFamily: 'MSYH' }}>
                                        {popular_exercise.name}
                                    </Typography>
                                    <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'MSYH' }}>
                                        Get started at anywhere
                                    </Typography>
                                </Grid>
                                <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 10}}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'MSYH' }}>
                                        <LocalFireDepartmentIcon color={"error"}/>
                                        {popular_exercise.calories}
                                    </Typography>
                                    <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'MSYH' }}>
                                        CALORIES BURNT
                                    </Typography>
                                </Grid>
                                <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'MSYH'}} color="error">
                                    Go
                                    <BoltIcon variant="small" />
                                </Button>
                            </Grid>
                        </Card>
                    ))}
                </Grid>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/" replace={true} />
    }
};

export default Yoga;
