import React, {useEffect} from "react";
import history from "../Tool/history";
import Footer from '../Tool/Footer';
import AppHeader from '../Tool/App_Header';
import Mountain from "../Picture/Yoga_Mountain.png";

import Card from '@mui/material/Card';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Pagination from '@mui/material/Pagination';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Button from "@mui/material/Button";
import BoltIcon from '@mui/icons-material/Bolt';
import cookie from "react-cookies";
import {Navigate} from "react-router";

import axios from 'axios';
import MakeSchedule from "./MakeSchedule";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Tree from "../Picture/Yoga_Tree.png";
import ImageListItemBar from "@mui/material/ImageListItemBar/ImageListItemBar";
import dayjs from "dayjs";
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function ExerciseOption() {
    const [topage, setTopage] = React.useState("");
    const [popular_exercises, setPopular_exercises] = React.useState([])
    const [yoga_exercises, setYoga_exercises] = React.useState([])
    const [path, setPath] = React.useState("")
    const [popular_pageid, setPopular_id] = React.useState(1)
    const [popular_showlist, setPopular_showlist] = React.useState([])

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            const yoga_exercises_Array = [...yoga_exercises];
            const popular_exercises_Array = [...popular_exercises];
            axios.get(server+"exercise/exercises/",{headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
                const exercise_num = response.data['count']
                const exercise_list = response.data['results']
                for(let i = 0; i < exercise_num; i++){
                    const exercise = exercise_list[i];
                    const exercise_json = JSON.parse(JSON.stringify(exercise));
                    //console.log(exercise_json)
                    if(exercise['category'] === "yoga"){
                        let j = yoga_exercises_Array.length
                        yoga_exercises_Array[j] = exercise_json;
                    }else{
                        let j = popular_exercises_Array.length
                        popular_exercises_Array[j] = exercise_json;
                    }
                }
                //console.log(popular_exercises_Array)
                setYoga_exercises(yoga_exercises_Array)
                setPopular_exercises(popular_exercises_Array)
                setPopular_showlist(popular_exercises_Array.slice(0,5))
            })
        }
    },[])
    const pagination_change = (event, value) => {
        setPopular_id(value);
        const yoga_exercises_Array = popular_exercises.slice((value-1)*5, value*5)
        setPopular_showlist(yoga_exercises_Array)
    };
    if(topage===""){
        return(
            <div className="ExerciseOption">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 5, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                            Most Popular
                        </Typography>
                        {popular_showlist.map((popular_exercise) => (
                            <Card sx={{width:1500, mt: 3 }}>
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                                    <img src={Mountain} alt={"Mountain"} width="200" />
                                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:500, fontFamily: 'MSYH' }}>
                                            {popular_exercise.name}
                                        </Typography>
                                        <Typography variant="h5" sx={{ mt:5, width:500, fontFamily: 'MSYH' }}>
                                            {popular_exercise.duration/60} mins
                                            <br/>
                                            {popular_exercise.popularity} times a week
                                        </Typography>
                                    </Grid>
                                    <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                        <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 200,
                                        fontFamily: 'MSYH', ml:3 }}>
                                            <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                            {popular_exercise.calories}K
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt:1, width: 200, fontFamily: 'MSYH' }}>
                                            CALORIES BURNT
                                        </Typography>
                                    </Grid>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Button variant="contained" sx={{ ml: 2, fontSize: 'h5.fontSize', fontFamily: 'MSYH' }}
                                          size="large" color="error"
                                          onClick={() => {
                                            const id = popular_exercise.id;
                                            setPath("/Working_Yoga?exercise=" + id);
                                            history.push({ pathname: path, state: {} });
                                            setTopage("Working_Yoga");
                                          }}
                                        >
                                          GO NOW
                                          <BoltIcon fontSize="large" />
                                        </Button>
                                        <Button variant="contained" sx={{ ml: 2, fontSize: 'h5.fontSize', fontFamily: 'MSYH' }}
                                          size="large" color="primary"
                                          onClick={() => {
                                            const id = popular_exercise.id;
                                            setPath("/MakeSchedule?exercise=" + id);
                                            history.push({ pathname: path, state: {} });
                                            setTopage("MakeSchedule");
                                          }}
                                        >
                                          PLAN
                                        </Button>
                                      </div>
                                </Grid>
                            </Card>
                        ))}
                        <Pagination count={Math.ceil(popular_exercises.length/5)} page={popular_pageid} onChange={pagination_change} sx={{mt:2}}/>
                    </Grid>
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 3, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, mb: 3, fontFamily: 'MSYH'}}>
                            New Yoga
                        </Typography>
                        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{width:1310 }}>
                            <ImageList>
                                <Grid container direction="row" alignItems="center" justifyContent="center" sx={{width:1300 }}>
                                    {yoga_exercises.map((yoga_exercise) => (
                                        <ImageListItem sx={{width: 280, mr: 3}}>
                                            <img src={Tree} alt={"Tree"} />
                                            <ImageListItemBar
                                                title="Tree"
                                                subtitle= {yoga_exercise.duration/60 + "mins · "+ yoga_exercise.calories +"K Calorie"}
                                                actionIcon={
                                                    <Button sx={{ color:"#ffffff", fontFamily: 'MSYH' }}
                                                        onClick={() => {
                                                            const id = yoga_exercise.id
                                                            // const name = yoga_exercise.name.replaceAll(" ","_")
                                                            setPath("/MakeSchedule?exercise="+id)
                                                            history.push({pathname:path, state:{}});
                                                            setTopage("MakeSchedule");
                                                        }}
                                                    >
                                                        <BoltIcon />
                                                        Go
                                                    </Button>
                                                }
                                                sx={{ fontFamily: 'MSYH' }}
                                            />
                                        </ImageListItem>
                                    ))}
                                </Grid>
                            </ImageList>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="MakeSchedule"){
        return <Navigate to={path} replace={true} />
    }else if(topage==="Working_Yoga"){
        return <Navigate to={path} replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/Home" replace={true} />
    }
}

export default ExerciseOption;
