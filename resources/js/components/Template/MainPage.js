import React, { createContext, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import { Avatar, Badge, Box, Button, CardMedia, Container, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Tab, Tabs } from '@material-ui/core';
import MainMenuItem from '../Component/MainMenuItem/MainMenuItem';
import { Icon } from '@iconify/react';
import { useHistory, useLocation } from "react-router-dom";
import LogoutDialog from '../Component/Popup/LogoutDialog';
import TermsDialog from '../Component/Popup/TermsDialog';
import Splashscreen from '../Component/Splashscreen';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#171717',
        color: 'white'

    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    imgLogo: {
        paddingTop: 16 + 'px',
        paddingLeft: 16 + 'px',
        paddingRight: 16 + 'px',
        paddingBottom: 32 + 'px'
    },
    indicator: {
        backgroundColor: '#7DB9E0'
    },
    dot: {
        backgroundColor: 'red'
    },
    badge: {
        height: '50px', 
        width: '50px', 
        backgroundColor: '#171717', 
        alignItems: 'center', 
        justifyContent: 'center', 
        display: 'flex' 
    }
}));


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ROLE = {
    text: null
}

export default function MainPage(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [showPictureTab, setShowPictureTab] = React.useState(true);
    const role = JSON.parse(localStorage.getItem("user")).role_id;
    const [openLogoutPopup, setOpenLogoutPopup] = React.useState(false);
    const [tabValue, setTabValue] = React.useState(props.tabValue);
    const [openTerms,setOpenTerms] = React.useState(false);
    const [openSplashScreen, setOpenSplashScreen] = React.useState(true)
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseTerms =()=>{
        localStorage.setItem('FIRST_TERMS',false)
        setOpenTerms(false)
    }

    useEffect(() => {
        if(localStorage.getItem('FIRST_TERMS') === 'false'){
            // console.log("tewew")
            setOpenTerms(false);
        }else{
            // console.log("wowowo")
            setOpenTerms(true)
        }
    }, []);

    const handleOnTabChange = (e, value) => {
        // console.log(value);
        // setTabValue(value);

        if (value == 0) {
            history.push('/pelanggan/paket/foto-mentah')
        }

        if (value == 1) {
            history.push('/pelanggan/paket/foto-pilihan')
        }

        if (value == 2) {
            history.push('/pelanggan/paket/foto-akhir')
        }

        if (value == 3) {
            history.push('/pelanggan/paket/video')
        }

        if (value == 4) {
            history.push('/pelanggan/paket/album')
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };




    const handleLogout = () => {
        setOpenLogoutPopup(true);
    }

    const handleClosePopup = () => {
        setOpenLogoutPopup(false);
    }

    let tab = (props.showTab ?
        (<Tabs
            style={{ flexGrow: 1 }}
            value={tabValue}
            onChange={handleOnTabChange}>
            <Tab label={<span >Foto Mentah</span>} />
            <Tab label={<span >Foto Pilihan</span>} />
            <Tab label={<span >Foto Akhir</span>} />
            <Tab label={<span >Video</span>} />
            <Tab label={<span >Album</span>} />
        </Tabs>) : null);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color="secondary"
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar disableGutters={true} variant="dense">
                    <IconButton

                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    {open &&
                        <IconButton
                            onClick={handleDrawerClose}
                            edge="start"
                            style={{ color: 'white' }}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>}
                    {tab}
                    <IconButton aria-label="show 17 new notifications" color="inherit"  variant="dot" 
                    onClick={handleClick}
                    style={{position:"absolute",right:"0",marginRight:"5px"}}>
                    <Badge color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                    </IconButton>
                    {/* <div className={classes.badge} >
                        <Badge classes={{
                            dot: classes.dot
                        }} variant="dot">
                            <Icon icon="bx:bx-bell" style={{ fontSize: '24px', color: 'white' }} />
                        </Badge>
                    </div> */}

                </Toolbar>

            </AppBar>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{  
                    style: {  
                      width: 250,  
                    },  
                 }} 
            >
                <div onClick={handleClose} style={{
                    cursor:"pointer",
                    margin:"1em"
                }}>
                    <div>
                    <div style={{display:"flex"}}>
                    <Avatar style={{marginRight:"5px"}}>U</Avatar> User telah memengirim foto pilihanannya didalam paket Lamaran<br/>
                    </div>
                    <span><AccessTimeIcon style={{fontSize:"15px",marginRight:"5px"}}/>1 jam</span>
                    </div>
                </div>
                <div onClick={handleClose}  style={{
                    cursor:"pointer",
                    margin:"1em"
                }}>
                <div>
                    <div style={{display:"flex"}}>
                    <Avatar>U</Avatar> User telah memengirim foto pilihanannya didalam paket Lamaran<br/>
                    </div>
                    <span><AccessTimeIcon style={{fontSize:"15px"}}/>1 jam</span>
                    </div>
                </div>
                <div onClick={handleClose}  style={{
                    cursor:"pointer",
                    margin:"1em"
                }}>
                <div>
                    <div style={{display:"flex"}}>
                    <Avatar>U</Avatar> User telah memengirim foto pilihanannya didalam paket Lamaran<br/>
                    </div>
                    <span><AccessTimeIcon style={{fontSize:"15px"}}/>1 jam</span>
                    </div>
                </div>
            </Menu>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <img src="/img/logo_amor_mainpage.png" className={classes.imgLogo} />
                <Divider />
                <List>
                    <ListItem>

                    </ListItem>

                    <MainMenuItem role={role} />
                    {/* <MainMenuItem jenis="admin" /> */}
                </List>
                <Divider />
                <ListItem button key='Keluar' style={{ position: 'absolute', bottom: 0 }} onClick={handleLogout}>
                    <ListItemIcon classes={{ root: classes.icon }}><Icon icon="bx:bx-log-out" style={{ fontSize: '24px', color: 'white' }} /> </ListItemIcon>
                    <ListItemText primary='Keluar' />
                </ListItem>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
            <LogoutDialog closePopup={handleClosePopup} open={openLogoutPopup} />
            <TermsDialog open = {openTerms} handleClose={handleCloseTerms}/>
        </div>
    );
}
