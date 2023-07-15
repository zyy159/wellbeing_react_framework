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
import {Navigate} from "react-router";

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://47.97.104.79/';

function Yoga(){
    const [topage, setTopage] = React.useState("");
    const [data, setData] = useState([]);
    const [motions, setMotions] = useState([]);
    const [motion, setMotion] = useState([]);

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }
    },[])

    if(topage===""){
        return (
            <div className="Yoga_Page">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ ml: 2, mt: 4, mr:2, mb: 4 }}>
                    <Card sx={{ width: 900}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                            <img src={Mountain} alt={"Mountain"} width="200" />
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:200, fontFamily: 'HWE' }}>
                                    Mountain
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'HWE' }}>
                                    Get started at anywhere
                                </Typography>
                            </Grid>
                            <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'HWE' }}>
                                    <LocalFireDepartmentIcon color={"error"}/>
                                    6.1K
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'HWE' }}>
                                    CALORIES BURNT
                                </Typography>
                            </Grid>
                            <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'HWE'}} color="error">
                                Go
                                <BoltIcon variant="small" />
                            </Button>
                        </Grid>
                    </Card>
                    <Card sx={{ mt:4, width: 900 }}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                            <img src={Tree} alt={"Tree"} width="200"/>
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:200, fontFamily: 'HWE' }}>
                                    Tree
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'HWE' }}>
                                    Relax your body in 2 mins
                                </Typography>
                            </Grid>
                            <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'HWE' }}>
                                    <LocalFireDepartmentIcon color={"error"}/>
                                    7.2K
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'HWE' }}>
                                    CALORIES BURNT
                                </Typography>
                            </Grid>
                            <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'HWE' }} color="error">
                                Go
                                <BoltIcon variant="small" />
                            </Button>
                        </Grid>
                    </Card>
                    <Card sx={{ mt:4, width: 900 }}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" >
                            <img src={Triangle} alt={"Triangle"} width="200"/>
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:200, fontFamily: 'HWE' }}>
                                    Triangle
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'HWE' }}>
                                    Next step to try
                                </Typography>
                            </Grid>
                            <Grid container item direction="column" alignItems="center" justifyContent="flex-start" xs="auto" sx={{ml: 24}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'HWE' }}>
                                    <LocalFireDepartmentIcon color={"error"}/>
                                    8.3K
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'HWE' }}>
                                    CALORIES BURNT
                                </Typography>
                            </Grid>
                            <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'HWE' }} color="error">
                                Go
                                <BoltIcon variant="small" />
                            </Button>
                        </Grid>
                    </Card>
                    <Card sx={{ mt:4, width: 900 }}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto">
                            <img src={Holdhand} alt={"Holdhand"} width="200"/>
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5 , width:200, fontFamily: 'HWE' }}>
                                    Holdhand
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'HWE' }}>
                                    Try to control your breath
                                </Typography>
                            </Grid>
                            <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24, width: 100}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'HWE' }}>
                                    <LocalFireDepartmentIcon color={"error"}/>
                                    9.4K
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'HWE' }}>
                                    CALORIES BURNT
                                </Typography>
                            </Grid>
                            <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'HWE'}} color="error">
                                Go
                                <BoltIcon variant="small" />
                            </Button>
                        </Grid>
                    </Card>

                    <Card sx={{ mt:4, width: 900 }}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" >
                            <img src={Chair} alt={"Chair"} width="200" />
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 4}}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:200, fontFamily: 'HWE' }}>
                                    Chair
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width:200, fontFamily: 'HWE' }}>
                                    Your are almost there!!!
                                </Typography>
                            </Grid>
                            <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120, fontFamily: 'HWE' }}>
                                    <LocalFireDepartmentIcon color={"error"}/>
                                    10.1K
                                </Typography>
                                <Typography variant="h7" sx={{ mt:1, width: 140, fontFamily: 'HWE' }}>
                                    CALORIES BURNT
                                </Typography>
                            </Grid>
                            <Button variant="contained" sx={{ ml: 3, mr: 2, fontSize: 'h6.fontSize', fontFamily: 'HWE'}} color="error">
                                Go
                                <BoltIcon variant="small" />
                            </Button>
                        </Grid>
                    </Card>
                </Grid>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/Home" replace={true} />
    }
};

export default Yoga;
