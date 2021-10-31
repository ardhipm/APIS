import { InputLabel, TextField, Typography,Button,MenuItem,
	Select,
    FormControl, Modal,
    Fade,
    Backdrop,
    makeStyles,
    CircularProgress,
    InputAdornment,
    IconButton, } from '@material-ui/core';
import React,{useRef,useEffect, useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import {Formik, validateYupSchema} from 'formik'
import {patchMemberAdmin, getAdminMemberDetail,addMemberAdmin} from '../../../Redux/Admin/action';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Cancel, CheckCircle } from '@material-ui/icons';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import { useMinimalSelectStyles } from '@mui-treasury/styles/select/minimal';
const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '0px',
      borderRadius:"15px",
      width:"30%",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
  }));
function FormulirAdminMember() {
    const history = useHistory();
    const classes = useStyles();
    const detailAdmin = useSelector((state) => state.admin.detailAdmin.data);
    const {adminId} = useParams();
    // console.log({adminId})
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [modalsSuccses, setmodalsSuccses] = React.useState(false);
    const [modalsFail, setmodalsFail] = React.useState(false);
    const [loading,setLoading] = React.useState(false);

    const handleOpenModalSuccess = () => {
    setmodalsSuccses(true);
    };
    const handleCloseModalSuccess = () => {
    setmodalsSuccses(false);
    };
    const handleOpenModalFail = () => {
        setmodalsFail(true);
      };
      const handleCloseModalFail= () => {
        setmodalsFail(false);
      };
    // const minimalSelectClasses = useMinimalSelectStyles();
    //console.log(adminId)
    useEffect(async() => {
        setLoading(true)
       const resp = await dispatch(getAdminMemberDetail(adminId))
        if(resp.type == 'GET_ADMIN_MEMBER_DETAIL_SUCCESS' || 'GET_ADMIN_MEMBER_DETAIL_FAIL'){
            setLoading(false)
        }
      }, []);
    //   //console.log(detailAdmin.is_active)
    const dispatch = useDispatch();
    // const formRef = useRef();
    const formData = (
        <Formik
            // innerRef={formRef}
            initialValues={ 
                !adminId ? {} :
            {
                username:detailAdmin?.username,
                plain_password:detailAdmin?.plain_password,
                invoice_no: detailAdmin?.invoice_no,
                is_active:detailAdmin?.is_active,
                email:detailAdmin?.email
            }}
            enableReinitialize={true}
            validate={(values)=>{
                const errors ={};
                if(!values.plain_password){
                    errors.plain_password = 'Mohon Masukan Password';
                }
                if(!values.username){
                    errors.username = 'Mohon Masukan Username';
                }
                if(!values.email){
                    errors.email = 'Mohon Masukan Email';
                }
                if(values.plain_password !== values.rewrite_password){
                    errors.rewrite_password = 'Mohon Masukan Password Yang Benar';
                }
                console.log(errors)
                return errors;
            }}
            onSubmit={async(values,{setSubmitting})=>{
                const payload ={
                    // costumers_id:2,
                    // invoice_no:values.invoice_no,
                    username:values.username,
                    is_active:values.is_active,
                    id_customer:adminId,
                    role_id:3,
                    password: values.plain_password,
                    email:values.email
                }
                if(adminId){
                    const resp = await dispatch(patchMemberAdmin(payload,adminId));
                    if(resp.type === 'PATCH_MEMBER_ADMIN_SUCCESS'){
                        handleOpenModalSuccess();
                    }else{
                        handleOpenModalFail();
                    }
                }else{
                    const resp = await dispatch(addMemberAdmin(payload));
                    if(resp.type === 'ADD_MEMBER_ADMIN_SUCCESS'){
                        handleOpenModalSuccess();
                    }else{
                        handleOpenModalFail();
                    }
            }
                setSubmitting(false);
            }}
        >{({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
            dirty,
            setFieldValue,
        }) =>(

            <div>
                <Typography variant="h4">
               <b>Edit Admin</b> 
            </Typography>
            <div>
                <div className="pelanggan">
                <InputLabel style={{marginBottom:10,marginTop:10}}><b>Username</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        value={values.username}
                        error={errors.username}
                        helperText={errors.username}
                        onChange={handleChange('username')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Email</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        value={values.email}
                        error={errors.email}
                        helperText={errors.email}
                        onChange={handleChange('email')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Kata Sandi</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        type={showPassword ? 'text' : 'password'}
                        value={values.plain_password}
                        error={errors.plain_password}
                        helperText={errors.plain_password}
                        onChange={handleChange('plain_password')}
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
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Ulangi Kata Sandi</b></InputLabel>
                    <TextField
                        style={{
                            width:"100%"
                        }}
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        type="password"
                        value={values.rewrite_password}
                        error={errors.rewrite_password}
                        helperText={errors.rewrite_password}
                        onChange={handleChange('rewrite_password')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Status</b></InputLabel>
                    <FormControl size="small" style={{
                        width:"100%"
                    }}>
                    <Select
                        variant="outlined"
                        style={{ width: '100%' }}
                        // IconComponent={iconComponent}
                        value={values.is_active || ''}
                        error={errors.is_active}
                        helperText={errors.is_active}
                        onChange={handleChange('is_active')}>
                        <MenuItem value={0}>
                            Tidak Aktif
                        </MenuItem>
                        <MenuItem value={1}>
                            Aktif
                        </MenuItem>
                    </Select>
                    </FormControl>
                </div>
            </div>
            <Button 
                onClick={handleSubmit}
                disabled={!dirty || !isValid || isSubmitting}
                style={{textTransform:"capitalize",
                backgroundColor:"#000", 
                color:"#FFF", 
                position:"absolute",
                bottom:"0",
                marginBottom:"12px",
                width:"80%"}}>
                Simpan
            </Button>
            </div>
        )
        
        }

        </Formik>
    )
    return (
        <div>
          {formData}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalsSuccses}
            onClose={handleCloseModalSuccess}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout:500
            }}
          >
              <Fade in={modalsSuccses}>
                  <div className={classes.paper} align="center">
                    <div labelStyle={{ fontSize: '200%' }} align="center">
                    <CheckCircle style={{
                        fontSize:100,
                        color:"#6ECB63"
                    }}/>
                    </div>
                    <h2 id="transition-modal-title">
                        Data Admin Berhasil Di Tambahkan
                    </h2>
                    <Button
                        style={{
                            textTransform:"capitalize",
                            backgroundColor:"#000", 
                            color:"#FFF", 
                            width:"100%"
                        }}
                        onClick={()=>{
                            history.push('/admin/pengguna')
                            handleCloseModalSuccess();
                        }}
                    >
                        Ok
                    </Button>
                    </div>
              </Fade>
          </Modal>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalsFail}
            onClose={handleCloseModalFail}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout:500
            }}
          >
              <Fade in={modalsFail}>
                  <div className={classes.paper} align="center">
                    <div labelStyle={{ fontSize: '200%' }} align="center">
                    <Cancel style={{
                        fontSize:100,
                        color:"#FF4848"
                    }}/>
                    </div>
                    <h2 id="transition-modal-title">
                        Data Admin Gagal Di Tambahkan
                    </h2>
                    <Button
                        style={{
                            textTransform:"capitalize",
                            backgroundColor:"#000", 
                            color:"#FFF", 
                            width:"100%"
                        }}
                        onClick={()=>{
                            history.push('/admin/pengguna')
                            handleCloseModalFail();
                        }}
                    >
                        Ok
                    </Button>
                    </div>
              </Fade>
          </Modal>
          <Backdrop className={classes.backdrop} open={loading} >
            <CircularProgress color="inherit" />
        </Backdrop>
        </div>
    );
}

export default FormulirAdminMember;