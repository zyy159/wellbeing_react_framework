import React from "react";
import Tree from "../Picture/Yoga_Tree.png"

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import BoltIcon from '@mui/icons-material/Bolt';
import Grid from "@mui/material/Grid";

function PicList() {
    return (
        <Grid container direction="row" alignItems="center" justifyContent="center" sx={{width:1310 }}>
            <ImageList>
                <Grid container direction="row" alignItems="center" justifyContent="center" sx={{width:1300 }}>
                    <ImageListItem sx={{width: 280}}>
                        <img src={Tree} alt={"Tree"} />
                        <ImageListItemBar
                            title="Tree"
                            subtitle="2 mins · 7.2K Calorie"
                            actionIcon={
                                <Button sx={{ color:"#ffffff" }}>
                                    <BoltIcon />
                                    Go
                                </Button>
                            }
                        />
                    </ImageListItem>
                    <ImageListItem sx={{width: 280, ml:5}}>
                        <img src={Tree} alt={"Tree"} />
                        <ImageListItemBar
                            title="Tree"
                            subtitle="2 mins · 7.2K Calorie"
                            actionIcon={
                                <Button sx={{ color:"#ffffff" }}>
                                    <BoltIcon />
                                    Go
                                </Button>
                            }
                        />
                    </ImageListItem>
                    <ImageListItem sx={{width: 280, ml:5}}>
                        <img src={Tree} alt={"Tree"} />
                        <ImageListItemBar
                            title="Tree"
                            subtitle="2 mins · 7.2K Calorie"
                            actionIcon={
                                <Button sx={{ color:"#ffffff" }}>
                                    <BoltIcon />
                                    Go
                                </Button>
                            }
                        />
                    </ImageListItem>
                    <ImageListItem sx={{width: 280, ml:5}}>
                        <img src={Tree} alt={"Tree"} />
                        <ImageListItemBar
                            title="Tree"
                            subtitle="2 mins · 7.2K Calorie"
                            actionIcon={
                                <Button sx={{ color:"#ffffff" }}>
                                    <BoltIcon />
                                    Go
                                </Button>
                            }
                        />
                    </ImageListItem>
                </Grid>
            </ImageList>
        </Grid>
    );
};

export default PicList;

