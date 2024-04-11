import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Viewer from './Viewer';
import React from 'react';
import { homeUrl } from './config/index'
import { useSnackbar } from 'notistack';

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
export const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (variant, message) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };
  const classes = useStyles();
  const [file, setFile] = React.useState(`${homeUrl}/小可爱.fbx`);
  const [showProgress, setShowProgress] = React.useState(true);
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

  return (
    <div>
      <div className={classes.toolbar} />
      <Paper elevation={3} className={classes.innerContent}>
        <Backdrop className={classes.backdrop} open={showProgress} >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Viewer
          file={file}
          onReady={onViewerReady}
          onLoaded={onViewerLoaded}
          onError={onViewerError}
        />
      </Paper>
    </div>
  )
}