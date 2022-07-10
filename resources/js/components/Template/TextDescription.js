import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react'


const TextDescription = ({description}) =>{

    useEffect(() =>{

    }, [description]);
    
    return(
        <React.Fragment>
           <Typography variant="subtitle1" >
                <div dangerouslySetInnerHTML={{ __html: description }} style={{overflowX: 'hidden', overflowY: 'auto', maxHeight: '68vh'}}/>
            </Typography>
        </React.Fragment>
    )
      
}
export default React.memo(TextDescription);