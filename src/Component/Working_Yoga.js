import React,{Component, useEffect,useRef} from "react";
import {Navigate, useLocation} from 'react-router-dom';
import { estimateImagePose, drawKeypointsToDiv, drawSkeletonToDiv } from '../Tool/Sample_pic.js';
import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
import chair from "../Picture/Pose/chair.png";
import dog from "../Picture/Pose/dog.png";
import mountain from "../Picture/Pose/mountain.png";
import tree from "../Picture/Pose/tree.png";
import warrior1 from "../Picture/Pose/warrior1.png";
import Calories from '../Picture/Calories_Chart.png';
import sport_video from '../Tool/Sport_video.js';
import useImagePose from '../Tool/useImagePose.js';
import history from "../Tool/history";
import './Working_Yoga.css';
import { Line } from 'react-chartjs-2';
import {CategoryScale, Chart,LinearScale,PointElement,LineElement} from 'chart.js';

import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import * as posenet from '@tensorflow-models/posenet';

import cookie from "react-cookies";
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'http://47.97.104.79/';

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

function Working_Yoga(){
    const [topage, setTopage] = React.useState("")
    const [showIndex, setShowIndex] = React.useState(0)
    const [timer, setTimer] = React.useState(null)
    const [status, setStatus] = React.useState("Not Start")
    const [startComparison, setStartComparison] = React.useState(false);
    const [imagePose, setImagePose] = React.useState(null);
    const [videoPose, setVideoPose] = React.useState(null);
    const [net, setNet] = React.useState(null);
    const [similarityScores, setSimilarityScores] = React.useState([]);
    const [exerciseData, setExerciseData] = React.useState(null);
    const [modelStores, setModelStores] = React.useState([]);
    const [currentModel, setCurrentModel] = React.useState(null);
    const [imageData, setImageData] = React.useState([]); // 用于存储图像URL和对应的标签
    const [imgs, setImgs] = React.useState([{ label: "", imgPath: "", duration: 0, calories: 0 }]);
    const [imageRefs, setImageRefs] = React.useState([]); // 初始化为空数组
    const [poseContainerRefs, setPoseContainerRefs] = React.useState([]); // 初始化为空数组
    const [shouldStart, setShouldStart] = React.useState(false);
    const [isPaused, setIsPaused] = React.useState(false);
    const [countdown, setCountdown] = React.useState(0);

    const stop = () => {
        setShowIndex(0)
        clearInterval(timer);
    }

    const pause = () => {
        setIsPaused(true);
    }
    const start = () => {
        setShowIndex(0)
        const now = new Date();
        const formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
        console.log("Click Start Time:", formattedTime);
        setShouldStart(true);
        setIsPaused(false);
        setStartComparison(true)
        setStatus("In Progress")
    }
    const change = (index) => {
        setShowIndex(index)
    }

    //prepare the line chart
    const data = {
        labels: similarityScores.map((_, i) => i + 1),  // 生成标签
        datasets: [
          {
            label: 'Pose Similarity',
            data: similarityScores,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
    };

    const options = {
        scales: {
            y: {
                type: 'linear',  // 显式指定类型
                beginAtZero: true,
            },
        },
    };

    // 创建一个异步函数来获取和设置数据
    const fetchAndSetData = async () => {
      try {
            const exerciseID = '15';
            const difficulty = 2;
            const exerciseResponse = await axios.get(`http://47.97.104.79/exercise/exercises/${exerciseID}/`);
            const modelStores = exerciseResponse.data.model_stores;
            console.log("exerciseResponse",exerciseResponse.data)
            if (modelStores.length > 0) {
              const fetchedModels = await Promise.all(modelStores.map(async (storeUrl) => {
                const response = await axios.get(storeUrl);
                return {
                      label: response.data.name,
                      imgPath: response.data.model_url,
                      duration: response.data.duration * 1000 * difficulty,
                      calories: response.data.calories * difficulty,
                };
              }));

              const sortedModels = fetchedModels.sort((a, b) => {
                   return a.label.localeCompare(b.label);
              });
              console.log("setImgs fetchedModels",fetchedModels)
              setImgs(sortedModels);

              // 你也可以在这里更新其他依赖于 imgs 的状态
              const newImageRefs = fetchedModels.map(() => React.createRef());
              setImageRefs(newImageRefs);
              setShowIndex(fetchedModels.length - 1);
              const newPoseContainerRefs = fetchedModels.map(() => React.createRef());
              setPoseContainerRefs(newPoseContainerRefs);
            }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 在 useEffect 中调用该函数
    useEffect(() => {
        console.log("fetchAndSetData start")
        fetchAndSetData();
    }, []);  // 空依赖数组表示这个 useEffect 仅在组件挂载时运行

//    useEffect(()=>{
//        if(!cookie.load('user_id')){
//            history.push({pathname:"/SignIn",state:{}});
//            setTopage("SignIn")
//        }
//    },[])

    //prepare the image interval
//    useEffect(() => {
//          let intervalId;
//          let currentDuration = 0; // 或其他默认值
//          // 当有有效的图片索引，并且图片数组不为空时
//          console.log("currentDuration imgs",imgs)
//          if ( shouldStart && imgs && imgs.length > 0 && showIndex < imgs.length) {
//            currentDuration = imgs[showIndex].duration;
//            setCountdown(currentDuration / 1000);  // 假设 duration 是以毫秒为单位
//                // 更新倒计时
//            // 设置定时器
//            if (!isPaused) {
//                // 初始化倒计时
//                intervalId = setInterval(() => {
//                    setCountdown(prevCountdown => {
//                        if (prevCountdown <= 1) {
//                            clearInterval(intervalId); // 当倒计时到 0 时清除定时器
//                            return 0;
//                        }
//                        return prevCountdown - 1;
//                    });
//                }, 1000); // 每秒更新一次
//
//                intervalId = setInterval(() => {
//                  setShowIndex((si) => si + 1);
//                }, currentDuration);
//            }
//          }
//
//          // 清除定时器
//          return () => {
//            clearInterval(intervalId);
//          };
//    }, [showIndex, imgs,shouldStart,isPaused]);

    // 用于图片轮播的 useEffect
    useEffect(() => {
        let imageIntervalId;

        // 当有有效的图片索引，并且图片数组不为空时
        if (shouldStart && imgs && imgs.length > 0 && showIndex < imgs.length && !isPaused) {
            const currentDuration = imgs[showIndex].duration;

            // 设置图片轮播的定时器
            imageIntervalId = setInterval(() => {
                setShowIndex((prevIndex) => prevIndex + 1);
            }, currentDuration);
        }

        // 清除图片轮播的定时器
        return () => {
            clearInterval(imageIntervalId);
        };
    }, [showIndex, imgs, shouldStart, isPaused]);

    // 用于倒计时的 useEffect
    useEffect(() => {
        let countdownIntervalId;

        if (shouldStart && imgs && imgs.length > 0 && showIndex < imgs.length && !isPaused) {
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
    }, [showIndex, imgs, shouldStart, isPaused]);

//
// Normalize keypoints based on the nose position
    function normalize_keypoints(keypoints) {
      console.log('keypoints:', keypoints);
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

    // Calculate Euclidean distance between two points
    function euclidean_distance(pt1, pt2) {
      return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
    }

    // Calculate similarity between two poses
    function pose_similarity(normalized_pose1, normalized_pose2) {
      let distance = 0;
      for (let i = 0; i < normalized_pose1.length; i++) {
        const keypoint1 = normalized_pose1[i];
        const keypoint2 = normalized_pose2[i];
        distance += euclidean_distance(keypoint1.position, keypoint2.position);
      }
      return distance / normalized_pose1.length;
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

//
    function poseSimilarity(pose1, pose2) {
        console.log('Pose 1:', pose1);
        console.log('Pose 2:', pose2);

        const normalized_keypoints1 = normalize_keypoints(pose1.keypoints);
        const normalized_keypoints2 = normalize_keypoints(pose2.keypoints);

        //使用余弦相似度
        const array1 = keypoints_to_array(normalized_keypoints1);
        const array2 = keypoints_to_array(normalized_keypoints2);
        const similarity = cosine_similarity(array1, array2);
        console.log("Cosine Similarity:", similarity);
        console.log("Similarity Percentage:", (similarity + 1) / 2 * 100); // Convert range from [-1, 1] to [0, 100]
        let similarityScore = (similarity + 1) / 2 * 100
        // 添加新的相似度分数到数组中
        setSimilarityScores(prevScores => [...prevScores, similarityScore]);
        //使用欧氏距离判定相似度
//        const similarity = pose_similarity(normalized_pose1, normalized_pose2);
//        console.log('Normalized Pose 1:', normalized_pose1);
//        console.log('Normalized Pose 2:', normalized_pose2);
//        console.log('Similarity:', similarity);
    }

//    useEffect(()=>{
//        const intervalId = counterValid && setInterval(() =>
//            setShowIndex(si=>si+1), 20000
//        );
//        return () => clearInterval(intervalId)
//    },[counterValid])

    useEffect(() => {
        async function loadPoseNetModel() {
          const model = await posenet.load();
          setNet(model);
        }
        loadPoseNetModel();
      }, []);

      // 当 showIndex 或 PoseNet 模型更改时，获取新的图像姿态
      useEffect(() => {
        async function estimatePoseFromImage() {
          const now = new Date();
          let formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace
          (/:/g, '');
          //console.log("estimatePoseFromImage Start : ", formattedTime,showIndex,imageRefs[showIndex]);
          if (net && imageRefs && imageRefs[showIndex]) {
            const imageElement = imageRefs[showIndex].current;
            if (imageElement) {
              const pose = await net.estimateSinglePose(imageElement);
              setImagePose(pose);
              formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
              console.log("estimatePose pose : ", formattedTime);
            }
          }
        }
        estimatePoseFromImage();
      }, [showIndex, net, imageRefs]);


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
                   // inputResolution: 801
                });

                async function detectPose() {
                    const pose = await net.estimateSinglePose(video,{
                      maxDetections: 2,
                      scoreThreshold: 0.5,
                      nmsRadius: 30
                    });

                    setVideoPose(pose); // 设置视频姿态

                    const now = new Date();
                    const formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString()
                    .slice(0, 8).replace(/:/g, '');

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

    // Calculate the similarity
    useEffect(() => {
      const now = new Date();
      let formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace
      (/:/g, '');

      //console.log("Video pose Timestamp:", formattedTime);
      if (shouldStart && videoPose && imagePose)  {  // 确保 poseFromImage 已经被设置
          formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace
          (/:/g, '');

          console.log("Start Compare Timestamp:", formattedTime);
          console.log("useEffect trigger");
          console.log("poseFromImage:", imagePose);
          console.log("poseFromVideo:", videoPose);
          poseSimilarity(videoPose, imagePose);
      }
    }, [videoPose, imagePose,shouldStart]);

    if (topage === "") {
        return (
            <div className="Working_Yoga">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <Grid container direction="row" alignItems="flex-start" justifyContent="center" sx={{mt: 5, mb: 4}}>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center"
                          sx={{width: 700, mr: 5, ml: 1}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <VideoCameraFrontIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'HWE'}}>
                                LIVE Camera
                            </Typography>
                        </Grid>
                        <Card sx={{width: 680, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="center">
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start"
                                      sx={{mt: 2, mb: 1}}>
                                    <Box sx={{position: 'relative', display: 'inline-flex', ml: 3}}>
                                        <CircularProgress variant="determinate"
                                                          value={status === "Not Start" ? 0 : (showIndex + 1) * 20}
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
                                                {status === "Not Start" ? 0 : (showIndex + 1) * 20} %
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5"
                                                sx={{fontWeight: 'bold', lineHeight: 1.5, m: 2, fontFamily: 'HWE'}}>
                                        {showIndex <= imgs.length - 1 ? imgs[showIndex].label : imgs[0].label}
                                    </Typography>
                                    {showIndex < imgs.length - 1
                                        ? <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, ml: 45, fontFamily: 'HWE'}}> >> Next: {imgs[showIndex + 1].label} </Typography>
                                        : <Typography variant="h6" sx={{fontWeight: 'bold', lineHeight: 1.5, ml: 45, fontFamily: 'HWE'}}> </Typography>
                                    }
                                </Grid>
                                <Box sx={{ width: "640px", height: "567px", position: 'relative' }}>
                                     <div style={{position: 'relative'}}>
                                        <video id="webcam" width="640" height="480" autoPlay style={{position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)'}}></video>
                                        <canvas id="canvas" width="640" height="480" style={{position: 'absolute', top: 0, left: 0}}></canvas>
                                    </div>
                                </Box>
                                <Grid container item direction="row" alignItems="center" justifyContent="center"
                                      sx={{mt: 2, mb: 3}}>

                                    <Button variant={"outlined"} color={'error'} size="large"
                                            sx={{fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={start}
                                    >
                                        Start
                                    </Button>
                                    <Button variant={"outlined"} color={'error'} size="large"
                                            sx={{ml: 4, fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={stop}
                                    >
                                        Pause
                                    </Button>
                                    <Button variant={"outlined"} color={"error"} size="large"
                                            sx={{ml: 4, fontWeight: 'bold', fontFamily: 'HWE'}}
                                            onClick={stop}
                                    >
                                        Stop
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center"
                          sx={{width: 550}}>
                        <Grid container item direction="row" alignItems="center" justifyContent="flex-start">
                            <SelfImprovementIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                            <Typography variant="h4" sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'HWE'}}>
                                AI Coach
                            </Typography>
                        </Grid>
                        <Card sx={{width: 500, mt: 3, mb: 2}}>
                            <Grid container item direction="column" alignItems="center" justifyContent="center">
                                <Grid container item direction="row" alignItems="center" justifyContent="flex-start"
                                      sx={{mt: 2, mb: 1, ml: 2}}>
                                    <Box sx={{position: 'relative', display: 'inline-flex'}}>
                                        <CircularProgress variant="determinate"
                                                          value={status === "Not Start" ? 0 : (showIndex + 1) * 20}
                                                          color={"error"}/>
                                        <Box sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Typography variant="caption" component="div" color="text.secondary">
                                                {status === "Not Start" ? 0 : (showIndex + 1) * 20} %
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5"
                                                sx={{fontWeight: 'bold', lineHeight: 1.5, m: 2, fontFamily: 'HWE'}}>
                                        {showIndex <= imgs.length - 1 ? imgs[showIndex].label : imgs[0].label}
                                    </Typography>
                                    {showIndex < imgs.length - 1
                                        ? <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            lineHeight: 1.5,
                                            ml: 23,
                                            fontFamily: 'HWE'
                                        }}> >> Next: {imgs[showIndex + 1].label} </Typography>
                                        : <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            lineHeight: 1.5,
                                            ml: 23,
                                            fontFamily: 'HWE'
                                        }}> </Typography>
                                    }
                                </Grid>
                                <Grid item sx={{mt: 1}}>
                                    <div className="ReactCarousel">
                                        <div className="contain">
                                            {showIndex===imgs.length
                                            ? <ul className="ul"> <li className= 'show' key={0}><img src={imgs[0].imgPath}/></li></ul>
                                            : <ul className="ul">
                                                {imgs.map((value, index) => {
                                                    return (
                                                        <li className={index === showIndex ? 'show' : ''}
                                                            key={index}>
                                                            <div id={`poseContainer${index}`}
                                                            ref={poseContainerRefs[index]}
                                                            style={{ width: '480px', height: '302px' }}>
                                                                <img crossOrigin="anonymous"
                                                                ref={imageRefs[index]}
                                                                id="Pose"
                                                                src={value.imgPath + '?timestamp=' + Math.random()}
                                                                alt="Pose"
                                                                //onLoad={() => handleImageLoad(index)}
                                                                key={index}
                                                                />
                                                                <div style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                        color: 'white',
                                                                        padding: '5px'
                                                                     }}>
                                                                        {countdown} s
                                                                </div>
                                                            </div>
                                                            //<img src={value.imgPath}/>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            }
                                            {showIndex===imgs.length
                                            ? <ul className="dots" style={{width: imgs.length * 20 + 'px'}}> <li className= 'active' key={0} onClick={() => {change(0)}}> <img src={imgs[0].imgPath}/> </li></ul>
                                            : <ul className="dots" style={{width: imgs.length * 20 + 'px'}}>
                                                {imgs.map((value, index) => {
                                                    return (
                                                        <li key={index}
                                                            className={index === showIndex ? 'active' : ''}
                                                            onClick={() => {
                                                                change(index)
                                                            }}></li>
                                                    )
                                                })}
                                            </ul>
                                            }
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                        <Card sx={{width: 500, mt: 2.5}}>
                            <Grid item sx={{mt: 1, ml: 4}}>
                                <Line data={data} options={options}/>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    } else if (topage === "SignIn") {
        return (<Navigate to="/SignIn" replace={true}/>)
    } else if (topage === "Home") {
        return (<Navigate to="/Home" replace={true}/>)
    }
};

export default Working_Yoga;
