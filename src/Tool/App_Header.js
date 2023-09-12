// import logo from '../Picture/HSBC-LOGO.png'
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import cookie from "react-cookies";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = "application/json";
const server = 'https://wellbeing.htcangelfund.com/api/';

function AppHeader(props) {
    const {setTopage} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const hadleHomePage = () => {
        setTopage("Home")
    }
    const handleLogout = () => {
        const csrftoken = cookie.load("csrftoken")
        console.log(csrftoken)
        let data = new FormData();
        axios.post(server+"rest-auth/logout/", data,{headers:{'X-CSRFToken':csrftoken}}).then(function (response) {
            cookie.remove('user_id')
            cookie.remove('token')
            cookie.remove('email')
            cookie.remove('csrftoken')
            setTopage("SignIn")
        })
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2'
            }
        }
    })
    if(!cookie.load('user_id')) {
        return (
            <div className="AppBar">
                <ThemeProvider theme={darkTheme}>
                    <Box sx={{flexGrow: 1}}>
                        <AppBar position="static" color="primary" sx={{height: 60}}>
                            <Toolbar position="regular">
                                <Typography variant="h4" color="#EE270C" component="div" sx={{flexGrow: 1, fontFamily: 'MSYH', ml: 1}}>
                                    Wellbeing Gallery
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </ThemeProvider>
            </div>
        );
    }else{
        const user_id = cookie.load('user_id')
        const email = cookie.load('email')
        return (
            <div className="AppBar">
                <ThemeProvider theme={darkTheme}>
                    <Box sx={{flexGrow: 1, mb: 9}}>
                        <AppBar position="fixed" color="primary" sx={{height: 60}}>
                            <Toolbar position="regular">
                                <Typography variant="h4" color="#EE270C" component="div" sx={{flexGrow: 1, fontFamily: 'MSYH', ml: 1}}>
                                    Wellbeing Gallery
                                </Typography>
                                <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={hadleHomePage}
                                    color="inherit"
                                >
                                    <HomeIcon color={"error"} fontSize="large"/>
                                </IconButton>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle color={"error"} fontSize="large"/>
                                </IconButton>

                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem sx={{fontFamily: 'MSYH'}}>Hi, {user_id}</MenuItem>
                                        <MenuItem sx={{fontFamily: 'MSYH'}}>{email}</MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout} sx={{fontFamily: 'MSYH'}}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </ThemeProvider>
            </div>
        );
    }
}

export default AppHeader;
