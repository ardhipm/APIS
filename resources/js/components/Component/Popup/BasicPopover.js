import { Popover, Typography } from '@material-ui/core';
import * as React from 'react';

export default function BasicPopover(props) {
    const { description,anchorEl,handleClosePopover, ...others } = props;
    // const [anchorEl, setAnchorEl] = React.useState(extAnchorEl);

    // React.useEffect(() => {
    //     setAnchorEl(extAnchorEl);
    // },[anchorEl])


    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleClose = () => {
        handleClosePopover();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                Open Popover
            </Button> */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                
            >
                <Typography sx={{ p: 2 }} style={{padding: '10px'}}>{description}</Typography>
            </Popover>
        </div>
    );
}