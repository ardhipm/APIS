import React, { useEffect } from 'react';
import { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import MainPage from './MainPage';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ component: Component, role = [0], apiLink = "", tabValue = 0, name = "Page", showTab = false, ...rest }) => {


    
    const user = useSelector((state) => state.loginReducer.user);
    const selector = useSelector((state)=> state);
    // console.log(selector)

    useEffect(() => {
        // console.log('test');
        // fetchNotif();
    }, []);



    const fetchNotif = () => {
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: "/api/notification/fetch_notification",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            let values = res.data;
            if (values.success == true) {
                localStorage.setItem("notification", JSON.stringify(values.data));
                // setDownloadLink(values.data);
            }

        }).catch(error => {
            // console.log(error);
        })
    }
    const test = (props) => {
        if (localStorage.getItem("authToken") !== null) {
            // console.log(localStorage.getItem("user"));
            const roleUser = JSON.parse(localStorage.getItem("user")).roleId;
            // console.log(role, roleUser);

            //console.log(role);
            //console.log(roleUser);
            //console.log(role.includes(roleUser));
            if (!role.includes(roleUser)) {
                window.location.href = "/login";

            } else {
                return (<MainPage tabValue={tabValue} showTab={showTab || false}>
                            <Component tabValue={tabValue} apiLink={apiLink} pageName={name || ''} />
                        </MainPage>);
            }


        } else {
            return (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />);
        }
    }

    return (<Route
        {...rest}
        render={props => test(props)}
    />
    );
}
