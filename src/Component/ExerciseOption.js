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
import MakeSchedule from "./MakeSchedule";
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://127.0.0.1:8000';

function ExerciseOption() {
    const [topage, setTopage] = React.useState("");
    useEffect(()=>{
        // if(!cookie.load('user_id')){
        //     history.push({pathname:"/SignIn",state:{}});
        //     setTopage("SignIn")
        // }
    })
    const Moutain_Go_Button = () => {
        history.push({pathname:"/MakeSchedule",state:{}});
        setTopage("MakeSchedule");
    };
    if(topage===""){
        return(
            <div className="ExerciseOption">
                <AppHeader/>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 5, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, mb: 3}}>
                            Most Popular
                        </Typography>
                        <Card sx={{width:1300 }}>
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                                <img src={Mountain} alt={"Mountain"} width="200" />
                                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:500 }}>
                                        Mountain
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt:5, width:500 }}>
                                        10 mins
                                        <br/>
                                        5 times a week
                                    </Typography>
                                </Grid>
                                <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 200 }}>
                                        <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                        6.1K
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt:1, width: 200 }}>
                                        CALORIES BURNT
                                    </Typography>
                                </Grid>
                                <Button variant="contained" sx={{ ml: 2, mr: 2, fontSize: 'h5.fontSize'}} size="large" color="error" onClick={Moutain_Go_Button}>
                                    Go
                                    <BoltIcon fontSize="large" />
                                </Button>
                            </Grid>
                        </Card>
                        <Card sx={{width:1300, mt: 3}}>
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                                <img src={Mountain} alt={"Mountain"} width="200" />
                                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:500 }}>
                                        Mountain
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt:5, width:500 }}>
                                        10 mins
                                        <br/>
                                        5 times a week
                                    </Typography>
                                </Grid>
                                <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 200 }}>
                                        <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                        6.1K
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt:1, width: 200 }}>
                                        CALORIES BURNT
                                    </Typography>
                                </Grid>
                                <Button variant="contained" sx={{ ml: 2, mr: 2, fontSize: 'h5.fontSize'}} size="large" color="error">
                                    Go
                                    <BoltIcon fontSize="large" />
                                </Button>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid container item direction="column" alignItems="center" justifyContent="center"  sx={{ mt: 3, mr: 2, mb: 4}}>
                        <Typography variant="h4" color="error" sx={{ml: 5, fontWeight: 'bold', lineHeight: 1.5, mb: 3}}>
                            New Yoga
                        </Typography>
                        <PicList />
                    </Grid>
                </Grid>
                <Footer/>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="MakeSchedule"){
        return <Navigate to="/MakeSchedule" replace={true} />
    }
}

export default ExerciseOption;
