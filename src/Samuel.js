import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import './Samuel.css'

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        minHeight: '60px'
    },

    // container: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     height: '100vh',
    // },

    // cameraContainer: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     flexGrow: 1, // Cameras container takes remaining vertical space
    // },
    // iframe: {
    //     width: '700px', // Adjust as needed to accommodate spacing
    //     height: '100%',
    //     border: 'none',
    // },
}));

export const SamuelPage = () => {
    const classes = useStyles();

    // these cameras are for live streaming and stuff
    // IMPORTANT! CHANGE ACCORDINGLY
    const camera1Ip = "http://127.0.0.1:5001/video_feed/0"; // operated by flask server
    const camera2Ip = "http://127.0.0.1:5001/video_feed/1"; // operated by flask server

    return (
        <div className='container'>
            <div className={classes.toolbar} />
            <div style={{ maxWidth: 1280, width: "100%", alignItems: "center", justifyContent: 'center', display: 'flex' }}>
                <h3 style={{ width: "50%", textAlign: "center" }}>Camera 1</h3>
                <h3 style={{ width: "50%", textAlign: "center" }}>Camera 2</h3>
            </div>
            <div style={{ maxWidth: 1280, width: "100%", alignItems: "center", display: 'flex' }}>
                <div style={{ width: "50%" }}>
                    <img src={camera1Ip} style={{ border: "none" }} ></img>
                </div>
                <div style={{ width: "50%" }}>
                    <img src={camera2Ip} style={{ border: "none" }} ></img>
                </div>

            </div>

        </div>
    )
}
