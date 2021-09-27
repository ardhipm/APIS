import { FormControlLabel, FormGroup, Grid, InputLabel, makeStyles, TextField, Switch } from '@material-ui/core';
import { Form } from 'formik';
import React from 'react';
import { patchShipmentAdmin } from '../../../Redux/Admin/action';
const useStyles = makeStyles({
    layout: {
        paddingRight: '10px',
        paddingRight: '10px',
    },
    formLabel: {
        fontSize: 18 + 'px',
        color: 'black',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    errorMsg: {
        color: 'red',
        paddingTop: '8px'
    }
});

const FormPersonalPelanggan = (props) => {
    let formik = props.formik;

    const classes = useStyles();

    const [isActive, setIsActive] = React.useState(formik.values.isActive);

    return (
        <FormGroup>
            <Grid container className={classes.layout} spacing={4}>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel}>Nama Lengkap</InputLabel>
                    <TextField
                        id="fullName"
                        name="fullName"
                        variant="outlined"
                        size="small"
                        type="text"
                        fullWidth
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.fullName && formik.errors.fullName}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} >
                        Nama Pasangan
                    </InputLabel>
                    <TextField
                        id="partnerName"
                        name="partnerName"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formik.values.partnerName}
                        onChange={formik.handleChange}
                        error={formik.touched.partnerName && Boolean(formik.errors.partnerName)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.partnerName && formik.errors.partnerName}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} >
                        No. Ponsel
                                </InputLabel>
                    <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.phoneNumber && formik.errors.phoneNumber}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} >
                        Email
                    </InputLabel>
                    <TextField
                        id="email"
                        name="email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.email && formik.errors.email}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} >
                        Nama Pengguna
                    </InputLabel>
                    <TextField
                        id="userName"
                        name="userName"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.userName && formik.errors.userName}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel} >
                        Kata Sandi
                </InputLabel>
                    <TextField
                        id="password"
                        name="password"
                        variant="outlined"
                        type="password"
                        size="small"
                        fullWidth
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.password && formik.errors.password}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel}>
                        Ulangi Kata Sandi
                    </InputLabel>
                    <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        variant="outlined"
                        type="password"
                        size="small"
                        fullWidth
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    />
                    <span className={classes.errorMsg}>{formik.touched.confirmPassword && formik.errors.confirmPassword}</span>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel className={classes.formLabel}>
                        Status
                    </InputLabel>
                    <FormControlLabel 
                        control={<Switch checked={formik.values.isActive} onChange={e => {
                            setIsActive(!isActive);

                            formik.setFieldValue('isActive', !isActive);
                        }} />} 
                        label={formik.values.isActive ? "Aktif" : "Tidak Aktif"} />
                </Grid>

            </Grid>

        </FormGroup>

    );
}

export default FormPersonalPelanggan;