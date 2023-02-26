import logo from '../Picture/HSBC-LOGO.png'
import React, { useCallback } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { ThemeProvider, createTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function AppHeader() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2'
      }
    }
  })
  return(
    <div className="AppBar">
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="primary" sx={{ height: 60 }}>
            <Toolbar position="regular">
              <img src={logo} className="App_Logo" alt="logo" />
              <Typography variant="h4" color="#EE270C" component="div" sx={{ flexGrow: 1 }}>
                Wellbeing Gallery
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default AppHeader;