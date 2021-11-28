import React, { useEffect } from 'react';
import { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import MainPage from './MainPage';
import axios from 'axios';

export const PrivateRoute = ({ component: Component, role = [0], apiLink = "", tabValue = 0, name = "Page", showTab = false, ...rest }) => {

    useEffect(() => {
        // console.log('test');
        fetchNotif();
    }, []);


    const fetchNotif = () => {
        const token = localStorage.getItem('authToken');
        axios.request({
            method: 'get',
            url: "/api/notification/fetch_notification",
            headers: { 'Content-Type': 'application/text', 'Authorization': 'Bearer ' + token }
        }).then( res => {
            let values = res.data;
            if(values.success == true){
                localStorage.setItem("notification", JSON.stringify(values.data));
                // setDownloadLink(values.data);
            }

        }).catch( error => {
            console.log(error);
        })
    }
    const test = (props) => {
        if (localStorage.getItem("authToken") !== null) {
            const roleUser = JSON.parse(localStorage.getItem("user")).role_id;
            //console.log(role);
            //console.log(roleUser);
            //console.log(role.includes(roleUser));
            if (!role.includes(roleUser)) {
                return (<div>dilarang</div>);

            } else {
                return (<MainPage tabValue={tabValue} showTab={showTab}>
                    <Component  tabValue={tabValue} apiLink={apiLink} pageName={name} />
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
