import { Button, Container, Grid, Typography, Checkbox } from '@material-ui/core';
import React, { useEffect } from 'react';


const SubPackageItem = (props) => {

    const [check, setCheck] = React.useState(props.isSelected)

    const handleCheck = () => {
        setCheck(!check);
        props.handleItemCheck(!check, props.index);
    }

    useEffect(() => {
        
        setCheck(props.isSelected);
    }, [props.isSelected])

    
    const handleOnDetailClick = (event) => {
        let item = {
            subPackageName: props.title,
            subPackageDetail: props.desc,
            editPhotoQuantity: props.editQty,
            albumPhotoQuantity: props.albumQty,
            printPhotoQuantity: props.printQty,
            isSelected: props.isSelected
        }
        props.onDetail(event, item, false, props.index);
    }
    return (
        <Grid item xs={12}>
            {/* {console.log(props)} */}
            <Grid container justifyContent='space-between' >
                <Grid item xs={6}>
                    <Grid container  wrap='nowrap'>
                        <Grid item>
                            <Checkbox checked={check} value={props.index} onChange={handleCheck}/>
                        </Grid>
                        <Grid item>
                            <Grid container style={{maxWidth: '130px'}}>
                                <Grid item xs={12} style={{maxWidth: '130px', display:'ruby block', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                    {props.title}
                                </Grid>
                                <Grid item xs={12} style={{ cursor: 'pointer', maxWidth: '130px' }} onClick={handleOnDetailClick}>
                                    Lihat Detail
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent='space-between'>
                        <Grid item xs={4}>
                            <Grid container>
                                <Grid item xs={12}>
                                    Edit
                                </Grid>
                                <Grid item xs={12}>
                                    {props.editQty}
                                </Grid>        
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Grid container>
                                    <Grid item xs={12}>
                                        Album
                                    </Grid>
                                    <Grid item xs={12}>
                                        {props.albumQty}
                                    </Grid>        
                                </Grid>
                            </Grid>
                        <Grid item xs={4} >
                            <Grid container>
                                <Grid item xs={12}>
                                    Cetak
                                </Grid>
                                <Grid item xs={12}>
                                    {props.printQty}
                                </Grid>        
                            </Grid>
                        </Grid>
                        
                    </Grid>
                        
                    
                </Grid>
                
                
            </Grid>
        </Grid>
    );
}

export default SubPackageItem;