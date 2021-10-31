import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, Grid } from '@material-ui/core';


const AddPackageDialog = (props) => {
  const [currentPackageData, setCurrentPackageData] = React.useState(props.item);
  const [isError, setIsError] = React.useState(false);

  let formik = props.formik;

  const handleClose = () => {
    props.onClose();
  }

  const handleSubmit = () => {
    // //console.log(currentPackageData);
    // setCurrentPackageData(prevState => {
    //   return {
    //     ...prevState,
    //     packageName : formik.values.packageName,
    //     packageDescription : formik.values.packageDescription,
    //   }
    // })
    // if(currentPackageData.packageName.length > 0 && currentPackageData.packageDescription.length > 0){
    props.onSubmitPackage(currentPackageData);
    props.onClose();
    //   setIsError(false);
    // }else{
    //   setIsError(true);
    // }

  }

  const handlePackageName = (e) => {
    setCurrentPackageData(prevState => {
      return {
        ...prevState,
        packageName: e.target.value
      }
    })
  }

  const handlePackageDescription = (e) => {
    setCurrentPackageData(prevState => {
      return {
        ...prevState,
        packageDescription: e.target.value
      }
    })
  }


  return (
    <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Tambah Paket</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="packageName"
              label="Nama Paket"
              type="text"
              // value={currentPackageData.packageName}
              value={formik.values.packageName}
              // onChange={handlePackageName}
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="packageDescription"
              label="Deskripsi"
              type="text"
              multiline
              // value={currentPackageData.packageDescription}
              value={formik.values.packageDescription}
              // onChange={handlePackageDescription}
              onChange={formik.handleChange}

              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              id="albumPhotoQuantity"
              label="Limit Foto Album"
              value={formik.values.albumPhotoQuantity}
              type="text"
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoFocus
              margin="dense"
              id="printPhotoQuantity"
              label="Limit Foto Cetak"
              value={formik.values.printPhotoQuantity}
              type="text"
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" >
          Simpan
        </Button>
        {isError && <Typography style={{ color: 'red' }} variant="h6">
          Nama package dan deskripsi tidak boleh kosong
        </Typography>}
      </DialogActions>
    </Dialog>

  );

}

export default AddPackageDialog;