import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Container, Grid, Typography } from '@material-ui/core';


const AddSubPackageDialog = (props) => {
    const [currentSubPackageData, setCurrentSubPackageData] = React.useState(props.item);

    

    // //console.log(currentSubPackageData);
    const handleClose = (event) => {
        // //console.log(event);
        props.onClose();
    }

    const handleSubmit = () => {
        props.onSubmit(currentSubPackageData, props.index);
        props.onClose();
    }

    const handleSubPackageName = (e) => {
        setCurrentSubPackageData(prevState => {
            return {
                ...prevState,
                subPackageName: e.target.value
            }
        })
    }

    const handleSubPackageDesc = (e) => {
        setCurrentSubPackageData(prevState => {
            return {
                ...prevState,
                subPackageDetail: e.target.value
            }
        })
    }

    const handleEditQty = (e) => {
        setCurrentSubPackageData(prevState => {
            return {
                ...prevState,
                editPhotoQuantity: e.target.value
            }
        })
    }

    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Tambah Sub Paket</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="subPackageName"
                            label="Nama Sub Paket"
                            type="text"
                            value={currentSubPackageData.subPackageName}
                            onChange={handleSubPackageName}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            id="subPackageDescription"
                            label="Deskripsi"
                            value={currentSubPackageData.subPackageDetail}
                            type="text"
                            onChange={handleSubPackageDesc}
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            id="photoEditQuantity"
                            label="Kuantitas Edit Foto"
                            value={currentSubPackageData.editPhotoQuantity}
                            type="text"
                            onChange={handleEditQty}
                            fullWidth
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary">
                    Simpan
                </Button>
            </DialogActions>
        </Dialog>

    );

}

export default AddSubPackageDialog;