import { InputLabel, TextField, Typography,Button, Modal,
    Fade,
    Backdrop,
    makeStyles,
    CircularProgress} from '@material-ui/core';
import React,{useEffect} from 'react';
// import AddIcon from '@material-ui/icons/Add';
import {Formik} from 'formik'
import {patchShipmentAdmin,getAdminShipmentDetail} from '../../../Redux/Admin/action';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Cancel, CheckCircle } from '@material-ui/icons';

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
function EditDataLogistik(props) {
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
    const shipmentDetail = useSelector((state) => state.admin.detailShipment.data);
    const {customerId} = useParams();
    // //console.log(customerId)
    
      useEffect(async() => {
        setLoading(true)
       const resp = await dispatch(getAdminShipmentDetail(customerId))
        if(resp.type == 'GET_ADMIN_SHIPMENT_DETAIL_SUCCESS' || 'GET_ADMIN_SHIPMENT_DETAIL_FAIL'){
            setLoading(false)
        }
      }, []);
    // //console.log(getAdminInvoiceDetail)

    const dispatch = useDispatch();
    const formData = (
        <Formik
            // innerRef={formRef}
            initialValues={{
                customer_name:shipmentDetail.customer_name,
                receipt_link: shipmentDetail.receipt_link,
                receipt_no:shipmentDetail.receipt_no,
            }}
            enableReinitialize={true}
            validate={(values)=>{
                const errors ={};

                if(!values.customer_name){
                    errors.customer_name = 'Mohon Masukan Nama Pelanggan';
                }
                if(!values.receipt_link){
                    errors.costumers_id = 'Mohon Masukan Link Resi';
                }
                if(!values.receipt_no){
                    errors.costumers_id = 'Mohon Masukan Nomor Resi';
                }
                return errors;
            }}
            onSubmit={async(values,{setSubmitting})=>{
                const payload ={
                    // costumers_id:2,
                    receipt_link:values.receipt_link,
                    receipt_no:values.receipt_no,
                }
                const resp = await dispatch(patchShipmentAdmin(payload,customerId));
                if(resp.type === 'PATCH_SHIPMENTS_ADMIN_SUCCESS'){
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
               <b>Edit Logistik</b> 
            </Typography>
            <div>
                <div className="pelanggan">
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Nama Pelanggan</b></InputLabel>
                    <TextField
                        id="outlined-size-small"
                        variant="outlined"
                        style={{
                            width:"100%"
                        }}
                        size="small"
                        value={values.customer_name}
                        error={errors.customer_name}
                        helperText={errors.customer_name}
                        onChange={handleChange('customer_name')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>Link Resi</b></InputLabel>
                    <TextField
                        style={{
                            width:"100%"
                        }}
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        value={values.receipt_link}
                        error={errors.receipt_link}
                        helperText={errors.receipt_link}
                        onChange={handleChange('receipt_link')}
                    />
                    <InputLabel style={{marginBottom:10,marginTop:10}}><b>No Resi</b></InputLabel>
                    <TextField
                        style={{
                            width:"100%"
                        }}
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        value={values.receipt_no}
                        error={errors.receipt_no}
                        helperText={errors.receipt_no}
                        onChange={handleChange('receipt_no')}
                    />
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
                        Data Logistik Berhasil Di Update
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
                        Data Logistik Gagal Di Update
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
          <Backdrop className={classes.backdrop} open={loading} >
            <CircularProgress color="inherit" />
        </Backdrop>
        </div>
    );
}

export default EditDataLogistik;