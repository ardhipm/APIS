import { InputLabel, TextField, Typography,Button,MenuItem,
	Select,
    FormControl,
    Modal,
    Fade,
    Backdrop,
    makeStyles, 
    CircularProgress} from '@material-ui/core';
import React,{useEffect} from 'react';
// import AddIcon from '@material-ui/icons/Add';
import {Formik} from 'formik'
import {patchInvoiceAdmin, getAdminInvoiceDetail} from '../../../Redux/Admin/action';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Cancel, CheckCircle } from '@material-ui/icons';
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
function EditDataPembayaran(props) {
    const history = useHistory();
    const classes = useStyles();
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

    const invoiceDetail = useSelector((state) => state.admin.detailInvoice.data);
    const {customerId} = useParams();
    // const minimalSelectClasses = useMinimalSelectStyles();
    //console.log(customerId)
    useEffect(async() => {
        setLoading(true)
        const resp = await dispatch(getAdminInvoiceDetail(customerId))
        if(resp.type == 'GET_ADMIN_INVOICE_DETAIL_SUCCESS'){
            setLoading(false)
        }else{
            setLoading(false)
        }
      }, []);
    //   //console.log(invoiceDetail.id_payment_status)
    const dispatch = useDispatch();
    // const formRef = useRef();
    const formData = (
        <Formik
            // innerRef={formRef}
            initialValues={{
                partner_name:invoiceDetail?.partner_name,
                customer_name:invoiceDetail?.customer_name,
                invoice_no: invoiceDetail?.invoice_no,
                id_payment_status:invoiceDetail?.id_payment_status,
            }}
            enableReinitialize={true}
            validate={(values)=>{
                const errors ={};
                if(!values.customer_name){
                    errors.customer_name = 'Mohon Masukan Nama Pelanggan';
                }
                if(!values.partner_name){
                    errors.partner_name = 'Mohon Masukan Nama Pasangan';
                }
                if(!values.invoice_no){
                    errors.invoice_no = 'Mohon Masukan Nomor Struk';
                }
                // if(!values.id_payment_status){
                //     errors.id_payment_status = 'Mohon Masukan Status';
                // }
                return errors;
            }}
            onSubmit={async(values,{setSubmitting})=>{
                const payload ={
                    // costumers_id:2,
                    invoice_no:values.invoice_no,
                    id_payment_status:values.id_payment_status,
                    id_customer:customerId
                }
                const resp = await dispatch(patchInvoiceAdmin(payload,customerId));
                if(resp.type === 'PATCH_INVOICE_ADMIN_SUCCESS'){
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
               <b>Edit Pembayaran</b> 
            </Typography>
            <div style={{margin:30}}>
                <div className="pelanggan">
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Nama Pelanggan</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        value={values.customer_name || ''}
                        error={errors.customer_name}
                        helperText={errors.customer_name}
                        onChange={handleChange('customer_name')}
                    />
                     <InputLabel style={{marginBottom:10,marginTop:10}}><b>Nama Pasangan</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        value={values.partner_name}
                        error={errors.partner_name}
                        helperText={errors.partner_name}
                        onChange={handleChange('partner_name')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Nomor Struk</b></InputLabel>
                    <TextField
                        style={{
                            width:"100%"
                        }}
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        value={values.invoice_no}
                        error={errors.invoice_no}
                        helperText={errors.invoice_no}
                        onChange={handleChange('invoice_no')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Status Pembayaran</b></InputLabel>
                    <FormControl size="small" style={{
                        width:"100%"
                    }}>
                    <Select
                        variant="outlined"
                        style={{ width: '100%' }}
                        // IconComponent={iconComponent}
                        value={values.id_payment_status || 0}
                        error={errors.id_payment_status}
                        helperText={errors.id_payment_status}
                        onChange={handleChange('id_payment_status')}>
                        <MenuItem value={0}>
                            Belum Lunas
                        </MenuItem>
                        <MenuItem value={1}>
                            Lunas
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
                        Data Pembayaran Berhasil Di Update
                    </h2>
                    <Button
                        style={{
                            textTransform:"capitalize",
                            backgroundColor:"#000", 
                            color:"#FFF", 
                            width:"100%"
                        }}
                        onClick={()=>{
                            handleCloseModalSuccess();
                            history.push('/admin/pembayaran')
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
                        Data Pembayaran Gagal Di Update
                    </h2>
                    <Button
                        style={{
                            textTransform:"capitalize",
                            backgroundColor:"#000", 
                            color:"#FFF", 
                            width:"100%"
                        }}
                        onClick={()=>{
                            handleCloseModalFail();
                            // history.push('/admin/pelanggan')
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

export default EditDataPembayaran;