import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import HomePopup from './HomePopup'
import TryPopup from './TryPopup'
import ImageUploadPopup from './ImageUploadPopup'
import FormatPopup from './FormatPopup'
import { useSnackbar } from 'notistack';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import './App.css'




const drawerWidth = 310;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    height: "60px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    height: "100vh",
    width: "100%"
  },
  innerContent: {
    display: 'flex',
    height: "calc(100vh - 80px)",
    width: "100%"
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function App() {
  const classes = useStyles();
  const theme = useTheme();

  /** Snack bars */
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (variant, message) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };


  /** Home popup */
  const shouldOpenHomePopup = () => {
    if (typeof localStorage != 'undefined') {
      return localStorage.getItem('homePopup') == null;
    }
    else return true;
  }

  const onCloseHomePopup = () => {
    if (typeof localStorage != 'undefined') {
      localStorage.setItem('homePopup', true);
    }
  }

  const [homePopupOpened, sethomePopupOpened] = React.useState(shouldOpenHomePopup());

  /** Try popup */
  const [tryPopupOpened, setTryPopupOpened] = React.useState(false);

  const openTryPopup = () => {
    autoOpenDrawer();
    setTryPopupOpened(true);
  }

  /** Image upload popup */
  const [imagePopupOpened, setImagePopupOpened] = React.useState(false);

  const openImagePopup = () => {
    autoOpenDrawer();
    setImagePopupOpened(true);
  }

  /** Format popup */
  const [formatPopupOpened, setFormatPopupOpened] = React.useState(false);
  const [openedFormat, setOpenedFormat] = React.useState(null);

  /** Viewer */
  const [file, setFile] = React.useState(window.location + "formats/FBX/models/小可爱.fbx");

  const onViewerReady = () => {
    setShowProgress(false)
  }

  const onViewerLoaded = () => {
    showSnackbar("success", "Model loaded with success")
    setShowProgress(false)
  }

  const onViewerError = () => {
    showSnackbar("error", "An error has occurred. If you are trying to load a model, could you please email it to me at rufus31415@gmail.com ?")
    setShowProgress(false)
  }
  const router = useNavigate()

  /** left drawer */
  const shouldOpenDrawer = () => window.innerWidth / window.innerHeight > 1;
  const [open, setOpen] = React.useState(shouldOpenDrawer());
  const autoOpenDrawer = () => { if (open) setOpen(shouldOpenDrawer()) };

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);


  // these cameras are for live streaming and stuff
  // IMPORTANT! CHANGE ACCORDINGLY
  const camera1Ip = "127.0.0.1:5001/video_feed/0"; // operated by flask server
  const camera2Ip = "127.0.0.1:5001/video_feed/1"; // operated by flask server
  let [selectMenuIndex,setSelectMenuIndex] = useState('');

  const handleCameraClick = () => {
    const windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    const newWindow = window.open("", "_blank", windowFeatures);

    newWindow.document.write(`
      <html>
        <head>
          <title>Camera Streams</title>
          <style>
            body { margin: 0; display: flex; height: 100vh; }
            iframe { width: 50%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="http://${camera1Ip}"></iframe>
          <iframe src="http://${camera2Ip}"></iframe>
        </body>
      </html>
    `);

    newWindow.document.close();
  };

  const handlePhotogrammetry = () => {
    window.location.href = "http://127.0.0.1:5001"
  }

  const intoPage = (path) => {
    // window.location.href = "zoning"
    console.log(path);
    router( '/' + path)
  }

  window.addEventListener("resize", autoOpenDrawer, false);
  window.addEventListener("orientationchange", autoOpenDrawer, false);

  /** Menu right */

  const openFormatPopup = (format) => {
    autoOpenDrawer();
    setOpenedFormat(format);
    setFormatPopupOpened(true);
  }

  const onClickInfo = () => sethomePopupOpened(true);

  /** Progress */
  const [showProgress, setShowProgress] = React.useState(true);

  const location = useLocation()

  useEffect(() => {
    // console.log(location);
    setSelectMenuIndex(location.pathname)
  },[location])


  return (

    <div className={classes.root}>
      <HomePopup
        open={homePopupOpened}
        setOpen={sethomePopupOpened}
        onClose={onCloseHomePopup}
      />
      <TryPopup
        open={tryPopupOpened}
        setOpen={setTryPopupOpened}
        setFile={setFile}
      />
      <ImageUploadPopup
        open={imagePopupOpened}
        setOpen={setImagePopupOpened}
        setFile={setFile}
      />
      <FormatPopup
        open={formatPopupOpened}
        setOpen={setFormatPopupOpened}
        format={openedFormat}
        setFile={setFile}
      />

      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={({backgroundColor:'#000'})}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <span style={({color:"#fff"})}>Singapore Art Museum</span> <span style={({color:'#e61563'})}>Digital Curatorial Platform</span>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          </div>
          <div className={classes.sectionMobile}>
            <Link href="https://github.com/rufus31415" color="inherit" target="_blank">
              <IconButton
                aria-label="GitHub"
                aria-haspopup="true"
                color="inherit"
              >
                <GitHubIcon />
              </IconButton>
            </Link>
            <IconButton
              aria-label="Info"
              aria-haspopup="true"
              // onClick={null}
              color="inherit"
              onClick={onClickInfo}
            >
              <InfoIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button
            key="home"
            data-key="home"
            onClick={() => intoPage('home')}
            selected={selectMenuIndex === '/home'}
            classes={{selected:'selected'}}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          {/* <ListItem button
            key="browser"
            classes={{selected:'selected'}}
            selected={selectMenuIndex === 'browser'}
            onClick={openTryPopup}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="Try my files" />
          </ListItem> */}
          <ListItem button
            key="browserImage"
            classes={{selected:'selected'}}
            selected={selectMenuIndex === 'browserImage'}
            onClick={openImagePopup}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="Creation of Bounding Shapes" />
          </ListItem>
          <ListItem button
            key="zoning"
            classes={{selected:'selected'}}
            selected={selectMenuIndex === '/zoning'}
            onClick={() => intoPage('zoning')}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="Zoning Selection" />
          </ListItem>
          <ListItem button
            key="livestream"
            onClick={() => intoPage('samuel')}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="SAMuel" />
          </ListItem>
          <ListItem button
            key="photogrammetry"
            onClick={handlePhotogrammetry}
          >
            <ListItemIcon><OpenInBrowserIcon /></ListItemIcon>
            <ListItemText primary="Photogrammetry" />
          </ListItem>

        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <Outlet />
      </main>
    </div>
  );
}