import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory, useLocation } from "react-router-dom";
import { Badge, Collapse, makeStyles } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { meanBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationUser } from '../../Redux/Notification/notification.action';


const useStyles = makeStyles((theme) => ({
    rootItem: {
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.secondary.light
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.secondary.light,
            '&:hover': {
                backgroundColor: theme.palette.secondary.light
            },
            borderLeft: theme.custom.selectedTab.borderLeft
        },

    },
    icon: {
        color: 'white'
    },
    nested: {
        paddingLeft: theme.spacing(9),
    },
}));

const MENU_PELANGGAN = [
    {
        id: 1,
        title: "Paket",
        type: "single",
        icon: "bx:bx-category",
        routeLink: "/pelanggan/paket"
    },
    {
        id: 2,
        title: "Struk Pembayaran",
        type: "single",
        icon: "bx:bx-receipt",
        routeLink: "/pelanggan/pembayaran"
    },
    {
        id: 3,
        title: "Logistik",
        type: "single",
        icon: "bx:bx-trip",
        routeLink: "/pelanggan/logistik"
    },
    {
        id: 4,
        title: "Bantuan",
        type: "dropdown",
        icon: "bx:bx-help-circle",
    },
    {
        id: 5,
        title: "Syarat & Ketentuan",
        type: "child",
        icon: "",
        routeLink: "/pelanggan/syarat-ketentuan"
    },
    {
        id: 6,
        title: "FAQ",
        type: "child",
        icon: "",
        routeLink: "/pelanggan/faq"
    }
]

const MENU_ADMIN = [
    {
        id: 1,
        title: "Pelanggan",
        type: "single",
        icon: "bx:bx-group",
        routeLink: "/admin/pelanggan"
    },
    {
        id: 2,
        title: "Pembayaran",
        type: "single",
        icon: "bx:bx-receipt",
        routeLink: "/admin/pembayaran"
    },
    {
        id: 3,
        title: "Logistik",
        type: "single",
        icon: "bx:bx-trip",
        routeLink: "/admin/logistik"
    },
    {
        id: 7,
        title: "Pemberitahuan",
        type: "single",
        icon: "bx:bell",
        routeLink: "/admin/notifikasi"
    },
    {
        id: 5,
        title: "Bantuan",
        type: "dropdown",
        icon: "bx:bx-help-circle",
    },
    {
        id: 6,
        title: "Syarat & Ketentuan",
        type: "child",
        icon: "",
        routeLink: "/admin/edit/syarat-ketentuan"
    },
    {
        id: 8,
        title: "FAQ",
        type: "child",
        icon: "",
        routeLink: "/admin/edit/faq"
    },
    
]

const MENU_SUPER_ADMIN = [
    {
        id: 1,
        title: "Pengguna Admin",
        type: "single",
        icon: "bx:bx-user",
        routeLink: "/admin/pengguna"
    },
    {
        id: 2,
        title: "Pelanggan",
        type: "single",
        icon: "bx:bx-group",
        routeLink: "/admin/pelanggan"
    },
    {
        id: 3,
        title: "Pembayaran",
        type: "single",
        icon: "bx:bx-receipt",
        routeLink: "/admin/pembayaran"
    },
    {
        id: 4,
        title: "Logistik",
        type: "single",
        icon: "bx:bx-trip",
        routeLink: "/admin/logistik"
    },
    {
        id: 7,
        title: "Pemberitahuan",
        type: "single",
        icon: "bx:bell",
        routeLink: "/admin/notifikasi"
    },
    {
        id: 5,
        title: "Bantuan",
        type: "dropdown",
        icon: "bx:bx-help-circle",

    },
    {
        id: 6,
        title: "Syarat & Ketentuan",
        type: "child",
        icon: "",
        routeLink: "/admin/edit/syarat-ketentuan"
    },
    {
        id: 8,
        title: "FAQ",
        type: "child",
        icon: "",
        routeLink: "/admin/edit/faq"
    },
    
]

{/* <Badge color="secondary" variant="dot" invisible={invisible}>
          <MailIcon />
        </Badge> */}

const MENU = (role) => {
    if (role === 1) {
        return MENU_PELANGGAN;
    }

    if (role === 2) {
        return MENU_SUPER_ADMIN;
    }

    if (role === 3) {
        return MENU_ADMIN;
    }


}

const MainMenuItem = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const menus = MENU(props.role);
    const notifProps = useSelector((state) => state.notifReducer)
    const dispatch = useDispatch();
    

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    useEffect(() => {
        // console.log(window.location.pathname);

        menus.map((menu) => {
            if (window.location.pathname === menu.routeLink) {
                // console.log(menu.routeLink)
                setSelectedIndex(menu.id);
            }
        })
        
    }, [])

    useEffect(() => {
        dispatch(getNotificationUser());
    },[selectedIndex]);

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const handleListItemClick = (event, idx, link) => {
        // console.log(asd + " " + link);
        setSelectedIndex(idx);
        setDropdownOpen(false);


    };
    const location = useLocation();
    let insideCollapse = [];
    return (
        <List>
            {
                menus.map((menu) => {
                    if (menu.type === "single") {

                        return (<ListItem key={menu.id.toString()} button
                            component={Link}
                            to={menu.routeLink}
                            classes={{ root: classes.rootItem }}
                            selected={selectedIndex === menu.id}
                            onClick={(event) => handleListItemClick(event, menu.id, menu.routeLink)}>

                            <ListItemIcon classes={{ root: classes.icon }}>
                                {menu.title == "Pemberitahuan" ? <Badge color="error" variant="dot" invisible={!notifProps.newNotif}>
                                    <Icon icon={menu.icon} style={{ fontSize: '24px', color: 'white' }} />
                                </Badge> : <Icon icon={menu.icon} style={{ fontSize: '24px', color: 'white' }} />}

                            </ListItemIcon>
                            <ListItemText primary={menu.title} />
                        </ListItem>)
                    }
                    if (menu.type === "dropdown") {
                        return <ListItem key={menu.id.toString()} button onClick={handleDropdown}>
                            <ListItemIcon>
                                <Icon icon={menu.icon} style={{ fontSize: '24px', color: 'white' }} />
                            </ListItemIcon>
                            <ListItemText primary="Bantuan" />
                            {dropdownOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    }
                    if (menu.type === "child") {
                        insideCollapse.push(<ListItem key={menu.id.toString()} button
                            classes={{ root: classes.rootItem }}
                            className={classes.nested}
                            component={Link}
                            to={menu.routeLink}>

                            <ListItemText primary={menu.title} />
                        </ListItem>)

                    }
                })

            }

            {
                <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {insideCollapse}
                    </List>
                </Collapse>
            }
        </List >
    );
}

export default MainMenuItem;