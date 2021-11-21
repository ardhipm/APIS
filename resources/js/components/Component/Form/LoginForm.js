import React, { useState, setState } from 'react';
import { makeStyles, withStyles, alpha } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import { Backdrop,CircularProgress, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, Link } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { userLogIn } from '../../actions';
import Splashscreen from '../Splashscreen';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    const [loading, setLoading] = React.useState(false);

    const classes = useStyles();
    let history = useHistory();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [state, setState] = useState({
        errorMsg: ""
    })

    const handleSubmit = (values) => {
        setLoading(true);
        const loginForm = {
            username: values.userName,
            password: values.password
        };

        axios.post("/api/login", {
            username: values.userName,
            password: values.password
        }).then(res => {
            if (res.data.success) {
                // //console.log(res.data.role_id);

                let user = res.data.user;
                let userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_active: user.is_active,
                    role_id: user.role_id
                }
                // dispatch(userLogIn(res.data.user));


                if (user.is_active == 1) {
                    setLoading(false);
                    setOpenSplashScreen(true);
                    setTimeout(() => {
                        localStorage.setItem("authToken", res.data.access_token);
                        localStorage.setItem("SOURCE_TO_CHOICE", false);
                        localStorage.setItem("user", JSON.stringify(userData));

                        setTimeout(function () { //Start the timer
                            //console.log('start') //After 1 second, set render to true
                            if (res.data.user.role_id == 1) {
                                history.push({ pathname: "/pelanggan/paket", state: { role: "pelanggan" } });
                                // const test = React.createContext(history.location.state.role);
                            }
                            if (res.data.user.role_id == 2) {
                                history.push({ pathname: "/admin/pengguna", state: { role: "superadmin" } });
                                localStorage.setItem("FIRST_TERMS", false)
                                window.location.reload();
                            }
                            if (res.data.user.role_id == 3) {
                                history.push({ pathname: "/admin/pelanggan", state: { role: "admin" } });
                                localStorage.setItem("FIRST_TERMS", false)
                                window.location.reload();
                            }
                        }.bind(this), 3)


                        setOpenSplashScreen(false)
                    }, 8000)
                } else {
                    setLoading(false);
                    setState(prevState => ({
                        ...prevState,
                        errorMsg: 'User tidak Aktif.'
                    }));
                    return null;

                }

            } else {
                setLoading(false);
                setState(prevState => ({
                    ...prevState,
                    errorMsg: 'Username tidak di temukan.'
                }));
                return null;

            }

        }).catch(error => {
                setLoading(false);
                setState(prevState => ({
                    ...prevState,
                    errorMsg: 'Username tidak di temukan.'
                }));
                return null;

                //console.log(error);
            })


    }

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {

            handleSubmit(values);
        },
    });

    return (

        <form className={classes.formLogin} onSubmit={formik.handleSubmit}>
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
                                defaultValue={false}
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
                        {state.errorMsg}
                    </Typography>
                </Grid>
            </Grid>
            <Splashscreen open={openSplashScreen} />
            <Backdrop style={{ zIndex: 1000, color: '#fff', }}
                open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </form>


    );
}

export default LoginForm;