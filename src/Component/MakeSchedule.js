import React, {useEffect} from "react";
import {useLocation, Navigate} from 'react-router-dom'
import AppHeader from '../Tool/App_Header';
import Mountain from "../Picture/Yoga_Mountain.png";
import { date_Func,getDateIndex,getDateElement,getEndDatetime } from '../Tool/Date_Func';
import history from "../Tool/history";
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
import Tooltip from '@mui/material/Tooltip';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SendIcon from '@mui/icons-material/Send';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import cookie from "react-cookies";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';
const fronEndserver = 'https://wellbeing.htcangelfund.com/';

dayjs.extend(utc);

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
    const [exerciseID, setExerciseID] = React.useState(null);
    const [scheduleID, setScheduleID] = React.useState(null);
    //console.log(exerciseID)
    const today = new Date();
    const [topage, setTopage] = React.useState("");
    const [exercise_info, setExercise_info] = React.useState(null);
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
    const [userToken, setUserToken] = React.useState(null);

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
        let tmpExercise_link=fronEndserver+"Working_Yoga?exercise="+exerciseID;
        //console.log(tmpExercise_link);
        //console.log("exercise_link ",tmpExercise_link);
        data.append("name",exercise_info.name)
        data.append("exercises[]", `https://wellbeing.htcangelfund.com/api/exercise/exercises/${exerciseID}/`);

        data.append("location", `https://wellbeing.htcangelfund.com/Working_Yoga?exercise=${exerciseID}`);
        data.append("start_time", newArray[0])
        data.append("end_time",  newArray[newArray.length-1])
        console.log("newArray",newArray);
        for(let i = 0; i < newArray.length; i++){
            const startTimeString = newArray[i];
        //    console.log("startTimeString",startTimeString);
             // 使用 dayjs 来处理日期时间
//            const startTime = dayjs(startTimeString);
            const startTime = dayjs.utc(startTimeString);
            const formattedEndTime = startTime.add(10, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        //    console.log("startTime",startTime);
        //    console.log("New startTime",formattedEndTime);
            // 格式化为'%Y-%m-%dT%H:%M:%S.%fZ'的字符串

            sub_schedules[i] = {
                "start_time": startTime.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                "end_time": formattedEndTime
            }
        }
        data.append("sub_schedules",  JSON.stringify(sub_schedules))
        // Log FormData entries
        //console.log('FormData entries:');
        //for (let pair of data.entries()) {
        //    console.log(pair[0]+ ', ' + pair[1]);
        //}
        axios.post(server+"exercise/schedules/", data, {headers:{"Content-Type":'application/json',"Authorization": "Token "+token}}).then(function (response) {
            //console.log(response)
            alert("The Schedule Mails have been sent! Please check the coming mails!")
            setTopage("Home")
        }).catch(err => {
            //console.log(err)
            alert("Fail to send the schedule mails! Please retry!");
        })
    }

    useEffect(()=>{
        const fetchData = async () => {
            try {
                    const exerciseResponse = await axios.get(server+"exercise/exercises/"+exerciseID+"/", {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": "Token " + userToken
                            }
                    });
                    //console.log("exerciseResponse",exerciseResponse);
                    setExercise_info(exerciseResponse.data);
                    } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        };
        fetchData();
    }, [exerciseID,userToken,exerciseID]);

    useEffect(()=>{
        if(edit_time !== null){
            setDialog_Open(true);
        }else{
            setDialog_Open(false);
        }
    }, [edit_time]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const exerciseParam = params.get('exercise');
        if (exerciseParam) {
          //console.log("exerciseID:", exerciseParam);
          setExerciseID(exerciseParam);
        } else {
          console.error("exerciseID 不存在");
        }
      }, []);

    useEffect(() => {
        if(date_config.from_date !== null){
            // 用dayjs将开始日期转换为用户的本地时区
            // 当您从日期选择器中获取日期时
            const localFromDate = dayjs.utc(date_config.from_date);

            // 在显示给用户看的时候，转换为本地时间
            const displayFromDate = localFromDate.local().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            // 当您要生成日期列表时
            let currentDay = localFromDate;
            let finalDateList = [];
            for (let i = 0; i < date_config.range; i++) {
                // 如果当前日期不是周六(6)或周日(0)，则添加到列表中
                while (currentDay.day() === 6 || currentDay.day() === 0) {
                    currentDay = currentDay.add(1, 'day');
                }
                finalDateList.push(currentDay.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
                currentDay = currentDay.add(1, 'day');
            }
            setDate_list(finalDateList);
            //setDate_list(date_Func(localFromDate, localToDate))

           // console.log("date_list",date_list);
           // Get to date
           if (finalDateList.length > 0) {
              const endDate = finalDateList[finalDateList.length - 1];
              const localToDate = dayjs.utc(endDate).local();
              setTo_date(localToDate); // 用最后一个日期更新 to_date
           }
        } else {
            setTo_date(null);
            setDate_list([])
        }
    }, [date_config.range, date_config.from_date]);


    useEffect(()=>{
        if(!cookie.load('user_id')){
            history.push({pathname:"/SignIn",state:{}});
            setTopage("SignIn")
        }else{
            const token = cookie.load("token")
            setUserToken(token);
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
                                        {exercise_info ?(
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.5, width:350, fontFamily: 'MSYH' }}>
                                            {exercise_info.name}
                                        </Typography>) : (
                                        <p>Loading...</p>
                                        )}
                                        {exercise_info ?(
                                        <Typography variant="h5" sx={{ mt:5, width:350, fontFamily: 'MSYH' }}>
                                            {exercise_info.duration/60} mins
                                        </Typography>) : (
                                        <p>Loading...</p>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container item direction="column" alignItems="center" justifyContent="center" xs="auto" sx={{ml: 24}}>
                                    {exercise_info ?(
                                    <Typography variant="h3" sx={{ ml:4, fontWeight: 'bold', lineHeight: 1.5, width: 200, fontFamily: 'MSYH' }}>
                                        <LocalFireDepartmentIcon fontSize="large" color={"error"}/>
                                        {exercise_info.calories}K
                                    </Typography>) : (
                                        <p>Loading...</p>
                                        )}
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
                                    Step 2: Modify your plan
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                        <Grid container alignItems="center" justifyContent="center" xs={"auto"} sx={{ mt: 2 }}>
                                            <Grid container alignItems="center" justifyContent="center">
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: 'MSYH', marginRight: '8px' }}>
                                                    Modify start date:
                                                </Typography>
                                                <DemoItem sx={{ mb: 2 }}>
                                                    <ThemeProvider theme={Theme}>
                                                        <DateTimePicker
                                                            disablePast
                                                            color="error"
                                                            value={date_config.from_date}
                                                            views={['year', 'day', 'hours', 'minutes', 'seconds']}
                                                            orientation="landscape"
                                                            disabled={date_config.step_two_disabled}
                                                            onChange={(newValue) =>
                                                                setDate_config({ ...date_config, from_date: dayjs(newValue) })
                                                            }
                                                            sx={{ fontFamily: 'MSYH' }}
                                                            ampm={false}
                                                        />
                                                    </ThemeProvider>
                                                </DemoItem>
                                            </Grid>
                                            <Grid container item direction="row" alignItems="center" justifyContent="center" xs={"auto"} sx={{ mt: 2 }}>
                                                <DemoItem sx={{ mb: 2 }}>
                                                    <DateTimeField
                                                      //  color="error"
                                                        label={"From Date"}
                                                        value={date_config.from_date}
                                                        readOnly
                                                        format="L HH:mm"
                                                        sx={{ fontFamily: 'MSYH' }}
                                                    />
                                                </DemoItem>
                                                <DemoItem sx={{ mb: 2, ml: 2 }}>
                                                    <DateTimeField
                                                       // color="error"
                                                        label={"To Date"}
                                                        sx={{ fontFamily: 'MSYH' }}
                                                        value={to_date}
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
                                                                 {exercise_info.name}
                                                            </Typography>
                                                            <Typography variant="h7"
                                                                        sx={{fontWeight: 'bold', lineHeight: 1.5, mt: 1, fontFamily: 'MSYH'}}
                                                                        color={"error"}>
                                                                {dayjs.utc(date).local().format('YYYY-MM-DDTHH:mm:ss')}
                                                            </Typography>
                                                        </ListItemText>
                                                        <ListItemSecondaryAction sx={{mr:4}}>
                                                            <Tooltip title="Coming Soon" arrow>
                                                                <IconButton edge="end">
                                                                    <EditCalendarIcon />
                                                                </IconButton>
                                                            </Tooltip>
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
                                                                   onChange={(newValue) => {
                                                                        console.log("newValue",newValue);
//                                                                        const newValueInUtc = dayjs(newValue).utc().format();  // 转换为 UTC 时间并转换为 ISO 格式
//                                                                        console.log("newValueInUtc",newValueInUtc);
                                                                        setEdit_time(newValue);
                                                                    }}
                                                                   disablePast
                                                                   readOnly
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
