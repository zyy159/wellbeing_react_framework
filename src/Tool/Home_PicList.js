import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from "react-swipeable-views-utils";
import Typography from '@mui/material/Typography';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


function PicList() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    // 这里定义你的笔记
    const notes = [
    {
        title:    'Wellbeing Gallery Points Rules',
        content:
        `Point Acquisition:
        - Daily Login: Earn 5 points each day you log into Wellbeing Gallery.
        - Completing Exercise Tutorials: Earn 2 points for each action for an exercise tutorial completed.
        - Consistent Exercise: Earn an additional 50 points for completing exercise tutorials for 7 consecutive days.
        - Sharing Experiences: Earn 20 points for sharing your fitness experiences on the internal social platform.
        - Participating in Team Challenges: Earn 30 points for participating in team challenges.
        - Completing Team Challenges: When a team successfully completes a challenge, each member earns an additional 50 points.
        - Referring a Colleague: Earn 40 points for referring a colleague to join Wellbeing Gallery and complete their first exercise.

        Point Levels:
        Employees can reach different levels based on their accumulated points, and each level comes with its own specific badge and rewards.
        - Bronze: 0-500 points
        - Silver: 501-1500 points
        - Gold: 1501-3000 points
        - Platinum: 3001-5000 points
        - Diamond: 5001 points and above

        Point Expiry:
        To encourage ongoing participation, points may expire after one year. Employees can use them before they expire, or engage in activities to extend their validity.

        User Interface:
        On the Wellbeing Gallery user interface, employees can view their point balance, point history, and points that are about to expire.
        They can also view their level, badges earned, and rewards that can be redeemed.`
        },
            //... 更多笔记
        ];


    const maxSteps = notes.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {notes.map((note, index) => (
                    <div key={index} style={{ overflowY: 'auto', maxHeight: '500px', padding: '16px' }}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <>
                                <Typography variant="h6" align="center" gutterBottom>
                                    {note.title}
                                </Typography>
                                <p style={{ whiteSpace: 'pre-line' }}>{note.content}</p>
                            </>
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                position="static"
                steps={maxSteps}
                activeStep={activeStep}
                backButton={
                    <Button size="small" onClick={handleBack} color="error" disabled={activeStep === 0} sx={{ fontFamily: 'MSYH' }}>
                        {theme.direction === "rtl" ? (
                            <KeyboardArrowRight/>
                        ) : (
                            <KeyboardArrowLeft/>
                        )}
                        Back
                    </Button>
                }
                nextButton={
                    <Button size="small" onClick={handleNext} color="error" disabled={activeStep === maxSteps - 1} sx={{ fontFamily: 'MSYH' }}>
                        Next
                        {theme.direction === "rtl" ? (
                            <KeyboardArrowLeft/>
                        ) : (
                            <KeyboardArrowRight/>
                        )}
                    </Button>
                }
            />
        </Box>
    );
}

export default PicList;
