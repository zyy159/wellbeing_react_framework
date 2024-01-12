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
import IconButton from '@mui/material/CardContent';
import FastForwardSharpIcon from '@mui/icons-material/FastForwardSharp';
import Diversity3SharpIcon from '@mui/icons-material/Diversity3Sharp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import {Navigate} from "react-router-dom";
import Box from '@mui/material/Box';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Snackbar from '@mui/material/Snackbar';
// import moment from 'moment';
import { Line } from 'react-chartjs-2';
import {CategoryScale, Chart,LinearScale,PointElement,LineElement} from 'chart.js';
import { Link as RouterLink } from 'react-router-dom';
// import Canvas2Image from "canvas2image"; // 导入用于将 Canvas 转化为图片的库
import QRCode from 'qrcode'; // 导入 qrcode 库

import cookie from 'react-cookies';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import MembershipRule from './MembershipRule'; // 根据您的文件结构更新路径
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CloseIcon from '@mui/icons-material/Close';

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
dayjs.extend(utc);

function Home() {
    const [topage, setTopage] = React.useState("Home");
    const [exerciseId, setExerciseId] = React.useState(null);
    const [userToken, setUserToken] = React.useState(null);
    const [wellbeing_level, setWellbeing_level] = React.useState(null);
    const [total_time, setTotal_time] = React.useState("");
    const [total_score, setTotal_score] = React.useState(0);
    const [total_likes, setTotal_likes] = React.useState(0);
    const [likes_received, setlikes_received] = React.useState(0);
    const [invitationCode, setInvitationCode] = React.useState(null);
    const [upcomingPlans, setUpcomingPlans] = React.useState([]);
    const [badgeData, setBadgeData] = React.useState(null);
    const [userProfile, setUserProfile] = React.useState(null);
    const [userRanking, setUserRanking] = React.useState([]);
    const [userLikees, setuserLikees] = React.useState([]);
    const [userScore, setUserScore] = React.useState([]);
    const [userCalorie, setUserCalorie] = React.useState([]);
    const [userTime, setUserTime] = React.useState([]);
    const [userInvites, setUserInvites] = React.useState([]);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarPosition, setSnackbarPosition] = React.useState({ vertical: 'bottom', horizontal: 'left' });
    const [chartData, setChartData] = React.useState(null);
    const [maxScore, setmaxScore] = React.useState(0);
    const [maxCalories, setmaxCalories] = React.useState(0);
    const [showTooltip, setShowTooltip] = React.useState(false); // 是否显示提示
    const [showPoster, setShowPoster] = React.useState(false); // 是否显示海报
    const [posterImage, setPosterImage] = React.useState(null); // 海报图片
    const canvasRef = React.useRef(null);

    //const [hasLiked, setHasLiked] = React.useState(false);
    const options = {
        responsive: true,  // 让图表响应式
        maintainAspectRatio: false,  // 不保持宽高比
        scales: {
            'y-axis-1': {
                type: 'linear',
                position: 'left',
                max: maxScore * 5,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Actions Score',
                    color: 'rgb(75, 192, 192)'  // 与数据集同样的颜色
                },
                ticks: {
                    color: 'rgb(75, 192, 192)'  // 与数据集同样的颜色
                }
            },
            'y-axis-2': {
                type: 'linear',
                position: 'right',
                max: maxCalories * 5,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Calories Burned',
                    color: 'rgb(255, 99, 132)'  // 与数据集同样的颜色
                },
                ticks: {
                    color: 'rgb(255, 99, 132)'  // 与数据集同样的颜色
                }
            }
        },
    };

    function timeStringToSeconds(timeString) {
      //console.log("timeString", timeString);
      const dayMatch = timeString.match(/(\d+) days,/);
      const timeMatch = timeString.match(/(\d{1,2}):(\d{2}):(\d{2})\.\d+/);

      if (!timeMatch && !dayMatch) {
        console.log("Invalid timeMatch dayMatch format");
        return 0;
      }

      let days = 0;
      if (dayMatch) {
        days = parseInt(dayMatch[1], 10);
      }

      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const seconds = parseInt(timeMatch[3], 10);

        return (days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds;
      }

      return days * 24 * 3600;
    }


    function formatTime(seconds) {
        if (isNaN(seconds)) {
            console.error("formatTime was called with NaN");
            return "";
        }
        //console.log("formatTime(seconds)",seconds);
        const days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        const hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        const mnts = Math.floor(seconds / 60);
        seconds  -= mnts*60;

        if(days > 0) {
            return `${days} Days ${hrs} Hours`;
        } else if(hrs > 0) {
            return `${hrs} Hours ${mnts} Minutes`;
        } else if(mnts > 0) {
            return `${mnts} Minutes ${seconds} Seconds`;
        } else {
            return `${seconds} Seconds`;
        }
    }

    function formatScore(score) {
        if (score >= 1000) {
            return (score / 1000).toFixed(1) + "K";
        } else {
            return score;
        }
    }

    const formatLikes = (likes) => {
        return likes >= 1000 ? (likes / 1000).toFixed(1) + 'K' : likes;
    };

    const handleMouseEnter = (userId) => {
    // 在这里可以执行鼠标悬停时的逻辑，如果需要的话
    };

    const handleMouseLeave = () => {
        // 在这里可以执行鼠标离开时的逻辑，如果需要的话
    };

    const UserRankinghandleLike = async (likee) => {
        try {
            //get current user ID
            const userresponse = await axios.get(server + "rest-auth/user/", {
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + userToken
                        }
                    });
            //console.log("userresponse",userresponse);

            const liker = userresponse.data.pk;
            let data = {
                liker: liker,
                likee: likee  // 使用传递进来的likee参数
            };
            await axios.post(server + "exercise/like/", data, {
                headers: {"Content-Type": 'application/json', "Authorization": "Token " + userToken}
            });

            // 更新点赞数和hasLiked状态
            const updatedRanking = userRanking.map(user =>
                user.pk === likee
                    ? {...user, likes_received: user.likes_received + 1, hasLiked: true}
                    : user
            );
            setUserRanking(updatedRanking);
            // 重新获取用户排名
            //await fetchUserRanking();
        } catch (error) {
            console.error("Failed to like:", error.response);
            setSnackbarMessage(error.response.data.error  || "Failed to like"); // Set the error message
            setSnackbarOpen(true); // Open the Snackbar with the new message
        }
    };

    const UserScorehandleLike = async (likee) => {
        try {
            //get current user ID
            const userresponse = await axios.get(server + "rest-auth/user/", {
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + userToken
                        }
                    });
            //console.log("userresponse",userresponse);

            const liker = userresponse.data.pk;
            let data = {
                liker: liker,
                likee: likee  // 使用传递进来的likee参数
            };
            await axios.post(server + "exercise/like/", data, {
                headers: {"Content-Type": 'application/json', "Authorization": "Token " + userToken}
            });

            // 更新点赞数和hasLiked状态
            const updatedRanking = userScore.map(user =>
                user.pk === likee
                    ? {...user, likes_received: user.likes_received + 1, hasLiked: true}
                    : user
            );
            setUserScore(updatedRanking);
            // 重新获取用户排名
            //await fetchUserRanking();
        } catch (error) {
            console.error("Failed to like:", error.response);
            setSnackbarMessage(error.response.data.error  || "Failed to like"); // Set the error message
            setSnackbarOpen(true); // Open the Snackbar with the new message
        }
    };

    const UserInviteshandleLike = async (likee) => {
        try {
            //get current user ID
            const userresponse = await axios.get(server + "rest-auth/user/", {
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + userToken
                        }
                    });
            //console.log("userresponse",userresponse);

            const liker = userresponse.data.pk;
            let data = {
                liker: liker,
                likee: likee  // 使用传递进来的likee参数
            };
            await axios.post(server + "exercise/like/", data, {
                headers: {"Content-Type": 'application/json', "Authorization": "Token " + userToken}
            });

            // 更新点赞数和hasLiked状态
            const updatedRanking = userInvites.map(user =>
                user.pk === likee
                    ? {...user, likes_received: user.likes_received + 1, hasLiked: true}
                    : user
            );
            setUserInvites(updatedRanking);
            // 重新获取用户排名
            //await fetchUserRanking();
        } catch (error) {
            console.error("Failed to like:", error.response);
            setSnackbarMessage(error.response.data.error  || "Failed to like"); // Set the error message
            setSnackbarOpen(true); // Open the Snackbar with the new message
        }
    };

    const MembershipUserList = ({ userRanking, UserRankinghandleLike }) => {
        return (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userRanking.slice(0, 100).map((user, index) => (
                    <div key={user.pk} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                        <Typography variant="subtitle1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                            Top {index + 1}: {user.username} - {formatScore(user.points)} points
                        </Typography>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton
                                onClick={() => UserRankinghandleLike(user.pk)}
                                size="small"
                                className="like-button" // 添加CSS类名
                                onMouseEnter={() => handleMouseEnter(user.pk)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <ThumbUpIcon sx={{ color: user.hasLiked ? 'pink' : 'grey' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: user.hasLiked ? 'pink' : 'grey' }}>
                                {formatLikes(user.likes_received)}
                            </Typography>
                            {errorMsg && (
                                <Typography variant="body2" sx={{ color: 'red' }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const ScoreUserList = ({ userScore, UserScorehandleLike }) => {
        return (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userScore.slice(0, 100).map((user, index) => (
                    <div key={user.pk} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                        <Typography variant="subtitle1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                            Top {index + 1}: {user.username} - {formatScore(user.total_score)} Score
                        </Typography>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton
                                onClick={() => UserScorehandleLike(user.pk)}
                                size="small"
                                className="like-button" // 添加CSS类名
                                onMouseEnter={() => handleMouseEnter(user.pk)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <ThumbUpIcon sx={{ color: user.hasLiked ? 'pink' : 'grey' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: user.hasLiked ? 'pink' : 'grey' }}>
                                {formatLikes(user.likes_received)}
                            </Typography>
                            {errorMsg && (
                                <Typography variant="body2" sx={{ color: 'red' }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    const CalorieUserList = ({ userCalorie, CalorieUserhandleLike }) => {
        return (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userCalorie.slice(0, 100).map((user, index) => (
                    <div key={user.pk} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                        <Typography variant="subtitle1" sx={{mt: 1, fontFamily: 'MSYH'}}>
                            Top {index + 1}: {user.username} - {formatScore(user.total_calories)} Calories
                        </Typography>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton
                                onClick={() => CalorieUserhandleLike(user.pk)}
                                size="small"
                                className="like-button" // 添加CSS类名
                                onMouseEnter={() => handleMouseEnter(user.pk)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <ThumbUpIcon sx={{ color: user.hasLiked ? 'pink' : 'grey' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: user.hasLiked ? 'pink' : 'grey' }}>
                                {formatLikes(user.likes_received)}
                            </Typography>
                            {errorMsg && (
                                <Typography variant="body2" sx={{ color: 'red' }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const InvitesUserList = ({ userInvites, UserInviteshandleLike}) => {
        return (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {userInvites.slice(0, 100).map((user,index) => (
                    <div key={user.pk} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <Typography variant="subtitle1" sx={{ mt: 1, fontFamily: 'MSYH' }}>
                            Top {index + 1}: {user.username} - {user.invites_sent} Invites
                        </Typography>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton
                                onClick={() => UserInviteshandleLike(user.pk)}
                                size="small"
                                className="like-button" // 添加CSS类名
                                onMouseEnter={() => handleMouseEnter(user.pk)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <ThumbUpIcon sx={{ color: user.hasLiked ? 'pink' : 'grey' }} />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: user.hasLiked ? 'pink' : 'grey' }}>
                                {formatLikes(user.likes_received)}
                            </Typography>
                            {errorMsg && (
                                <Typography variant="body2" sx={{ color: 'red' }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
            if(!cookie.load('user_id')){
                history.push({pathname:"/SignIn",state:{}});
                setTopage("SignIn")
            }else{
                setUserToken(cookie.load("token"));
            }
    }, []);

    const fetchUserRanking = async () => {
        try {
            const response = await axios.get(server + "exercise/userlist/?sortby=points", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
            //console.log("fetchUserRanking",response.data);
            if (response.data && Array.isArray(response.data)) {
                // 假设您有一个名为likers的数组，其中包含当前用户点赞过的用户的ID。
                // 如果不存在这样的数组，请根据您的数据结构调整这部分代码。


                // 更新每个用户的hasLiked状态
                const updatedUserRanking = response.data.map(user => ({
                    ...user,
                    // 如果当前用户点赞过此用户，则将hasLiked设置为true
                    hasLiked: userLikees.includes(user.pk)
                }));
                setUserRanking(updatedUserRanking);
            }
            //setUserRanking(response.data);
        } catch (error) {
            console.error("Failed to fetch user ranking:", error);
        }
    };

    const fetchUserScore = async () => {
        try {
            const response = await axios.get(server + "exercise/userlist/?sort_by=total_score", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
            if (response.data && Array.isArray(response.data)) {
                // 假设您有一个名为likers的数组，其中包含当前用户点赞过的用户的ID。
                // 如果不存在这样的数组，请根据您的数据结构调整这部分代码。


                // 更新每个用户的hasLiked状态
                const updatedUserScore = response.data.map(user => ({
                    ...user,
                    // 如果当前用户点赞过此用户，则将hasLiked设置为true
                    hasLiked: userLikees.includes(user.pk)
                }));
                setUserScore(updatedUserScore);
            }

        } catch (error) {
            console.error("Failed to fetch user score:", error);
        }
    };

    const fetchUserTime = async () => {
        try {
            const response = await axios.get(server + "exercise/userlist/?sort_by=total_time", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
            if (response.data && Array.isArray(response.data)) {
                // 假设您有一个名为likers的数组，其中包含当前用户点赞过的用户的ID。
                // 如果不存在这样的数组，请根据您的数据结构调整这部分代码。


                // 更新每个用户的hasLiked状态
                const updatedUserTime = response.data.map(user => ({
                    ...user,
                    // 如果当前用户点赞过此用户，则将hasLiked设置为true
                    hasLiked: userLikees.includes(user.pk)
                }));
                setUserTime(updatedUserTime);
            }

        } catch (error) {
            console.error("Failed to fetch user score:", error);
        }
    };

    const fetchUserCalorie = async () => {
        try {
            const response = await axios.get(server + "exercise/userlist/?sort_by=total_calories", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
            if (response.data && Array.isArray(response.data)) {
                // 假设您有一个名为likers的数组，其中包含当前用户点赞过的用户的ID。
                // 如果不存在这样的数组，请根据您的数据结构调整这部分代码。


                // 更新每个用户的hasLiked状态
                const updatedUserCalorie = response.data.map(user => ({
                    ...user,
                    // 如果当前用户点赞过此用户，则将hasLiked设置为true
                    hasLiked: userLikees.includes(user.pk)
                }));
                setUserCalorie(updatedUserCalorie);
            }

        } catch (error) {
            console.error("Failed to fetch user score:", error);
        }
    };

    const fetchUserInvites = async () => {
        try {
            const response = await axios.get(server + "exercise/userlist/?sort_by=invites_sent", {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": "Token " + userToken
                }
            });
            if (response.data && Array.isArray(response.data)) {
                // 更新每个用户的排名信息
                const updatedUserInvites = response.data.map((user, index) => ({
                    ...user,
                    hasLiked: userLikees.includes(user.pk),
                    invitesRank: index + 1
                }));
                setUserInvites(updatedUserInvites);
            }
        } catch (error) {
            console.error("Failed to fetch user invites:", error);
        }
    };
    const handleClosePoster = () => {
        // 关闭海报
        setShowPoster(false);
      };
    // 生成包含邀请码的链接并显示二维码
    const handleGeneratePoster = () => {
        const inviteLink = `https://wellbeing.htcangelfund.com/SignUp?invitecode=${invitationCode}`;
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");

        // 在 Canvas 上绘制文本和二维码
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";

        // 获取用户名并绘制在中间
        const username = cookie.load('user_id');

        ctx.fillText(username, canvas.width / 2, canvas.height / 2 - 10); // 垂直居中，稍微上移一些
        console.log("generateQRCodectx",ctx);
        console.log("generateQRCodecanvas",canvas);
        const options = {
                          color: {
                            dark: "#666666", // 红色作为暗色（填充）模块的颜色
                            light: "#FFFFFF" // 亮色（空白）模块的颜色，这里设置为白色
                          },
                          width: 200
                        };
        // 使用 qrcode 库生成二维码
        QRCode.toCanvas(canvas, inviteLink, options, (error) => {
            if (error) {
                console.error("Error generating QR code:", error);
            } else {
                // 将 Canvas 转换为图片并设置为海报图片
                const poster = canvas.toDataURL("image/png");
                // 创建一个新的Canvas元素
                const mergedCanvas = document.createElement("canvas");
                const mergedCtx = mergedCanvas.getContext("2d");



                // 设置新Canvas的宽度和高度
                const canvasWidth = 258;
                const canvasHeight = 350; // 可根据需要调整高度

                mergedCanvas.width = canvasWidth;
                mergedCanvas.height = canvasHeight;
                // 设置画布的背景
                const gradient = mergedCtx.createLinearGradient(0, 0, 0, canvasHeight);
                gradient.addColorStop(0, "#000000"); // 开始颜色
                gradient.addColorStop(1, "#999999"); // 结束颜色
                mergedCtx.fillStyle = gradient;
                mergedCtx.fillRect(0, 0, canvasWidth, canvasHeight);

//                // 绘制顶部文本 "Invitation"
//                mergedCtx.fillStyle = "red";
//                mergedCtx.font = "30px Arial";
//                mergedCtx.textAlign = "center";
//                mergedCtx.fillText("Invitation", canvas.width / 2, 30);

              // 获取用户名并绘制在中间
                let textstr = cookie.load('user_id');
                let textstrWidth = ctx.measureText(textstr).width;
                let textX = canvas.width / 2 - textstrWidth/2;
                mergedCtx.fillStyle = "white";
                mergedCtx.font = "26px Times New Roman";
                mergedCtx.fillText(textstr, textX, 30);

              // 绘制底部文本 "Invite you join the Wellbeing Gallery"
                textstr = "Invite you scan QRcode";
                textstrWidth = ctx.measureText(textstr).width;
                textX = canvas.width / 2 - textstrWidth/2;
                mergedCtx.fillStyle = "red";
                mergedCtx.font = "16px Times New Roman";
                mergedCtx.fillText(textstr, textX, 60);
                // 绘制底部文本 "Invite you join the Wellbeing Gallery"
                textstr = "To join the Wellbeing Gallery";
                textstrWidth = ctx.measureText(textstr).width;
                textX = canvas.width / 2 - textstrWidth/2;
                mergedCtx.fillStyle = "Burgundy";
                mergedCtx.font = "16px Times New Roman";
                mergedCtx.fillText(textstr, textX, 90);

                // 绘制生成的二维码图片
                const qrCodeImg = new Image();
                qrCodeImg.src = poster; // 假设posterImage是已生成的二维码图片
                qrCodeImg.onload = () => {
                  // 将二维码图片绘制到新Canvas的底部居中位置
                  const qrCodeWidth = 200; // 二维码图片的宽度
                  const qrCodeHeight = 200; // 二维码图片的高度
                  const qrCodeX = (canvasWidth - qrCodeWidth) / 2;
                  const qrCodeY = canvasHeight - qrCodeHeight - 20; // 底部居中位置，可根据需要调整纵坐标

                  mergedCtx.drawImage(qrCodeImg, qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                  // 将合并后的Canvas转换为图片
                  const mergedImage = mergedCanvas.toDataURL("image/png");


                  setPosterImage(mergedImage);
                  setShowPoster(true);
                  // 设置模态框的大小
                  const modalContent = document.querySelector(".poster-content");
                  if (modalContent) {
                    modalContent.style.width = "80%"; // 设置模态框宽度
                    modalContent.style.height = "80%"; // 设置模态框高度
                  }
                };
            }
        });
    };


    useEffect(() => {
            if(userToken && userLikees){
                fetchUserRanking();
                fetchUserScore();
                fetchUserTime();
                fetchUserInvites(); // 获取邀请排名
            }
    }, [userToken,userLikees]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let tmptoken = cookie.load("token")
                const response = await axios.get(server +'exercise/actions/',{
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
                const actions = response.data.results;
                const currentOwnerId = cookie.load('user_id');
                //const filteredActions = actions.filter(action => action.owner === currentOwnerId);
                const labels = actions.map(action => new Date(action.start_time).toLocaleDateString());
                const caloriesData = actions.map(action => action.calories);
                const scoreData = actions.map(action => action.score);
                const maxCalories = Math.max(...caloriesData);
                setmaxCalories(maxCalories);
                const maxScore = Math.max(...scoreData);
                setmaxScore(maxScore);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Calories',
                            data: caloriesData,
                            fill: false,
                            backgroundColor: 'rgb(75, 192, 192)',
                            borderColor: 'rgba(75, 192, 192, 0.2)',
                            yAxisID: 'y-axis-1',
                            tension: 0.4  // 添加此属性以使线条更加平滑
                        },
                        {
                            label: 'Score',
                            data: scoreData,
                            fill: false,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                            yAxisID: 'y-axis-2',
                            tension: 0.4  // 添加此属性以使线条更加平滑
                        },
                    ],
                });
            } catch (error) {
                console.error('Failed to fetch data from API:', error);
            }
        };

        fetchData();
    }, [userToken]);

    useEffect(() => {
        const fetchData = async () => {
            if (!cookie.load('user_id')) {
                history.push({ pathname: "/SignIn", state: {} });
                setTopage("SignIn");
            } else {
                const token = cookie.load("token");

                try {
                    //Get the user summary
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
                    const ownerPlans = allPlans;
                    const fetchExerciseDetails = async (exerciseUrl) => {
                        try {
                            const response = await axios.get(exerciseUrl,{
                                headers: {
                                    "Content-Type": 'application/json',
                                    "Authorization": "Token " + token
                                }
                            });
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
                                // Check if there is at least one future sub_schedule
                                const sortedSubSchedules = subSchedulesParsed.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

                                const now = new Date();
                                const hasFutureSubSchedule = sortedSubSchedules.some(sub_schedule =>
                                    new Date(sub_schedule.start_time) > now
                                );
                                const futureSubSchedules = subSchedulesParsed
                                  ? subSchedulesParsed
                                      .filter(sub_schedule => new Date(sub_schedule.start_time) > new Date()) // Keep only future sub_schedules
                                      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)) // Sort them by start_time
                                  : [];

                                // If there are no future sub_schedules, skip this plan
                                if (!hasFutureSubSchedule) {
                                    return null;
                                }


                                const convertToMMDDHHMM = (isoString) => {
                                    const localDate = dayjs.utc(isoString).local();
                                    return localDate.format('MM-DD HH:mm');
                                };
                                 // Update each sub_schedule
                                const updatedSubSchedules = sortedSubSchedules.map(subSchedule => {
                                    return {
                                      ...subSchedule,
                                      start_time: convertToMMDDHHMM(subSchedule.start_time),
                                      end_time: convertToMMDDHHMM(subSchedule.end_time)
                                    };
                                });
                                const exerciseId = plan.exercises[0].replace(/\/$/, '').split('/').pop();
                                const scheduleID = plan.id
                                const hostname = window.location.hostname;
                                const protocol = window.location.protocol;
                                const port = window.location.port

                                let baseUrl =""
                                if (hostname === "localhost" || hostname === "127.0.0.1") {
                                     baseUrl = `${protocol}//${hostname}:${port}`;
                                }else{
                                     baseUrl = `${protocol}//${hostname}`;
                                }
                                const goButtonUrl =
                                `${baseUrl}/Working_Yoga?exercise=${exerciseId}&schedule=${scheduleID}`;


                                return {
                                    ...plan,
                                    exerciseDetails,
                                    sub_schedules: futureSubSchedules, // Replace the original string with the parsed
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
                        const validPlans = detailedPlans.filter(plan => plan !== null); // Exclude null plans
                        // 将每个计划的 sub_schedules 展开为单独的详细计划
                        let newdetailedPlans = [];
                        validPlans.forEach(plan => {
                          if (plan.sub_schedules && plan.sub_schedules.length > 0) {
                            plan.sub_schedules.forEach(sub_schedule => {
                              const startTime = new Date(sub_schedule.start_time);
                              if (startTime > new Date()) { // 仅添加未来的子计划
                                newdetailedPlans.push({
                                  ...plan,
                                  start_time: sub_schedule.start_time,
                                  end_time: sub_schedule.end_time
                                });
                              }
                            });
                          }
                        });
                        // 按 start_time 排序这个新的数组
                        newdetailedPlans.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
                        setUpcomingPlans(newdetailedPlans);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取用户个人信息
                const token = cookie.load("token");
                const userProfileResponse = await axios.get(server + "exercise/userprofile/", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                    }
                });
                // 输出服务器响应以进一步调试

                if (userProfileResponse.status === 200) {
                    setUserProfile(userProfileResponse.data);
                    let tmp_likes_received = parseInt(userProfileResponse.data.likes_received, 10)+ 1;

                    setlikes_received(tmp_likes_received);
                    setInvitationCode(userProfileResponse.data.invite_code);
                    setuserLikees(userProfileResponse.data.likees);
                } else {
                    console.log("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        };
        if(userToken){
           // console.log("user profile token",userToken);
            fetchData();
        }

    }, [userToken]);

     // 当userProfile更新时，获取徽章信息
    useEffect(() => {
        const fetchBadgeData = async () => {
            try {
                // 确保badge的URL可用
                if (userProfile && userProfile.badge) {
                    const badgeResponse = await axios.get(userProfile.badge, {
                        headers: {
                             "Content-Type": 'application/json',
                             "Authorization": "Token " + userToken
                        }
                    });

                    if (badgeResponse.status === 200) {
                        setBadgeData(badgeResponse.data);
                    } else {
                        console.log("Failed to fetch badge data");
                    }
                }
            } catch (error) {
                console.error("Error fetching badge data: ", error);
            }
        };
        //console.log("userProfile",userProfile,userToken);
        fetchBadgeData();
    }, [userProfile, userToken]);

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
                                            <RouterLink to="/ExerciseOption" style={{ textDecoration: 'none' }}>
                                              <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                                Hi {cookie.load('user_id')}! Get started now?
                                              </Typography>
                                            </RouterLink>
                                    </Grid>
                                    <Grid container item direction="row" justifyContent="center" alignItems="center"
                                          xs="auto" sx={{mb: 1}}>
                                        <div>
                                          {invitationCode ? (
                                            <div>
                                              {/* 显示邀请码，点击邀请码生成二维码海报 */}
                                              <Tooltip title="Click to generate an invitation poster" arrow>
                                                <div
                                                  onMouseEnter={handleMouseEnter}
                                                  onMouseLeave={handleMouseLeave}
                                                  style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                                                  onClick={handleGeneratePoster}
                                                >
                                                  Your Invite Code: {invitationCode}
                                                </div>
                                              </Tooltip>
                                            </div>
                                          ) : (
                                            <Typography variant="h6" sx={{ ml: 2, mt: 1, fontFamily: 'MSYH' }}>
                                              Your Invite Code is loading...
                                            </Typography>
                                          )}

                                          {/* 显示海报 */}
                                          {showPoster && (
                                              <div className="poster-modal">
                                                <div className="poster-content">
                                                  <CloseIcon className="close-button" onClick={() => setShowPoster(false)} />
                                                  <img src={posterImage} alt="Poster" />
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid container item direction="row" justifyContent="space-between" alignItems="center" sx={{mt: 1}}>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}
                                        >
                                            <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                {total_time.includes('.') ? total_time.split('.')[0] : total_time}
                                            </Typography>
                                            <Box height={30}>
                                                <Typography variant="h7" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                    Exercise Time
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}
                                        >
                                            <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                {formatScore(total_score)}
                                            </Typography>
                                            <Box height={30}>
                                                <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                    Score
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}
                                        >
                                            <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                {(likes_received === null || likes_received === undefined) ? 1 :  formatLikes(likes_received)}
                                            </Typography>
                                            <Box height={30}>
                                                <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                    People Like You
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid container item direction="column" justifyContent="center"
                                              alignItems="center" xs="auto" sx={{mr: 3}}
                                        >
                                            {/* 徽章信息展示位置 */}
                                            {
                                                badgeData && (
                                                    <Tooltip
                                                        title={<MembershipRule />}
                                                        placement="bottom"
                                                    >
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* 这里添加 flexbox 样式 */}
                                                            <img src={badgeData.image_url} alt={badgeData.name} style={{width: '40px', height: '40px'}}/>
                                                            <Box height={40}>
                                                                <Typography variant="h7" sx={{mt: 1, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                                    Wellbeing Level
                                                                </Typography>
                                                            </Box>
                                                        </div>
                                                    </Tooltip>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="column" alignItems="center" justifyContent="center"
                                          sx={{mt: 1}}>
                                        <Card sx={{ width: 600, height: 330, display: 'flex', flexDirection: 'column'
                                        }}>
                                            <Typography variant="h5" sx={{m: 2, fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                Upcoming Plans
                                            </Typography>
                                            <div className="plan-list" style={{ flex: 1, overflowY: 'auto' }}>
                                                  {upcomingPlans.map((plan, index) => (
                                                    <Grid container item direction="column" key={index} className="plan-list-row">
                                                      <Grid container item direction="row" justifyContent="flex-start"
                                                            alignItems="center" sx={{ ml: 2, mt: 2, mb: 1 }}
                                                            className="sub-schedule-row">
                                                        <Grid container item xs={8} direction="row" alignItems="center"
                                                              justifyContent="flex-start" sx={{ ml: 2 }}>
                                                          <Grid item xs={10} className="text-container">
                                                            <Typography variant="body1" sx={{ mt: 1, fontFamily: 'MSYH' }}>
                                                              {plan.name}
                                                            </Typography>
                                                          </Grid>
                                                          <Grid item xs={10} className="text-container">
                                                            <Typography variant="body1" sx={{ mt: 1, fontFamily: 'MSYH' }}>
                                                              Date: {new Date(plan.start_time).toLocaleString()}
                                                            </Typography>
                                                          </Grid>
                                                          <Grid item xs={2} className="go-button-container">
                                                            <Button variant="contained" sx={{ fontSize: 'h6.fontSize', fontFamily: 'MSYH' }} color="error"
                                                                    onClick={() => {
                                                                        window.location.href = plan.goButtonUrl;
                                                                    }}>
                                                              Go
                                                              {/* Assuming BoltIcon is a component you have defined/imported */}
                                                              <BoltIcon variant="small" />
                                                            </Button>
                                                          </Grid>
                                                        </Grid>
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
                            <Card sx={{ ml: 4, width: 600, height: 500 }}>
                                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                    <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
                                        Lastest 50 actions history chart
                                    </Typography>
                                    <Box width="100%" height="90%">
                                        {chartData && (
                                            <Line data={chartData} options={options} />
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid container item direction="row" alignItems="center" justifyContent="space-around"
                        sx={{mt: 4, width: 1300}} spacing={1}>
                            <Card sx={{ width: '30%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily:
                                    'MSYH',textAlign: 'center' }}>
                                        Membership Points Leaderboard
                                    </Typography>
                                    <MembershipUserList userRanking={userRanking} UserRankinghandleLike={UserRankinghandleLike} />
                                </CardContent>
                            </Card>
                            <Card sx={{ width: '30%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily:
                                    'MSYH',textAlign: 'center' }}>
                                        Exercise Scores Leaderboard
                                    </Typography>
                                    <ScoreUserList userScore={userScore} UserScorehandleLike={UserScorehandleLike} />
                                </CardContent>
                            </Card>
                            <Card sx={{ width: '30%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH', textAlign: 'center' }}>
                                        Invites Leaderboard
                                    </Typography>
                                    <InvitesUserList userInvites={userInvites} UserInviteshandleLike={UserInviteshandleLike}/>
                                </CardContent>
                            </Card>
                            {/* Place Snackbar here */}
                            <Snackbar
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                open={snackbarOpen}
                                autoHideDuration={6000}  // 6 秒后自动隐藏
                                onClose={() => setSnackbarOpen(false)}
                                message={snackbarMessage}
                            />
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
