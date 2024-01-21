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
import {Navigate} from "react-router-dom";

import axios from 'axios';
import MakeSchedule from "./MakeSchedule";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Tree from "../Picture/Yoga_Tree.png";
import ImageListItemBar from "@mui/material/ImageListItemBar/ImageListItemBar";
import dayjs from "dayjs";
import UnlockNewActivityDialog from './UnlockNewActivityDialog';
import ExerciseTooltip from './ExerciseTooltip';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';


function CampaignScoreUserList()  {
      console.log("CampaignScoreUserList component rendering");
      const [campaignScores, setCampaignScores] = React.useState([]);
      const [topage, setTopage] = React.useState("");
      const [userToken, setUserToken] = React.useState(null);
      const [popular_exercises, setPopular_exercises] = React.useState([])
      const [yoga_exercises, setYoga_exercises] = React.useState([])
      const [path, setPath] = React.useState("")
      const [popular_pageid, setPopular_id] = React.useState(1)
      const [popular_showlist, setPopular_showlist] = React.useState([])

      const backgroundStyle = {
            position: 'relative',
            minHeight: '100vh'
        };

      const overlayStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('/20240131_GDT_ANNUALPARTY.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
        };

      function formatScore(score) {
            if (score >= 1000) {
                return (score / 1000).toFixed(1) + "K";
            } else {
                return score;
            }
      }

      useEffect(() => {
                if(!cookie.load('user_id')){
                    history.push({pathname:"/SignIn",state:{}});
                    setTopage("SignIn")
                }else{
                    setUserToken(cookie.load("token"));
                }
      }, []);

      useEffect(() => {
        // Construct the API URL using startDate, endDate, and exerciseId

        const startDate='2024-01-15';
        const endDate='2024-01-20';
        const exerciseId=16;
        const apiUrl = `https://wellbeing.htcangelfund.com/api/exercise/user_exercise_rankings/?start_date=${startDate}&end_date=${endDate}&exercise_id=${exerciseId}`;
        console.log("userToken",userToken);
        console.log("apiUrl",apiUrl);
        console.log("Topage",topage);
        // Call the API to fetch campaign scores
        const fetchData = async () => {
          try {
            const response = await axios.get(apiUrl,{
                            headers: {
                                "Content-Type": 'application/json',
                                "Authorization": "Token " + userToken
                            }
                        });
            console.log("response",response);
            setCampaignScores(response.data);
          } catch (error) {
            console.error("Failed to fetch campaign scores:", error.response);
          }
        };

        fetchData();
      }, [userToken]);

      if(topage===""){
        return(
            <div className="CampaignScoreUserList" style={backgroundStyle}>
                <div style={overlayStyle}></div>
                <UnlockNewActivityDialog setPath={setPath} setTopage={setTopage} exercisesList={popular_showlist}/>
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Typography variant="h3" sx={{
                                fontWeight: 'bold',
                                lineHeight: 1.5,
                                fontFamily: 'MSYH',
                                color: 'red',
                                textShadow: '2px 2px black',
                                padding: '5px',
                                textAlign: 'left',
                                marginBottom: '60px',
                                marginTop: '20px'
                            }}>
                                Union - GDT Annual Party 2023 Wellbeing Score Leaderboard
                            </Typography>
                </Grid>
                {/* 外部居中的div */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    {/* 排名列表的容器 */}
                    <div style={{ maxWidth: '1000px', width: '100%' }}>
                        {campaignScores.slice(0, 100).map((user, index) => (
                            <div key={user.pk} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                                <Typography variant="h3" style={{ textAlign: 'left', fontFamily: 'MSYH' ,marginBottom:
                                '20px',}}>
                                    Top {index + 1}: {user.username} - {formatScore(user.exercise_score)} Score
                                </Typography>
                                {/* Add like button and logic here */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/" replace={true} />
    }
}

export default CampaignScoreUserList;
