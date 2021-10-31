import { InputLabel, TextField, Typography,Button,MenuItem,
	Select,
    FormControl,
    Modal,
    Fade,
    Backdrop,
    makeStyles 
} from '@material-ui/core';
import React from 'react';
// import AddIcon from '@material-ui/icons/Add';
import {Formik} from 'formik'
import {addMemberAdmin} from '../../../Redux/Admin/action';
import { useDispatch } from 'react-redux';
import { Cancel, CheckCircle } from '@material-ui/icons';
// import { useParams } from 'react-router';
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
  }));
function TambahAdmin() {
    const classes = useStyles();
    const [modalsSuccses, setmodalsSuccses] = React.useState(false);
    const [modalsFail, setmodalsFail] = React.useState(false);
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

    const dispatch = useDispatch();
    // const formRef = useRef();
    const formData = (
        <Formik
            // innerRef={formRef}
            initialValues={{}}
            enableReinitialize={true}
            validate={(values)=>{
                const errors ={};
                if(!values.plain_password){
                    errors.plain_password = 'Mohon Masukkan Kata Sandi';
                }
                if(!values.username){
                    errors.username = 'Mohon Masukkan Username';
                }
                if(!values.email){
                    errors.email = 'Mohon Masukkan Email';
                }
                if(values.plain_password !== values.rewrite_password){
                    errors.rewrite_password = 'Mohon Masukkan Kata Sandi Yang Benar';
                }
                //console.log(errors)
                return errors;
            }}
            onSubmit={async(values,{setSubmitting})=>{
                const payload ={
                    // costumers_id:2,
                    // invoice_no:values.invoice_no,
                    username:values.username,
                    password: values.plain_password,
                    email:values.email
                }
                    const resp = await dispatch(addMemberAdmin(payload));
                    if(resp.type === 'ADD_MEMBER_ADMIN_SUCCESS'){
                        handleOpenModalSuccess();
                    }else{
                        handleOpenModalFail();
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
               <b>Formulir Admin</b> 
            </Typography>
            <div style={{margin:30}}>
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
                        type="password"
                        value={values.plain_password}
                        error={errors.plain_password}
                        helperText={errors.plain_password}
                        onChange={handleChange('plain_password')}
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
                        value={values.is_active}
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
                width:"100%"}}>
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
                        onClick={handleCloseModalSuccess}
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
                        onClick={handleCloseModalFail}
                    >
                        Ok
                    </Button>
                    </div>
              </Fade>
          </Modal>
        </div>
    );
}

export default TambahAdmin;