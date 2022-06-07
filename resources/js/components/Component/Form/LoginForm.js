import React, { useState, setState, useEffect } from 'react';
import { makeStyles, withStyles, alpha } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { Backdrop, CircularProgress, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, Link } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userLogIn } from '../../actions';
import Splashscreen from '../Splashscreen';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { isTokenExists, login } from '../../Redux/Login/login.action';
import { getOriginPhotoMetadata } from '../../Redux/User/features/originphoto/originphoto.action';
import { GET_CUSTOMER_VIEW } from '../../Redux/actionTypes';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },

    pos: {
        marginBottom: 12,
    },
    bgLogin: {
        height: 100 + '%',
        width: 100 + '%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#171717'
    },
    cardLogin: {
        width: 25 + '%',
        maxWidth: 400 + 'px',
        minWidth: 330 + 'px',
        justifySelf: 'center',
        alignSelf: 'center',
        margin: 'auto',
        borderRadius: 16 + 'px',
        display: 'flex',
        padding: 12 + 'px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1

    },
    imgLogo: {
        position: 'absolute',
        height: 90 + 'px',
        width: 90 + 'px',
        top: 25 + '%',
        zIndex: 5
    },
    box1: {
        flex: 1,
        alignSelf: 'flex-end'
    },
    box2: {
        flex: 11,
        padding: 20 + 'px'

    },
    formLogin: {

    },
    inputTxt: {
        width: 100 + '%'
    },
    inputBtn: {
        width: 100 + '%',
        textTransform: 'capitalize',
        padding: '8px 12px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#171717'
        }
    },
    typoBold: {
        fontWeight: 'bold'
    },
    bgLogo: {
        position: 'absolute',
        height: 100 + '%',
        color: '#2e2e2e',
        right: 0,
        zIndex: 0,
        opacity: 0.1
    },
    label: {
        fontSize: 12 + 'px',
        color: 'white'
    },
    formLabel: {
        fontSize: 24 + 'px',
        color: 'white',
        fontWeight: 'bold'
    },
    errorMsg: {
        color: 'red',
        paddingTop: '8px'
    },
    chkboxStyle: {
        textAlign: 'left',
        paddingTop: 0 + 'px',
        paddingBottom: 0 + 'px',
        color: 'white'
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const BootstrapInput = withStyles((theme) => ({
    root: {
        width: 100 + '%',
        'label + &': {
            marginTop: theme.spacing(1),
        },
    },
    input: {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: 100 + '%',
        padding: '12px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

const loginSchema = Yup.object().shape({
    userName: Yup.string('Masukkan Nama Pengguna Anda')
        .required('Nama Pengguna dibutuhkan'),
    password: Yup.string('Masukkan Kata Sandi Anda')
        .required('Kata Sandi dibutuhkan'),
});

const LoginForm = (props) => {
    const [openSplashScreen, setOpenSplashScreen] = React.useState(false)
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const loginReducer = useSelector((state) => state.loginReducer);
    const user = JSON.parse(localStorage.getItem("user"));

    const classes = useStyles();
    let history = useHistory();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [state, setState] = useState({
        errorMsg: ""
    })

    useEffect(() => {
        dispatch(isTokenExists());
        // dispatch({type: GET_CUSTOMER_VIEW});
        if (loginReducer.isAuthenticated) {
            // console.log('is authentication true');
            setOpenSplashScreen(true);
            if(user.roleId == 1){
                dispatch(getOriginPhotoMetadata());
            }

            const timer = setTimeout(() => {
                // setCount('Timeout called!');
                setOpenSplashScreen(false);
                // console.log('start') //After 1 second, set render to true
                if (user.roleId == 1) {
                    history.push({ pathname: "/pelanggan/paket", state: { role: "pelanggan" } });
                    // const test = React.createContext(history.location.state.role);
                }
                if (user.roleId == 2) {
                    history.push({ pathname: "/admin/pengguna", state: { role: "superadmin" } });
                    // localStorage.setItem("FIRST_TERMS", false)
                    // window.location.reload();
                }
                if (user.roleId == 3) {
                    history.push({ pathname: "/admin/pelanggan", state: { role: "admin" } });
                    // localStorage.setItem("FIRST_TERMS", false)
                    // window.location.reload();
                }
            }, 8000);
            return () => clearTimeout(timer);
        }

    }, [loginReducer.isAuthenticated])

    const handleSubmit = (values) => {
        // console.log(values);
        dispatch(login(values.userName, values.password, values.rememberMe))
    }

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
            rememberMe: false
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {

            handleSubmit(values);
        },
    });

    return (

        <form className={classes.formLogin} onSubmit={formik.handleSubmit}>
            {/* <button onClick={(e) => { e.preventDefault(); console.log(loginReducer) }}>print selector</button> */}
            {/* <form className={classes.formLogin} onSubmit={handleSubmit}> */}
            <Grid container spacing={4}>
                <Grid className={classes.gridItem} item xs={12}>
                    <InputLabel className={classes.formLabel} shrink htmlFor="userName">
                        Nama Pengguna
                    </InputLabel>
                    <BootstrapInput
                        id="userName"
                        name="userName"
                        placeholder="Nama Pengguna"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.userName && formik.errors.userName}</span>


                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} shrink htmlFor="password">
                        Kata Sandi
                    </InputLabel>
                    <TextField
                        id="password"
                        name="password"
                        variant="outlined"
                        placeholder="**********"
                        style={{
                            width: "100%",
                            backgroundColor: "#FFFF"
                        }}
                        size="small"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <span className={classes.errorMsg}>{formik.touched.password && formik.errors.password}</span>


                </Grid>
                <Grid item xs={6} style={{ textAlign: 'left', display: 'flex' }}>
                    <FormControlLabel
                        classes={{ label: classes.label }}
                        control={
                            <Checkbox
                                defaultValue={formik.values.rememberMe}
                                // onChange={formik.handleChange}
                                onChange={(e) => {
                                    formik.setFieldValue('rememberMe', e.target.checked);
                                }}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                style={{ textAlign: 'left', paddingTop: 0 + 'px', paddingBottom: 0 + 'px', color: 'white' }}
                            />
                        }
                        label="Ingat Saya"
                    />
                </Grid>
                {/* <Grid item xs={6} style={{ textAlign: 'right' }} >
                    <Link className={classes.label} color="textSecondary" style={{ fontSize: 12 + 'px', display: 'inline', lineHeight: 'normal', fontWeight: 'bold' }}>Lupa Kata Sandi?</Link>

                </Grid> */}
                <Grid item xs={12} style={{ paddingTop: 50 + 'px' }}>
                    <Button variant="contained" color="primary" type="submit" className={classes.inputBtn}>
                        Masuk
                    </Button>
                    <Typography className={classes.errorMsg} color="textSecondary" gutterBottom
                        style={{ fontSize: 12 + 'px', display: 'inline', lineHeight: 'normal' }}>
                        {loginReducer.errorMsg}
                    </Typography>
                </Grid>
            </Grid>
            <Splashscreen open={openSplashScreen} />
            <Backdrop style={{ zIndex: 1000, color: '#fff', }}
                open={loginReducer.loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </form>


    );
}

export default LoginForm;