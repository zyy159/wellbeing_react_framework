import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const images = [
    {
        label: "Rocket",
        imgPath: "https://i.hd-r.cn/4863142b2e1b4fc97885b5df0c2c2559.png" ,
    },
    {
        label: "Yoga",
        imgPath: "https://i.hd-r.cn/750c60901a901ecf71a27e576f8e0a9d.png" ,
    },
    {
        label: "Running",
        imgPath: "https://i.hd-r.cn/82c5b8ee83861cf30a345913e23d07a9.png" ,
    },
    {
        label: "Scheme",
        imgPath: "https://i.hd-r.cn/d9652918fa148a5d3000887c488e57f1.png" ,
    },
]

function PicList() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0)
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
                        <img width = "100%" Height = "450"
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
                    <Button size="small" onClick={handleBack} color="error" disabled={activeStep === 0} >
                        {theme.direction === "rt1" ? (
                            <KeyboardArrowRight/>
                        ) : (
                            <KeyboardArrowLeft/>
                        )}
                        Back
                    </Button>
                }
                nextButton={
                    <Button size="small" onClick={handleNext} color="error" disabled={activeStep === maxSteps - 1} >
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