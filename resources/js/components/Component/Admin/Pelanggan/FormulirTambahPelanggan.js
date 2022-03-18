import { InputLabel, TextField, Typography, Button, FormControlLabel, Grid, withStyles, InputBase, alpha, makeStyles, Backdrop, CircularProgress, setRef, Tooltip } from '@material-ui/core';
import React, { useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AddPackageDialog from '../../Popup/AddPackageDialog';
import AddSubPackageDialog from '../../Popup/AddSubPackageDialog';
import FormPaketPelanggan from './FormPaketPelanggan';
import { Switch, useParams } from 'react-router';
import FormPersonalPelanggan from './FormPersonalPelanggan';
import axios from 'axios';
import SuccessDialog from '../../Popup/SuccessDialog';
import ErrorDialog from '../../Popup/ErrorDialog';
import IconButton from '@material-ui/core/IconButton';
import { Autorenew, FolderOpen } from '@material-ui/icons';
import { Refresh } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenConfirmDialog, confirmDialogType } from '../../../Redux/User/features/confirmdialog/confirmdialog.action';
import ConfirmationDialog from '../../Popup/ConfirmationDialog';
import LoadingSnackbar from '../../User/OriginPhotoPage/LoadingSnackbar';
import PhotoAlert from '../../User/OriginPhotoPage/PhotoAlert';
import { setOpenLoadingPopup } from '../../../Redux/Popup/Loading/loading.action';

const useStyles = makeStyles((theme) => ({

    formLabel: {
        fontSize: 18 + 'px',
        color: 'black',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    errorMsg: {
        color: 'red',
        paddingTop: '8px'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


const customerSchema = Yup.object().shape({
    fullName: Yup.string('Masukkan Nama Lengkap').required('Nama Lengkap Dibutuhkan'),
    partnerName: Yup.string('Masukkan Nama Pasangan').required('Nama Pasangan Dibutuhkan'),
    phoneNumber: Yup.string('Masukkan Nomor Telepon').matches(phoneRegExp, 'Nomor Telepon tidak valid').required('Nomor Telepon Dibutuhkan'),
    email: Yup.string('Masukkan email pelanggan').email('Email tidak valid').required('Email dibutuhkan'),
    userName: Yup.string('Masukkan Nama Pengguna').required('Nama Pengguna Dibutuhkan'),
    password: Yup.string('Masukkan Kata Sandi Anda').when("oldPassword", {
        is: value => value && value.length > 0,
        then: Yup.string(),
        otherwise: Yup.string().required("Kata Sandi dibutuhkan")
    }),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Kata sandi harus sesuai'),
    oldPassword: Yup.string(),
    packageName: Yup.string('Masukkan Nama Paket').required('Nama Paket Dibutuhkan'),
    packageDescription: Yup.string('Masukkan Deskripsi Paket'),
    albumPhotoQuantity: Yup.number().min(0).integer().required('Limit Foto Album dibutuhkan'),
    printPhotoQuantity: Yup.number().min(0).integer().required('Limit Foto Cetak dibutuhkan'),
    subPackage: Yup.array().min(1, 'Minimal memiliki 1 sub paket')
});

let dummySubPaketData = {
    packageName: "",
    packageDescription: "",
    subPackage: []
}

let initValue = {
    fullName: '',
    partnerName: '',
    phoneNumber: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    isActive: true,
    restrictDelete: false,
    packageName: '',
    packageDescription: '',
    albumPhotoQuantity: 0,
    printPhotoQuantity: 0,
    subPackage: [],
};


function FormulirTambahPelanggan(props) {

    let { customerId } = useParams();
    const classes = useStyles();
    const adminProps = useSelector((state) => state.admin);
    const allProps = useSelector((state) => state);
    const dispatch = useDispatch();

    const [openPackagePopup, setOpenPackagePopup] = React.useState(false);
    const [dataPackage, setDataPackage] = React.useState(dummySubPaketData);
    const [showPackageForm, setShowPackageForm] = React.useState(false);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    const [alertPopup, setAlertPopup] = React.useState(false);
    const [isErrorPopup, setIsErrorPopup] = React.useState(false);
    const [alertText, setAlertText] = React.useState("Tambah pelanggan berhasil")
    const [refreshPopup, setRefreshPopup] = React.useState(false);
    const [linkToFolderDrive, setLinkToFolderDrive] = React.useState('');

    const handleCreateCustomer = (values) => {
        setSubmitLoading(true);

        let subPackage = [];

        values.subPackage.map((item) => {
            subPackage.push({
                "sub_package_name": item.subPackageName,
                "sub_package_description": item.subPackageDetail,
                "num_edit_photo": item.editPhotoQuantity,
            })
        })

        let requestData = {
            "username": values.userName,
            "email": values.email,
            "is_active": values.isActive,
            "role_id": "1",
            "name": values.fullName,
            "phone_no": values.phoneNumber,
            "partner_name": values.partnerName,
            "restrict_delete": values.restrictDelete,
            "password": values.password,
            "password_confirmation": values.confirmPassword,
            "package_name": values.packageName,
            "package_description": values.packageDescription,
            "num_album_photo": values.albumPhotoQuantity,
            "num_print_photo": values.printPhotoQuantity,
            "sub_package": subPackage
        }


        const token = localStorage.getItem('authToken');

        axios.request({
            data: requestData,
            method: 'post',
            url: '/api/admin/register_customer',
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                if (res.data.success == true) {
                    setIsErrorPopup(false);

                } else {
                    setIsErrorPopup(true);
                }

                setSubmitLoading(false);
                setAlertPopup(true);


                if (res.data.success == true) {
                    setTimeout(() => {
                        window.location.href = "/admin/pelanggan";
                    }, 2000);
                }

            })
            .catch(error => {
                // //console.log(error);
                // //console.log('error here');
                setSubmitLoading(false);
                setIsErrorPopup(true);
                setAlertPopup(true);

            })
    }

    const handleUpdateCustomer = (values) => {
        setSubmitLoading(true);

        let subPackage = [];

        values.subPackage.map((item) => {
            subPackage.push({
                "id_sub_package": item.idSubPackage || null,
                "sub_package_name": item.subPackageName,
                "sub_package_description": item.subPackageDetail,
                "num_edit_photo": item.editPhotoQuantity,
            })
        })

        const token = localStorage.getItem('authToken');

        let requestData = {
            "id_user": values.idUser,
            "id_customer": values.idCustomer,
            "id_package": values.idPackage,
            "username": values.userName,
            "email": values.email,
            "is_active": values.isActive,
            "role_id": "1",
            "name": values.fullName,
            "restrict_delete": values.restrictDelete,
            "phone_no": values.phoneNumber,
            "partner_name": values.partnerName,
            "password": values.password,
            "password_confirmation": values.confirmPassword,
            "package_name": values.packageName,
            "package_description": values.packageDescription,
            "num_album_photo": values.albumPhotoQuantity,
            "num_print_photo": values.printPhotoQuantity,
            "sub_package": subPackage
        }

        axios.request({
            data: requestData,
            method: 'post',
            url: '/api/customer/updateCustomer',
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        })
            .then(res => {
                if (res.data.success == true) {
                    setIsErrorPopup(false);
                } else {
                    setIsErrorPopup(true);
                }

                setSubmitLoading(false);
                setAlertPopup(true);

                setTimeout(() => {
                    window.location.href = "/admin/pelanggan";
                }, 2000);

            })
            .catch(error => {
                // //console.log(error);
                // //console.log('error here');
                setSubmitLoading(false);
                setIsErrorPopup(true);
                setAlertPopup(true);

            })
    }

    let formik = useFormik({
        initialValues: initValue,
        validationSchema: customerSchema,
        onSubmit: (values) => {
            if (customerId) {

                // console.log('update');
                // console.log(values);
                setAlertText("Update pelanggan berhasil")
                handleUpdateCustomer(values);
            } else {
                //console.log('insert');
                setAlertText("Tambah pelanggan berhasil")
                handleCreateCustomer(values);
            }

        },
    });

    useEffect(() => {
        if (customerId) {
            setSubmitLoading(true);
            const token = localStorage.getItem('authToken');
            //console.log("true")
            axios.request({
                method: 'get',
                url: '/api/customer/show/' + customerId,
                headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
            })
                .then(res => {

                    if (res.data.success == true) {


                        let values = res.data.data;
                        //console.log('data')
                        // //console.log(values);

                        if (values.package_name && values.package_description) {
                            setShowPackageForm(true);
                        }

                        formik.setFieldValue('idUser', values.id_user);
                        formik.setFieldValue('idCustomer', values.id_customer);
                        formik.setFieldValue('idPackage', values.packages_id);
                        formik.setFieldValue('fullName', values.name);
                        formik.setFieldValue('partnerName', values.partner_name);
                        formik.setFieldValue('phoneNumber', values.phone_no);
                        formik.setFieldValue('email', values.email);
                        formik.setFieldValue('userName', values.username);
                        formik.setFieldValue('restrictDelete', values.restrict_delete > 0 ? true : false);
                        formik.setFieldValue('isActive', values.is_active > 0 ? true : false);
                        formik.setFieldValue('packageName', values.package_name);
                        formik.setFieldValue('packageDescription', values.package_description);
                        formik.setFieldValue('albumPhotoQuantity', values.num_album_photo);
                        formik.setFieldValue('printPhotoQuantity', values.num_print_photo);
                        formik.setFieldValue('password', values.plain_password);
                        formik.setFieldValue('confirmPassword', values.plain_password);
                        formik.setFieldValue('oldPassword', values.password);
                        setLinkToFolderDrive(values.basename_gdrive);

                        let subPackage = [];

                        values.sub_package.map((item) => {
                            let subPackageItem = {
                                idSubPackage: item.id,
                                subPackageName: item.sub_package_name,
                                subPackageDetail: item.sub_package_description,
                                editPhotoQuantity: item.num_edit_photo,
                                printPhotoQuantity: item.num_print_photo,
                                isSelected: false,
                            }
                            subPackage.push(subPackageItem);
                        })


                        formik.setFieldValue('subPackage', subPackage);

                        // //console.log(formik.values);
                        setSubmitLoading(false);
                    } else {

                    }


                })
                .catch(error => {
                    //console.log(error);
                    //console.log('error here');

                })
        } else {

            //console.log("false")

        }
    }, [])


    const handleClosealertPopup = () => {
        setAlertPopup(false);
    }

    const handleCloseRefreshPopup = () => {
        setRefreshPopup(false)
    }

    const submitPackagePopup = (packageData) => {
        setShowPackageForm(true);
    }

    const openAddPackagePopup = (event) => {
        if ((event.currentTarget.id === "packageForm" || event.currentTarget.id === "editPackageButton") && event.type === "click") {
            setOpenPackagePopup(true);
        }
    }

    const closeAddPackagePopup = () => {
        setOpenPackagePopup(false);
    }

    const openDriveLink = () => {
        window.open(`https://drive.google.com/drive/u/1/folders/${linkToFolderDrive}`, '_blank');
    }

    const handleIndexOriginPhoto = () => {
        dispatch(setOpenConfirmDialog(true, 'Foto mentah pada google drive akan terindeks, lanjutkan ?',confirmDialogType.INDEX_ORIGIN_PHOTO ))
    }

    const handleIndexChoicePhoto = () => {
        dispatch(setOpenConfirmDialog(true, 'Foto pilihan pada google drive akan terindeks, lanjutkan ?',confirmDialogType.INDEX_CHOICE_PHOTO ))
    }


    const handlePackageData = (packageData) => {
        setDataPackage(prevState => {
            return {
                ...prevState,
                packageName: packageData.packageName,
                packageDescription: packageData.packageDescription
            }
        });


        // //console.log('handlePackageDtaa ' + dataPackage);
    }

    const handleLoading = () => {
        dispatch(setOpenLoadingPopup(true, 'alskdjf'))
    }

    const showAlertPopup = (isErrorPopup ?
        <ErrorDialog
            open={alertPopup}
            text="Terdapat error ketika menambah pelanggan"
            handleClose={handleClosealertPopup} /> :
        <SuccessDialog
            open={alertPopup}
            text={alertText}
            handleClose={handleClosealertPopup} />)

    const packageElement = (showPackageForm > 0 ?
        <FormPaketPelanggan data={formik.data} formik={formik} openEditPopup={openAddPackagePopup} setPackageData={handlePackageData} />
        : <Grid container style={{ alignItems: 'center' }} justifyContent="center">
            <Grid item xs={12} style={{}}>
                <AddIcon id="packageForm" style={{ marginLeft: "45px", fontSize: "50px", cursor: "pointer" }} onClick={openAddPackagePopup} />
                <h2>Tambah Paket</h2>
            </Grid>
        </Grid>)

    

    const refreshPhotoUser = () => {
        // console.log('here')
        setSubmitLoading(true)
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'post',
            url: '/api/admin/drive/refresh_photo/param?customerId=' + customerId,
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            console.log('kesini')
            setSubmitLoading(false)
            console.log(res)
            if (res.data.success == true) {
                console.log('berhasil')
                setRefreshPopup(true);
            } else {
                setIsErrorPopup(true);
            }
        }).catch(err => {
            console.log(err)
            setSubmitLoading(false)
            setIsErrorPopup(true);
        })
    }


    return (
        <div style={{ overflow: 'auto', height: '85vh' }}>
            <div style={{ position: 'absolute', top: 0, right: 0 }}>

            </div>
            <Typography variant="h4" style={{ marginBottom: '24px' }}>
                <b>{customerId == undefined ? 'Tambah' : 'Edit'} Pelanggan</b>
                {customerId != undefined ? <Tooltip title="Buka folder drive">
                    <IconButton onClick={openDriveLink}>
                        <FolderOpen />
                    </IconButton>
                </Tooltip>:<></>}
                {customerId != undefined ?<Tooltip title="Indeks foto mentah">
                    <IconButton onClick={handleIndexOriginPhoto}>
                        <Autorenew style={{ color: '#559DCC'}} />
                    </IconButton>
                </Tooltip>:<></>}
                {customerId != undefined ?<Tooltip title="Indeks foto pilihan">
                    <IconButton onClick={handleIndexChoicePhoto}>
                        <Autorenew style={{ color: '#FB9300'}}/>
                    </IconButton>
                </Tooltip>:<></>}
                {/* <button onClick={() => console.log(allProps)}>show props</button>
                <button onClick={handleLoading}>show loading</button> */}


                {/* <Tooltip title="Indeks Foto Pilihan">
                    <IconButton onClick={refreshPhotoUser}>
                        <RefreshIcon />
                    </IconButton>
                    <Button
                        style={{ textTransform: "capitalize", backgroundColor: "#000", color: "#FFF", width: "100%", marginTop: '16px' }}
                        type="submit"
                    >
                        Test
                    </Button>
                </Tooltip> */}
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid item xs={6}>
                        <FormPersonalPelanggan formik={formik} />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container style={{ height: '100%', flexFlow: 'column', paddingLeft: '10px' }}>
                            <Grid item xs={12} className={classes.formLabel} style={{ flex: 0, marginBottom: '0px' }}>
                                Paket yang dipilih
                            </Grid>
                            <Grid item xs={12} style={formik.values.packageName.length > 0 ?
                                { backgroundColor: 'white', flex: 1, padding: '16px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '8px' } :
                                { backgroundColor: '#F3F3F3', flex: 1, justifyContent: 'center', display: 'grid' }} >
                                {packageElement}
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                <Button
                    style={{ textTransform: "capitalize", backgroundColor: "#000", color: "#FFF", width: "100%", marginTop: '16px' }}
                    type="submit"
                >
                    Simpan
                </Button>
                <span className={classes.errorMsg}>{formik.touched.packageName && formik.errors.packageName}</span>
                <span className={classes.errorMsg}>{formik.touched.packageDescription && formik.errors.packageDescription}</span>
                <span className={classes.errorMsg}>{formik.touched.subPackage && formik.errors.subPackage}</span>

                <AddPackageDialog
                    open={openPackagePopup}
                    onClose={closeAddPackagePopup}
                    item={dataPackage}
                    formik={formik}
                    onSubmitPackage={submitPackagePopup} />


                {alertPopup ? showAlertPopup : null}
                <Backdrop className={classes.backdrop} open={submitLoading} >
                    <CircularProgress color="inherit" />
                </Backdrop>

            </form>
            <SuccessDialog
                open={refreshPopup}
                text={"Sinkronisasi berhasil"}
                handleClose={handleCloseRefreshPopup} />
            <ConfirmationDialog />
            <LoadingSnackbar />
            <PhotoAlert />
        </div >
    );
}

export default FormulirTambahPelanggan;