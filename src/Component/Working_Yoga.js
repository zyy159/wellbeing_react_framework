import React,{Component, useEffect,useRef} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import AppHeader from '../Tool/App_Header';
import './Working_Yoga.css';
import history from "../Tool/history";
import 'font-awesome/css/font-awesome.min.css';

import { Line } from 'react-chartjs-2';
import * as posenet from '@tensorflow-models/posenet';
import { poseSimilarity } from 'posenet-similarity';
import * as tf from '@tensorflow/tfjs';
import {CategoryScale, Chart,LinearScale,PointElement,LineElement} from 'chart.js';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AudioPlayer from 'react-audio-player';

import cookie from "react-cookies";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

// Define the model
const model = tf.sequential();
model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [34]}));
model.add(tf.layers.dense({units: 32, activation: 'relu'}));
model.add(tf.layers.dense({units: 16, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));  // Output is between 0 and 1

// Compile the model
model.compile({
  optimizer: tf.train.adam(),
  loss: 'binaryCrossentropy',
  metrics: ['accuracy']
});

function Working_Yoga(){
    const location = useLocation();
    const [exerciseID, setExerciseID] = React.useState(null);
    const [scheduleID, setScheduleID] = React.useState(0);
//    const [exerciseID, setExerciseID] = React.useState((location.search).replaceAll("?exercise=",""));
    const [topage, setTopage] = React.useState("");
    const [showIndex, setShowIndex] = React.useState(0);
    const [timer, setTimer] = React.useState(null);
    const [status, setStatus] = React.useState("Not Start");
    const [startComparison, setStartComparison] = React.useState(false);
    const [imagePose, setImagePose] = React.useState(null);
    const [videoPose, setVideoPose] = React.useState(null);
    //const [net, setNet] = React.useState(null);
    const [similarityScores, setSimilarityScores] = React.useState([]);
    const [singleSimilarityScores, setSingleSimilarityScores] = React.useState([]);
    const [singleCalories, setSingleCalories] = React.useState(0);

    const [similarityScore, setSimilarityScore] = React.useState(null);
    const [postActions, setPostActions] = React.useState(false);
    const [imgs, setImgs] = React.useState([{ label: "", imgPath: "", duration: 0, calories: 0 , imgDesc: "",storeUrl:
    ""}]);
    const [imageRefs, setImageRefs] = React.useState([]); // 初始化为空数组
    const [poseContainerRefs, setPoseContainerRefs] = React.useState([]); // 初始化为空数组
    const [shouldStart, setShouldStart] = React.useState(false);
    const [isPaused, setIsPaused] = React.useState(false);
    const [showPaused, setShowPaused] = React.useState(false);
    const [countdown, setCountdown] = React.useState(0);
    const [Readycountdown, setReadyCountdown] = React.useState(0);
    const [miss, setMiss] = React.useState(0);
    const [good, setGood] = React.useState(0);
    const [great, setGreat] = React.useState(0);
    const [awesome, setAwesome] = React.useState(0);
    const [showCountdown, setShowCountdown] = React.useState(false);
    const [showCongratulations, setShowCongratulations] = React.useState(false);
    const [showStars, setShowStars] = React.useState(false);
    const [firstLoad, setfirstLoad] = React.useState(false);
    const [caloriesBurnedArray, setCaloriesBurnedArray] = React.useState([]);
    const difficulty = "Easy";
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const [isPoseEstimated, setIsPoseEstimated] = React.useState(false);
    const [isPersonDetected, setIsPersonDetected] = React.useState(true); // 默认值设为true
    const [isMuted, setIsMuted] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [audio] = React.useState(new Audio('https://wellbeing-resources.oss-cn-hangzhou.aliyuncs.com/exercise_music/HSBC%20Sound.MP3'));
    const [videoStream, setVideoStream] = React.useState(null);

    const stop = () => {
        setShowIndex(0); // 重置轮播到第一张图片
        clearInterval(timer); // 如果有一个名为 `timer` 的定时器，请确保清理它
        setShouldStart(false); // 确保轮播不会自动开始
        setIsPaused(true); // 将轮播设置为暂停状态
        setStartComparison(false); // 确保不进行视频动作识别
        // 添加停止音乐播放的逻辑
        audio.pause();
        setIsPlaying(false);
        // 执行页面导航到主页 "Home"
        // 显示提示信息
        alert("You are about to leave the exercise page and return to the homepage.");
        history.push({pathname:"/",state:{}});
        setTopage("Home");
    }
    const pause = () => {
        setIsPaused(true);
        audio.pause();
        setShowPaused(false);
    }
    const start = () => {
        setShowIndex(0)
        const now = new Date();
        const formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
        console.log("Click Start Time:", formattedTime);
        setShouldStart(true);
        setIsPaused(false);
        setShowPaused(true);
        //console.log("showCongratulations01",showCongratulations,showStars);
        setfirstLoad(false);
        setPostActions(false);
        setShowCongratulations(false);  // 设置为 true 以显示 "Congratulation"
        setShowStars(false);  // 设置为 true 以显示 "Stars"
        // 在用户点击 "Start" 按钮时开始播放音乐，切换音乐播放状态
        audio.play();
        //console.log("showCongratulations02",showCongratulations,showStars);
        setStatus("In Progress");
    }
    const change = (index) => {
        setShowIndex(index)
    }
    const startPauseToggle = () => {
        if (!showPaused) {
            start();
        } else {
            pause();
        }

    };
    //prepare the line chart
    const data = {
        labels: similarityScores.map((_, i) => i + 1),
        datasets: [
            {
                label: 'Pose Similarity',
                data: similarityScores,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y-axis-1',
            },
            {
                label: 'Calories Burned',
                data: caloriesBurnedArray,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-axis-2',
            },
        ],
    };

    const options = {
        responsive: true,  // 让图表响应式
        maintainAspectRatio: false,  // 不保持宽高比
        scales: {
            'y-axis-1': {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Pose Similarity',
                    color: 'rgb(75, 192, 192)'  // 与数据集同样的颜色
                },
                ticks: {
                    color: 'rgb(75, 192, 192)'  // 与数据集同样的颜色
                }
            },
            'y-axis-2': {
                type: 'linear',
                position: 'right',
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

    // 创建一个异步函数来获取和设置数据
    const fetchAndSetData = async () => {
        try {
            let difficultyFactor;
            switch (difficulty) {
                case "Easy":
                    difficultyFactor = 2;
                    break;
                case "Medium":
                    difficultyFactor = 3;
                    break;
                case "Hard":
                    difficultyFactor = 5;
                    break;
                default:
                    console.error("Invalid difficulty level");
                    return;
            }
            const token = cookie.load("token");
            const exerciseResponse = await axios.get(server+"exercise/exercises/"+exerciseID+"/", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + token
                            }
                    });
            const modelStores = exerciseResponse.data.model_stores;
            //console.log("exerciseID",exerciseID)
            //console.log("exerciseResponse.data",exerciseResponse.data)
            //console.log("modelStores",modelStores)
            if (modelStores.length > 0) {
                const fetchedModels = await Promise.all(modelStores.map(async (storeUrl) => {
                    const response = await axios.get(storeUrl,{
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": "Token " + token
                                }
                    });
                    return {
                        label: response.data.name,
                        imgPath: response.data.model_url,
                        duration: response.data.duration * 1000 * difficultyFactor,
                        calories: response.data.calories * difficultyFactor,
                        imgDesc: response.data.description,
                        storeUrl: storeUrl
                    };
                }));
                const sortedModels = fetchedModels.sort((a, b) => {
                    return a.label.localeCompare(b.label);
                });
                //console.log("setImgs fetchedModels",fetchedModels);
                setImgs(sortedModels);

                // 你也可以在这里更新其他依赖于 imgs 的状态
                const newImageRefs = fetchedModels.map(() => React.createRef());
                setImageRefs(newImageRefs);
                // setShowIndex(fetchedModels.length - 1);
                const newPoseContainerRefs = fetchedModels.map(() => React.createRef());
                setPoseContainerRefs(newPoseContainerRefs);
                setfirstLoad(true)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const circularProgressStyle = {
        color: 'transparent',
        '& .MuiCircularProgress-circle': {
            stroke: '#FF5733',
            strokeLinecap: 'round',
            strokeWidth: '6px',  // 你的边框宽度
        }
    };

    useEffect(() => {
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }
    }, []);
    // 切换静音状态
    const toggleMute = () => {
       audio.muted = !isMuted;
       setIsMuted(!isMuted);
    };

    useEffect(() => {
        audio.loop = true; // 设置音频循环播放
        audio.volume = 0.1; // 设置音量为 10%
      }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const exerciseParam = params.get('exercise');
        const scheduleParam = params.get('schedule');
        if (exerciseParam) {
          setExerciseID(exerciseParam);
        } else {
          console.error("exerciseID 不存在");
        }
        if (scheduleParam) {
          setScheduleID(scheduleParam);
        } else {
          console.error("Warning: ScheduleID 不存在");
        }
  }, [location.search]);  // 依赖于 location.search
    // 在 useEffect 中调用该函数
    useEffect(() => {
        //console.log("fetchAndSetData start")
        if (exerciseID) {
            //console.log("exerciseID fetchAndSetData",exerciseID);
            // exerciseID 有值，可以运行代码
            fetchAndSetData();
        } else {
            // exerciseID 没有值，执行其他逻辑或者报错
            console.error("exerciseID 不存在");
        }
    }, [exerciseID]);  // 空依赖数组表示这个 useEffect 仅在组件挂载时运行

    useEffect(() => {
        const video = document.getElementById('webcam');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // 当视频数据加载完成时调用的函数
        function handleVideoLoaded() {
            //console.log("Video data loaded.");
            async function initializePoseNet() {
                const net = await posenet.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    multiplier: 0.75,
                    modelUrl: 'https://wellbeing.htcangelfund.com/public/models/movenet/model.json',
                  });

                async function detectPose() {
                    if (showCongratulations) {
                      // 如果 showCongratulations 为真，停止捕捉和运行
                      console.log("Exercise Completed!")
                      return;
                    }
                    const pose = await net.estimateSinglePose(video, {
                        maxDetections: 2,
                        scoreThreshold: 0.5,
                        nmsRadius: 30
                    });
                    setVideoPose(pose); // 设置视频姿态
                    // 检查是否检测到人像
                    const isDetected = pose.keypoints.some(keypoint => keypoint.score > 0.5);
                    if(!isDetected){
                        alert("Missing human presence, please ensure the camera is turned on or not obstructed");
                    }
                    // 更新状态
                    setIsPersonDetected(isDetected);
                    const now = new Date();
                    const formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
                    // 这里我们假设 video.width 是视频的宽度
                    const mirroredKeypoints = mirrorKeypoints(pose.keypoints, video.width);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawKeypoints(mirroredKeypoints, ctx); // 使用镜像后的关键点
                    drawSkeleton(mirroredKeypoints, ctx);  // 使用镜像后的关键点
                    requestAnimationFrame(detectPose);
                }
                detectPose();
            }
            initializePoseNet();
        }
        // 获取摄像头的视频流
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                setVideoStream(stream);
                //console.log("Video stream : " , stream);
                video.addEventListener('loadeddata', handleVideoLoaded);
            })
            .catch((err) => {
                console.error("Error accessing the camera", err);
            });
        // 清除事件监听器
        return () => {
            video.removeEventListener('loadeddata', handleVideoLoaded);
        };
    }, []);

    useEffect(() => {
        // 添加 beforeunload 事件监听器
        window.addEventListener("beforeunload", handleBeforeUnload);

        // 在组件卸载时清除事件监听器
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
          audio.pause();
          if (videoStream) {
              videoStream.getTracks().forEach((track) => {
                track.stop();
              });
          }
//          stop(); // 确保在页面卸载时停止所有活动
        };
    }, []);

    const handleBeforeUnload = (event) => {
        // 在用户即将离开页面时暂停音乐播放
         audio.pause();
         // 关闭视频流监听
        if (videoStream) {
          videoStream.getTracks().forEach((track) => {
            track.stop();
          });
        }
    };

    // 用于图片轮播的 useEffect
    useEffect(() => {
        let imageIntervalId;

        // 当有有效的图片索引，并且图片数组不为空时
        if (shouldStart && imgs && imgs.length > 0 && showIndex < imgs.length && !isPaused) {

            const currentDuration = imgs[showIndex].duration;
            // 设置图片轮播的定时器
            imageIntervalId = setInterval(() => {
                setShowIndex((prevIndex) => prevIndex + 1);
                setPostActions(true);
            }, currentDuration +5000);
        }
        // 清除图片轮播的定时器
        return () => {
            //console.log('Cleaning up!', { showIndex, shouldStart, postActions });
            clearInterval(imageIntervalId);

            if(shouldStart && showIndex >= imgs.length - 1){
                setShouldStart(false);
                setStartComparison(false)
                setShowCongratulations(true);  // 设置为 true 以显示 "Congratulation
                setShowStars(true);  // 设置为 true 以显示 Stars
                // 在 showCongratulations 为真时执行的操作
                alert("Congratulations on completing the training. You can click the home button to return to the homepage, or you can click Start again to do it one more time.");
            }
        };
    }, [showIndex, imgs, shouldStart, isPaused]);

    useEffect(() => {
        // 检查 singleSimilarityScores 是否包含数据
        //console.log('Checking whether to post action...', { singleSimilarityScores, showIndex, postActions });
        if (singleSimilarityScores.length > 0 && showIndex < imgs.length && postActions) {
            const { mean, stdDeviation } = calculateMeanAndStdDeviation(singleSimilarityScores);
            const zScores = calculateZScores(singleSimilarityScores, mean, stdDeviation);
            const stars = calculateStarRating(zScores);
            let endTime = new Date().toISOString();
            //console.log("imgs[showIndex].duration",imgs[showIndex].duration);
            let startTime = new Date(new Date(endTime).getTime() - imgs[showIndex].duration ).toISOString();
            //console.log("startTime",startTime);
            //console.log("endTime",endTime);
            let data = {
                owner: cookie.load('user_id'),
                model_store: imgs[showIndex].storeUrl,
                start_time: startTime,  // 确保 startTime 在这个上下文中是可用的
                end_time: endTime,
                score: stars,
                calories: Math.round(singleCalories),
                label: `Schedule_${scheduleID}_Exercise_${exerciseID}`
            };

            const token = cookie.load("token");
            axios.post(server+"exercise/actions/", data, {headers:{"Content-Type":'application/json',"Authorization": "Token "+token}})
                .then(response => {
                    console.log("Data sent successfully");
                })
                .catch(error => {
                    console.error("Error sending data:", error);
                });
            setSingleSimilarityScores([]);  // 清空单张图片的相似度得分数组
            setSingleCalories(0);  // 重置 singleCalories 回到初始状态
            setPostActions(false);// 重置 回到初始状态
        } else {
            console.warn("No similarity scores available for the current image. Data not sent to backend.");
        }
    }, [singleSimilarityScores, showIndex, imgs, postActions]); //运行useEffect 当 singleSimilarityScores 或 showIndex改变


    //开始倒计时
    useEffect(() => {
        let countdownIntervalId;
        if (shouldStart && imgs && imgs.length > 0 && showIndex < imgs.length) {
            // 初始化倒计时
            setStartComparison(false)
            setReadyCountdown(5);
            setShowCountdown(true); // 显示倒计时
            countdownIntervalId = setInterval(() => {
                setReadyCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        setShowCountdown(false); // 隐藏倒计时
                        setStartComparison(true)
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
        // 清除倒计时的定时器
        return () => {
            clearInterval(countdownIntervalId);
        };
    }, [showIndex, imgs, shouldStart]);

    // 用于倒计时的 useEffect
    useEffect(() => {
            let countdownIntervalId;
            if (startComparison && imgs && imgs.length > 0 && showIndex < imgs.length && !isPaused) {
                setCountdown(Math.floor(imgs[showIndex].duration / 1000));  // 初始化倒计时
                // 设置倒计时的定时器
                countdownIntervalId = setInterval(() => {
                    setCountdown((prevCountdown) => prevCountdown - 1);
                }, 1000);
            }
            // 清除倒计时的定时器
            return () => {
                clearInterval(countdownIntervalId);
            };
        }, [showIndex, imgs, startComparison, isPaused]);

        // 当 showIndex 或 PoseNet 模型更改时，获取新的图像姿态

    useEffect(() => {
        async function estimatePoseFromImage() {
            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,
                modelUrl: 'https://wellbeing.htcangelfund.com/public/models/movenet/model.json',
            });

            const imageElement = imageRefs[showIndex]?.current;
            if (imageElement) {
                // Ensure the image is fully loaded
                if (imageElement.complete && imageElement.naturalHeight !== 0) {
                    // 当图片加载完成时，设置
                    setIsImageLoaded(true);
                    // 当姿态预测完成时，设置
                    setIsPoseEstimated(true);
                    //console.log("Image is loaded, estimating pose...");
                    const pose = await net.estimateSinglePose(imageElement);
                    //console.log("Pose estimation result:", pose);
                    setImagePose(pose);
                } else {
                    // If image is not loaded, set up a listener to run pose estimation once it does
                    imageElement.onload = async () => {
                        //console.log("Image onload is loaded, estimating pose...");
                        const pose = await net.estimateSinglePose(imageElement);
                        //console.log("Pose onload estimation result:", pose);
                        // 当图片加载完成时，设置
                        setIsImageLoaded(true);
                        // 当姿态预测完成时，设置
                        setIsPoseEstimated(true);
                        setImagePose(pose);
                    };
                }
            }
        }
        estimatePoseFromImage();
    }, [showIndex, imageRefs]);


    // Calculate the similarity
    useEffect(() => {
        const now = new Date();
        let formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
        //console.log("Video pose Timestamp:", formattedTime);
        if (startComparison && videoPose && imagePose && !isPaused)  {  // 确保 poseFromImage 已经被设置
            formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
//            console.log("Start Compare Timestamp:", formattedTime);
//            console.log("useEffect trigger");
            //console.log("poseFromImage:", imagePose);
            //console.log("poseFromVideo:", videoPose);
            let tmpsimilarityScore = CosineposeSimilarity(videoPose, imagePose);
            //使用全连接的前馈神经网络（Feedforward Neural Network, FNN）
            //let tmpsimilarityScore = FNNposeSimilarity(videoPose, imagePose);
            // 计算每一帧的平均卡路里
            const framesPerSecond = 30; // 假设视频是30fps
            if (imgs && imgs[showIndex] && typeof imgs[showIndex].duration === 'number' && typeof imgs[showIndex].calories === 'number') {
                const durationInSeconds = imgs[showIndex].duration / 1000; // 当前动作的持续时间（以秒为单位）
                const caloriesPerFrame = imgs[showIndex].calories / (durationInSeconds * framesPerSecond);
                //console.log("imgs[showIndex].calories ", showIndex, imgs[showIndex].calories);
//                console.log("durationInSeconds", durationInSeconds);
//                console.log("average caloriesPerFrame", caloriesPerFrame);
                const currentFrameCalories = caloriesPerFrame * tmpsimilarityScore/100; // 使用相似度进行加权
                //console.log("tmpsimilarityScore & currentFrameCalories ", tmpsimilarityScore, currentFrameCalories);
                const newCaloriesBurnedArray = [...caloriesBurnedArray, (caloriesBurnedArray.slice(-1)[0] || 0) + currentFrameCalories];
                // 更新 singleCalories 状态
                setSingleCalories(prevCalories => prevCalories + currentFrameCalories);
                setCaloriesBurnedArray(newCaloriesBurnedArray);
            } else {
                console.warn("imgs or imgs[showIndex] is undefined, or missing duration or calories");
            }
        }

    }, [videoPose, imagePose,shouldStart]);

    // 假设这是你计算相似度的函数或效果
    useEffect(() => {
        if (!shouldStart) return;
        // 假设 similarityScore 是你计算出的相似度分数
        // 根据难度设置阈值
        let thresholdA, thresholdB, thresholdC;
        switch (difficulty) {
            case "Easy":
                thresholdA = 15;
                thresholdB = 30;
                thresholdC = 60;
                break;
            case "Medium":
                thresholdA = 40;
                thresholdB = 60;
                thresholdC = 70;
                break;
            case "Hard":
                thresholdA = 50;
                thresholdB = 70;
                thresholdC = 80;
                break;
            default:
                console.error("Invalid difficulty level");
                return;
        }
        if (similarityScore < thresholdA) {
            setMiss(miss + 1);
        } else if (similarityScore >= thresholdA && similarityScore < thresholdB) {
            setGood(good + 1);
        } else if (similarityScore >= thresholdB && similarityScore < thresholdC) {
            setGreat(great + 1);
        } else {
            setAwesome(awesome + 1);
        }
    }, [similarityScore]); // 这个 useEffect 依赖于 similarityScore

    useEffect(() => {
        if (showStars) {
            //console.log("similarityScores",similarityScores)
            onCarouselComplete(similarityScores)
        }
     }, [shouldStart]);

    //when the exercise is end, then show the total score of the exercise
    useEffect(() => { }, [similarityScore]);

    // 计算平均值和标准差
    function calculateMeanAndStdDeviation(data) {
        const n = data.length;
        const mean = data.reduce((acc, val) => acc + val, 0) / n;
        const stdDeviation = Math.sqrt(data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n);
        return { mean, stdDeviation };
    }

    // 计算Z分数
    function calculateZScores(data, mean, stdDeviation) {
        return data.map(x => (x - mean) / stdDeviation);
    }

    // 计算星级评分
    function calculateStarRating(zScores) {
        let stars = 0;
        let confidential = 0;
        const n = zScores.length;
        switch (difficulty) {
            case "Easy":
                confidential = 0.15;
                break;
            case "Medium":
                confidential = 0.6;
                break;
            case "Hard":
                confidential = 0.8;
                break;
            default:
                console.error("Invalid difficulty level");
                return;
        }
        for (let i = 0; i < n; i++) {
            if (zScores[i] > confidential) {
                stars++;
            }
        }
        return Math.min(Math.round((stars / n) * 5), 5);
    }

    // 显示星星
    function displayStars(stars) {
        const starContainer = document.getElementById('star-container');
        let starHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                starHTML += '<span class="fa fa-star checked"></span>';
            } else {
                starHTML += '<span class="fa fa-star"></span>';
            }
        }
        // console.log("starHTML",starHTML);
        starContainer.innerHTML = starHTML;
    }

    // 在图片轮播完成后调用此函数
    function onCarouselComplete(similarityScores) {
        const { mean, stdDeviation } = calculateMeanAndStdDeviation(similarityScores);
        const zScores = calculateZScores(similarityScores, mean, stdDeviation);
        // console.log("zScores ",zScores)
        const stars = calculateStarRating(zScores);
        // console.log("stars ",stars)
        displayStars(stars);
    }

    //使用神经网络进行动作判断
    // Function to convert keypoints to 34-dimension array
    function FNNkeypoints_to_array(keypoints) {
        let arr = [];
        for (let i = 0; i < keypoints.length; i++) {
            arr.push(keypoints[i].position.x, keypoints[i].position.y);
        }
        return arr;
    }

    function FNNposeSimilarity(pose1, pose2) {
        // ... existing code
        const standardPoseArray = FNNkeypoints_to_array(pose1.keypoints);
        const videoPoseArray = FNNkeypoints_to_array(pose2.keypoints);
        // 将输入转换为模型所需的形状 [2, 34]
        const inputData = tf.tensor2d([standardPoseArray, videoPoseArray]);
        const standardPoseTensor = tf.tensor(standardPoseArray, [1, 34]);
        const videoPoseTensor = tf.tensor(videoPoseArray, [1, 34]);

        // Assume you have a trained model
        // 使用模型进行预测
        const similarityTensor = model.predict(inputData);
        const similarityArray = similarityTensor.dataSync();
        const similarityScore = similarityArray[0] * 100;

        //const similarityScore = model.predict(tf.stack([standardPoseTensor, videoPoseTensor])).dataSync()[0];
        // 添加新的相似度分数到数组中
        setSimilarityScores(prevScores => [...prevScores, similarityScore]);
        setSimilarityScore(similarityScore);
        //console.log("FNN Similarity:", similarityScore);
        return similarityScore;
    }

    // Normalize keypoints based on the nose position
    function normalize_keypoints(keypoints) {
        //console.log('keypoints:', keypoints);
        const nose_x = keypoints[0].position.x;
        const nose_y = keypoints[0].position.y;
        const normalized_keypoints = keypoints.map(keypoint => {
            return {
                position: {
                    x: keypoint.position.x - nose_x,
                    y: keypoint.position.y - nose_y
                },
                part: keypoint.part
            };
        });
        return normalized_keypoints;
    }

    // Calculate cosine similarity between two vectors
    function cosine_similarity(a, b) {
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += (a[i] * b[i]);
            magnitudeA += Math.pow(a[i], 2);
            magnitudeB += Math.pow(b[i], 2);
        }
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        return dotProduct / (magnitudeA * magnitudeB);
    }

    // Convert normalized keypoints to a simple array (ignoring the 'part' labels)
    function keypoints_to_array(keypoints) {
        let arr = [];
        for (let i = 0; i < keypoints.length; i++) {
            arr.push(keypoints[i].position.x, keypoints[i].position.y);
        }
        return arr;
    }

    function calculateConfidenceSimilarity(keypoints1, keypoints2) {
        let similarConfidenceCount = 0;

        // Assuming keypoints1 and keypoints2 are of the same length
        for (let i = 0; i < keypoints1.length; i++) {
            if (keypoints1[i].score >= keypoints2[i].score) {
                similarConfidenceCount += 1;
            }
        }

        return similarConfidenceCount / keypoints1.length; // This will give us the percentage of keypoints with similar confidence
    }
    function CosineposeSimilarity(pose1, pose2) {
        //console.log('ImagePose 1:', pose1);
        //console.log('VideoPose 2:', pose2);

        const normalized_keypoints1 = normalize_keypoints(pose1.keypoints);
        const normalized_keypoints2 = normalize_keypoints(pose2.keypoints);

        // 计算关键点置信度的相似度
        const confidenceSimilarity = calculateConfidenceSimilarity(pose1.keypoints, pose2.keypoints);

        //使用余弦相似度
        const array1 = keypoints_to_array(normalized_keypoints1);
        const array2 = keypoints_to_array(normalized_keypoints2);
        const similarity = cosine_similarity(array1, array2);
        const consineDistance = poseSimilarity(pose1, pose2, {strategy:'cosineDistance'});
        let mapScore = 0;
        if(consineDistance>0.5 || consineDistance<0) {
         mapScore = 0;} else {
         mapScore = 1 - consineDistance;
         mapScore = Math.round((mapScore-0.5)*200) }
       // console.log("similarityCompare", similarity, mapScore);
//        console.log("confidenceSimilarity:", confidenceSimilarity);
        //console.log("Similarity Percentage:", (similarity + 1) / 2 * 100); // Convert range from [-1, 1] to [0, 100]
        let similarityScore = (similarity + 1) / 2 * 100 * confidenceSimilarity;
        //console.log("Finetune Cosine Similarity::", similarityScore);
        // 添加新的相似度分数到数组中
        setSimilarityScores(prevScores => [...prevScores, mapScore]);
        //console.log("start setSingleSimilarityScores")
        setSingleSimilarityScores(prevScores => [...prevScores, mapScore]);
        //console.log("singleSimilarityScores length", singleSimilarityScores.length);
        setSimilarityScore(mapScore);
        return mapScore;
    }

    function mirrorKeypoints(keypoints, videoWidth) {
        // console.log("Mirroring keypoints for a new frame");
        return keypoints.map(keypoint => ({
            ...keypoint,
            position: {
                x: videoWidth - keypoint.position.x,
                y: keypoint.position.y
            }
        }));
    }

    function drawKeypoints(keypoints, ctx) {
        for (let i = 0; i < keypoints.length; i++) {
            let keypoint = keypoints[i];
            if (keypoint.score > 0.5) {
                ctx.fillStyle = 'rgba(0,255,0,1)';
                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 7.5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    function drawSkeleton(keypoints, ctx) {
        let skeleton = posenet.getAdjacentKeyPoints(keypoints, 0.5);
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < skeleton.length; i++) {
            let partA = skeleton[i][0];
            let partB = skeleton[i][1];
            ctx.beginPath();
            ctx.moveTo(partA.position.x, partA.position.y);
            ctx.lineTo(partB.position.x, partB.position.y);
            ctx.stroke();
        }
    }

    if (topage === "") {
        return (
            <div className="Working_Yoga">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="row" alignItems="flex-start" justifyContent="center" sx={{mt: 10, mb: 4, width: "100%"}}>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" sx={{width: "54%" }}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <VideoCameraFrontIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                LIVE Camera
                            </Typography>
                        </Grid>
                        <Card sx={{width: '95%', height:640, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="flex-start" sx={{width: "100%"}}>
                                <Grid container item direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1, width: "100%"}}>
                                    <Grid container item direction="row" alignItems="center" justifyContent="flex-start" sx={{ width:"50%", mt:2 }}>
                                        <Box sx={{position: 'relative', display: 'inline-flex', ml: 3}}>
                                            <CircularProgress variant="determinate"
                                                              value={status === "Not Start" ? 0 : Math.min(100, Math.round((showIndex + 1) / imgs.length * 100))}
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
                                                    {status === "Not Start" ? 0 : Math.min(100, Math.round((showIndex + 1) / imgs.length * 100))} %
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1, m: 2, fontFamily: 'MSYH'}}>
                                            {showIndex <= imgs.length - 1 ? imgs[showIndex].label : imgs[0].label}
                                        </Typography>
                                    </Grid>
                                    {showIndex < imgs.length - 1
                                        ? <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1, fontFamily: 'MSYH', mr:3}}>
                                            >> Next: {imgs[showIndex + 1].label}
                                        </Typography>
                                        : null
                                    }
                                </Grid>
                                <Box sx={{ width: 640, height: 490, position: 'relative' }}>
                                    <Grid container item direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1, width: "100%"}}>
                                          <p style={{color: '#EE270C', fontWeight: 'bold'}}>Miss: {miss}</p>
                                          <p style={{color: 'green', fontWeight: 'bold'}}>Good: {good}</p>
                                          <p style={{color: 'blue', fontWeight: 'bold'}}>Great: {great}</p>
                                          <p style={{color: 'purple', fontWeight: 'bold'}}>Awesome: {awesome}</p>
                                    </Grid>

                                    {showCongratulations && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            fontSize: '48px',
                                            color: 'gold',
                                            textAlign: 'center',
                                            marginTop: '40px',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 1000  // 设置一个高 z-index
                                        }}>
                                            Congratulation!
                                        </div>
                                    )}
                                    {showStars && ( <div id="star-container"></div>)}
                                    {showCountdown && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '36px',
                                            color: 'red',  // 改为黑色以形成对比
                                            zIndex: 1000  // 设置一个高 z-index
                                        }}>
                                            {Readycountdown > 1 ?  `Ready in ${Readycountdown} seconds` : 'Go!'}
                                        </div>
                                    )}
                                    <div style={{position: 'relative'}}>
                                        <video id="webcam" width="640" height="420" autoPlay style={{position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)'}}></video>
                                        <canvas id="canvas" width="640" height="420" style={{position: 'absolute', top: 0, left: 0}}></canvas>
                                    </div>
                                </Box>
                                <Grid container item direction="row" alignItems="center" justifyContent="center" sx={{mt: 2, mb: 3}}>
                                     {/* Start/Pause Button */}
                                    <Tooltip title={isImageLoaded && isPoseEstimated ? "" : "Loading, please wait a minute"}>
                                        <span>
                                            <Button
                                                variant={"outlined"}
                                                color={'error'}
                                                size="large"
                                                sx={{fontWeight: 'bold', fontFamily: 'MSYH'}}
                                                onClick={startPauseToggle}
                                                disabled={!(isImageLoaded && isPoseEstimated) }
                                            >
                                                {showCongratulations ? "Start" : (showPaused ? "Pause" : "Start")}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Button
                                                variant={"outlined"}
                                                color={"error"}
                                                size="large"
                                                sx={{ml: 4, fontWeight: 'bold', fontFamily: 'MSYH'}}
                                                onClick={toggleMute}
                                            >
                                                {isMuted ? "Music" : "Nomusic"}
                                            </Button>
                                    {/* Stop Button */}
                                    <Tooltip title={isImageLoaded && isPoseEstimated ? "" : "Loading, please wait a minute"}>
                                        <span>
                                            <Button
                                                variant={"outlined"}
                                                color={"error"}
                                                size="large"
                                                sx={{ml: 4, fontWeight: 'bold', fontFamily: 'MSYH'}}
                                                onClick={stop}
                                                disabled={!(isImageLoaded && isPoseEstimated) }
                                            >
                                                Stop
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" sx={{width: "44%"}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <SelfImprovementIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                AI Coach
                            </Typography>
                        </Grid>
                        <Card sx={{width: "95%", height:640, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="space-around">
                                <Grid container item direction="column" alignItems="center" justifyContent="flex-start" sx={{mb:2, width: "100%"}} className="contain">
                                    {showIndex===imgs.length
                                        ? <ul className="ul">
                                            <li className= 'show' key={0} style={{ width: '430px', height: '300px' }}>
                                                <img alt="" src={imgs[0].imgPath}/>
                                            </li>
                                        </ul>
                                        : <ul className="ul">
                                            {imgs.map((value, index) => {
                                                return (
                                                    <li className={index === showIndex ? 'show' : ''} key={index}>
                                                        <div id={`poseContainer${index}`}
                                                            ref={poseContainerRefs[index]}
                                                            style={{ width: '430px', height: '300px' }}
                                                        >
                                                            <img alt="" crossOrigin="anonymous"
                                                                ref={imageRefs[index]}
                                                                id="Pose"
                                                                src={value.imgPath }
                                                                alt="Pose"
                                                                //onLoad={() => handleImageLoad(index)}
                                                                key={index}
                                                            />
                                                            //<canvas id={`debugCanvas${index}`} width="430"
                                                            height="300" style={{position: 'absolute', top: 0, left: 0}}></canvas>
                                                            <div style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                    color: 'white',
                                                                    padding: '5px'
                                                            }}>
                                                                Keep more {countdown} s
                                                            </div>
                                                            <div style={{
                                                                        position: 'absolute',
                                                                        bottom: 0,
                                                                        left: 0,
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                                        color: 'white',
                                                                        padding: '5px'
                                                                }}>
                                                                    {value.imgDesc}
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    }
                                    {showIndex===imgs.length
                                        ? <ul className="dots" style={{width: imgs.length * 20 + 'px'}}>
                                            <li key={0}
                                                className='active'
                                                onClick={() => {
                                                    change(0)
                                                }}
                                            >
                                            </li>
                                        </ul>
                                        : <ul className="dots" style={{width: imgs.length * 20 + 'px'}}>
                                            {imgs.map((value, index) => {
                                                return (
                                                    <li key={index}
                                                        className={index === showIndex ? 'active' : ''}
                                                        onClick={() => {
                                                            change(index)
                                                        }}
                                                    >
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    }
                                </Grid>
                                <Grid container item direction="row" alignItems="center" justifyContent="center"
                                sx={{mt: 4, width: "100%", height: 200}}>
                                    <Line data={data} options={options} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    } else if (topage === "SignIn") {
        return (<Navigate to="/SignIn" replace={true}/>)
    } else if (topage === "Home") {
        return (<Navigate to="/" replace={true}/>)
    }
};

export default Working_Yoga;
