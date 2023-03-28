import AppHeader from '../Tool/App_Header';
import Footer from '../Tool/Footer';
import React from "react";
import sport_video from './Sport_video.js';
import Calories from '../Picture/Calories_Chart.png';
import Mountain from '../Picture/Yoga_Ai.png'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function Working_Yoga(){

    return(
        <div className="Working_Yoga">
            <AppHeader/>
            <Grid container direction="row" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ ml: 2, mt: 4, mr:2, mb: 4 }}>
                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" sx={{ width: 750 }}>
                    <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto">
                        <VideoCameraFrontIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5 }}>
                            LIVE Camera
                        </Typography>
                    </Grid>
                    <Card sx={{ width: 750, mt: 3, mb: 2 }}>
                        <Grid container item direction="column" alignItems="center" justifyContent="center" >
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" sx={{mt:2,mb:2}}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={80} color={"error"}/>
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
                                            80%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, m: 2 }} >
                                    Mountain
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.5, ml: 48 }} >
                                    >> Next: Triangle
                                </Typography>
                            </Grid>
                            <Box>
                                <iframe
                                    title="sport_video"
                                    srcDoc={sport_video}
                                    style={{  border: '0px', height: 500, width: 650 }}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    scrolling="auto"
                                />
                            </Box>
                            <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto" sx={{mt:2, mb:3}}>
                                <Button variant={"outlined"} color={'error'} size="large" sx={{fontWeight: 'bold'}}>
                                    Pause
                                </Button>
                                <Button variant={"outlined"} color={"error"} size="large" sx={{ml:8, fontWeight: 'bold'}}>
                                    Stop
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml: 7, width: 750 }}>
                    <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto">
                        <SelfImprovementIcon color={"error"} fontSize={"large"} sx={{mr: 2}}/>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5 }}>
                            AI Coach
                        </Typography>
                    </Grid>
                    <Card sx={{ width: 750, mt: 3, mb: 2 }}>
                        <Grid container item direction="column" alignItems="center" justifyContent="center" >
                            <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs="auto" sx={{ml: 2, mt: 2}}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={80} color={"error"}/>
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
                                            80%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, m: 2 }} >
                                    Mountain
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.5, ml: 48 }} >
                                    >> Next: Triangle
                                </Typography>
                            </Grid>
                            <Grid item sx={{ml: 2, mt: 1}}>
                                <img src={Mountain} alt={""} width={250}/>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card sx={{ width: 750, mt: 2.5 }}>
                        <Grid item sx={{ml: 20, mt: 1}}>
                            <img src={Calories} alt={""} width={450}/>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Working_Yoga;
