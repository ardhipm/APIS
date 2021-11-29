import { Backdrop, Button, Checkbox, CircularProgress, Container, Grid, Typography } from '@material-ui/core';

import React, { useEffect } from 'react';
import AddSubPackageDialog from '../../Popup/AddSubPackageDialog';
import SubPackageItem from './SubPackageItem';
import { Icon } from '@iconify/react';
import WarningDialog from '../../Popup/WarningDialog';
import { useParams } from 'react-router';
import axios from 'axios';

const initial = {
    subPackageName: "",
    subPackageDetail: "",
    editPhotoQuantity: 0,
    isSelected: false
}

const FormPaketPelanggan = (props) => {
    let { customerId } = useParams();

    const [openSubPackagePopup, setOpenSubPackagePopup] = React.useState(false);
    const [dataPackage, setDataPackage] = React.useState(props.formik.values);
    const [currentSubDetail, setCurrentSubDetail] = React.useState(initial);
    const [subIndex, setSubIndex] = React.useState(0);
    const [checkAll, setCheckAll] = React.useState(false);
    const [subLength, setSubLength] = React.useState(0);
    const [showHapus, setShowHapus] = React.useState(false);
    const [popupDeleteSub, setPopupDeleteSub] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // let formik = props.formik;
    // //console.log(formik.values);

    useEffect(() => {
        setDataPackage(props.formik.values)
        setSubLength(props.formik.values.subPackage.length);
    }, [props.formik.values])

    const handleEdit = (e) => {
        props.openEditPopup(e);
    }

    const handleDelete = () => {
        setPopupDeleteSub(true);
    }


    const handleItemCheck = (isSelect, index) => {
        setDataPackage(prevState => {
            let currentData = prevState;

            currentData.subPackage[index].isSelected = isSelect;

            let isShow = false;
            currentData.subPackage.map(item => {

                isShow = isShow || item.isSelected;

            })

            setShowHapus(isShow);
            // //console.log(isShow);

            return currentData;

        })
    }

    const handleTitleCheck = (e) => {
        setCheckAll(e.target.checked);
        setDataPackage(prevState => {
            let currentData = prevState;

            let isShow = false;
            currentData.subPackage.map(item => {
                item.isSelected = e.target.checked;
                isShow = isShow || item.isSelected;
            })

            setShowHapus(isShow);

            return currentData;
        })
    }


    const handleOpenSubPackagePopup = (event, item, isNewSub, index) => {
        setSubIndex(index);
        if (!isNewSub) {
            setCurrentSubDetail(prevState => {
                return {
                    ...prevState,
                    subPackageName: item.subPackageName,
                    subPackageDetail: item.subPackageDetail,
                    editPhotoQuantity: item.editPhotoQuantity,
                    isSelected: item.isSelected
                }
            })
        } else {
            setCurrentSubDetail(prevState => {
                return {
                    ...prevState,
                    isSelected: checkAll
                }
            })
        }

        setOpenSubPackagePopup(true);

    }

    const handleCloseSubPackagePopup = () => {
        setCurrentSubDetail(prevState => {
            return {
                ...prevState,
                subPackageName: "",
                subPackageDetail: "",
                editPhotoQuantity: 0,
                isSelected: false
            }
        })
        setOpenSubPackagePopup(false);
    }


    const handleSubmitSubPackagePopup = (data, index) => {
        setDataPackage(prevState => {
            let currentData = prevState;
            if (index != undefined) {
                currentData.subPackage[index].subPackageName = data.subPackageName;
                currentData.subPackage[index].subPackageDetail = data.subPackageDetail;
                currentData.subPackage[index].editPhotoQuantity = data.editPhotoQuantity;
                currentData.subPackage[index].isSelected = data.isSelected;
            } else {
                currentData.subPackage.push(data);
            }

            return currentData;
        })
        setSubLength(dataPackage.subPackage.length);
        props.setPackageData(data);
    }

    const handleSubPackageDetail = (data) => {
        setCurrentSubDetail(data);
    }

    const popup = (openSubPackagePopup ? <AddSubPackageDialog
        index={subIndex}
        open={openSubPackagePopup}
        item={currentSubDetail}
        onClose={handleCloseSubPackagePopup}
        onSubmit={handleSubmitSubPackagePopup} /> : null);


    return (
        <Grid container spacing={2} style={{ display: 'grid' }}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Nama Paket
                                    </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" >
                                    {dataPackage.packageName}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={6} align="right" >
                        <Button id="editPackageButton" onClick={handleEdit} variant="contained" color="primary"
                            endIcon={<Icon icon="bx:bx-edit" style={{ color: 'white' }} />}
                            style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                            Ubah
                         </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Deskripsi
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                    {dataPackage.packageDescription}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                Limit Foto Album
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                    {dataPackage.albumPhotoQuantity}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Limit Foto Cetak
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                    {dataPackage.printPhotoQuantity}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={0}>
                            {subLength > 0 ? <Grid item xs={1}>
                                <Checkbox checked={checkAll} onChange={handleTitleCheck} />
                            </Grid> : null}

                            <Grid item xs={subLength > 0 ? 5 : 6}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Sub Paket
                                </Typography>
                            </Grid>
                            <Grid item xs={3} align="right">
                                {subLength > 0 ? <Button onClick={handleDelete} style={{ fontSize: '12px', textTransform: 'capitalize' }} variant="contained" color="primary" disabled={!showHapus}
                                    endIcon={<Icon icon="bx:bx-trash-alt" style={{ color: 'white' }} />} >
                                    Hapus
                                </Button> : null}
                            </Grid>
                            <Grid item xs={3} align="right">
                                <Button style={{ fontSize: '12px', textTransform: 'capitalize' }} variant="contained" color="primary"
                                    endIcon={<Icon icon="bx:bx-plus" style={{ color: 'white' }} />}
                                    onClick={(e) => handleOpenSubPackagePopup(e, currentSubDetail, true)}>
                                    Sub Paket
                                    </Button>
                            </Grid>

                            {/* <Grid item xs={12}>
                                <Typography variant="subtitle2">
                                    Test Deskripsi Paket, paket ini merupakan paket yang tidak laku
                            </Typography>
                            </Grid> */}
                        </Grid>

                    </Grid>
                    {subLength > 0 ? dataPackage.subPackage.map((item, index) => {
                        return (<SubPackageItem
                            handleItemCheck={handleItemCheck}
                            isSelected={checkAll || item.isSelected}
                            key={index}
                            index={index}
                            title={item.subPackageName}
                            desc={item.subPackageDetail}
                            editQty={item.editPhotoQuantity}
                            onDetail={handleOpenSubPackagePopup} />)
                    }) : null}
                </Grid>

            </Grid>
            {popup}
            <WarningDialog 
                open={popupDeleteSub}
                text="Anda ingin menghapus sub package ?"
                showConfirmButton={true}
                handleClose={() =>{
                    setPopupDeleteSub(false);
                }}
                handleConfirm={() =>{
                    setDataPackage(prevState => {
                        setLoading(true);
                        let currentData = prevState;
                        const saveData = currentData.subPackage.filter(x => !x.isSelected);
                        const deleteData = currentData.subPackage.filter(x => x.isSelected);
                        
                        
                        if(customerId){
                            // //console.log(deleteData);  
                            let list_delete_sub_package =[]
                            deleteData.map(item => {

                                list_delete_sub_package.push(
                                    {
                                        "id_sub_package" : item.idSubPackage,
                                        "sub_package_name": item.subPackageName
                                    }
                                );
                            })
                            // //console.log(list_delete_sub_package);
                            const token = localStorage.getItem('authToken');
                            let requestData = {
                                "id_customer": customerId,
                                "list_delete_sub_package": list_delete_sub_package
                            }
                            
                            axios.request({
                                data: requestData,
                                method: 'post',
                                url: '/api/customer/sub_package/delete_multiple',
                                headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
                            })
                                .then(res => {
                                    setLoading(false);
                    
                                })
                                .catch(error => {
                                    setLoading(false);
                                    // //console.log(error);
                                    // //console.log('error here');
                    
                                })  
                        }else{
                            setLoading(false);
                        }
                        currentData.subPackage = saveData;

                        return currentData;
                    })
            
                    setSubLength(dataPackage.subPackage.length);
            
                    setCheckAll(false);
                    setPopupDeleteSub(false);
                }} />
                <Backdrop style={{zIndex: 1000,color: '#fff',}} 
                    open={loading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
        </Grid >
    )
}

export default FormPaketPelanggan;