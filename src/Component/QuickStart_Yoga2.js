import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
import Chair from '../Picture/Yoga_Chair.png';
import Holdhand from '../Picture/Yoga_Holdhand.png';
import Mountain from '../Picture/Yoga_Mountain.png';
import Triangle from '../Picture/Yoga_Triangle.png';
import Tree from '../Picture/Yoga_Tree.png';
import React, {useState, useEffect} from "react";

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
const server = 'http://localhost:80/';


console.log("**********");

function Yoga(){
    const [topage, setTopage] = React.useState("");
    const [motions, setMotions] = useState([]);
    const [motion, setMotion] = useState([]);
    console.log("---------");

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }

        const fetchData = async () => {
          const result = await axios(
            server + 'exercise/motions/',
          ).then(response => {
            setMotions(response.data.results);
            console.log(response.data.results);
          });
        };
        console.log("motions:" + motions);
        if (motions==""){
            console.log("motions is null, fetch motions.");
            fetchData();
        } else {
            console.log("motions is not null, don't fetch motions.");
        }
    },[]);

    if(topage===""){

    return (
            <div className="Yoga_Page">
                <AppHeader/>
                <Grid container direction="column" alignItems="center" justifyContent="center" item xs="auto" sx={{ ml: 2, mt: 4, mr:2, mb: 4 }}>
                    {motions.map(item => (
//                        console.log(item.id),
                        <Motion
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            demo={item.demo}
                            url={item.url}
                            setTopage={setTopage}
                            setMotion={setMotion}
                        />
                      ))}
                </Grid>
                <Footer/>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Working_Yoga"){
        return <Navigate to="/Working_Yoga" state={motion} replace={true} />
    }
};

function Motion(props) {
    return <Card sx={{ width: 900}}>
                <Grid container item direction="row" alignItems="center" justifyContent="flex-start" item xs="auto">
                    <img src={props.demo} alt={"Mountain"} width="200" />
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" item xs="auto" sx={{ml: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:200 }}>
                            {props.name}
                        </Typography>
                        <Typography variant="h7" sx={{ mt:1, width:200 }}>
                            {props.description}
                        </Typography>
                    </Grid>
                    <Grid container item direction="column" alignItems="center" justifyContent="center" item xs="auto" sx={{ml: 24}}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width: 120 }}>
                            <LocalFireDepartmentIcon color={"error"}/>
                            6.1K
                        </Typography>
                        <Typography variant="h7" sx={{ mt:1, width: 130 }}>
                            CALORIES BURNT
                        </Typography>
                    </Grid>
                    <Button variant="contained" sx={{ ml: 4, mr: 2, fontSize: 'h6.fontSize'}} color="error"
                        onClick={() => {
                          let data = {
                            id:props.id,
                            name:props.name,
                            description:props.description,
                            demo:props.demo,
                            url:props.url
                          };
                          console.log(data);
                          history.push({pathname:"/Working_Yoga", state:data});
                          props.setMotion(data)
                          props.setTopage("Working_Yoga");
                        }}
                    >
                        Go
                        <BoltIcon variant="small" />
                    </Button>
                </Grid>
            </Card>
};

export default Yoga;