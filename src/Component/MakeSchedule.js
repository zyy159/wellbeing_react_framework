import React, {useEffect} from "react";
import {useLocation} from 'react-router-dom'
import AppHeader from '../Tool/App_Header';
import Mountain from "../Picture/Yoga_Mountain.png";
import { date_Func,getDateIndex,getDateElement,getEndDatetime } from '../Tool/Date_Func';
import history from "../Tool/history";
import {Navigate} from "react-router";
//import {Access_Token, authProvider, getAuthenticatedClient, Schedule} from '../Tool/Outlook_Func'
//import { initializeGraphForUserAuth, sendMailAsync} from '../Tool/Outlook_Func';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SendIcon from '@mui/icons-material/Send';

import cookie from "react-cookies";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';
const fronEndserver = 'https://wellbeing.htcangelfund.com/';

const Theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f",
    },
  },
});

class ResponseInfo {
    constructor(status, data, msg) {
        this.status = status;
        this.data = data;
        this.msg = msg;
    }
}

function MakeSchedule(){
    const location = useLocation();
    const [exerciseID, setExerciseID] = React.useState((location.search).replaceAll("?exercise=",""))
    console.log(exerciseID)
    const today = new Date();
    const [topage, setTopage] = React.useState("");
    const [exercise_info, setExercise_info] = React.useState({
        name: '',
        duration: 0,
        calories: 0,
        popularity: 0
    });
    const [exercise_link, setExercise_link] = React.useState([])
    const [button_style_list, setButton_style_list] = React.useState({
        Five_DAY: 'outlined',
        Ten_DAY: 'outlined',
        Three_WEEK: 'outlined',
        One_MONTH: 'outlined',
    });
    const [date_config, setDate_config] = React.useState({
        range: null,
        step_two_disabled: true,
        from_date: null
    });
    const [to_date, setTo_date] = React.useState(null)
    const [date_list, setDate_list] = React.useState([])
    const [dialog_open, setDialog_Open] = React.useState(false);
    const [edit_time, setEdit_time] = React.useState(null);

    const dialog_handleClickOpen = (date) => {
        setEdit_time(dayjs(date));
    };
    const dialog_handleClose = () => {
        setEdit_time(null);
    };
    const dialog_handleChange = () => {
        var index = getDateIndex(new Date(date_config.from_date),new Date(edit_time))
        const newArray = [...date_list];
        newArray[index] = getDateElement(new Date(edit_time));
        setDate_list(newArray);
        setEdit_time(null);
    };

    const Send = () => {
        const newArray = [...date_list];
        const sub_schedules = [];
        const token = cookie.load("token")
        let data = new FormData();
        console.log("exercise_link ",exercise_link)
        data.append("name",exercise_info.name)
        data.append("exercises[]", `https://wellbeing.htcangelfund.com/api/exercise/exercises/${exerciseID}/`)
        data.append("start_time", newArray[0])
        data.append("end_time",  newArray[newArray.length-1])
        for(let i = 0; i < newArray.length; i++){
            sub_schedules[i] = {
                "start_time": new Date(newArray[i]),
                "end_time": getEndDatetime(new Date(newArray[i]), 10)
            }
        }
        data.append("sub_schedules",  JSON.stringify(sub_schedules))
        axios.post(server+"exercise/schedules/", data, {headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
            console.log(response)
            alert("The Schedule Mails have been sent! Please check the coming mails!")
            setTopage("Home")
        }).catch(err => {
            console.log(err)
            alert("Fail to send the schedule mails! Please retry!");
        })
    }

    useEffect(()=>{
        if(edit_time !== null){
            setDialog_Open(true);
        }else{
            setDialog_Open(false);
        }
    }, [edit_time]);

    useEffect(()=>{
        if(date_config.from_date !== null){
            setTo_date(dayjs(date_config.from_date).add(date_config.range-1, 'day'));
            setDate_list(date_Func(new Date(date_config.from_date), new Date(dayjs(date_config.from_date).add(date_config.range-1, 'day'))))
            console.log(date_list)
        }else{
            setTo_date(null);
            setDate_list([])
        }
    }, [date_config.range,date_config.from_date]);

    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            let tmpExercise_link=fronEndserver+"Working_Yoga?exercise="+exerciseID+"&token="+token
            setExercise_link(tmpExercise_link)
            console.log(tmpExercise_link)
//            axios.get(server+"exercise/exercises/"+exerciseID,{headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
//                setExercise_info({...exercise_info, name:response.data.name, duration:response.data.duration, calories:response.data.calories, popularity:response.data.popularity})
//                setExercise_link(response.data.model_stores)
//            }).catch(err => {
//                console.log(err)
//                alert("Fail to load! Please retry!");
//            })
        }
    },[]);

    if(topage==="") {
        return (
            <div className="MakeSchedulePage">
                <AppHeader topage={topage} setTopage={setTopage}/>
                <div className="main">
                    <Grid container direction="column" alignItems="center" justifyContent="center" sx={{mb:3}}>
                        <Card sx={{width:1300, mt: 4 }}>
                            <Grid container item direction="row" alignItems="center" justifyContent="space-between" xs="auto">
                                <Grid container item direction="row" alignItems="center" justifyContent="center" xs="auto">
                                    <img src={Mountain} alt={"Mountain"} width="200" />
                                    <Grid container item direction="column" alignItems="flex-start" justifyContent="center" xs="auto" sx={{ml:3}}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:350, fontFamily: 'MSYH' }}>
                                            {exercise_info.name}
                                        </Typography>
                                        <Typography variant="h5" sx={{ mt:5, width:350, fontFamily: 'MSYH' }}>
                                            {exercise_info.duration/60} mins
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                    <Typography variant="h3" sx={{ ml:4, fontWeight: 'bold', lineHeight: 1.5, width: 200, fontFamily: 'MSYH' }}>
                                        <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                        {exercise_info.calories}K
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt:1, width: 200, fontFamily: 'MSYH' }}>
                                        CALORIES BURNT
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                        <Grid container item direction="row" alignItems="flex-start" justifyContent="center" className={"Step"} sx={{mt:5, width:1300}}>
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" className={"Step1_2"} sx={{width:600}}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                    Step 1: Select the Plan Period
                                </Typography>
                                <Grid container item direction="column" alignItems="center" justifyContent="flex-start" className={"Step1"}>
                                    <Grid container item direction="row" alignItems="center" justifyContent="center" xs={"auto"} sx={{ mt:3}}>
                                        <Button color={"error"} sx={{fontSize: 'h6.fontSize', mr: 2, width: 200, fontFamily: 'MSYH'}} variant={button_style_list.Five_DAY}
                                            onClick={() => {
                                                setButton_style_list({ Five_DAY:"contained", Ten_DAY: "outlined",Three_WEEK:"outlined", One_MONTH:"outlined" })
                                                setDate_config({...date_config,range: 5, step_two_disabled: false, from_date: dayjs(today)})
                                            }}
                                        >
                                            5 Days Plan
                                        </Button>
                                        <Button color={"error"} sx={{fontSize: 'h6.fontSize', width: 200, fontFamily: 'MSYH'}} variant={button_style_list.Ten_DAY}
                                            onClick={() => {
                                                setButton_style_list({ Five_DAY:"outlined", Ten_DAY: "contained",Three_WEEK:"outlined", One_MONTH:"outlined" })
                                                setDate_config({...date_config,range: 10, step_two_disabled: false, from_date: dayjs(today)})
                                            }}
                                        >
                                            10 Days Plan
                                        </Button>
                                    </Grid>
                                    <Grid container item direction="row" alignItems="center" justifyContent="center" sx={{mt: 2}}>
                                        <Button color={"error"} sx={{fontSize: 'h6.fontSize', mr: 2, width: 200, fontFamily: 'MSYH'}} variant={button_style_list.Three_WEEK}
                                            onClick={() => {
                                                setButton_style_list({ Five_DAY:"outlined", Ten_DAY: "outlined",Three_WEEK:"contained", One_MONTH:"outlined" })
                                                setDate_config({...date_config,range: 21, step_two_disabled: false, from_date: dayjs(today)})
                                            }}
                                        >
                                            3 Weeks Plan
                                        </Button>
                                        <Button color={"error"} sx={{fontSize: 'h6.fontSize', width: 200, fontFamily: 'MSYH'}} variant={button_style_list.One_MONTH}
                                            onClick={() => {
                                                setButton_style_list({ Five_DAY:"outlined", Ten_DAY: "outlined",Three_WEEK:"outlined", One_MONTH:"contained" })
                                                setDate_config({...date_config,range: 30, step_two_disabled: false, from_date: dayjs(today)})
                                            }}
                                        >
                                            1 Month Plan
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, mt: 4, fontFamily: 'MSYH' }}>
                                    Step 2: Select the Date Range
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                        <Grid container item direction="row" alignItems="center" justifyContent="center" xs={"auto"}>
                                            <DemoItem>
                                                <ThemeProvider theme={Theme}>
                                                    <StaticDateTimePicker
                                                        color = "error"
                                                        value={date_config.from_date}
                                                        disabled = {date_config.step_two_disabled}
                                                        orientation="landscape"
                                                        slotProps={{
                                                            toolbar: {hidden: true,},
                                                            actionBar: {actions:[]},
                                                        }}
                                                        disablePast
                                                        onChange={(newValue) =>
                                                            setDate_config({...date_config, from_date: dayjs(newValue)})
                                                        }
                                                        sx = {{ fontFamily: 'MSYH' }}
                                                    />
                                                </ThemeProvider>
                                            </DemoItem>
                                            <Grid container item direction="column" alignItems="center" justifyContent="center" xs={"auto"}>
                                                <DemoItem>
                                                    <DateTimeField 
                                                        color = "error"
                                                        label={"From Date"}
                                                        value={date_config.from_date}
                                                        readOnly
                                                        format="L HH:mm"
                                                        sx={{fontFamily: 'MSYH'}}
                                                    />
                                                </DemoItem>
                                                <DemoItem >
                                                    <DateTimeField 
                                                        color = "error"
                                                        label={"To Date"}
                                                        sx = {{mt: 3, fontFamily: 'MSYH'}}
                                                        value = {to_date}
                                                        readOnly
                                                        format="L HH:mm"
                                                    />
                                                </DemoItem>
                                            </Grid>
                                        </Grid>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            <Grid container item direction="column" alignItems="flex-start" justifyContent="center" className={"Step1_2"} sx={{ml: 5, width:600}}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH' }}>
                                    Step 3: Confirm the Schedule and Send the Invitation
                                </Typography>
                                {date_list.length === 0
                                    ? <Alert severity="info" sx={{width: 580, mt:2}} color={"error"}>You haven't select the Plan Period!</Alert>
                                    : <Box sx={{height: 580, width: 600, mt:2}}>
                                        <List sx={{maxHeight: 580, overflow: 'auto'}}>
                                            {date_list.map((date) => (
                                                <Card sx={{width: 580, mb: 2}}>
                                                    <ListItem component="div" disablePadding key={date} sx={{ml: 2}}>
                                                        <ListItemText>
                                                            <Typography variant="h6"
                                                                        sx={{fontWeight: 'bold', lineHeight: 1.5, fontFamily: 'MSYH'}}>
                                                                One Week Mountain
                                                            </Typography>
                                                            <Typography variant="h7"
                                                                        sx={{fontWeight: 'bold', lineHeight: 1.5, mt: 1, fontFamily: 'MSYH'}}
                                                                        color={"error"}>
                                                                {date}
                                                            </Typography>
                                                        </ListItemText>
                                                        <ListItemSecondaryAction sx={{mr:4}}>
                                                            <IconButton edge={"end"} onClick={()=>dialog_handleClickOpen(date)}>
                                                                <EditCalendarIcon/>
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </Card>
                                            ))}
                                        </List>
                                        <Dialog open={dialog_open} onClose={dialog_handleClose}>
                                            <DialogTitle sx={{ fontFamily: 'MSYH' }}>
                                                {"Edit the start time of "+new Date(edit_time).getFullYear()+"-"+(new Date(edit_time).getMonth() + 1)+"-"+new Date(edit_time).getDate()}
                                            </DialogTitle>
                                            <DialogContent>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={["TimeField"]}>
                                                        <TimeField label="From Time"
                                                                   color = "error"
                                                                   value={edit_time}
                                                                   onChange={(newValue) => setEdit_time(newValue)}
                                                                   disablePast
                                                                   format="HH:mm"
                                                                   sx={{ fontFamily: 'MSYH' }}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={()=>dialog_handleClose()} color={"error"} sx={{ fontFamily: 'MSYH' }}>Cancel</Button>
                                                <Button onClick={()=>dialog_handleChange()} color={"error"} sx={{ fontFamily: 'MSYH' }}>OK</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                        <Button variant="contained" color="error" endIcon={<SendIcon size="large" />}
                                sx={{fontSize: 'h5.fontSize', width: 200, mt: 6, fontFamily: 'MSYH'}}
                                onClick={()=>Send()}
                        >
                            Send
                        </Button>
                    </Grid>
                </div>
            </div>
        );
    }else if(topage==="SignIn"){
        return <Navigate to="/SignIn" replace={true} />
    }else if(topage==="Home"){
        return <Navigate to="/" replace={true} />
    }
}

export default MakeSchedule;
