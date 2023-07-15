import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from "react-swipeable-views-utils";

import Rocket from '../Picture/Home_Rocket.png';
import Yoga from '../Picture/Home_Yoga_top.png';
import Running from '../Picture/Home_Running_top.png';
import Scheme from '../Picture/Home_Scheme_top.png'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function PicList() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0)
    const images = [
        {
            label: "Rocket",
            imgPath: Rocket,
        },
        {
            label: "Yoga",
            imgPath: Yoga ,
        },
        {
            label: "Running",
            imgPath: Running ,
        },
        {
            label: "Scheme",
            imgPath: Scheme,
        },
    ]
    const maxSteps = images.length;

    const handleNext = () =>{
        setActiveStep((preActiveStep) => preActiveStep + 1);
    }

    const handleBack = () =>{
        setActiveStep((preActiveStep) => preActiveStep - 1);
    }

    const handleStepChange = (step) =>{
        setActiveStep(step);
    }

    return (
        <Box sx ={{ flexGrow: 1 }}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((step,index) => (
                    <div key={step.label}>
                    {Math.abs(activeStep - index) <= 2 ? (
                        <img width = "100%" height = "450"
                            src={step.imgPath}
                            alt={step.label}
                        />)
                        : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                position="static"
                steps={maxSteps}
                activeStep={activeStep}
                backButton={
                    <Button size="small" onClick={handleBack} color="error" disabled={activeStep === 0} sx={{ fontFamily: 'MSYH' }}>
                        {theme.direction === "rt1" ? (
                            <KeyboardArrowRight/>
                        ) : (
                            <KeyboardArrowLeft/>
                        )}
                        Back
                    </Button>
                }
                nextButton={
                    <Button size="small" onClick={handleNext} color="error" disabled={activeStep === maxSteps - 1} sx={{ fontFamily: 'MSYH' }}>
                        {theme.direction === "rt1" ? (
                            <KeyboardArrowLeft/>
                        ) : (
                            <KeyboardArrowRight/>
                        )}
                        Next
                    </Button>
                }
            />
        </Box>
    );
}

export default PicList;
